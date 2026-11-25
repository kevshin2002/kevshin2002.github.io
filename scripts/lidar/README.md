# LiDAR export

Turns a recorded bag into the small point cloud the landing page renders.
Dependencies are `numpy` and `rosbags` — no sourced ROS environment, and it
reads ROS 1 `.bag` as well as ROS 2 `.db3` / `.mcap`.

```bash
# what is in the bag, and what the export would weigh
python3 scripts/lidar/extract_cloud.py BAG --topic /lidar/points --dry-run

# write it
python3 scripts/lidar/extract_cloud.py BAG \
    --topic /lidar/points --pose-topic /localization/global/odom \
    --start 832.4 --end 937.4 --stride 3 --max-range 90 \
    --corridor 14 --keep-above 0.3 --keep-below 2.2 \
    --level-voxels 0.30,1.8,4.0 --detail-radius 90 \
    --out static/data/track-cloud.bin
```

The bag is only read. Pass `--cache FILE` to keep the accumulated cloud so the
filtering can be retuned without re-reading a hundred gigabytes. Pass a wrong
`--topic` and it prints every topic in the bag with its type.

Drop the `.bin` at `static/data/track-cloud.bin` and the page picks it up. With
no file there the stage falls back to a procedural circuit, so nothing breaks.

## What it does

1. Decodes `sensor_msgs/PointCloud2` from the message's own `fields[]`, so it
   needs nothing sensor-specific. Where `existence_probability_percent` is
   present, weak returns are dropped.
2. Motion-compensates each scan against the pose topic using the per-point
   timestamps, then accumulates into the map frame. The static transform from
   the cloud's frame to the pose child frame is looked up in `/tf_static`.
3. Crops to a corridor around the driven line, drops the ground (5th
   percentile of z per 2 m column), and keeps a height band above it.
4. Voxel-downsamples into levels of detail. Level 0 is fine but covers only a
   sector around the focus; the coarser levels cover everything. The renderer
   picks by zoom, which is exactly when each one is the one you can see.
5. Morton-sorts, quantises x/y to uint16, delta-zigzags along that order, and
   writes byte planes plus one byte of height above ground.

## Two things that were measured, not assumed

**Scans are not already motion-compensated.** Frame-to-frame voxel agreement
at the hardest genuine corner in the reference bag (0.81 rad/s, 1.53 g, 4.6
degrees of rotation per 99 ms sweep):

|                   | 0.15 m | 0.30 m | 0.60 m |
| ----------------- | ------ | ------ | ------ |
| one pose per scan | 30.0%  | 57.4%  | 78.9%  |
| per-point deskew  | 33.7%  | 61.7%  | 81.7%  |

Consistently better at every scale, so deskew is on by default. Note that the
same test on a _straight_ shows almost nothing — the smear is along the
direction of travel, where a frame-to-frame comparison cannot see it. Pick a
corner, and check the corner is real: a first attempt landed on a pose glitch
implying 51 g and produced a much larger, entirely spurious, difference.

**Fused odometry carries orientation spikes.** In the reference bag 5.2% of
`/localization/global/odom` samples imply more than 2 g of lateral
acceleration and 0.26% imply more than 10 g, which no car does. Timestamps are
monotonic and positions are continuous, so it is the orientation alone.
`--max-lat-g` drops those and interpolates across them.

## Encoding

Measured on 283k real points, bytes per point over the wire:

| encoding                            | raw      | gzipped  |
| ----------------------------------- | -------- | -------- |
| xyz planes + intensity              | 7.00     | 4.26     |
| xy planes + height byte + intensity | 6.00     | 3.44     |
| xy planes + height byte             | 5.00     | 2.48     |
| **xy delta planes + height byte**   | **5.00** | **2.09** |

Intensity is nearly incompressible and the renderer barely used it, so it is
gone. Height is stored above local ground rather than as absolute z — one byte
covers the kept band at millimetre resolution, and it makes the colour show
structure instead of the circuit's 60 m of elevation change.

`--scale` is the quantisation step. Making it much finer than the voxel wastes
bytes: it stops neighbouring points sharing a high byte, which is the whole
reason the planes compress.

The wire format is documented at the top of
`src/components/homepage/visual/cloud.ts`; the two must stay in step.
