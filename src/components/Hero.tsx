"use client";

import { useRef } from "react";
import { hero, sections, site } from "@/content/site";
import { onBootReveal } from "@/lib/boot";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { overlays } from "@/lib/overlays";
import { scrollToTarget } from "@/lib/scroll";
import { ElasticWord } from "./ui/ElasticWord";

/**
 * 00 — Not a hero section: an opening title.
 *
 * A giant ABHI fills the screen with Abhi standing in front of it. The
 * letters are elastic — they stretch towards your pointer and give way
 * around it — and the figure and the word drift at two different depths.
 * Scroll and the word parts like curtains; the caption lands in the gap.
 * Two ways in from the first screen: Quick look (the 30-second version) or
 * Explore (everything).
 *
 * The boot sequence dives in through the zero of "100": the scene rushes up
 * from that point and the letters burst in, via `boot:reveal`.
 */
export function Hero({ portrait, cutout = false }: { portrait: React.ReactNode; cutout?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const s = sections.hero;

  useGSAP(
    (_ctx, contextSafe) => {
      const q = gsap.utils.selector(root);
      const pin = q("[data-pin]")[0] as HTMLElement;
      const letters = q("[data-letter]") as HTMLElement[];
      const half = Math.ceil(letters.length / 2);
      const left = letters.slice(0, half);
      const right = letters.slice(half);
      const mm = gsap.matchMedia();
      let playIntro: (() => void) | null = null;

      mm.add(MOTION_OK, () => {
        gsap.set(q("[data-caption]"), { visibility: "visible" });

        // Scroll: the word parts like curtains, the figure steps forward.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 1.3)}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        tl.fromTo(left, { xPercent: 0, x: 0, scale: 1 }, { xPercent: (i) => -150 + i * 30, scale: 1.2, duration: 1 }, 0)
          .fromTo(right, { xPercent: 0, x: 0, scale: 1 }, { xPercent: (i) => 120 + i * 30, scale: 1.2, duration: 1 }, 0)
          .to(q("[data-word]"), { opacity: 0.14, duration: 0.55 }, 0.3)
          .fromTo(q("[data-figure-wrap]"), { scale: 1, yPercent: 0 }, { scale: 0.93, yPercent: -3, duration: 1 }, 0)
          .to(q("[data-rail]"), { opacity: 0, y: -24, duration: 0.3 }, 0)
          .fromTo(q("[data-shade]"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.4)
          .fromTo(q("[data-caption-line]"), { yPercent: 110, y: 0 }, { yPercent: 0, duration: 0.3, stagger: 0.07, ease: "power3.out" }, 0.55)
          .fromTo(q("[data-caption-note]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.25 }, 0.8);

        // Pointer: two depths — the figure drifts against the word.
        const fx = gsap.quickTo(q("[data-figure-drift]"), "x", { duration: 1.1, ease: "power3" });
        const fy = gsap.quickTo(q("[data-figure-drift]"), "y", { duration: 1.1, ease: "power3" });
        const wx = gsap.quickTo(q("[data-word-drift]"), "x", { duration: 1.4, ease: "power3" });
        const wy = gsap.quickTo(q("[data-word-drift]"), "y", { duration: 1.4, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse" || window.scrollY > window.innerHeight * 1.6) return;
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          fx(-nx * 22);
          fy(-ny * 12);
          wx(nx * 12);
          wy(ny * 8);
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        // Arrival. Thrown in through the loader's zero, the whole scene rushes
        // up from the point the dive went through and the letters burst in;
        // on an ordinary visit, the letters simply rise.
        playIntro = contextSafe!(() => {
          const html = document.documentElement;
          const origin = html.dataset.bootOrigin;
          delete html.dataset.bootOrigin;
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          if (origin) {
            const [ox, oy] = origin.split(" ").map(Number);
            const box = pin.getBoundingClientRect();
            tl.fromTo(q("[data-stage]"), { scale: 0.7, transformOrigin: `${ox - box.left}px ${oy - box.top}px` }, { scale: 1, duration: 1.5 }, 0)
              .fromTo(letters, { yPercent: 85, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.06, ease: "back.out(1.6)" }, 0.1)
              .fromTo(q("[data-figure-intro]"), { opacity: 0, scale: 1.1, yPercent: 5 }, { opacity: 1, scale: 1, yPercent: 0, duration: 1.3 }, 0.05)
              .fromTo(q("[data-glow]"), { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.3, duration: 0.45, ease: "power2.out" }, 0.2)
              .to(q("[data-glow]"), { scale: 1, duration: 1.2 }, 0.65)
              .fromTo(q("[data-intro]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.65);
          } else {
            tl.fromTo(letters, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.07 }, 0)
              .fromTo(q("[data-figure-intro]"), { opacity: 0, scale: 1.08, yPercent: 4 }, { opacity: 1, scale: 1, yPercent: 0, duration: 1.6 }, 0.2)
              .fromTo(q("[data-intro]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.6);
          }
        });

        return () => {
          tl.kill();
          window.removeEventListener("pointermove", onMove);
          playIntro = null;
        };
      });

      // Once the type has loaded, re-measure and tell the preloader the
      // first screen is laid out. The intro plays as the preloader opens,
      // or straight away when there isn't one.
      let disposed = false;
      let cancelIntro = () => {};
      const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);
      fontsReady.then(
        contextSafe!(() => {
          if (disposed) return;
          ScrollTrigger.refresh();
          document.documentElement.dataset.heroReady = "";
          window.dispatchEvent(new Event("hero:ready"));
          cancelIntro = onBootReveal(() => playIntro?.());
        }),
      );

      return () => {
        disposed = true;
        cancelIntro();
        delete document.documentElement.dataset.heroReady;
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={s.id}
      className="hero relative"
      data-theme="ink"
      data-index={s.index}
      data-label={s.label}
      data-phase={s.phase}
      aria-labelledby="hero-title"
    >
      <h1 id="hero-title" className="sr-only">
        {site.name} — builder, engineer and creative technologist
      </h1>

      <div data-pin className="relative h-svh min-h-[560px] overflow-hidden">
        <div data-stage className="absolute inset-0">
        {/* 1 · The word, behind everything. */}
        <div data-word className="hero-word absolute inset-x-0">
          <div data-word-drift className="h-full">
            <ElasticWord text={hero.word} className="h-full px-gutter" heightRatio={0.8} />
          </div>
        </div>

        {/* 2 · The figure, in front of the word. */}
        <div data-figure-wrap className="pointer-events-none absolute inset-0 z-10">
          <div data-figure-drift className="absolute inset-0">
            <div data-figure-intro className="absolute inset-0 flex items-end justify-center">
              {cutout ? (
                <div className="hero-figure relative shrink-0">
                  <span data-glow aria-hidden className="hero-figure-glow absolute" />
                  {portrait}
                </div>
              ) : (
                <div className="absolute inset-0 opacity-60">{portrait}</div>
              )}
            </div>
          </div>
          <div aria-hidden className="hero-scrim absolute inset-0" />
          <div
            data-shade
            aria-hidden
            className="absolute inset-0 opacity-0"
            style={{ background: "linear-gradient(to top, rgb(11 11 10 / 0.9), rgb(11 11 10 / 0.2) 55%, rgb(11 11 10 / 0.5))" }}
          />
        </div>

        </div>

        {/* 3 · The rails: who, and two ways in. */}
        <div className="relative z-20 flex h-full flex-col justify-between px-gutter pb-4 pt-[calc(var(--nav-h)+10px)] md:pb-5">
          <div data-rail className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-10">
            <div data-intro className="label flex flex-col gap-1.5">
              <span className="flex items-center gap-3">
                <span aria-hidden className="inline-block h-2 w-2 bg-accent" />
                {hero.kicker}
              </span>
              <span className="text-muted">{hero.name}</span>
            </div>
            <p data-intro className="hidden max-w-[36ch] text-[15px] leading-snug text-fg/85 sm:block md:text-right md:text-base">
              {hero.intro}
            </p>
          </div>

          <div data-rail className="flex flex-col gap-4 border-t border-line pt-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4 lg:max-w-[64rem] lg:flex-1">
              {hero.meta.map((m) => (
                <div key={m.k} data-intro className="label">
                  <dt className="text-muted">{m.k}</dt>
                  <dd className={`normal-case tracking-normal text-[13px] ${m.accent ? "text-accent" : "text-fg"}`}>{m.v}</dd>
                </div>
              ))}
            </dl>
            <div data-intro className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => overlays.open("quickLook")}
                className="label group inline-flex items-center gap-2 bg-accent px-4 py-3 text-bg"
              >
                {hero.paths.fast} <span className="arrow-nudge-x">→</span>
                <kbd className="ml-1 hidden border border-bg/40 px-1 text-[10px] md:inline">Q</kbd>
              </button>
              <button
                type="button"
                onClick={() => scrollToTarget(`#${sections.short.id}`)}
                className="label group inline-flex items-center gap-2 border border-line px-4 py-3 transition-colors hover:border-fg"
              >
                {hero.paths.deep} <span className="arrow-nudge-x">↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 · Lands in the gap as the word parts. */}
        <div data-caption className="invisible absolute inset-x-0 bottom-0 z-30 flex flex-col gap-6 px-gutter pb-[7vh] md:flex-row md:items-end md:justify-between">
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
