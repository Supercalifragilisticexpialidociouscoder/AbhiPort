"use client";

import { useRef } from "react";
import { lab, labEntries } from "@/content/lab";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { TransitionLink } from "../PageTransition";
import { StatusChip } from "../ui/StatusChip";
import { PartGlyph } from "../visuals/PartGlyph";

/**
 * The lab, filed: one prototype and nine experiments, each a door to its
 * own page. The prototype gets the big tile; every card shows its part as a
 * schematic until a real bench photo exists.
 */
export function LabIndex({ className, fill = "enter" }: { className?: string; fill?: "enter" | "note" }) {
  const root = useRef<HTMLOListElement>(null);
  const [lead, ...rest] = labEntries;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          gsap.utils.selector(root)("[data-lab-card]"),
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 85%", once: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className={cn("grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4", className)}>
      <li data-lab-card className="bg-bg sm:col-span-2 lg:row-span-2">
        <TransitionLink href={`/lab/${lead.slug}`} transitionLabel={lead.title} data-cursor="Open" className="group relative flex h-full min-h-[340px] flex-col justify-between gap-8 p-5 md:p-7">
          <span className="label flex items-center justify-between gap-4">
            <span className="tnum text-accent">Lab / {lead.number}</span>
            <StatusChip status={lead.status} />
          </span>
          <span className="grid grid-cols-[1fr_auto] items-end gap-6">
            <span>
              <span className="display block text-[clamp(48px,5.6vw,108px)] leading-[0.84] transition-[font-variation-settings] duration-700 ease-[var(--ease-expo)] group-hover:[--wdth:84]">
                {lead.titleLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
              <span className="mt-4 block max-w-[34ch] text-[clamp(17px,1.4vw,21px)] leading-snug text-muted">{lead.line}</span>
            </span>
            <LeanTeaser />
          </span>
          <span className="label flex flex-wrap items-center justify-between gap-4">
            <span className="text-muted">{lead.parts.join(" · ")}</span>
            <span className="inline-flex items-center gap-2 text-fg">
              <span className="link-line">The full build</span>
              <span className="arrow-nudge-x text-accent">→</span>
            </span>
          </span>
        </TransitionLink>
      </li>
      {rest.map((e) => (
        <li key={e.slug} data-lab-card className="bg-bg">
          <TransitionLink href={`/lab/${e.slug}`} transitionLabel={e.title} data-cursor="Open" className="group flex h-full min-h-[210px] flex-col justify-between gap-6 p-5">
            <span className="label flex items-center justify-between gap-3">
              <span className="tnum text-muted transition-colors group-hover:text-accent">Lab / {e.number}</span>
              <span className="text-muted">{e.kind}</span>
            </span>
            <PartGlyph name={e.glyph} className="h-14 w-14 text-fg transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-rotate-6 group-hover:scale-110" />
            <span>
              <span className="display block text-[clamp(28px,2.4vw,40px)] leading-[0.9]">{e.title}</span>
              <span className="mt-2 block text-[14px] leading-snug text-muted">{e.line}</span>
            </span>
          </TransitionLink>
        </li>
      ))}
      {/* Closes the grid: the way in from the home page, or a note on /lab. */}
      <li data-lab-card className="bg-bg lg:col-span-3">
        {fill === "enter" ? (
          <TransitionLink href="/lab" transitionLabel="The lab" data-cursor="Open" className="group flex h-full min-h-[210px] flex-col justify-between gap-6 p-5 md:p-7">
            <span className="label text-muted">/lab</span>
            <span className="display text-[clamp(40px,4.4vw,84px)] leading-[0.86]">
              Enter the lab<span className="arrow-nudge-x ml-[0.15em] text-accent">→</span>
            </span>
            <span className="label text-muted">{labEntries.length} builds · each one with its own page</span>
          </TransitionLink>
        ) : (
          <div className="flex h-full min-h-[210px] flex-col justify-between gap-6 p-5 md:p-7">
            <span className="label text-accent">Bench rules</span>
            <p className="max-w-[60ch] text-[clamp(17px,1.4vw,21px)] leading-snug">{lab.note}</p>
            <span className="label text-muted">More gets filed as it gets built.</span>
          </div>
        )}
      </li>
    </ol>
  );
}

/** A still of the lean gauge — the live one is on the prototype's page. */
function LeanTeaser() {
  const polar = (deg: number, r: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: 60 + r * Math.cos(a), y: 60 + r * Math.sin(a) };
  };
  const arc = (from: number, to: number, r: number) => {
    const a = polar(from, r);
    const b = polar(to, r);
    return `M${a.x} ${a.y} A${r} ${r} 0 0 1 ${b.x} ${b.y}`;
  };
  return (
    <svg viewBox="0 0 120 70" className="hidden w-[clamp(120px,12vw,200px)] shrink-0 sm:block" aria-hidden>
      <path d={arc(-90, 90, 50)} fill="none" stroke="var(--line)" strokeWidth="1.5" />
      <path d={arc(45, 90, 50)} fill="none" stroke="var(--accent)" strokeWidth="3" />
      <path d={arc(-90, -45, 50)} fill="none" stroke="var(--accent)" strokeWidth="3" />
      <g className="origin-[60px_60px] rotate-[28deg] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-[58deg]">
        <line x1="60" y1="60" x2="60" y2="16" stroke="var(--fg)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="4" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.2" />
    </svg>
  );
}
