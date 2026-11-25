/**
 * Career notes, shown on /career in the order listed (newest first).
 *
 * One note per organization. Each note has the overall years, the org name,
 * and one subsection per role (title, dates, short write-up). Descriptions are
 * plain text; separate paragraphs with a blank line.
 *
 * `media` is optional and is shared by the whole note: an .mp4/.webm loops
 * muted, a .gif/.webp/.jpg/.png is shown as-is. Put files under `static/` and
 * reference them by path, e.g. "/career/<file>". Videos only play while on
 * screen. Keep each under ~5 MB (H.264, no audio, `-movflags +faststart`).
 */

export interface CareerRole {
  title: string;
  /** e.g. "Jan 2026 - Nov 2026". */
  period: string;
  /** What you did. Blank line = new paragraph. */
  description: string;
}

export interface CareerEntry {
  id: string;
  /** Overall time at the organization, e.g. "June 2025 - November 2026". */
  year: string;
  org: string;
  orgUrl?: string;
  /** Optional one-liner under the org name. */
  tagline?: string;
  roles: CareerRole[];
  media?: {
    src: string;
    poster?: string;
    /**
     * "background" (default) fills the note behind the text, best for wide
     * footage. "side" shows the clip in a column on the right, best for
     * tall/portrait footage such as a 3D viewer recording.
     */
    layout?: "background" | "side";
  };
}

export const career: CareerEntry[] = [
  {
    id: "forterra",
    year: "November 2026 - Current",
    org: "Forterra",
    orgUrl: "https://www.forterra.com",
    roles: [
      {
        title: "Software Engineer I, Fielded Autonomy",
        period: "November 2026 - Current",
        description: ``,
      },
    ],
  },
  {
    id: "ai-racing-tech",
    year: "June 2025 - November 2026",
    org: "AI Racing Tech",
    orgUrl: "https://www.airacingtech.com",
    tagline:
      "Indy Autonomous Challenge, Dallara AV-24 (built on the Dallara Indy NXT chassis)",
    roles: [
      {
        title: "Technical Lead, Localization",
        period: "Jan 2026 - Nov 2026",
        description: `I led state estimation for the AV-24, covering GNSS/INS, wheel-inertial and LiDAR-inertial odometry and the fusion that ties them together, and owned the full sensor package underneath it. I built a redundancy layer so the car could lose a GNSS unit or IMU mid-run and keep going, and brought localization into our dSPACE Sim2Real setup for multi-car race testing.`,
      },
      {
        title: "Perception Engineer",
        period: "Jan 2026 - Nov 2026",
        description: `I rebuilt the camera pipeline to run on the GPU end to end: six cameras rectified, cropped and downsampled in a single CUDA kernel, object detection with TensorRT, and a low-bandwidth video uplink so the pit wall could see what the car sees. Most of the work was making it cheap enough to leave CPU for everything else.`,
      },
      {
        title: "Navigation Engineer",
        period: "June 2025 - Dec 2025",
        description: `I built the navigation front end: cleaning up raw GPS/INS data before the filter ever sees it, wheel-inertial odometry that dead-reckons with 0.17% drift, and a LiDAR-inertial mapping pipeline anchored to RTK GNSS that produces centimeter-level maps of the track.`,
      },
      {
        title: "Sensor System Engineer",
        period: "June 2025 - Dec 2025",
        description: `I got every sensor on the car onto the same clock, with cameras, LiDARs and radars synchronized to GPS time within a few hundred nanoseconds, and configured and extended the drivers for our three GPS/INS units. Timing is invisible when it works, and everything downstream depends on it.`,
      },
    ],
    media: {
      src: "/video/lidar-gicp-v2.mp4",
      poster: "/video/lidar-gicp-v2.jpg",
      layout: "side",
    },
  },
];
