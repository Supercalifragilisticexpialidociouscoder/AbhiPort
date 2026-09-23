"use client";

import { useRef } from "react";
import { sections, statement } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SectionHead } from "./ui/SectionHead";

/**
 * 02 — The thesis. "This is a portfolio." gets struck through on scroll and
 * corrected to "Logbook." The page flips to paper for it.
 */
export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const pin = q("[data-pin]")[0];

        gsap.fromTo(
          q("[data-in]"),
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: { trigger: pin, start: "top 62%", once: true },
          },
        );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: pin, start: "top top", end: "+=130%", pin: true, scrub: 0.6 },
        });
        tl.to({}, { duration: 0.25 })
          .fromTo(q("[data-strike]"), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.inOut" })
          .to(q("[data-struck]"), { opacity: 0.22, duration: 0.2 }, "<0.15")
          .fromTo(q("[data-fix]"), { yPercent: 105, y: 0 }, { yPercent: 0, duration: 0.3, ease: "power3.out" }, "<0.05")
          .to({}, { duration: 0.35 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={sections.statement.id}
      data-theme="paper"
      data-index={sections.statement.index}
      data-label={sections.statement.label}
      aria-labelledby="statement-title"
      className="relative"
    >
      <div data-pin className="flex min-h-svh flex-col px-gutter pb-[8vh] pt-[calc(var(--nav-h)+4vh)]">
        <SectionHead index={sections.statement.index} title="A note on this site" aside="Read before scrolling" />

        <h2 id="statement-title" className="sr-only">
          This is a work in progress, not a portfolio.
        </h2>

        <p aria-hidden className="display mt-auto pt-10 text-[length:min(calc((100vw-2*var(--gutter))/4.9),16.5vh)] leading-[0.8]">
          <span className="mask">
            <span data-in className="block">
              {statement.lead}
            </span>
          </span>
          <span className="mask">
            <span data-in className="relative inline-block">
              <span data-struck className="inline-block">
                {statement.struck}
              </span>
              <span data-strike className="absolute -left-[2%] -right-[2%] top-[42%] h-[0.085em] origin-left bg-accent" />
            </span>
          </span>
          <span className="mask">
            <span data-fix className="block">
              {statement.replacement.replace(".", "")}
              <span className="text-accent">.</span>
            </span>
          </span>
        </p>

      </div>
    </section>
  );
}
