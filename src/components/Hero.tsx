"use client";

import { useRef } from "react";
import { hero, site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span key={i} data-char className="inline-block will-change-transform">
          {c}
        </span>
      ))}
    </>
  );
}

const WDTH_MIN = 62;
const WDTH_MAX = 125;
const LINE = 0.8; // line-height of .hero-name

/**
 * 00 — The name, as big as the screen allows.
 *
 * The first line is fitted to the full width using Archivo's width axis:
 * the font size is capped by the height available, then the letterforms
 * stretch until ABHIRAM spans edge to edge. On scroll the two lines slide
 * apart and the portrait frame (tucked beside REDDY) opens to full-bleed.
 */
export function Hero({ portrait }: { portrait: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const pin = q("[data-pin]")[0] as HTMLElement;
      const grid = q("[data-grid]")[0] as HTMLElement;
      const measure = q("[data-measure]")[0] as HTMLElement;
      const top = q("[data-area='top']")[0] as HTMLElement;
      const meta = q("[data-area='meta']")[0] as HTMLElement;
      const slot = q("[data-slot]")[0] as HTMLElement;
      const frame = q("[data-frame]")[0] as HTMLElement;
      const l1 = q("[data-line='1']")[0] as HTMLElement;
      const l2 = q("[data-line='2']")[0] as HTMLElement;

      /* ── Fit the name ─────────────────────────────────────────────── */
      const setName = (size: number, wdth: number) => {
        section.style.setProperty("--name-size", `${size.toFixed(2)}px`);
        section.style.setProperty("--name-wdth", wdth.toFixed(1));
      };
      const fit = () => {
        const W = grid.clientWidth - parseFloat(getComputedStyle(grid).paddingLeft) * 2;
        const H = grid.clientHeight - parseFloat(getComputedStyle(grid).paddingTop) - parseFloat(getComputedStyle(grid).paddingBottom);
        const desktop = window.matchMedia("(min-width: 768px) and (min-aspect-ratio: 1/1)").matches;
        const reserved = top.offsetHeight + meta.offsetHeight + (desktop ? 28 : H * 0.3);
        let size = Math.max(40, (H - reserved) / (2 * LINE));
        size = Math.min(size, W * 0.5);
        setName(size, WDTH_MIN);
        const narrow = measure.getBoundingClientRect().width;
        if (narrow >= W) {
          setName(size * (W / narrow), WDTH_MIN);
          return;
        }
        setName(size, WDTH_MAX);
        if (measure.getBoundingClientRect().width <= W) return;
        let lo = WDTH_MIN;
        let hi = WDTH_MAX;
        for (let i = 0; i < 10; i++) {
          const mid = (lo + hi) / 2;
          setName(size, mid);
          if (measure.getBoundingClientRect().width > W) hi = mid;
          else lo = mid;
        }
        setName(size, lo);
      };
      fit();
      ScrollTrigger.addEventListener("refreshInit", fit);

      const slotInset = () => {
        const p = pin.getBoundingClientRect();
        const s = slot.getBoundingClientRect();
        return `inset(${(s.top - p.top).toFixed(1)}px ${(p.right - s.right).toFixed(1)}px ${(p.bottom - s.bottom).toFixed(1)}px ${(s.left - p.left).toFixed(1)}px)`;
      };

      const mm = gsap.matchMedia();

      /* ── Reduced motion: everything in place, nothing moves ───────── */
      mm.add(REDUCED, () => {
        const place = () => {
          const p = pin.getBoundingClientRect();
          const s = slot.getBoundingClientRect();
          gsap.set(frame, { clipPath: slotInset() });
          gsap.set(q("[data-frame-shift]"), { x: s.left + s.width / 2 - (p.left + p.width / 2), y: s.top + s.height / 2 - (p.top + p.height / 2) });
        };
        place();
        const st = ScrollTrigger.create({ trigger: pin, onRefresh: place });
        return () => st.kill();
      });

      /* ── Motion ───────────────────────────────────────────────────── */
      mm.add(MOTION_OK, () => {
        const caption = q("[data-caption]")[0];
        gsap.set(caption, { visibility: "visible" });

        // Scroll: split the name, open the frame, land the caption.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 1.35)}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // The media starts centred on the slot (a tight crop) and drifts back
        // to centre as the frame opens — same ease, so it never under-fills.
        const shift = () => {
          const p = pin.getBoundingClientRect();
          const s = slot.getBoundingClientRect();
          return { x: s.left + s.width / 2 - (p.left + p.width / 2), y: s.top + s.height / 2 - (p.top + p.height / 2) };
        };
        tl.fromTo(frame, { clipPath: () => slotInset() }, { clipPath: "inset(0px 0px 0px 0px)", ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(q("[data-frame-shift]"), { x: () => shift().x, y: () => shift().y }, { x: 0, y: 0, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(l1, { xPercent: 0, x: 0 }, { xPercent: -32, duration: 1 }, 0)
          .fromTo(l2, { xPercent: 0, x: 0 }, { xPercent: 32, duration: 1 }, 0)
          .to([l1, l2], { opacity: 0, duration: 0.4 }, 0.25)
          .to(q("[data-fade]"), { opacity: 0, y: -24, duration: 0.3 }, 0)
          .fromTo(q("[data-shade]"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.45)
          .fromTo(q("[data-caption-line]"), { yPercent: 110, y: 0 }, { yPercent: 0, duration: 0.3, stagger: 0.07, ease: "power3.out" }, 0.62)
          .fromTo(q("[data-caption-note]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.25 }, 0.85);

        // Load: ~1.3s of controlled motion, then out of the way.
        const intro = contextSafe!(() => {
          fit();
          ScrollTrigger.refresh();
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .fromTo(q("[data-line='1'] [data-char]"), { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.15, stagger: 0.045 }, 0)
            .fromTo(q("[data-line='2'] [data-char]"), { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.15, stagger: 0.045 }, 0.12)
            .fromTo(q("[data-shutter]"), { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: "expo.inOut" }, 0.3)
            .fromTo(q("[data-frame-inner]"), { scale: 1.35 }, { scale: 1, duration: 1.8 }, 0.3)
            .fromTo(q("[data-intro]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.55);
        });
        const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);
        fontsReady.then(intro);

        return () => tl.kill();
      });

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", fit);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="hero relative"
      data-theme="ink"
      data-index="00"
      data-label="Start"
      aria-labelledby="hero-title"
    >
      <h1 id="hero-title" className="sr-only">
        {site.name} — builder, engineer and creative technologist
      </h1>

      <div data-pin className="relative h-svh min-h-[560px] overflow-hidden">
        {/* The portrait frame. Clipped to the slot beside REDDY until scroll opens it. */}
        <div data-frame className="pointer-events-none absolute inset-0 z-0">
          <div data-frame-shift className="absolute inset-0 will-change-transform">
            <div data-frame-inner className="absolute inset-0 will-change-transform">
              {portrait}
            </div>
          </div>
          <div
            data-shade
            className="absolute inset-0 opacity-0"
            style={{
              background:
                "linear-gradient(to top, rgb(11 11 10 / 0.88), rgb(11 11 10 / 0.15) 55%, rgb(11 11 10 / 0.45))",
            }}
          />
        </div>

        <div data-grid className="hero-grid relative z-10 gap-x-4 px-gutter pb-4 pt-[calc(var(--nav-h)+10px)] md:gap-x-5 md:pb-5">
          <div data-area="top" data-fade className="flex flex-col gap-3 pb-3 md:flex-row md:items-start md:justify-between md:gap-10 md:pb-4">
            <p data-intro className="label flex items-center gap-3">
              <span className="inline-block h-2 w-2 bg-accent" aria-hidden />
              {hero.kicker}
            </p>
            <p data-intro className="max-w-[36ch] text-[15px] leading-snug text-fg/85 md:text-right md:text-base">
              {hero.intro}
            </p>
          </div>

          <div data-area="slot" data-slot className="relative my-3 min-h-0 land:my-0 land:mb-[0.02em]">
            <div data-shutter className="absolute inset-0 hidden origin-top bg-bg" />

          </div>

          <div data-area="l1" data-line="1" aria-hidden className="hero-name display">
            <span className="mask">
              <span data-measure className="inline-block">
                <Chars text={hero.lines[0]} />
              </span>
            </span>
          </div>

          <div data-area="l2" data-line="2" aria-hidden className="hero-name display land:justify-self-end">
            <span className="mask">
              <Chars text={hero.lines[1]} />
            </span>
          </div>

          <div data-area="meta" data-fade className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-3 md:mt-4 md:grid-cols-4">
            {hero.meta.map((m) => (
              <div key={m.k} data-intro className="label">
                <span className="block text-muted">{m.k}</span>
                <span className="block normal-case tracking-normal text-[13px] text-fg">{m.v}</span>
              </div>
            ))}
            <div data-intro className="label flex items-end justify-between gap-3 md:justify-end">
              <span className="text-muted">Scroll</span>
              <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-3 animate-[cue_1.8s_var(--ease-expo)_infinite] bg-accent" />
              </span>
            </div>
          </div>
        </div>

        {/* Lands over the open frame. */}
        <div data-caption className="invisible absolute inset-x-0 bottom-0 z-20 flex flex-col gap-6 px-gutter pb-[7vh] md:flex-row md:items-end md:justify-between">
          <p className="display text-[clamp(64px,13vw,240px)] text-paper">
            {hero.caption.lines.map((line, i) => (
              <span key={line} className="mask">
                <span data-caption-line className={i === hero.caption.lines.length - 1 ? "block text-ir" : "block"}>
                  {line}
                </span>
              </span>
            ))}
          </p>
          <p data-caption-note className="label max-w-[30ch] text-paper/80 md:mb-3 md:text-right">
            {hero.caption.note}
          </p>
        </div>
      </div>
    </section>
  );
}
