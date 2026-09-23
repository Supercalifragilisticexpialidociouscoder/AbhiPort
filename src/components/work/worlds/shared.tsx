"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Each of the eight featured projects gets a world: a diagram built from
 * what the project actually is, animated only while its scene is on screen.
 * No fake screenshots, no invented numbers — where a fact isn't public, the
 * world says so instead of drawing something plausible.
 */
export type WorldProps = {
  /** The scene is the live one. Timelines idle at frame 0 otherwise. */
  live: boolean;
  className?: string;
};

/** The sheet every world is drawn on: a bordered plate with a caption rail. */
export function Plate({
  title,
  aside,
  footer,
  className,
  children,
}: {
  title: string;
  aside?: string;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={cn("relative flex h-full min-h-0 flex-col border border-line", className)}>
      <figcaption className="label flex items-center justify-between gap-4 border-b border-line px-3 py-2 text-muted">
        <span>{title}</span>
        <span>{aside ?? "Illustration"}</span>
      </figcaption>
      <div className="relative min-h-0 flex-1">{children}</div>
      {footer ? <div className="label flex items-center justify-between gap-4 border-t border-line px-3 py-2 text-muted">{footer}</div> : null}
    </figure>
  );
}

/**
 * Builds a looping timeline once and parks it at frame 0 whenever the scene
 * isn't live, so only the visible world costs anything. Reduced motion never
 * builds one — every world reads as a still diagram without it.
 */
export function useWorld(live: boolean, build: (tl: gsap.core.Timeline, q: (s: string) => Element[]) => void, scope: React.RefObject<HTMLElement | null>) {
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const t = gsap.timeline({ repeat: -1, paused: true });
        build(t, q as (s: string) => Element[]);
        tl.current = t;
        return () => {
          t.kill();
          tl.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope, dependencies: [] },
  );

  useGSAP(
    () => {
      const t = tl.current;
      if (!t) return;
      if (live) t.play();
      else t.pause(0);
    },
    { dependencies: [live], scope },
  );
}

/** A dashed marker for a fact that isn't public. Same language as [ADD …]. */
export function Withheld({ children, className }: { children: string; className?: string }) {
  return <span className={cn("label inline-block border border-dashed border-accent/70 px-2 py-1 text-accent", className)}>{children}</span>;
}

/** SVG text in the site's mono label voice. */
export function T({ x, y, children, accent, size = 9, anchor = "start", opacity }: { x: number; y: number; children: React.ReactNode; accent?: boolean; size?: number; anchor?: "start" | "middle" | "end"; opacity?: number }) {
  return (
    <text
      x={x}
      y={y}
      fill={accent ? "var(--accent)" : "var(--muted)"}
      fontSize={size}
      textAnchor={anchor}
      opacity={opacity}
      style={{ fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}
    >
      {children}
    </text>
  );
}
