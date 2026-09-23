"use client";

import { useRef } from "react";
import type { LabEntry } from "@/content/lab";
import { labEntries } from "@/content/lab";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { onPageEnter, TransitionLink } from "../PageTransition";
import { StatusChip } from "../ui/StatusChip";
import { PartGlyph } from "../visuals/PartGlyph";

/**
 * The opening of a lab page: the part as a schematic, the title set huge,
 * and the page's own storyline — sensor → angle → visualization, ping →
 * echo → distance — drawn as a line that lights up stage by stage.
 */
export function LabHero({ entry: e }: { entry: LabEntry }) {
  const root = useRef<HTMLElement>(null);
  const longest = Math.max(...e.titleLines.map((l) => l.length));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.fromTo(q("[data-lh-line]"), { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.15, stagger: 0.08 }, 0)
          .fromTo(q("[data-lh-in]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.3)
          .fromTo(q("[data-lh-glyph]"), { opacity: 0, rotate: -12, scale: 0.8 }, { opacity: 1, rotate: 0, scale: 1, duration: 1.4 }, 0.2)
          .fromTo(q("[data-arc-fill]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0.5)
          .fromTo(q("[data-arc-step]"), { opacity: 0.25 }, { opacity: 1, duration: 0.3, stagger: 1.2 / Math.max(1, e.arc.length - 1) }, 0.55);
        return onPageEnter(() => tl.play());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="garage" data-index="00" data-label={e.title} aria-labelledby="lab-title" className="relative px-gutter pb-14 pt-[calc(var(--nav-h)+3vh)]">
      <div data-lh-in className="label flex items-center justify-between gap-4 border-b border-line pb-3">
        <TransitionLink href="/lab" transitionLabel="The lab" className="group inline-flex items-center gap-2 py-1">
          <span className="arrow-nudge-x rotate-180">→</span>
          <span className="link-line">The lab</span>
        </TransitionLink>
        <span className="text-muted">
          Lab <span className="tnum text-accent">{e.number}</span> / {pad(labEntries.length)} · {e.kind}
        </span>
      </div>

      <div className="relative mt-[6vh]">
        <span data-lh-glyph aria-hidden className="pointer-events-none absolute -top-[2vh] right-0">
          <PartGlyph name={e.glyph} className="h-auto w-[clamp(84px,16vw,260px)] text-fg opacity-40" />
        </span>
        <p data-lh-in className="label relative flex flex-wrap items-center gap-3">
          <StatusChip status={e.status} />
          <span className="text-muted">{e.parts.join(" · ")}</span>
        </p>
        <h1 id="lab-title" className="case-title display relative mt-5" style={{ "--n": longest } as React.CSSProperties}>
          <span className="sr-only">{e.title}</span>
          {e.titleLines.map((line) => (
            <span key={line} aria-hidden className="mask">
              <span data-lh-line className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <p data-lh-in className="max-w-[28ch] text-[clamp(24px,2.4vw,40px)] font-medium leading-[1.08] tracking-[-0.02em] lg:col-span-5">
          {e.line}
        </p>
        {/* The storyline */}
        <div className="self-end lg:col-span-7">
          <p data-lh-in className="label mb-4 text-muted">The story, in {e.arc.length} stages</p>
          <div className="relative">
            <span aria-hidden className="absolute left-0 right-0 top-[7px] h-px bg-line" />
            <span aria-hidden data-arc-fill className="absolute left-0 right-0 top-[7px] h-[2px] origin-left -translate-y-px bg-accent" />
            <ol className="relative grid gap-4" style={{ gridTemplateColumns: `repeat(${e.arc.length}, minmax(0, 1fr))` }}>
              {e.arc.map((a, i) => (
                <li key={a} data-arc-step>
                  <span aria-hidden className={`block h-[15px] w-[15px] rounded-full border-2 bg-bg ${i === e.arc.length - 1 ? "border-accent bg-accent" : "border-fg"}`} />
                  <span className="label tnum mt-3 block text-muted">{pad(i + 1)}</span>
                  <span className="display mt-1 block text-[clamp(18px,1.7vw,30px)] leading-[0.95]">{a}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
