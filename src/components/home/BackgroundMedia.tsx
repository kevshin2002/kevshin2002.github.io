import React, { useEffect, useRef, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

export interface BackgroundMediaProps {
  src: string;
  /** Lighter encode used on narrow screens and data-saver connections. */
  srcSmall?: string;
  poster?: string;
  className?: string;
  /** "auto" for above-the-fold clips, "metadata" for everything else. */
  preload?: "auto" | "metadata" | "none";
  /** Called with the video's currentTime on every timeupdate. */
  onTime?: (t: number) => void;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function wantsSmall(): boolean {
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return window.innerWidth < 900 || Boolean(conn?.saveData);
}

/**
 * A looping, muted background clip (or image/gif) that only plays while it is
 * on screen. The source is chosen on the client, so the server-rendered page
 * shows only the poster and the browser downloads exactly one encode.
 * Reduced-motion users keep the poster.
 */
export function BackgroundMedia({
  src,
  srcSmall,
  poster,
  className,
  preload = "metadata",
  onTime,
}: BackgroundMediaProps): JSX.Element {
  const bigUrl = useBaseUrl(src);
  const smallUrl = useBaseUrl(srcSmall ?? src);
  const posterUrl = useBaseUrl(poster ?? "");
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const isVideo = VIDEO_EXT.test(src);
  const [activeSrc, setActiveSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isVideo || reduced) return;
    setActiveSrc(srcSmall && wantsSmall() ? smallUrl : bigUrl);
  }, [isVideo, reduced, srcSmall, smallUrl, bigUrl]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !activeSrc) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {
            /* autoplay refused; poster stays visible */
          });
        } else {
          v.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [activeSrc]);

  if (!isVideo) {
    return <img className={className} src={bigUrl} alt="" aria-hidden="true" />;
  }

  return (
    <video
      ref={ref}
      className={className}
      src={activeSrc}
      poster={poster ? posterUrl : undefined}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={preload}
      aria-hidden="true"
      onTimeUpdate={
        onTime ? (e) => onTime(e.currentTarget.currentTime) : undefined
      }
    />
  );
}
