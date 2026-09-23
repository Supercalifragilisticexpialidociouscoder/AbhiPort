"use client";

import { useRef } from "react";
import { useRaceClock } from "@/lib/race-clock";

/** A live race-time readout: your time inside the site this visit. */
export function RaceTime({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useRaceClock(ref);
  return (
    <span ref={ref} className={className} aria-hidden>
      00:00.00
    </span>
  );
}
