"use client";

import { useEffect, useId, useRef, useState } from "react";
import { races } from "@/content/site";
import { gsap, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { SectionHead } from "./ui/SectionHead";
import { Known, Ph } from "./ui/Ph";

const SESSION_STYLE: Record<string, string> = {
  Race: "bg-accent text-bg border-accent",
  Community: "border-fg text-fg",
  Practice: "border-line text-muted",
};

/**
 * 05 — Race weekends. Hackathons as a timing sheet. No invented positions:
 * results stay [ADD …] until they're real. The session clock counts the
 * time you spend here, and only while you're actually looking.
 */
export function Hackathons() {
  const root = useRef<HTMLElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  useEffect(() => {
    const el = root.current;
    const c = clock.current;
    if (!el || !c) return;
    const reduce = window.matchMedia(REDUCED).matches;
    let total = 0;
    let start = 0;
    let raf = 0;
    let interval = 0;
    let visible = false;
    const fmt = (ms: number) => {
      const m = Math.floor(ms / 60000);
      const s = Math.floor(ms / 1000) % 60;
      const cs = Math.floor(ms / 10) % 100;
      return reduce ? `${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}.${pad(cs)}`;
    };
    const tick = () => {
      c.textContent = fmt(total + performance.now() - start);
      if (!reduce) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          visible = true;
          start = performance.now();
          if (reduce) interval = window.setInterval(tick, 1000);
          else raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && visible) {
          visible = false;
          total += performance.now() - start;
          cancelAnimationFrame(raf);
          window.clearInterval(interval);
          c.textContent = fmt(total);
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
    };
  }, []);

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
      id="races"
      data-theme="garage"
      data-index="05"
      data-label="Race weekends"
      aria-labelledby="races-title"
      className="relative px-gutter pb-[16vh] pt-[12vh]"
    >
      <SectionHead index="05" title="Race weekends" aside="Timing sheet — unofficial" />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <h2 id="races-title" data-race-title className="display text-[clamp(76px,13.5vw,260px)] lg:col-span-8">
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
          <p className="text-[clamp(18px,1.4vw,22px)] leading-snug">{races.lead}</p>
          <div className="border border-line">
            <div className="label flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Session clock
              </span>
              <span className="text-muted">You</span>
            </div>
            <p className="px-4 pb-3 pt-4">
              <span ref={clock} className="display tnum block text-[clamp(52px,5vw,84px)] leading-[0.8]" aria-live="off">
                00:00.00
              </span>
            </p>
            <p className="label border-t border-line px-4 py-2.5 text-muted">Time you&apos;ve spent here. Only runs while you&apos;re watching.</p>
          </div>
        </div>
      </div>

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
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-2 py-5 pl-4 text-left lg:grid-cols-[3rem_7.5rem_1fr_12rem_8rem_9rem_2.5rem] lg:pl-5"
                >
                  <span className="label tnum text-muted">{pad(i + 1)}</span>
                  <span className="order-first col-span-3 lg:order-none lg:col-span-1">
                    <span className={cn("label inline-block border px-2 py-1", SESSION_STYLE[r.session])}>{r.session}</span>
                  </span>
                  <span className="display text-[clamp(30px,3.2vw,56px)] leading-[0.9] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
                    {r.name}
                  </span>
                  <span className="label col-start-2 text-muted lg:col-start-auto">{r.kind}</span>
                  <span className="label col-start-2 lg:col-start-auto">
                    <Known value={r.date} todo="Add date" />
                  </span>
                  <span className="label col-start-2 lg:col-start-auto">
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
                <div id={panelId} hidden={!isOpen} className="grid gap-4 pb-6 pl-4 lg:grid-cols-[3rem_7.5rem_1fr] lg:gap-4 lg:pl-5">
                  <span className="hidden lg:block" />
                  <span className="hidden lg:block" />
                  <div className="max-w-2xl space-y-3 text-[16px] leading-relaxed text-muted">
                    {r.detail ? <p>{r.detail}</p> : null}
                    {r.notes ? <p className="text-fg">{r.notes}</p> : <Ph>Add notes — what you built, what happened</Ph>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
