"use client";

import { useId, useRef, useState } from "react";
import { races, sections } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { SectionHead } from "./ui/SectionHead";
import { Known, Ph } from "./ui/Ph";
import { RaceTime } from "./ui/RaceTime";

const SESSION_STYLE: Record<string, string> = {
  Race: "bg-accent text-bg border-accent",
  Practice: "border-line text-muted",
};

/**
 * 06 — Race weekends. Hackathons as evidence of execution under pressure,
 * not an identity: the process behind them, the problem statements, and a
 * timing sheet with no invented results. The clock is real: your time on
 * the site since you arrived. The full story — the 2× SIH credential,
 * photos and every event — lives one door away, on /community.
 */
export function Hackathons() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  const s = sections.races;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-race-line]"),
          { yPercent: 105, y: 0 },
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: q("[data-race-title]")[0], start: "top 85%", once: true } },
        );

        // The lap: each stage lights as the line reaches it.
        const steps = q("[data-lap-step]");
        const lap = gsap.timeline({ scrollTrigger: { trigger: q("[data-lap]")[0], start: "top 78%", end: "bottom 45%", scrub: 0.6 } });
        lap.fromTo(q("[data-lap-fill]"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: steps.length }, 0);
        steps.forEach((st, i) => {
          lap.fromTo(st, { opacity: 0.25 }, { opacity: 1, duration: 0.4, ease: "none" }, i + 0.1);
        });

        const rows = q("[data-row]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-sheet]")[0], start: "top 80%", once: true } });
        tl.fromTo(rows, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.9, stagger: 0.12, ease: "expo.out" }).fromTo(
          q("[data-flash]"),
          { scaleY: 0 },
          { scaleY: 1, duration: 0.5, stagger: 0.12, ease: "expo.out" },
          0.1,
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={s.id}
      data-theme="garage"
      data-index={s.index}
      data-label={s.label}
      aria-labelledby="races-title"
      className="relative px-gutter pb-[12vh] pt-[14vh]"
    >
      <SectionHead
        index={s.index}
        title={races.title}
        aside={
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" /> Telemetry mode · timing sheet
          </span>
        }
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <h2 id="races-title" data-race-title className="display text-[clamp(64px,11vw,210px)] lg:col-span-8">
          <span className="mask">
            <span data-race-line className="block">
              Race
            </span>
          </span>
          <span className="mask">
            <span data-race-line className="block">
              weekends<span className="text-accent">.</span>
            </span>
          </span>
        </h2>

        <div className="flex flex-col justify-end gap-8 lg:col-span-4">
          <div>
            <p className="text-[clamp(18px,1.4vw,22px)] leading-snug">{races.lead}</p>
            <p className="label mt-4 text-muted">{races.note}</p>
          </div>
          <div className="border border-line">
            <div className="label flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Your time in race mode
              </span>
              <span className="text-muted">Live</span>
            </div>
            <p className="px-4 pb-3 pt-4">
              <span className="sr-only">Your time on this site, counting up from the moment you arrived.</span>
              <RaceTime className="display tnum block text-[clamp(52px,5vw,84px)] leading-[0.8]" />
            </p>
            <p className="label border-t border-line px-4 py-2.5 text-muted">How long you&apos;ve been in here. Started when you arrived. A fresh visit resets it.</p>
          </div>
        </div>
      </div>

      {/* The lap: how a weekend actually goes */}
      <div data-lap className="relative mt-14">
        <p className="label mb-5 text-muted">One lap, every time</p>
        <div className="relative">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-line md:block" />
          <span aria-hidden data-lap-fill className="absolute left-0 right-0 top-[7px] hidden h-[2px] origin-left -translate-y-px bg-accent md:block" />
          <ol className="relative grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-7 md:gap-x-4">
            {races.process.map((st, i) => {
              const last = i === races.process.length - 1;
              return (
                <li key={st.label} data-lap-step>
                  <span aria-hidden className={cn("block h-[15px] w-[15px] rounded-full border-2 bg-bg", last ? "border-accent bg-accent" : "border-fg")} />
                  <p className="label tnum mt-4 text-muted">{pad(i + 1)}</p>
                  <p className={cn("display mt-1 text-[clamp(28px,2.4vw,42px)] leading-[0.9]", last && "text-accent")}>
                    {st.label}
                    {last ? <span className="tnum"> ×2</span> : null}
                  </p>
                  <p className="mt-2 text-[14px] leading-snug text-muted">{st.note}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Timing sheet */}
      <div data-sheet className="mt-16">
        <div aria-hidden className="label hidden grid-cols-[3rem_7.5rem_1fr_12rem_8rem_9rem_2.5rem] gap-4 border-b border-fg pb-2 text-muted lg:grid">
          <span>#</span>
          <span>Session</span>
          <span>Event</span>
          <span>Format</span>
          <span>Date</span>
          <span>Result</span>
          <span />
        </div>

        <ol>
          {races.entries.map((r, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-race-${i}`;
            return (
              <li key={r.name} data-row className="relative border-b border-line">
                <span data-flash aria-hidden className="absolute bottom-0 left-0 top-0 w-[3px] origin-top bg-accent" />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-2 py-4 pl-4 text-left lg:grid-cols-[3rem_7.5rem_1fr_12rem_8rem_9rem_2.5rem] lg:pl-5"
                >
                  <span className="label tnum text-muted">{pad(i + 1)}</span>
                  <span className="order-first col-span-3 lg:order-none lg:col-span-1">
                    <span className={cn("label inline-block border px-2 py-1", SESSION_STYLE[r.session])}>{r.session}</span>
                  </span>
                  <span className="display text-[clamp(28px,2.8vw,48px)] leading-[0.9] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
                    {r.name}
                  </span>
                  <span className="label col-start-2 text-muted lg:col-start-auto">{r.kind}</span>
                  <span className="label col-start-2 lg:col-start-auto">
                    <Known value={r.date} todo="Add date" />
                  </span>
                  <span className={cn("label col-start-2 lg:col-start-auto", r.result && "text-accent")}>
                    <Known value={r.result} todo="Add result" />
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "col-start-3 row-start-2 grid h-9 w-9 place-items-center justify-self-end rounded-full border border-line text-lg transition-transform duration-500 lg:col-start-auto lg:row-start-auto",
                      isOpen && "rotate-45 border-accent text-accent",
                    )}
                  >
                    +
                  </span>
                </button>
                <div id={panelId} hidden={!isOpen} className="grid gap-4 pb-8 pl-4 lg:grid-cols-[3rem_7.5rem_1fr] lg:pl-5">
                  <span className="hidden lg:block" />
                  <span className="hidden lg:block" />
                  <div className="max-w-3xl space-y-5">
                    {r.detail ? <p className="text-[16px] leading-relaxed text-muted">{r.detail}</p> : null}
                    {r.statements?.length ? (
                      <ul className="border-t border-line">
                        {r.statements.map((ps) => {
                          const inner = (
                            <>
                              <span className="label tnum text-accent">{ps.code}</span>
                              <span className="text-[17px] font-medium">{ps.title}</span>
                              <span className="label text-muted">{[ps.org, ps.concept].filter(Boolean).join(" · ")}</span>
                            </>
                          );
                          return (
                            <li key={ps.code + ps.title} className="border-b border-line">
                              {ps.href ? (
                                <TransitionLink
                                  href={ps.href}
                                  transitionLabel={ps.title}
                                  className="group/ps grid gap-1 py-3 md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-4"
                                >
                                  {inner}
                                  <span className="label hidden text-accent md:block">
                                    Case study <span className="inline-block transition-transform group-hover/ps:translate-x-1">→</span>
                                  </span>
                                </TransitionLink>
                              ) : (
                                <div className="grid gap-1 py-3 md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-4">{inner}</div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                    {r.notes ? <p className="text-fg">{r.notes}</p> : <Ph>Add notes — what you built, what happened</Ph>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* What race weekends train — and the door to the full story */}
      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-6">
        <p className="label text-muted lg:col-span-3">What a race weekend trains</p>
        <ul className="flex flex-wrap gap-1.5 lg:col-span-9">
          {races.skills.map((k) => (
            <li key={k} className="label border border-line px-2.5 py-1.5">
              {k}
            </li>
          ))}
        </ul>
      </div>

      <TransitionLink
        href={races.door.href}
        transitionLabel="Community"
        data-cursor="Open"
        className="group mt-12 flex flex-wrap items-center justify-between gap-6 border-y border-line py-6"
      >
        <span className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
            <span className="arrow-nudge-x">→</span>
          </span>
          <span className="display text-[clamp(26px,2.4vw,40px)]">{races.door.label}</span>
        </span>
        <span className="label max-w-sm text-muted">{races.door.note}</span>
      </TransitionLink>
    </section>
  );
}
