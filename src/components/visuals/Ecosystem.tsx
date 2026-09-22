"use client";

import { useState } from "react";
import { cn, pad } from "@/lib/cn";

const RING = 40; // ring radius, % of the square
const CORE = 17; // inner dashed ring

/**
 * The eight clubs orbiting one core. The "8" at the centre is Infin8's own
 * joke — scroll and it tips over into ∞ (see Community.tsx). Purely visual:
 * the real list of clubs sits beside it for screen readers and small screens.
 */
export function Ecosystem({ clubs, className }: { clubs: string[]; className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const at = (i: number, r: number) => {
    const a = (i / clubs.length) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
  };

  return (
    <div aria-hidden className={cn("relative mx-auto aspect-square w-full max-w-[620px] overflow-clip", className)}>
      {/* Ring, spokes and labels rotate together on scroll; labels counter-rotate to stay upright. */}
      <div data-eco-ring className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <circle cx="50" cy="50" r={RING} fill="none" stroke="var(--line)" strokeWidth="0.25" />
          <circle cx="50" cy="50" r={CORE} fill="none" stroke="var(--line)" strokeWidth="0.25" strokeDasharray="0.6 1.2" />
          {clubs.map((c, i) => {
            const a = at(i, CORE);
            const b = at(i, RING);
            return (
              <line
                key={c}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active === i ? "var(--accent)" : "var(--line)"}
                strokeWidth={active === i ? 0.55 : 0.25}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
            );
          })}
        </svg>

        {clubs.map((c, i) => {
          const p = at(i, RING);
          const on = active === i;
          return (
            <div
              key={c}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div data-eco-label className="flex flex-col items-center gap-2 text-center">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border bg-bg text-[10px] transition-all duration-300 md:h-10 md:w-10",
                    on ? "scale-110 border-accent bg-accent text-bg" : "border-fg/40",
                  )}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {pad(i + 1)}
                </span>
                <span
                  className={cn(
                    "hidden w-[13ch] text-[11px] font-medium uppercase leading-tight tracking-[0.06em] transition-colors duration-300 md:block",
                    on ? "text-accent" : "text-fg",
                  )}
                >
                  {c}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* The core: an 8 that becomes ∞. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center">
          <span data-eco-eight className="display block text-[clamp(84px,12vw,176px)] leading-[0.8]">
            8
          </span>
          <span className="label mt-3 text-muted">Infin8</span>
        </div>
      </div>
    </div>
  );
}
