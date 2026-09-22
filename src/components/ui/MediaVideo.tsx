"use client";

import { useEffect, useRef } from "react";

/** Muted, looping, inline video that stays still for reduced-motion users. */
export function MediaVideo({ src, label, className }: { src: string; label: string; className?: string }) {
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
      preload="metadata"
      aria-label={label}
    />
  );
}
