#!/usr/bin/env python3
"""
Turn a LiDAR rosbag into a small point cloud the website can load.

Reads sensor_msgs/PointCloud2 plus a pose topic from a ROS 1 or ROS 2 bag (via
`rosbags`, so no sourced ROS environment is needed), motion-compensates each
scan with its per-point timestamps, accumulates into the map frame, drops the
ground, voxel-downsamples, builds levels of detail, and writes one quantised
binary of a few hundred KB.

The bag is only ever read. Nothing large is copied and nothing large is
committed — the only output is the .bin.

    # what is in the bag, and what the export would weigh
    python3 scripts/lidar/extract_cloud.py BAG --topic /lidar/points --dry-run

    # one lap
    python3 scripts/lidar/extract_cloud.py BAG \
        --topic /lidar/points --pose-topic /localization/global/odom \
        --start 832.4 --end 937.4 --voxel 0.45 \
        --out static/data/track-cloud.bin

Two behaviours are measured rather than assumed — see README.md:

* Scans are NOT already motion-compensated. Per-point deskew improves
  frame-to-frame agreement by 3-4 percentage points at 1.5 g, so it is on by
  default; --no-deskew turns it off.
* Fused odometry can carry brief orientation spikes. Poses implying more than
  --max-lat-g of lateral acceleration are dropped and interpolated across.
"""

from __future__ import annotations

import argparse
import gzip
import json
import struct
import sys
from pathlib import Path

import numpy as np

MAGIC = b"PCL1"
VERSION = 3
#: header flag bit 0 — this cloud was generated, not recorded
FLAG_SYNTHETIC = 1 << 0

_DTYPES = {1: np.int8, 2: np.uint8, 3: np.int16, 4: np.uint16,
           5: np.int32, 6: np.uint32, 7: np.float32, 8: np.float64}
#: field names to try, in order, for a per-point intensity channel
INTENSITY_NAMES = ("intensity", "reflectance", "reflectivity", "i")


# --------------------------------------------------------------------------
# poses
# --------------------------------------------------------------------------


class Trajectory:
    """Interpolates vehicle pose, with obviously-bad orientations removed."""

    def __init__(self, t, pos, quat, speed, max_lat_g: float):
        keep = self._sane(t, quat, speed, max_lat_g)
        dropped = len(t) - int(keep.sum())
        if dropped:
            print(f"  dropped {dropped:,} of {len(t):,} poses "
                  f"({100 * dropped / len(t):.2f}%) implying > {max_lat_g} g")
        self.t, self.pos, self.quat = t[keep], pos[keep], quat[keep]

    @staticmethod
    def _sane(t, quat, speed, max_lat_g):
        yaw = np.unwrap(np.arctan2(
            2 * (quat[:, 3] * quat[:, 2] + quat[:, 0] * quat[:, 1]),
            1 - 2 * (quat[:, 1] ** 2 + quat[:, 2] ** 2)))
        rate = np.abs(np.diff(yaw) / np.maximum(np.diff(t), 1e-4))
        bad = np.r_[rate * speed[:-1] / 9.81 > max_lat_g, False]
        bad |= np.r_[False, bad[:-1]]  # a spike taints both ends of its step
        return ~bad

    def at(self, times: np.ndarray):
        """Position and unit quaternion at each time. Vectorised."""
        i = np.clip(np.searchsorted(self.t, times) - 1, 0, len(self.t) - 2)
        t0, t1 = self.t[i], self.t[i + 1]
        u = np.clip((times - t0) / np.maximum(t1 - t0, 1e-9), 0, 1)[:, None]
        pos = self.pos[i] + (self.pos[i + 1] - self.pos[i]) * u
        q0, q1 = self.quat[i], self.quat[i + 1]
        q1 = np.where((q0 * q1).sum(1, keepdims=True) < 0, -q1, q1)  # short arc
        # nlerp, not slerp: consecutive poses are milliseconds apart, so the
        # angle between them is tiny and the two agree to well under a mrad
        q = q0 + (q1 - q0) * u
        return pos, q / np.linalg.norm(q, axis=1, keepdims=True)


def rotate(q: np.ndarray, p: np.ndarray) -> np.ndarray:
    """Rotate each row of `p` by the matching unit quaternion in `q`."""
    x, y, z, w = q[:, 0], q[:, 1], q[:, 2], q[:, 3]
    a, b, c = p[:, 0], p[:, 1], p[:, 2]
    return np.stack([
        (1 - 2 * (y * y + z * z)) * a + 2 * (x * y - z * w) * b + 2 * (x * z + y * w) * c,
        2 * (x * y + z * w) * a + (1 - 2 * (x * x + z * z)) * b + 2 * (y * z - x * w) * c,
        2 * (x * z - y * w) * a + 2 * (y * z + x * w) * b + (1 - 2 * (x * x + y * y)) * c,
    ], axis=1)


def read_poses(reader, topic: str, max_lat_g: float):
    conns = [c for c in reader.connections if c.topic == topic]
    if not conns:
        raise SystemExit(f"pose topic {topic} not in bag")
    t, pos, quat, spd, child = [], [], [], [], None
    start = reader.start_time
    for conn, ts, raw in reader.messages(connections=conns):
        m = reader.deserialize(raw, conn.msgtype)
        pose = m.pose.pose if hasattr(m.pose, "pose") else m.pose
        child = getattr(m, "child_frame_id", "") or child
        p, o = pose.position, pose.orientation
        t.append((ts - start) / 1e9)
        pos.append((p.x, p.y, p.z))
        quat.append((o.x, o.y, o.z, o.w))
        v = getattr(getattr(m, "twist", None), "twist", None)
        spd.append(float(np.hypot(np.hypot(v.linear.x, v.linear.y), v.linear.z)) if v else 0.0)
    print(f"  {len(t):,} poses on {topic} (child frame {child!r})")
    return Trajectory(np.array(t), np.array(pos), np.array(quat),
                      np.array(spd), max_lat_g), child


def static_offset(reader, parent: str, child: str):
    """Translation and rotation of `child` expressed in `parent`."""
    conns = [c for c in reader.connections if c.topic == "/tf_static"]
    for conn, _, raw in reader.messages(connections=conns):
        for tr in reader.deserialize(raw, conn.msgtype).transforms:
            if tr.header.frame_id == parent and tr.child_frame_id == child:
                t, q = tr.transform.translation, tr.transform.rotation
                return np.array([t.x, t.y, t.z]), np.array([q.x, q.y, q.z, q.w])
        break
    return None


# --------------------------------------------------------------------------
# clouds
# --------------------------------------------------------------------------


def decode(msg, min_conf: int):
    """(xyz float64, intensity float32, per-point time offset in seconds)."""
    fields = {f.name: f for f in msg.fields}
    for k in ("x", "y", "z"):
        if k not in fields:
            raise SystemExit(f"cloud has no {k}; got {sorted(fields)}")
    n = msg.width * msg.height
    buf = np.frombuffer(msg.data, dtype=np.uint8)[: n * msg.point_step]
    buf = buf.reshape(n, msg.point_step)

    def chan(name):
        f = fields[name]
        dt = np.dtype(_DTYPES[f.datatype]).newbyteorder(">" if msg.is_bigendian else "<")
        col = buf[:, f.offset : f.offset + dt.itemsize]
        return np.ascontiguousarray(col).view(dt).ravel()

    xyz = np.stack([chan("x"), chan("y"), chan("z")], axis=1).astype(np.float64)
    keep = np.isfinite(xyz).all(axis=1)
    if "existence_probability_percent" in fields and min_conf > 0:
        keep &= chan("existence_probability_percent") >= min_conf

    inten = np.zeros(n, dtype=np.float32)
    for name in INTENSITY_NAMES:
        if name in fields:
            inten = chan(name).astype(np.float32)
            break

    # a per-point timestamp is 8 bytes of nanoseconds, declared as uint8[8]
    dt_s = np.zeros(n)
    f = fields.get("timestamp")
    if f is not None and f.count == 8:
        ns = np.ascontiguousarray(buf[:, f.offset : f.offset + 8]).view(np.uint64).ravel()
        dt_s = (ns.astype(np.float64) - float(ns.max())) * 1e-9

    return xyz[keep], inten[keep], dt_s[keep]


def voxel_downsample(pts: np.ndarray, voxel: float) -> np.ndarray:
    """Keep one point per occupied voxel."""
    if not len(pts):
        return pts
    k = np.floor(pts[:, :3] / voxel).astype(np.int64)
    k -= k.min(axis=0)
    d = k.max(axis=0) + 1
    flat = (k[:, 0] * d[1] + k[:, 1]) * d[2] + k[:, 2]
    _, idx = np.unique(flat, return_index=True)
    return pts[np.sort(idx)]


def ground_surface(pts: np.ndarray, cell: float, smooth: int = 2):
    """
    Low-percentile ground height on a grid, hole-filled and smoothed.

    Returns the grid plus its origin so callers can sample it bilinearly.
    """
    gx = np.floor(pts[:, 0] / cell).astype(np.int64)
    gy = np.floor(pts[:, 1] / cell).astype(np.int64)
    ox, oy = int(gx.min()), int(gy.min())
    gx -= ox
    gy -= oy
    w = int(gx.max()) + 1
    h = int(gy.max()) + 1

    flat = gx * h + gy
    order = np.lexsort((pts[:, 2], flat))
    sf, sz = flat[order], pts[order, 2]
    uniq, starts = np.unique(sf, return_index=True)
    ends = np.append(starts[1:], len(sf))
    pick = starts + ((ends - starts) * 0.05).astype(np.int64)

    grid = np.full(w * h, np.nan, dtype=np.float64)
    grid[uniq] = sz[pick]
    grid = grid.reshape(w, h)

    # fill gaps and take the edge off, with a NaN-aware box blur
    for _ in range(smooth):
        filled = np.nan_to_num(grid, nan=0.0)
        mask = (~np.isnan(grid)).astype(np.float64)
        acc = np.zeros_like(filled)
        cnt = np.zeros_like(filled)
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                acc += np.roll(np.roll(filled, dx, 0), dy, 1)
                cnt += np.roll(np.roll(mask, dx, 0), dy, 1)
        avg = np.where(cnt > 0, acc / np.maximum(cnt, 1), np.nan)
        grid = np.where(np.isnan(grid), avg, 0.5 * grid + 0.5 * avg)
    return grid, ox, oy, cell


def sample_surface(grid, ox, oy, cell, xy: np.ndarray) -> np.ndarray:
    """Bilinear lookup, which is what lets this track a slope inside a cell."""
    w, h = grid.shape
    fx = xy[:, 0] / cell - ox
    fy = xy[:, 1] / cell - oy
    x0 = np.clip(np.floor(fx).astype(np.int64), 0, w - 1)
    y0 = np.clip(np.floor(fy).astype(np.int64), 0, h - 1)
    x1 = np.clip(x0 + 1, 0, w - 1)
    y1 = np.clip(y0 + 1, 0, h - 1)
    tx = np.clip(fx - x0, 0, 1)
    ty = np.clip(fy - y0, 0, 1)
    g = np.nan_to_num(grid, nan=np.nanmedian(grid))
    return (
        g[x0, y0] * (1 - tx) * (1 - ty)
        + g[x1, y0] * tx * (1 - ty)
        + g[x0, y1] * (1 - tx) * ty
        + g[x1, y1] * tx * ty
    )


def cloth_ground(pts: np.ndarray, gr: float, rigidness: int,
                 iterations: int, step: float, relax: float = 0.5):
    """
    Ground surface by cloth simulation (Zhang et al., 2016).

    A percentile grid cannot separate ground from structure on terrain like
    this: the circuit climbs sixty metres and is steeply banked, so any cell
    big enough to contain reliable ground also spans enough slope to leave the
    uphill half of it standing.

    Cloth simulation has no such problem. Invert the cloud so the ground
    becomes the highest surface, drop a sheet onto it from above, and let
    internal stiffness stop the sheet from folding into gaps. Where the sheet
    settles is the terrain — it drapes over slopes and banking, and it bridges
    across the tops of trees and buildings rather than climbing them.

    Returns the ground height per grid cell in the original frame, with the
    grid origin, ready for bilinear sampling.
    """
    zi = -pts[:, 2]  # invert: ground becomes the surface a cloth lands on
    gx = np.floor(pts[:, 0] / gr).astype(np.int64)
    gy = np.floor(pts[:, 1] / gr).astype(np.int64)
    ox, oy = int(gx.min()), int(gy.min())
    gx -= ox
    gy -= oy
    w = int(gx.max()) + 1
    h = int(gy.max()) + 1

    # The collision surface is a low percentile of z per cell, not the raw
    # minimum: a single spurious return below the road would otherwise drag
    # the cloth down through it and leave the whole surface standing.
    flat = gx * h + gy
    order = np.lexsort((zi, flat))
    sf, sv = flat[order], zi[order]
    starts = np.searchsorted(sf, np.unique(sf))
    ends = np.append(starts[1:], len(sf))
    pick = starts + ((ends - starts) * 0.95).astype(np.int64)  # 95th of zi = 5th of z
    ht = np.full(w * h, -np.inf)
    ht[np.unique(sf)] = sv[np.minimum(pick, len(sv) - 1)]
    ht = ht.reshape(w, h)

    # cells with no returns must not swallow the cloth, so fill them from
    # their neighbours before starting
    empty = ~np.isfinite(ht)
    if empty.any():
        fill = np.where(empty, -np.inf, ht)
        for _ in range(6):
            nb = np.maximum.reduce([
                np.roll(fill, 1, 0), np.roll(fill, -1, 0),
                np.roll(fill, 1, 1), np.roll(fill, -1, 1),
            ])
            fill = np.where(np.isfinite(fill), fill, nb)
        ht = np.where(np.isfinite(fill), fill, np.nanmax(ht[np.isfinite(ht)]))

    cz = np.full((w, h), float(ht.max()) + 2.0)
    pinned = np.zeros((w, h), dtype=bool)

    for _ in range(iterations):
        cz = np.where(pinned, cz, cz - step)          # gravity
        hit = cz <= ht
        cz = np.where(hit, ht, cz)                    # collide with terrain
        pinned |= hit
        # internal stiffness: unpinned particles are pulled toward their
        # neighbours, which is what keeps the sheet from draping into gaps
        for _ in range(rigidness):
            nb = 0.25 * (
                np.roll(cz, 1, 0) + np.roll(cz, -1, 0)
                + np.roll(cz, 1, 1) + np.roll(cz, -1, 1)
            )
            cz = np.where(pinned, cz, cz + relax * (nb - cz))
            hit = cz <= ht
            cz = np.where(hit, ht, cz)
            pinned |= hit
        if pinned.all():
            break

    return -cz, ox, oy, gr   # back to the original frame


def drop_ground(pts: np.ndarray, cell: float, lo: float, hi: float,
                method: str = "grid", rigidness: int = 1,
                iterations: int = 900, step: float = 0.35,
                relax: float = 0.06) -> np.ndarray:
    """
    Keep only what stands above the ground, and record how far above.

    The ground is a bilinearly interpolated surface rather than one height per
    column. That matters here: this circuit climbs and falls sixty metres and
    is steeply banked in places, so a piecewise-constant estimate leaves the
    uphill side of every cell reading as half a metre of "structure" — which
    is exactly the road surface we are trying to be rid of.
    """
    if method == "cloth":
        grid, ox, oy, c = cloth_ground(pts, cell, rigidness, iterations,
                                       step, relax)
    else:
        grid, ox, oy, c = ground_surface(pts, cell)
    ground = sample_surface(grid, ox, oy, c, pts[:, :2])
    rel = pts[:, 2] - ground
    keep = (rel >= lo) & (rel <= hi)
    # column 3 becomes height above ground. Absolute z stays in column 2: the
    # camera flies through this, so it needs a real 3D position, while the
    # colouring wants height above the surface rather than above sea level.
    out = pts[keep].copy()
    out[:, 3] = rel[keep]
    return out


def structure_only(pts: np.ndarray, cell: float, min_extent: float,
                   always_above: float) -> np.ndarray:
    """
    Drop flat ground, keep things that stand up.

    Height alone cannot do this. A concrete barrier is about a metre tall, so
    any threshold high enough to clear the road also clears the barrier, and
    any threshold low enough to keep the barrier keeps a sheet of tarmac and
    gravel trap with it.

    What separates them is vertical extent. Within a one-metre cell the road
    spans a few centimetres; a barrier spans its full height, and a tree or a
    grandstand spans metres. So keep a cell if the spread of heights inside it
    says something is standing there — or if the point is simply high enough
    that it cannot be ground.

    Expects column 3 to be height above ground, as drop_ground leaves it.
    """
    k = np.floor(pts[:, :2] / cell).astype(np.int64)
    k -= k.min(axis=0)
    flat = k[:, 0] * (k[:, 1].max() + 1) + k[:, 1]
    order = np.argsort(flat, kind="stable")
    sf = flat[order]
    sh = pts[order, 3]
    starts = np.searchsorted(sf, np.unique(sf))
    ends = np.append(starts[1:], len(sf))
    lo = np.minimum.reduceat(sh, starts)
    hi = np.maximum.reduceat(sh, starts)
    extent = np.empty(len(pts))
    extent[order] = np.repeat(hi - lo, ends - starts)
    return (extent >= min_extent) | (pts[:, 3] >= always_above)


def near_mask(pts: np.ndarray, track_xy: np.ndarray, width: float) -> np.ndarray:
    """
    Boolean mask of points near the driven line.

    The trajectory is rasterised into cells of `width`/2 and dilated by two,
    so this selects roughly `width` either side without a spatial tree.
    """
    cell = width / 2
    tk = np.floor(track_xy / cell).astype(np.int64)
    off = tk.min(axis=0)
    tk -= off
    span = tk[:, 1].max() + 5
    occupied = set()
    for dx in range(-2, 3):
        for dy in range(-2, 3):
            occupied.update(((tk[:, 0] + dx) * span + (tk[:, 1] + dy)).tolist())
    pk = np.floor(pts[:, :2] / cell).astype(np.int64) - off
    key = pk[:, 0] * span + pk[:, 1]
    return np.isin(key, np.fromiter(occupied, dtype=np.int64))


def morton_sort(pts: np.ndarray, voxel: float) -> np.ndarray:
    """Order points so neighbours in the file are neighbours in space."""
    q = np.floor(pts[:, :3] / voxel).astype(np.int64)
    q -= q.min(axis=0)

    def spread(v):
        v = v & 0x1FFFFF
        for sh, mask in ((32, 0x1F00000000FFFF), (16, 0x1F0000FF0000FF),
                         (8, 0x100F00F00F00F00F), (4, 0x10C30C30C30C30C3)):
            v = (v | (v << sh)) & mask
        return (v | (v << 2)) & 0x1249249249249249

    code = spread(q[:, 0]) | (spread(q[:, 1]) << 1) | (spread(q[:, 2]) << 2)
    return pts[np.argsort(code, kind="stable")]


BUCKET_M = 10.0


def path_arclength(path: np.ndarray) -> np.ndarray:
    d = np.linalg.norm(np.diff(path[:, :2], axis=0), axis=1)
    return np.concatenate([[0.0], np.cumsum(d)])


def bucket_order(pts: np.ndarray, path: np.ndarray, scale: float):
    """
    Sort points by how far along the lap they are, Morton within each bucket,
    and tag each with its bucket in a fifth column.

    The fly-through only ever needs the slice of map around the camera, and a
    Morton-only order gives no way to find it. Bucketing by arclength does,
    and keeping Morton order inside each bucket preserves the spatial locality
    the delta encoding depends on. The tag rides along through voxel
    downsampling, so every level can report its own bucket offsets exactly.
    """
    s_along = path_arclength(path)
    idx = np.empty(len(pts), dtype=np.int64)
    step = 20000
    for i in range(0, len(pts), step):
        chunk = pts[i : i + step, :2]
        d = ((chunk[:, None, 0] - path[None, :, 0]) ** 2 +
             (chunk[:, None, 1] - path[None, :, 1]) ** 2)
        idx[i : i + step] = d.argmin(axis=1)
    bucket = np.floor(s_along[idx] / BUCKET_M).astype(np.int64)
    nb = int(bucket.max()) + 1

    q = np.floor(pts[:, :3] / max(scale, 1e-6)).astype(np.int64)
    q -= q.min(axis=0)

    def spread(v):
        v = v & 0x1FFFFF
        for sh, mask in ((32, 0x1F00000000FFFF), (16, 0x1F0000FF0000FF),
                         (8, 0x100F00F00F00F00F), (4, 0x10C30C30C30C30C3)):
            v = (v | (v << sh)) & mask
        return (v | (v << 2)) & 0x1249249249249249

    code = spread(q[:, 0]) | (spread(q[:, 1]) << 1) | (spread(q[:, 2]) << 2)
    order = np.lexsort((code, bucket))
    tagged = np.column_stack([pts[order], bucket[order]]).astype(np.float32)
    return tagged, nb, float(s_along[-1])


def bucket_starts(level: np.ndarray, nb: int) -> np.ndarray:
    """Index of the first point of each bucket, plus a terminator."""
    return np.searchsorted(level[:, 4], np.arange(nb + 1)).astype(np.uint32)


def accumulate(reader, args, traj, offset) -> np.ndarray:
    """Read the window, deskew each scan, and build the map cloud."""
    conns = [c for c in reader.connections if c.topic == args.topic]
    if not conns:
        print("topic not found. bag contains:", file=sys.stderr)
        for t, mt in sorted({c.topic: c.msgtype for c in reader.connections}.items()):
            print(f"  {t}  ({mt})", file=sys.stderr)
        raise SystemExit(1)
    if conns[0].msgtype != "sensor_msgs/msg/PointCloud2":
        raise SystemExit(f"{args.topic} is {conns[0].msgtype}, not PointCloud2")

    start = reader.start_time
    kw = {}
    if args.start is not None:
        kw["start"] = start + int(args.start * 1e9)
    if args.end is not None:
        kw["stop"] = start + int(args.end * 1e9)

    t_off, q_off = offset if offset else (np.zeros(3), np.array([0.0, 0, 0, 1]))
    acc: list[np.ndarray] = []
    total = kept = 0
    for i, (conn, ts, raw) in enumerate(reader.messages(connections=conns, **kw)):
        if i % args.stride:
            continue
        xyz, inten, dt_s = decode(reader.deserialize(raw, conn.msgtype),
                                  args.min_confidence)
        rng = np.linalg.norm(xyz, axis=1)
        m = (rng > args.min_range) & (rng < args.max_range)
        xyz, inten, dt_s = xyz[m], inten[m], dt_s[m]
        if not len(xyz):
            continue
        total += len(xyz)

        frame_t = (ts - start) / 1e9
        if traj is not None:
            times = frame_t + dt_s if args.deskew else np.full(len(xyz), frame_t)
            # cloud frame -> pose child frame, then child -> map
            local = rotate(np.broadcast_to(q_off, (len(xyz), 4)), xyz - t_off)
            pos, q = traj.at(times)
            world = rotate(q, local) + pos
        else:
            world = xyz

        acc.append(voxel_downsample(
            np.column_stack([world, inten]).astype(np.float32), args.accum_voxel))
        kept += 1
        if kept % 25 == 0:
            acc = [voxel_downsample(np.concatenate(acc), args.accum_voxel)]
            print(f"  ...{kept} scans, {total:,} points in, {len(acc[0]):,} kept")
    if not acc:
        raise SystemExit("no scans in the window")
    out = voxel_downsample(np.concatenate(acc), args.accum_voxel)
    print(f"  {kept} scans, {total:,} points in -> {len(out):,} after voxelising")
    return out


# --------------------------------------------------------------------------
# encoding
# --------------------------------------------------------------------------


def pick_focus(pts: np.ndarray, cell: float = 25.0):
    """Centre of the busiest cell — somewhere worth zooming into."""
    k = np.floor(pts[:, :2] / cell).astype(np.int64)
    k -= k.min(axis=0)
    flat = k[:, 0] * (k[:, 1].max() + 1) + k[:, 1]
    vals, counts = np.unique(flat, return_counts=True)
    sel = pts[flat == vals[counts.argmax()]]
    return float(np.median(sel[:, 0])), float(np.median(sel[:, 1]))


def encode(levels, scale, path, starts, lap_len, flags: int = 0) -> bytes:
    """
    Quantise to uint16 against a shared origin and write byte planes.

    Layout, little endian:

        0   char[4]  "PCL1"
        4   u16      version
        6   u16      flags
        8   f32[3]   origin x, y, z
        20  f32      scale
        24  f32[6]   bbox min xyz, max xyz
        48  f32[2]   height-above-ground range
        56  f32      lap length, metres
        60  f32      metres per bucket
        64  u8       level count
        65  u8[3]    pad
        68  u32      path node count
        72  u32      bucket count
        76  u32[L]   points per level

    then per level, for x, y and z: a u32 of the first quantised value and the
    low/high byte planes of the zigzagged deltas along the stored order, then
    one byte of height above ground per point. Then the camera path as plain
    quantised u16 x, y, z. Then bucket start indices into level 0, one per
    bucket plus a terminator.
    """
    allpts = np.concatenate(levels, axis=0)
    lo3 = allpts[:, :3].min(axis=0)
    hi3 = allpts[:, :3].max(axis=0)
    lo3 = np.minimum(lo3, path.min(axis=0))
    hi3 = np.maximum(hi3, path.max(axis=0))
    origin = lo3.astype(np.float64)
    span = float((hi3 - lo3).max())
    if span / scale > 65530:
        raise SystemExit(f"span {span:.1f} m at {scale} m overflows uint16; "
                         f"pass --scale {span / 65530:.4f} or larger")

    h_lo = float(allpts[:, 3].min())
    h_hi = float(allpts[:, 3].max())

    head = bytearray(MAGIC)
    head += struct.pack("<HH", VERSION, flags)
    head += struct.pack("<4f", *origin, scale)
    head += struct.pack("<6f", *lo3, *hi3)
    head += struct.pack("<2f", h_lo, h_hi)
    head += struct.pack("<2f", lap_len, BUCKET_M)
    head += struct.pack("<B3x", len(levels))
    head += struct.pack("<2I", len(path), len(starts) - 1)
    head += struct.pack(f"<{len(levels)}I", *[len(l) for l in levels])

    def quant(a, axis_origin):
        q = np.rint((a.astype(np.float64) - axis_origin) / scale).astype(np.int64)
        return np.clip(q, 0, 65535)

    body = bytearray()
    for lv in levels:
        for axis in range(3):
            q = quant(lv[:, axis], origin[axis])
            body += struct.pack("<I", int(q[0]))
            d = np.diff(q, prepend=q[0])
            if np.abs(d).max() > 32767:
                raise SystemExit("a step exceeds the 16-bit delta plane; "
                                 "use a coarser --scale")
            z = ((d << 1) ^ (d >> 63)).astype(np.uint32)
            body += (z & 0xFF).astype(np.uint8).tobytes()
            body += ((z >> 8) & 0xFF).astype(np.uint8).tobytes()
        h = (lv[:, 3] - h_lo) / max(h_hi - h_lo, 1e-6)
        body += np.clip(np.rint(h * 255), 0, 255).astype(np.uint8).tobytes()

    for axis in range(3):
        body += quant(path[:, axis], origin[axis]).astype("<u2").tobytes()
    body += np.asarray(starts, dtype="<u4").tobytes()
    return bytes(head + body)


def report(name: str, blob: bytes) -> int:
    gz = len(gzip.compress(blob, 9))
    print(f"  {name:<32} {len(blob) / 1024:8.1f} KB raw   {gz / 1024:7.1f} KB gzipped")
    return gz


def build_levels(pts, voxels, scale):
    # every level now covers the whole lap: the camera travels all of it, so
    # a detail sector around one spot is no longer the right shape
    return [voxel_downsample(pts, v) for v in voxels]


# --------------------------------------------------------------------------


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("bag", type=Path)
    ap.add_argument("--topic", required=True)
    ap.add_argument("--pose-topic", default=None,
                    help="odometry used to place scans in the map frame; omit "
                         "if the cloud is already in a fixed frame")
    ap.add_argument("--out", type=Path, default=Path("static/data/track-cloud.bin"))
    ap.add_argument("--start", type=float, default=None, help="seconds into the bag")
    ap.add_argument("--end", type=float, default=None)
    ap.add_argument("--stride", type=int, default=3, help="use every Nth scan")
    ap.add_argument("--accum-voxel", type=float, default=0.0,
                    help="voxel used while accumulating; defaults to half the "
                         "finest level. It is a floor on everything downstream, "
                         "so a dry run cannot explore below it")
    ap.add_argument("--level-voxels", default="0.30,1.0,2.2",
                    help="voxel size per level, finest first; level 0 is the "
                         "detail sector, the rest cover the whole cloud")
    ap.add_argument("--scale", type=float, default=0.05,
                    help="quantisation step; much finer than the voxel wastes "
                         "bytes, because it stops the byte planes compressing")
    ap.add_argument("--min-range", type=float, default=3.0)
    ap.add_argument("--max-range", type=float, default=120.0)
    ap.add_argument("--min-confidence", type=int, default=127,
                    help="existence_probability_percent floor, where present")
    ap.add_argument("--ground-method", choices=("grid", "cloth"), default="grid",
                    help="'grid' is a fine percentile grid sampled bilinearly; "
                         "'cloth' drapes a simulated sheet. Cloth is the "
                         "textbook answer but measured worse here — see README")
    ap.add_argument("--cloth-rigidness", type=int, default=1)
    ap.add_argument("--cloth-relax", type=float, default=0.06)
    ap.add_argument("--cloth-iterations", type=int, default=900)
    ap.add_argument("--cloth-step", type=float, default=0.35)
    ap.add_argument("--ground-cell", type=float, default=0.4,
                    help="grid spacing for the interpolated ground surface")
    ap.add_argument("--keep-above", type=float, default=0.5)
    ap.add_argument("--keep-below", type=float, default=4.0)
    ap.add_argument("--min-extent", type=float, default=0.0,
                    help="keep a cell only if its points span this much "
                         "height; 0 disables the test")
    ap.add_argument("--extent-cell", type=float, default=1.0)
    ap.add_argument("--always-above", type=float, default=2.5,
                    help="height above which a point is kept regardless")
    ap.add_argument("--near-width", type=float, default=0.0,
                    help="within this distance of the line, use --near-voxel; "
                         "beyond it, --far-voxel. 0 disables the split")
    ap.add_argument("--near-voxel", type=float, default=0.7)
    ap.add_argument("--far-voxel", type=float, default=2.2)
    ap.add_argument("--corridor", type=float, default=0.0,
                    help="keep only points within this many metres of the "
                         "driven line; 0 keeps everything the scan saw")
    ap.add_argument("--cache", type=Path, default=None,
                    help="cache the accumulated cloud here, and reuse it on a "
                         "later run so filtering can be retuned without "
                         "re-reading the bag")
    ap.add_argument("--max-lat-g", type=float, default=3.0,
                    help="reject poses implying more lateral acceleration")
    ap.add_argument("--no-deskew", dest="deskew", action="store_false")
    ap.add_argument("--dry-run", action="store_true",
                    help="report size at a range of voxel sizes, write nothing")
    args = ap.parse_args()
    args.voxels = [float(v) for v in args.level_voxels.split(",")]
    if args.accum_voxel <= 0:
        args.accum_voxel = min(args.voxels) / 2

    from rosbags.highlevel import AnyReader

    if args.cache and args.cache.exists():
        cached = np.load(args.cache)
        pts, track_xyz = cached["pts"], cached["track"]
        print(f"reusing cached cloud: {len(pts):,} points from {args.cache}")
        return finish(args, pts, track_xyz)

    with AnyReader([args.bag]) as reader:
        print(f"reading {args.bag.name} :: {args.topic}")
        traj = offset = None
        if args.pose_topic:
            traj, child = read_poses(reader, args.pose_topic, args.max_lat_g)
            cloud_frame = ""
            for conn, _, raw in reader.messages(
                    connections=[c for c in reader.connections if c.topic == args.topic]):
                cloud_frame = reader.deserialize(raw, conn.msgtype).header.frame_id
                break
            if child and cloud_frame and child != cloud_frame:
                offset = static_offset(reader, cloud_frame, child)
                if offset is None:
                    raise SystemExit(f"no /tf_static {cloud_frame} -> {child}; "
                                     f"cannot place the cloud in the pose frame")
                print(f"  {cloud_frame} -> {child}: t={offset[0].round(3)} "
                      f"q={offset[1].round(5)}")
            print(f"  deskew: {'on' if args.deskew else 'off'}")
        pts = accumulate(reader, args, traj, offset)
        lo = args.start if args.start is not None else -np.inf
        hi = args.end if args.end is not None else np.inf
        if traj is not None:
            m = (traj.t >= lo) & (traj.t <= hi)
            track_xyz = traj.pos[m]
            # one node every few metres is plenty for a camera path
            step = max(1, len(track_xyz) // 1800)
            track_xyz = track_xyz[::step]
        else:
            track_xyz = pts[:: max(1, len(pts) // 1500), :3]

    if args.cache:
        args.cache.parent.mkdir(parents=True, exist_ok=True)
        np.savez(args.cache, pts=pts, track=track_xyz)
        print(f"  cached to {args.cache}")
    finish(args, pts, track_xyz)


def finish(args, pts: np.ndarray, track_xyz: np.ndarray) -> None:
    if args.corridor > 0:
        before = len(pts)
        pts = pts[near_mask(pts, track_xyz[:, :2], args.corridor)]
        print(f"  {len(pts):,} points within {args.corridor:g} m of the line "
              f"({100 * len(pts) / max(before, 1):.1f}% of {before:,})")

    # Measure heights against the ground first and only cut it afterwards:
    # the verticality test needs the ground present to have anything to
    # measure the standing structure against.
    pts = drop_ground(pts, args.ground_cell, -0.6, args.keep_below,
                      args.ground_method, args.cloth_rigidness,
                      args.cloth_iterations, args.cloth_step,
                      args.cloth_relax)
    print(f"  {len(pts):,} points within the height band")

    if args.min_extent > 0:
        before = len(pts)
        pts = pts[structure_only(pts, args.extent_cell, args.min_extent,
                                 args.always_above)]
        print(f"  {len(pts):,} in cells that actually stand up "
              f"({100 * len(pts) / max(before, 1):.1f}% of {before:,})")

    before = len(pts)
    pts = pts[pts[:, 3] >= args.keep_above]
    print(f"  {len(pts):,} after cutting below {args.keep_above} m "
          f"({100 * len(pts) / max(before, 1):.1f}% of {before:,})")

    # Detail where it is felt, economy where it is not: barriers you drive
    # past at arm's length get a fine voxel, a grandstand sixty metres away
    # does not. Same file, one level, roughly half the bytes of doing the
    # whole map at the fine size.
    if args.near_width > 0:
        m = near_mask(pts, track_xyz[:, :2], args.near_width)
        near = voxel_downsample(pts[m], args.near_voxel)
        far = voxel_downsample(pts[~m], args.far_voxel)
        pts = np.concatenate([near, far])
        print(f"  {len(near):,} near @ {args.near_voxel} m + "
              f"{len(far):,} far @ {args.far_voxel} m = {len(pts):,}")

    # order for the fly-through, and keep the camera path alongside
    pts, nb, lap_len = bucket_order(pts, track_xyz, args.scale)
    print(f"  lap {lap_len:.0f} m in {nb} buckets of {BUCKET_M:g} m")

    if args.dry_run:
        print("\nsize against level voxels:")
        for mult in (0.7, 1.0, 1.4, 2.0):
            vs = [v * mult for v in args.voxels]
            lv = build_levels(pts, vs, args.scale)
            n = " + ".join(f"{len(x)//1000}k" for x in lv)
            report(f"{'/'.join(f'{v:.2f}' for v in vs)} m ({n})",
                   encode(lv, args.scale, track_xyz,
                          bucket_starts(lv[0], nb), lap_len))
        return

    levels = build_levels(pts, args.voxels, args.scale)
    for i, lv in enumerate(levels):
        print(f"  level {i}: {len(lv):,} points @ {args.voxels[i]:.2f} m")
    # voxel_downsample preserves order, so each level is still bucket-sorted
    blob = encode(levels, args.scale, track_xyz,
                  bucket_starts(levels[0], nb), lap_len)
    gz = report("total", blob)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_bytes(blob)
    args.out.with_suffix(".json").write_text(json.dumps({
        "source": args.bag.name, "topic": args.topic,
        "window": [args.start, args.end], "stride": args.stride,
        "deskew": args.deskew,
        "points": [len(l) for l in levels],
        "voxel": args.voxels,
        "scale": args.scale, "bytes": len(blob), "gzipped": gz,
    }, indent=2) + "\n")
    print(f"\nwrote {args.out} ({len(blob)/1024:.0f} KB, ~{gz/1024:.0f} KB over the wire)")


if __name__ == "__main__":
    main()
