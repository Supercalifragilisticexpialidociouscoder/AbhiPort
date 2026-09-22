"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const LIMIT = 70; // how far the simulated bike can lean
const THRESHOLD = 45; // warning threshold for the simulation

type Story = { label: string; note: string; bug?: boolean }[];

/**
 * A simulated lean-angle gauge for the motorcycle safety prototype. Your
 * cursor (or the slider, on touch/keyboard) is the bike. Past the threshold
 * the "LEDs" light and the "buzzer" goes off. Hover the −135° step of the
 * build story to replay the bug.
 */
export function LeanDial({ story }: { story: Story }) {
  const [angle, setAngle] = useState(0);
  const [bug, setBug] = useState(false);
  const face = useRef<HTMLDivElement>(null);
  const replayTimer = useRef(0);
  const sliderId = useId();
  useEffect(() => () => window.clearTimeout(replayTimer.current), []);

  // A tap replays the bug for a moment (hover already shows it on desktop).
  const replay = () => {
    setBug(true);
    window.clearTimeout(replayTimer.current);
    replayTimer.current = window.setTimeout(() => setBug(false), 1800);
  };
  const shown = bug ? -135 : angle;
  const warn = bug || Math.abs(shown) > THRESHOLD;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !face.current) return;
    const r = face.current.getBoundingClientRect();
    const t = (e.clientX - r.left) / r.width; // 0..1
    setAngle(Math.round((t - 0.5) * 2 * LIMIT));
  };

  // Gauge geometry (SVG units): pivot at (150, 150), radius 120.
  const polar = (deg: number, r: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: 150 + r * Math.cos(a), y: 150 + r * Math.sin(a) };
  };
  const arc = (from: number, to: number, r: number) => {
    const a = polar(from, r);
    const b = polar(to, r);
    return `M${a.x} ${a.y} A${r} ${r} 0 0 1 ${b.x} ${b.y}`;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
      <div className="lg:col-span-6">
        <div
          ref={face}
          onPointerMove={onMove}
          onPointerLeave={() => setAngle(0)}
          className="relative border border-line p-4"
          data-cursor="Lean"
        >
          <div className="label flex justify-between text-muted">
            <span>Lean angle · simulated</span>
            <span>Threshold ±{THRESHOLD}°</span>
          </div>

          <svg viewBox="0 0 300 200" className="mt-2 w-full" role="img" aria-label={`Simulated lean angle: ${shown} degrees${warn ? ", warning on" : ""}`}>
            <path d={arc(-90, 90, 120)} fill="none" stroke="var(--line)" strokeWidth="1.5" />
            <path d={arc(-90, -THRESHOLD, 120)} fill="none" stroke="var(--accent)" strokeWidth="3" opacity="0.8" />
            <path d={arc(THRESHOLD, 90, 120)} fill="none" stroke="var(--accent)" strokeWidth="3" opacity="0.8" />
            {Array.from({ length: 13 }, (_, i) => -90 + i * 15).map((d) => {
              const a = polar(d, 120);
              const b = polar(d, d % 45 === 0 ? 104 : 112);
              return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--fg)" strokeWidth={d % 45 === 0 ? 1.4 : 0.8} opacity="0.7" />;
            })}
            {[-90, -45, 0, 45, 90].map((d) => {
              const p = polar(d, 90);
              return (
                <text key={d} x={p.x} y={p.y + 4} textAnchor="middle" fill="var(--muted)" style={{ font: "500 9px var(--font-geist-mono), monospace" }}>
                  {d}°
                </text>
              );
            })}
            <g style={{ transform: `rotate(${shown}deg)`, transformOrigin: "150px 150px", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <line x1="150" y1="150" x2="150" y2="36" stroke={warn ? "var(--accent)" : "var(--fg)"} strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <circle cx="150" cy="150" r="6" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.5" />
          </svg>

          <div className="mt-1 flex items-end justify-between gap-4">
            <p className="display tnum text-[clamp(44px,4.5vw,76px)] leading-[0.8]">
              <span className={warn ? "text-accent" : undefined}>{shown > 0 ? `+${shown}` : shown}°</span>
            </p>
            <div className="label flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span aria-hidden className={cn("h-3 w-3 rounded-full border border-fg/50 transition-colors", warn && "border-accent bg-accent shadow-[0_0_12px_var(--accent)]")} />
                <span aria-hidden className={cn("h-3 w-3 rounded-full border border-fg/50 transition-colors", warn && "border-accent bg-accent shadow-[0_0_12px_var(--accent)]")} />
                LEDs
              </span>
              <span className={cn("tnum", warn ? "text-accent" : "text-muted")}>Buzzer {warn ? "· BEEP" : "· off"}</span>
            </div>
          </div>

          <label htmlFor={sliderId} className="label mt-5 block text-muted">
            Lean the bike
          </label>
          <input
            id={sliderId}
            type="range"
            min={-LIMIT}
            max={LIMIT}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </div>
      </div>

      <ol className="lg:col-span-6">
        {story.map((st, i) => (
          <li key={st.label} className="border-b border-line first:border-t">
            {st.bug ? (
              <button
                type="button"
                aria-pressed={bug}
                onMouseEnter={() => setBug(true)}
                onMouseLeave={() => setBug(false)}
                onFocus={() => setBug(true)}
                onBlur={() => setBug(false)}
                onClick={replay}
                className="grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-3 py-4 text-left"
              >
                <span className="label tnum text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="display block text-[clamp(26px,2.4vw,40px)] leading-[0.95] text-accent">{st.label}</span>
                  <span className="mt-1 block text-[15px] text-muted">
                    {st.note} <span className="label ml-1">(hover or tap to replay)</span>
                  </span>
                </span>
              </button>
            ) : (
              <div className="grid grid-cols-[2.5rem_1fr] items-baseline gap-3 py-4">
                <span className="label tnum text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="display block text-[clamp(26px,2.4vw,40px)] leading-[0.95]">{st.label}</span>
                  <span className="mt-1 block text-[15px] text-muted">{st.note}</span>
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
