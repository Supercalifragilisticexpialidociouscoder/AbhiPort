"use client";

import { useRef } from "react";
import { about } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SectionHead } from "./ui/SectionHead";

/**
 * 01 — Who's Abhi? Giant question, a portrait slot, and a lead paragraph
 * that "reads itself" as you scroll (words brighten in sequence).
 */
export function About({ portrait }: { portrait: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);

        gsap.fromTo(
          q("[data-title-char]"),
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.035,
            ease: "expo.out",
            scrollTrigger: { trigger: q("[data-title]")[0], start: "top 82%", once: true },
          },
        );

        gsap.fromTo(
          q("[data-word]"),
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: q("[data-lead]")[0], start: "top 78%", end: "bottom 42%", scrub: true },
          },
        );

        gsap.fromTo(
          q("[data-portrait]"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "expo.inOut",
            scrollTrigger: { trigger: q("[data-portrait]")[0], start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          q("[data-portrait-inner]"),
          { scale: 1.25 },
          { scale: 1, duration: 2, ease: "expo.out", scrollTrigger: { trigger: q("[data-portrait]")[0], start: "top 85%", once: true } },
        );

        gsap.fromTo(
          q("[data-fact]"),
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: { trigger: q("[data-facts]")[0], start: "top 88%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  const [question, rest] = [about.title.replace("?", ""), "?"];

  return (
    <section
      ref={root}
      id="about"
      data-theme="ink"
      data-index="01"
      data-label="Who's Abhi"
      aria-labelledby="about-title"
      className="relative px-gutter pb-[18vh] pt-[16vh]"
    >
      <SectionHead index="01" title="Who's Abhi?" aside="Profile / 2026" />

      <h2 id="about-title" data-title className="display mt-8 text-[length:calc((100vw-2*var(--gutter))/5.15)] leading-[0.8]">
        <span className="sr-only">{about.title}</span>
        <span aria-hidden className="mask whitespace-nowrap">
          {Array.from(question).map((c, i) => (
            <span key={i} data-title-char className="inline-block">
              {c === " " ? " " : c}
            </span>
          ))}
          <span data-title-char className="inline-block text-accent">
            {rest}
          </span>
        </span>
      </h2>

      <div className="mt-[10vh] grid gap-y-14 md:grid-cols-12 md:gap-x-6">
        <figure className="md:col-span-5 lg:col-span-4">
          <div data-portrait className="relative aspect-[4/5] w-full overflow-hidden">
            <div data-portrait-inner className="absolute inset-0">
              {portrait}
            </div>
          </div>
          <figcaption className="label mt-3 flex justify-between text-muted">
            <span>Fig. 02 — Abhi</span>
            <span>Off the clock</span>
          </figcaption>
        </figure>

        <div className="md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          <p data-lead className="text-[clamp(26px,3.3vw,58px)] font-medium leading-[1.04] tracking-[-0.025em]">
            {about.lead.split(" ").map((w, i) => (
              <span key={i} data-word className="inline">
                {w}{" "}
              </span>
            ))}
          </p>

          <div className="mt-12 grid gap-6 text-[17px] leading-relaxed text-muted lg:grid-cols-2 lg:gap-8">
            {about.body.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>

          <dl data-facts className="mt-14 border-t border-line">
            {about.facts.map((f) => (
              <div key={f.k} data-fact className="grid grid-cols-[minmax(7rem,30%)_1fr] items-baseline gap-4 border-b border-line py-3">
                <dt className="label text-muted">{f.k}</dt>
                <dd className="text-[15px]">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
