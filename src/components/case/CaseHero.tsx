"use client";

import { useRef } from "react";
import type { Project } from "@/content/projects";
import { projects } from "@/content/projects";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { onPageEnter, TransitionLink } from "../PageTransition";
import { Known } from "../ui/Ph";

/** Opening spread of a case study. Plays once the page wipe lifts. */
export function CaseHero({ project: p, cover }: { project: Project; cover: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const research = p.kind === "research";
  const longest = Math.max(...p.titleLines.map((l) => l.length));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.fromTo(q("[data-ch]"), { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.15, stagger: 0.08 }, 0)
          .fromTo(q("[data-ci]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.3)
          .fromTo(
            q("[data-cover]"),
            { clipPath: "inset(18% 12% 0% 12%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
            0.25,
          );
        return onPageEnter(() => tl.play());
      });
    },
    { scope: root },
  );

  const meta = [
    { k: "Type", v: p.category },
    { k: "Role", v: p.role, todo: "Add role" },
    { k: "Year", v: p.year, todo: "Add year" },
    { k: "Status", v: p.status, todo: "Add status" },
  ];

  return (
    <section
      ref={root}
      className="case-hero relative"
      data-theme={research ? "paper" : "ink"}
      data-index="00"
      data-label={p.title}
      aria-labelledby="case-title"
    >
      <div className="px-gutter pb-10 pt-[calc(var(--nav-h)+3vh)]">
        <div data-ci className="label flex items-center justify-between gap-4 border-b border-line pb-3">
          <TransitionLink href="/#work" transitionLabel="Work" className="group inline-flex items-center gap-2 py-1">
            <span className="arrow-nudge-x rotate-180">→</span>
            <span className="link-line">All work</span>
          </TransitionLink>
          <span className="text-muted">
            {research ? "Research note" : "Case study"} <span className="tnum text-accent">{p.number}</span> / {pad(projects.length)}
          </span>
        </div>

        <div className="relative mt-[6vh]">
          <span
            aria-hidden
            className="display hollow pointer-events-none absolute -top-[5vh] right-0 text-[clamp(96px,15vw,280px)] leading-[0.8] opacity-50"
          >
            {p.number}
          </span>
          <p data-ci className="label relative text-accent">
            {p.category}
          </p>
          <h1
            id="case-title"
            className="case-title display relative mt-4"
            style={{ "--n": longest } as React.CSSProperties}
          >
            <span className="sr-only">{p.title}</span>
            {p.titleLines.map((line) => (
              <span key={line} aria-hidden className="mask">
                <span data-ch className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
          <p data-ci className="max-w-[26ch] text-[clamp(24px,2.4vw,40px)] font-medium leading-[1.08] tracking-[-0.02em] lg:col-span-6">
            {p.tagline}
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-end lg:col-span-6 lg:grid-cols-4">
            {meta.map((m) => (
              <div key={m.k} data-ci className="border-t border-line pt-3">
                <dt className="label text-muted">{m.k}</dt>
                <dd className="mt-1.5 text-[15px] leading-snug">
                  <Known value={m.v} todo={m.todo ?? ""} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div data-cover className="relative mx-gutter aspect-[16/10] overflow-hidden md:aspect-[21/9]">
        {cover}
      </div>
    </section>
  );
}
