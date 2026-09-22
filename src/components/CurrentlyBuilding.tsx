"use client";

import { useRef } from "react";
import { now } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { SectionHead } from "./ui/SectionHead";

/**
 * 07 — Currently. The pit board: what's on the bench right now. The page
 * goes full signal-red, and each line flips into place like a split-flap.
 */
export function CurrentlyBuilding() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-board]")[0], start: "top 75%", once: true } });
        q("[data-flap]").forEach((el, i) => {
          const text = (el as HTMLElement).dataset.flap ?? "";
          tl.to(
            el,
            {
              duration: 0.9,
              scrambleText: { text, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ×0123456789", revealDelay: 0.25, speed: 0.6 },
              ease: "none",
            },
            i * 0.12,
          );
        });
        tl.fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: 0.08, ease: "expo.out" }, 0);
      });
    },
    { scope: root },
  );

  const rows = now.building.map((b, i) => ({ k: pad(i + 1), v: b }));

  return (
    <section
      ref={root}
      id="now"
      data-theme="ir"
      data-index="07"
      data-label="Currently"
      aria-labelledby="now-title"
      className="relative px-gutter pb-[14vh] pt-[16vh]"
    >
      <SectionHead index="07" title="Currently" aside={`Board updated — ${now.updated}`} />

      <div data-board className="mt-10">
        <h2 id="now-title" className="label flex items-center gap-3">
          <span aria-hidden className="inline-block h-2 w-2 bg-fg" />
          Currently building
        </h2>

        <ol className="mt-4">
          {rows.map((r) => (
            <li key={r.v} className="relative grid grid-cols-[3rem_1fr] items-baseline gap-4 py-2 md:grid-cols-[6rem_1fr]">
              <span data-rule aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left bg-fg/25" />
              <span className="label tnum">{r.k}</span>
              <span data-flap={r.v} className="display block text-[clamp(44px,8.6vw,170px)] leading-[0.86]">
                {r.v}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-6">
          {[
            { k: "Currently learning", v: now.learning },
            { k: "Currently exploring", v: now.exploring },
          ].map((row) => (
            <div key={row.k} className="relative border-t-2 border-fg pt-4">
              <p className="label">{row.k}</p>
              <p data-flap={row.v} className="display mt-3 text-[clamp(40px,5.4vw,104px)] leading-[0.86]">
                {row.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
