"use client";

import { useId, useRef, useState } from "react";
import { garage, sections, type Part } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { SectionHead } from "./ui/SectionHead";
import { StatusChip } from "./ui/StatusChip";
import { ImuScope } from "./visuals/ImuScope";
import { LeanDial } from "./visuals/LeanDial";
import { PartGlyph } from "./visuals/PartGlyph";

type BinKey = keyof typeof garage.bins;
const BINS: { key: BinKey; label: string }[] = [
  { key: "hardware", label: "Hardware" },
  { key: "software", label: "Software" },
  { key: "creative", label: "Creative" },
];

/**
 * 07 — The Garage: the hardware lab. Telemetry mode — grid paper, crosshair
 * cursor, a live sensor trace, a parts bin you can rummage through, and a
 * prototype on the bench with its (honest) build story. Every number here
 * is counted from content.
 */
export function Lab() {
  const root = useRef<HTMLElement>(null);
  const [bin, setBin] = useState<BinKey>("hardware");
  const [active, setActive] = useState(0);
  const tabsId = useId();
  const s = sections.garage;
  const parts: Part[] = garage.bins[bin];
  const part = parts[Math.min(active, parts.length - 1)];
  const hw = garage.bins.hardware;
  const bench = garage.bench[0];

  const stats = [
    { n: hw.length, k: "Parts on the bench" },
    { n: hw.filter((p) => p.kind === "Microcontroller").length, k: "Microcontroller families" },
    { n: hw.filter((p) => ["IMU", "Distance", "Detection"].includes(p.kind)).length, k: "Sensor types" },
    { n: garage.bench.length, k: "Prototype on the bench" },
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

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + BINS.length) % BINS.length;
    setBin(BINS[next].key);
    setActive(0);
    document.getElementById(`${tabsId}-tab-${next}`)?.focus();
  };

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
        title="The Garage — hardware lab"
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

        {/* Parts bin */}
        <div className="flex flex-col border border-line lg:col-span-5">
          <div role="tablist" aria-label="Parts bin" className="grid grid-cols-3 border-b border-line">
            {BINS.map((b, i) => (
              <button
                key={b.key}
                id={`${tabsId}-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={bin === b.key}
                aria-controls={`${tabsId}-panel`}
                tabIndex={bin === b.key ? 0 : -1}
                onClick={() => {
                  setBin(b.key);
                  setActive(0);
                }}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "label relative border-r border-line px-3 py-3 text-left transition-colors last:border-r-0",
                  bin === b.key ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                <span className="tnum mr-2 text-accent">{pad(garage.bins[b.key].length)}</span>
                {b.label}
                {bin === b.key ? <span aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] bg-accent" /> : null}
              </button>
            ))}
          </div>

          <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${BINS.findIndex((b) => b.key === bin)}`} className="flex flex-1 flex-col">
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
                {part.glyph !== "mono" ? <p className="label mt-2 normal-case tracking-normal text-[12px] text-muted">{part.spec}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* On the bench */}
      {bench ? (
        <article id="bench" aria-labelledby="bench-title" className="mt-20 scroll-mt-24">
          <div className="label flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-fg pb-3">
            <span className="tnum text-accent">Bench / {bench.id.replace("B-", "")}</span>
            <span>On the bench</span>
            <span className="ml-auto">
              <StatusChip status="Prototype" />
            </span>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-6">
            <h3 id="bench-title" className="display text-[clamp(48px,6.4vw,124px)] lg:col-span-7">
              {bench.title}
            </h3>
            <div className="self-end lg:col-span-5">
              <p className="text-[clamp(18px,1.4vw,22px)] leading-snug">{bench.summary}</p>
              <p className="label mt-4 text-accent">{bench.disclaimer}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {bench.parts.map((x) => (
                  <li key={x} className="label border border-line px-2.5 py-1.5">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12">
            <LeanDial story={bench.story} />
          </div>
        </article>
      ) : null}
    </section>
  );
}
