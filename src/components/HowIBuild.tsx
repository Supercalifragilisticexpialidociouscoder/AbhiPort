"use client";

import { useEffect, useRef, useState } from "react";
import { howIBuild, sections } from "@/content/site";
import { getProject, projectHref } from "@/content/projects";
import { gsap, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { Ph } from "./ui/Ph";
import { SectionHead } from "./ui/SectionHead";

/**
 * 08 — How I build. The skeleton most projects share, filled in with the
 * real choices from two of them (switchable): one that needs every layer and
 * one that skips most of them. Then the loop every project goes through,
 * the principles behind it, and the stack — told through the projects that
 * use it, never scored.
 */
export function HowIBuild() {
  const root = useRef<HTMLElement>(null);
  const [pick, setPick] = useState(0);
  const first = useRef(true);
  const s = sections.how;
  const example = howIBuild.examples[pick];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-how-line]"),
          { yPercent: 105, y: 0 },
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: q("[data-how-title]")[0], start: "top 85%", once: true } },
        );
        gsap.fromTo(
          q("[data-layer]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: q("[data-pipeline]")[0], start: "top 82%", once: true } },
        );
        gsap.fromTo(
          q("[data-loop-step]"),
          { opacity: 0, x: -18 },
          { opacity: 1, x: 0, duration: 0.9, stagger: 0.09, ease: "expo.out", scrollTrigger: { trigger: q("[data-loop]")[0], start: "top 85%", once: true } },
        );
        gsap.fromTo(
          q("[data-principle]"),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: q("[data-principles]")[0], start: "top 85%", once: true } },
        );
      });
    },
    { scope: root },
  );

  // Switching projects: the choices swap and a signal runs through the stack.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia(REDUCED).matches || !root.current) return;
    const q = gsap.utils.selector(root.current);
    gsap.fromTo(q("[data-choice]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "expo.out" });
    gsap.fromTo(q("[data-pulse]"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.9, ease: "power3.inOut" });
  }, [pick]);

  return (
    <section
      ref={root}
      id={s.id}
      data-theme="garage"
      data-index={s.index}
      data-label={s.label}
      aria-labelledby="how-title"
      className="relative px-gutter pb-[14vh] pt-[16vh]"
    >
      <SectionHead index={s.index} title={howIBuild.title} aside={howIBuild.aside} />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <h2 id="how-title" data-how-title className="display text-[clamp(72px,12vw,230px)] lg:col-span-7">
          <span className="mask">
            <span data-how-line className="block">
              How I
            </span>
          </span>
          <span className="mask">
            <span data-how-line className="block">
              build<span className="text-accent">.</span>
            </span>
          </span>
        </h2>
        <p className="max-w-md self-end text-[clamp(18px,1.4vw,22px)] leading-snug text-muted lg:col-span-5">{howIBuild.lead}</p>
      </div>

      {/* The pipeline */}
      <div className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="label text-muted">The skeleton — with real choices from</p>
          <div role="group" aria-label="Choose a project" className="label flex border border-line">
            {howIBuild.examples.map((ex, i) => (
              <button
                key={ex.slug}
                type="button"
                aria-pressed={pick === i}
                onClick={() => setPick(i)}
                className={cn("px-3 py-2 transition-colors md:px-4", pick === i ? "bg-accent text-bg" : "text-muted hover:text-fg", i > 0 && "border-l border-line")}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        <div data-pipeline className="relative mt-5">
          <span aria-hidden data-pulse className="absolute -top-px left-0 right-0 hidden h-[2px] bg-accent lg:block" />
          <ol className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
            {howIBuild.layers.map((layer, i) => (
              <li key={layer} data-layer className="relative flex min-h-[150px] flex-col justify-between gap-4 bg-bg p-4 md:p-5 lg:min-h-[200px]">
                <span className="label flex justify-between text-muted">
                  <span className="tnum">L{pad(i + 1)}</span>
                  {i < howIBuild.layers.length - 1 ? <span className="text-accent lg:inline">→</span> : <span className="text-accent">■</span>}
                </span>
                <span>
                  <span className="display block text-[clamp(24px,2.2vw,40px)] leading-[0.9]">{layer}</span>
                  <span data-choice className="mt-2 block min-h-[2.6em] text-[14px] leading-snug md:text-[15px]">
                    {example.choices[i] ?? <Ph>Add</Ph>}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="label mt-3 flex flex-col gap-2 text-muted sm:flex-row sm:justify-between sm:gap-4">
            <span>Frontend → API → Database → Auth → Infrastructure → Deployment</span>
            {getProject(example.slug)?.study ? (
              <TransitionLink href={`/work/${example.slug}#under-the-hood`} transitionLabel={example.name} className="link-line text-fg">
                {example.name}, under the hood →
              </TransitionLink>
            ) : (
              <span className="text-fg">You&apos;re inside it</span>
            )}
          </p>
        </div>
      </div>

      {/* The loop — the actual process, every time */}
      <div data-loop className="mt-20">
        <p className="label flex items-center justify-between border-b border-fg pb-2">
          <span>The loop</span>
          <span className="text-muted">Every project, every time</span>
        </p>
        <ol className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
          {howIBuild.loop.map((st, i) => {
            const last = i === howIBuild.loop.length - 1;
            return (
              <li key={st.label} data-loop-step className="flex flex-col gap-3 bg-bg py-5 pr-4 lg:pl-4 lg:first:pl-0">
                <span className="label tnum flex items-center gap-2 text-muted">
                  {pad(i + 1)}
                  <span className={last ? "text-accent" : "text-accent/70"}>{last ? "■" : "→"}</span>
                </span>
                <span className={cn("display text-[clamp(30px,2.6vw,46px)] leading-[0.9]", (st.label === "Break" || last) && "text-accent")}>{st.label}</span>
                <span className="text-[14px] leading-snug text-muted">{st.note}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Principles */}
      <div data-principles className="mt-20">
        <p className="label border-b border-fg pb-2">Five rules I actually follow</p>
        <ol className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {howIBuild.principles.map((p, i) => (
            <li key={p.name} data-principle className="flex flex-col gap-6 bg-bg py-6 pr-5 lg:pl-5 lg:first:pl-0">
              <span className="display hollow text-[64px] leading-[0.8]">{pad(i + 1)}</span>
              <span className="display text-[clamp(30px,2.6vw,46px)] leading-[0.9]">{p.name}</span>
              <span className="text-[15px] leading-relaxed text-muted">{p.body}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* The stack — told through the work, never graded */}
      <div data-built className="mt-20">
        <div className="label flex items-center justify-between border-b border-fg pb-2">
          <span>Built with — the stack, told through the work</span>
          <span className="text-muted">No percentages. Ever.</span>
        </div>
        <ul>
          {howIBuild.builtWith.map((row) => {
            const p = getProject(row.slug);
            const name = row.label ?? p?.title ?? row.slug;
            const href = row.href ?? (p ? (projectHref(p) ?? "/archive") : "/archive");
            return (
              <li key={row.slug} className="border-b border-line">
                <TransitionLink href={href} transitionLabel={name} className="group grid gap-2 py-4 md:grid-cols-12 md:items-baseline md:gap-6">
                  <span className="flex items-baseline gap-3 md:col-span-4">
                    <span className="label tnum text-accent">{p?.number ?? "HW"}</span>
                    <span className="display text-[clamp(26px,2.2vw,38px)] leading-[0.9] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
                      {name}
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-x-5 gap-y-1 text-[clamp(17px,1.4vw,21px)] md:col-span-7">
                    {row.items.map((it) => (
                      <span key={it}>{it}</span>
                    ))}
                  </span>
                  <span aria-hidden className="arrow-nudge-x hidden justify-self-end text-accent md:col-span-1 md:inline-block">
                    →
                  </span>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
        <p className="label mt-4 flex flex-wrap gap-x-4 gap-y-1 text-muted">
          <span className="text-fg">Also in the toolbox —</span>
          {howIBuild.alsoUsed.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
