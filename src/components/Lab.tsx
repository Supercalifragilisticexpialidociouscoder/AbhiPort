"use client";

import { useRef, useState } from "react";
import { garage, sections, type Part } from "@/content/site";
import { labEntries } from "@/content/lab";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { LabIndex } from "./lab/LabIndex";
import { SectionHead } from "./ui/SectionHead";
import { ImuScope } from "./visuals/ImuScope";
import { PartGlyph } from "./visuals/PartGlyph";

/**
 * 07 — The Garage: the physical side. Telemetry mode — grid paper,
 * crosshair cursor, a live sensor trace and a parts bin you can rummage
 * through. Then the lab index: one prototype and nine experiments, each a
 * door to its own page. Every number here is counted from content.
 */
export function Lab() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const s = sections.garage;
  const parts: Part[] = garage.parts;
  const part = parts[Math.min(active, parts.length - 1)];

  const stats = [
    { n: parts.length, k: "Parts on the bench" },
    { n: parts.filter((p) => p.kind === "Microcontroller").length, k: "Microcontroller families" },
    { n: parts.filter((p) => ["IMU", "Distance", "Detection"].includes(p.kind)).length, k: "Sensor types" },
    { n: labEntries.length, k: "Builds filed in the lab" },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-lab-line]"),
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: q("[data-lab-title]")[0], start: "top 85%", once: true },
          },
        );
        q("[data-count]").forEach((el) => {
          const target = Number((el as HTMLElement).dataset.count);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = pad(Math.round(obj.v));
            },
          });
        });
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
      aria-labelledby="garage-title"
      className="relative px-gutter pb-[14vh] pt-[16vh]"
    >
      <SectionHead
        index={s.index}
        title="The Garage — the physical side"
        aside={
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" /> Telemetry mode
          </span>
        }
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <h2 id="garage-title" data-lab-title className="display-wide text-[clamp(52px,9.4vw,180px)] lg:col-span-9">
          <span className="mask">
            <span data-lab-line className="block">
              The
            </span>
          </span>
          <span className="mask">
            <span data-lab-line className="block">
              Garage<span className="text-accent">_</span>
            </span>
          </span>
        </h2>
        <p className="max-w-sm self-end text-[clamp(18px,1.4vw,22px)] leading-snug text-muted lg:col-span-3">{garage.lead}</p>
      </div>

      {/* Counted from content, not typed in. */}
      <dl className="mt-14 grid grid-cols-2 border-t border-line md:grid-cols-4">
        {stats.map((st) => (
          <div key={st.k} className="flex flex-col gap-2 border-b border-line py-5 pr-4 md:border-b-0 md:border-r md:pl-4 md:first:pl-0 md:last:border-r-0">
            <dt className="label order-2 text-muted">{st.k}</dt>
            <dd data-count={st.n} className="display tnum order-1 text-[clamp(56px,6vw,108px)] leading-[0.8]">
              {pad(st.n)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="min-h-[420px] lg:col-span-7">
          <ImuScope />
        </div>

        {/* Parts bin — the hardware on the bench */}
        <div className="flex flex-col border border-line lg:col-span-5">
          <p className="label flex items-center justify-between border-b border-line px-4 py-3">
            <span>
              <span className="tnum mr-2 text-accent">{pad(parts.length)}</span>Parts bin
            </span>
            <span className="text-muted">Hover a part</span>
          </p>

          <ul className="flex-1">
            {parts.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={i === active}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group grid w-full grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 border-b border-line px-4 py-2 text-left transition-colors",
                    i === active ? "bg-fg/[0.06]" : "hover:bg-fg/[0.03]",
                  )}
                >
                  <span className={cn("label tnum", i === active ? "text-accent" : "text-muted")}>{p.id}</span>
                  <span className="text-[15px] font-medium">{p.name}</span>
                  <span className="label text-muted">{p.kind}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Datasheet for the selected part */}
          <div className="grid grid-cols-[88px_1fr] gap-4 border-t border-line p-4">
            <PartGlyph name={part.glyph} label={part.spec} className="h-[88px] w-[88px] text-fg" />
            <div className="min-w-0">
              <p className="label text-muted">
                Datasheet · <span className="text-accent">{part.id}</span>
              </p>
              <p className="mt-1 text-[17px] font-medium leading-tight">{part.line}</p>
              <p className="label mt-2 normal-case tracking-normal text-[12px] text-muted">{part.spec}</p>
            </div>
          </div>
        </div>
      </div>

      {/* The lab: every build gets its own page */}
      <div id="lab" className="mt-20 scroll-mt-24">
        <div className="label flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-fg pb-3">
          <span className="tnum text-accent">({s.index}.1)</span>
          <span>{garage.index.title}</span>
          <span className="text-muted">{garage.index.note}</span>
          <TransitionLink href="/lab" transitionLabel="The lab" className="group ml-auto inline-flex items-center gap-2">
            <span className="link-line">Enter the lab</span>
            <span className="arrow-nudge-x text-accent">→</span>
          </TransitionLink>
        </div>
        <LabIndex className="mt-6" />
      </div>
    </section>
  );
}
