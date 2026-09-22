"use client";

import { useRef } from "react";
import { timeline } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { SectionHead } from "./ui/SectionHead";
import { Ph } from "./ui/Ph";

/**
 * 06 — The line so far. A racing line through what happened, in order.
 * Desktop: pinned and driven sideways, the line draws itself and each
 * sector lights up as it crosses the marker. Mobile: a vertical line.
 * Years stay empty rather than guessed.
 */
export function Timeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          q("[data-tl-title]"),
          { yPercent: 105, y: 0 },
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: q("[data-tl-head]")[0], start: "top 85%", once: true } },
        );
      });

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const pin = q("[data-tl-pin]")[0] as HTMLElement;
        const track = q("[data-tl-track]")[0] as HTMLElement;
        const line = q("[data-tl-line]")[0] as HTMLElement;
        const sectors = q("[data-sector]") as HTMLElement[];
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const st = {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
        };
        const tween = gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { ...st, pin: true, anticipatePin: 1 } });
        gsap.fromTo(
          line,
          { scaleX: () => (window.innerWidth * 0.55) / track.scrollWidth },
          { scaleX: 1, ease: "none", scrollTrigger: { ...st } },
        );

        const lit = sectors.map((el) =>
          ScrollTrigger.create({
            trigger: el,
            containerAnimation: tween,
            start: "left 58%",
            onEnter: () => el.classList.add("is-lit"),
            onLeaveBack: () => el.classList.remove("is-lit"),
          }),
        );
        return () => {
          lit.forEach((t) => t.kill());
          sectors.forEach((el) => el.classList.remove("is-lit"));
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="timeline"
      data-theme="ink"
      data-index="06"
      data-label="The line"
      aria-labelledby="timeline-title"
      className="relative"
    >
      <div className="px-gutter pt-[16vh]">
        <SectionHead index="06" title="The line so far" aside="Sectors, not dates" />
        <div data-tl-head className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-6">
          <h2 id="timeline-title" className="display text-[clamp(64px,11vw,210px)] lg:col-span-8">
            <span className="mask">
              <span data-tl-title className="block">
                The line
              </span>
            </span>
            <span className="mask">
              <span data-tl-title className="block">
                so far<span className="text-accent">.</span>
              </span>
            </span>
          </h2>
          <p className="max-w-sm self-end text-[clamp(18px,1.4vw,22px)] leading-snug text-muted lg:col-span-4">{timeline.lead}</p>
        </div>
      </div>

      <div data-tl-pin className="relative mt-16 track:mt-0 track:h-svh track:overflow-hidden">
        <div aria-hidden className="label pointer-events-none absolute inset-x-gutter top-[calc(var(--nav-h)+4vh)] z-10 hidden justify-between text-muted track:flex">
          <span>
            <span className="text-accent">(06)</span> The line so far — in order
          </span>
          <span>Years only where there are receipts</span>
        </div>
        <ol data-tl-track className="relative px-gutter pb-[14vh] track:flex track:h-full track:w-max track:pb-0 track:pr-[40vw] track:pt-[calc(var(--nav-h)+4vh)]">
          {/* The racing line (desktop) */}
          <span aria-hidden className="absolute inset-x-0 top-[calc(50%_+_(var(--nav-h)_+_4vh)_/_2)] hidden h-px bg-line track:block" />
          <span data-tl-line aria-hidden className="absolute inset-x-0 top-[calc(50%_+_(var(--nav-h)_+_4vh)_/_2)] hidden h-[2px] origin-left -translate-y-px bg-accent track:block" />

          {timeline.sectors.map((s) => (
            <li
              key={s.code}
              data-sector
              className={cn(
                "sector group relative border-l border-line pb-12 pl-7 last:pb-0",
                "track:grid track:w-[clamp(300px,25vw,420px)] track:shrink-0 track:grid-rows-[1fr_auto_1fr] track:border-l-0 track:pb-0 track:pl-0 track:pr-12",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "display sector-code block leading-[0.8] text-[clamp(64px,7vw,150px)] track:self-end track:pb-6",
                  s.next ? "text-accent" : "hollow",
                )}
              >
                {s.code}
              </span>

              <span aria-hidden className="sector-node absolute -left-[5px] top-3 h-[9px] w-[9px] rounded-full border border-fg bg-bg track:relative track:left-0 track:top-0 track:my-[-4px] track:h-[11px] track:w-[11px]" />

              <div className="pt-4 track:self-start track:pt-7">
                <h3 className="display sector-title text-[clamp(40px,3.6vw,68px)] leading-[0.86]">{s.title}</h3>
                <p className="mt-3 max-w-[30ch] text-[16px] leading-snug text-muted">{s.text}</p>
                <p className="label mt-4">
                  {s.year ? <span className={s.next ? "text-accent" : ""}>{s.year}</span> : <Ph>Add year</Ph>}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
