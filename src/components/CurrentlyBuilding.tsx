"use client";

import { useRef } from "react";
import { now, sections, site } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { SectionHead } from "./ui/SectionHead";

/**
 * 11 — Currently. The pit board: what's on the bench right now, what's
 * being learned, and what's next (intentions, not achievements). The page
 * goes full signal-red and each line flips into place like a split-flap.
 */
export function CurrentlyBuilding() {
  const root = useRef<HTMLElement>(null);
  const s = sections.now;

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
  const side = [
    { k: "Currently learning", v: now.learning },
    { k: "Currently exploring", v: now.exploring },
    { k: "Currently testing", v: now.testing },
    { k: "Currently thinking about", v: now.thinkingAbout },
  ].filter((r): r is { k: string; v: string } => Boolean(r.v));

  return (
    <section
      ref={root}
      id={s.id}
      data-theme="ir"
      data-index={s.index}
      data-label={s.label}
      aria-labelledby="now-title"
      className="relative px-gutter pb-[14vh] pt-[16vh]"
    >
      <SectionHead index={s.index} title={now.title} aside={`Board updated — ${site.updated}`} />

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

        <div className={`mt-12 grid gap-8 md:gap-6 ${side.length > 2 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2"}`}>
          {side.map((row) => (
            <div key={row.k} className="relative border-t-2 border-fg pt-4">
              <p className="label">{row.k}</p>
              <p data-flap={row.v} className="display mt-3 text-[clamp(40px,5.4vw,104px)] leading-[0.86]">
                {row.v}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 border-t border-fg/30 pt-5 md:grid-cols-12 md:gap-6">
          <p className="label md:col-span-3">
            Next <span className="text-fg/60">— intentions, not achievements</span>
          </p>
          <p className="display text-[clamp(26px,3vw,52px)] leading-[0.95] md:col-span-9">
            {now.next.map((n, i) => (
              <span key={n}>
                {n}
                {i < now.next.length - 1 ? <span className="text-fg/40"> · </span> : null}
              </span>
            ))}
          </p>
        </div>

        <p className="label mt-10 text-fg/70">{now.label}</p>
      </div>
    </section>
  );
}
