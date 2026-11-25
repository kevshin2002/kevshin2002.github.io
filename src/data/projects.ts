/**
 * Projects shown on the homepage. Empty for now; the section renders a
 * placeholder until an entry is added. `media` follows the same rules as
 * career media (static/projects/..., .mp4 loops muted, images shown as-is).
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  repo?: string;
  tags?: string[];
  media?: { src: string; poster?: string };
}

export const projects: Project[] = [];
