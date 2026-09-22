"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping, inline video that stays still for reduced-motion users.
 * `critical` (above the fold) loads it up front and has the preloader wait
 * for its first frame; everything else only fetches metadata.
 */
export function MediaVideo({ src, label, className, critical = false }: { src: string; label: string; className?: string; critical?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) v.pause();
    else v.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      src={src}
      muted
      loop
      playsInline
      preload={critical ? "auto" : "metadata"}
      data-critical={critical ? "" : undefined}
      aria-label={label}
    />
  );
}
