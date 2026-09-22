"use client";

import { useEffect, useRef } from "react";
import { beyond } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { SectionHead } from "./ui/SectionHead";
import { Ph } from "./ui/Ph";

/**
 * 08 — Off-track. Everything that isn't code, laid out as a contact sheet
 * on a strip of film. Drag it (mouse), swipe it (touch) or scroll it with
 * the keyboard. Frames are placeholders until real photos land in /public.
 */
export function BeyondCode({ media }: { media: React.ReactNode[] }) {
  const root = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  // Mouse drag-to-scroll; touch and trackpads scroll natively.
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.dataset.dragging = "true";
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      delete el.dataset.dragging;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        // The category line slides as the page scrolls — film advancing.
        gsap.fromTo(
          q("[data-reel]"),
          { xPercent: 0, x: 0 },
          { xPercent: -38, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
        gsap.fromTo(
          q("[data-frame]"),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.06, ease: "expo.out", scrollTrigger: { trigger: strip.current, start: "top 85%", once: true } },
        );
      });
    },
    { scope: root },
  );

  const reel = beyond.frames.map((f) => f.tag).join(" · ");

  return (
    <section
      ref={root}
      id="beyond"
      data-theme="paper"
      data-index="08"
      data-label="Off-track"
      aria-labelledby="beyond-title"
      className="relative overflow-hidden pb-[14vh] pt-[16vh]"
    >
      <div className="px-gutter">
        <SectionHead index="08" title="Off-track" aside="Contact sheet" />
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-6">
          <h2 id="beyond-title" className="display text-[clamp(88px,17vw,330px)] lg:col-span-8">
            {beyond.title}
          </h2>
          <div className="self-end lg:col-span-4">
            <p className="display text-[clamp(30px,2.6vw,46px)] leading-[0.95]">{beyond.lead}</p>
            <p className="mt-4 max-w-sm text-[17px] leading-snug text-muted">
              Video, 3D, hardware tinkering, events and the people around them — the stuff that doesn&apos;t go on a résumé but probably explains the rest.
            </p>
          </div>
        </div>
      </div>

      <p aria-hidden className="display mt-14 whitespace-nowrap text-[clamp(48px,7vw,130px)] leading-none text-fg/[0.12]">
        <span data-reel className="inline-block pl-gutter">
          {reel} · {reel}
        </span>
      </p>

      {/* The film strip */}
      <div data-surface="ink" className="film relative mt-8 py-[34px]">
        <div
          ref={strip}
          data-cursor="Drag"
          data-lenis-prevent-horizontal
          tabIndex={0}
          role="region"
          aria-label="Off-track contact sheet — scroll sideways"
          className="scroll-x flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter data-[dragging=true]:snap-none md:snap-none"
        >
          {beyond.frames.map((f, i) => (
            <figure key={f.tag} data-frame className="w-[74vw] shrink-0 snap-start sm:w-[46vw] lg:w-[29vw]">
              <div className="relative aspect-[3/2] overflow-hidden bg-[#141413]">{media[i]}</div>
              <figcaption className="mt-2.5 flex items-baseline justify-between gap-3">
                <span className="label text-paper">{f.tag}</span>
                <span className="label tnum text-ir">
                  ABHI 400 ▸ {pad(i + 1)}
                  {i % 2 ? "A" : ""}
                </span>
              </figcaption>
              <p className="mt-1 min-h-[2.8em] text-[14px] leading-snug text-paper/70">
                {f.caption ?? <Ph>Add caption</Ph>}
              </p>
            </figure>
          ))}
          <div aria-hidden className="w-[10vw] shrink-0" />
        </div>
      </div>

      <p className="label mt-5 flex justify-between px-gutter text-muted">
        <span>{pad(beyond.frames.length)} frames</span>
        <span>Drag / swipe →</span>
      </p>
    </section>
  );
}
