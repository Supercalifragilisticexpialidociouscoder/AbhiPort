"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { gsap } from "@/lib/gsap";

/**
 * The opening title sequence: ABHI boots.
 *
 * A 000 → 100 count that's honest about what it waits for — the type, the
 * first screen's media and the hero's layout, nothing below the fold — and
 * that stretches along Archivo's width axis as it fills. At 100 the number
 * snaps back to condensed, squashes into the seam, and the screen splits open
 * along that line like a garage door, straight into the hero's own intro.
 *
 * The head script in layout.tsx picks the mode before first paint:
 * - full:  first visit
 * - short: returning visitor, new session
 * - still: prefers-reduced-motion — numbers only, then a quick fade
 * Reloads in the same session skip it entirely. Click, tap, Enter, Space or
 * Esc hurries it (it still waits for the essentials), and a hard cap means
 * the page always arrives, even if something never loads.
 */

type Mode = "full" | "short" | "still";

const MODES: Record<Mode, { target: number; floor: number; cap: number; hold: number; squash: number; doors: number }> = {
  // target: when (ms after navigation start) the count should land if everything is ready
  // floor:  the count never runs faster than this, so fast connections still see it
  // cap:    after counting this long, stop waiting for anything and go
  full: { target: 1300, floor: 700, cap: 6000, hold: 0.1, squash: 0.32, doors: 0.8 },
  short: { target: 650, floor: 380, cap: 4000, hold: 0.04, squash: 0.22, doors: 0.62 },
  still: { target: 450, floor: 250, cap: 4000, hold: 0, squash: 0, doors: 0 },
};

const STATUS: [number, string][] = [
  [0, "Initializing"],
  [20, "Loading the work"],
  [44, "Calibrating"],
  [66, "Breaking things"],
  [84, "Rebuilding"],
];

/** What the first screen actually needs, shown as a live checklist. */
const CHECKS = [
  ["type", "Type"],
  ["media", "Media"],
  ["layout", "Layout"],
] as const;
type Check = (typeof CHECKS)[number][0];

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Resolves once an image is decoded or a video has a first frame — or it failed. */
function mediaReady(el: Element): Promise<unknown> {
  if (el instanceof HTMLImageElement) return el.decode().catch(() => {});
  if (el instanceof HTMLVideoElement) {
    if (el.readyState >= 2) return Promise.resolve();
    return new Promise((r) => {
      el.addEventListener("loadeddata", r, { once: true });
      el.addEventListener("error", r, { once: true });
    });
  }
  return Promise.resolve();
}

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || html.dataset.loading !== "1") {
      setGone(true);
      return;
    }
    // Tells the head script's failsafe that the sequence is running.
    (window as Window & { __bootLive?: boolean }).__bootLive = true;

    const mode: Mode = html.dataset.boot === "short" || html.dataset.boot === "still" ? html.dataset.boot : "full";
    const cfg = MODES[mode];
    const q = gsap.utils.selector(el);
    const digits = q("[data-digits]")[0] as HTMLElement;
    const count = q("[data-count]")[0] as HTMLElement;
    const fill = q("[data-fill]")[0] as HTMLElement;
    const status = q("[data-status]")[0] as HTMLElement;
    const css = getComputedStyle(el);
    const wMin = parseFloat(css.getPropertyValue("--boot-wmin")) || 62;
    const wMax = parseFloat(css.getPropertyValue("--boot-wmax")) || 125;
    let disposed = false;

    // Nothing behind the preloader is reachable until it's gone.
    const inerted = Array.from(document.body.children).filter((n) => n !== el && n.tagName !== "SCRIPT" && !n.hasAttribute("inert"));
    inerted.forEach((n) => n.setAttribute("inert", ""));

    /* ── Readiness: only what the first screen needs ───────────────── */
    const pending = new Set<Check>(CHECKS.map(([k]) => k));
    const settle = (k: Check) => {
      if (disposed || !pending.delete(k)) return;
      q(`[data-check="${k}"]`)[0]?.setAttribute("data-done", "");
    };
    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(2500)]);
    fonts.then(() => settle("type"));
    const media = Array.from(document.querySelectorAll("[data-critical]"));
    Promise.all(media.map((m) => Promise.race([mediaReady(m), wait(5000)]))).then(() => settle("media"));
    if (document.querySelector(".hero")) {
      const heroReady =
        html.dataset.heroReady !== undefined ? Promise.resolve() : new Promise((r) => window.addEventListener("hero:ready", r, { once: true }));
      Promise.race([heroReady, wait(5000)]).then(() => settle("layout"));
    } else {
      fonts.then(() => requestAnimationFrame(() => settle("layout")));
    }

    /* ── The count ─────────────────────────────────────────────────── */
    const ease = gsap.parseEase("power1.inOut");
    let v = 0;
    let shown = -1;
    let label = "";
    let hurry = false;
    let t0 = 0;
    let last = 0;
    let minMs = cfg.floor;
    let tl: gsap.core.Timeline | null = null;

    const render = (waiting: boolean) => {
      const n = v >= 100 ? 100 : Math.floor(v);
      if (n !== shown) {
        shown = n;
        digits.textContent = String(n).padStart(3, "0");
      }
      // On the element that carries `display`: font-variation-settings is
      // computed there, so a child's --wdth would never reach it.
      if (mode !== "still") count.style.setProperty("--wdth", (wMin + ((wMax - wMin) * v) / 100).toFixed(2));
      fill.style.transform = `scaleX(${(v / 100).toFixed(4)})`;
      let next = STATUS[0][1];
      for (const [at, text] of STATUS) if (n >= at) next = text;
      if (waiting && n >= 88) next = "Almost there";
      if (n === 100) next = "Ready";
      if (next !== label) {
        label = next;
        status.textContent = next;
      }
    };

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(64, now - last);
      last = now;
      const elapsed = now - t0;
      if (elapsed > cfg.cap) pending.clear(); // never hold the page hostage
      const ready = pending.size === 0;
      const time = hurry ? 1 : Math.min(1, elapsed / minMs);
      // Without the essentials the count may lead, but it can't finish…
      const target = ready ? 100 * ease(time) : Math.min(100 * ease(time), 56 + (38 * (CHECKS.length - pending.size)) / CHECKS.length);
      v = Math.max(v, v + (target - v) * (1 - Math.exp(-dt / 60)));
      // …and on a slow connection it keeps creeping instead of freezing.
      const waiting = !ready && time >= 1;
      if (waiting) v = Math.max(v, v + (97 - v) * (1 - Math.exp(-dt / 2600)));
      if (ready && time >= 1 && v > 99.4) v = 100;
      render(waiting);
      if (v === 100) {
        gsap.ticker.remove(tick);
        exit();
      }
    };

    /* ── Handing over to the page ──────────────────────────────────── */
    const reveal = () => {
      if (html.dataset.loading === "1") html.dataset.loading = "reveal";
      window.dispatchEvent(new Event("boot:reveal"));
    };
    let finished = false;
    // Returning null doesn't unmount this component, so the effect's cleanup
    // won't run when the sequence ends — stop everything explicitly.
    const teardown = () => {
      gsap.ticker.remove(tick);
      window.clearTimeout(safety);
      el.removeEventListener("pointerdown", hurryUp);
      window.removeEventListener("keydown", onKey);
    };
    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      teardown();
      if (html.dataset.loading === "1") reveal();
      try {
        sessionStorage.setItem("abhi-booted", "1");
        localStorage.setItem("abhi-visited", "1");
      } catch {
        /* private mode — fine */
      }
      inerted.forEach((n) => n.removeAttribute("inert"));
      delete html.dataset.loading;
      delete html.dataset.boot;
      // The head script's scroll lock (wheel, touch, keys) comes off with it.
      (window as Window & { __bootUnlock?: () => void }).__bootUnlock?.();
      window.dispatchEvent(new Event("boot:done"));
      setGone(true);
    };

    const exit = () => {
      if (mode === "still") {
        tl = gsap.timeline({ onComplete: finish }).add(reveal).to(el, { autoAlpha: 0, duration: 0.25, ease: "power1.out" });
        return;
      }
      const s = cfg.squash;
      tl = gsap
        .timeline({ onComplete: finish, delay: cfg.hold })
        // The number snaps back to condensed and folds into the seam…
        .to(count, { "--wdth": wMin, duration: s, ease: "power3.in" }, 0)
        .to(count, { scaleY: 0, duration: s * 0.9, ease: "power4.in" }, s * 0.3)
        .to(q("[data-fade]"), { autoAlpha: 0, duration: 0.2, ease: "power1.out" }, 0)
        .to(q("[data-seam]"), { scaleY: 3, duration: 0.14, ease: "power2.in" }, s)
        // …which splits, carrying a red edge on each door, as the hero starts.
        .add(reveal, s * 1.2)
        .set(q("[data-seam]"), { autoAlpha: 0 }, s * 1.2)
        .set(q("[data-edge]"), { autoAlpha: 1 }, s * 1.2)
        .to(q("[data-door='top']"), { yPercent: -100, duration: cfg.doors, ease: "expo.inOut" }, s * 1.2)
        .to(q("[data-door='bottom']"), { yPercent: 100, duration: cfg.doors, ease: "expo.inOut" }, s * 1.2);
    };

    // The readouts appear once their typeface has (no fallback-font flash),
    // or after a beat regardless — and the count starts from there.
    const begin = () => {
      if (disposed || finished || t0) return;
      t0 = last = performance.now();
      minMs = Math.max(cfg.floor, cfg.target - t0);
      const readouts = q("[data-readout]");
      if (mode === "still") gsap.set(readouts, { autoAlpha: 1 });
      else gsap.to(readouts, { autoAlpha: 1, duration: 0.35, ease: "power1.out" });
      gsap.ticker.add(tick);
    };
    Promise.race([fonts, wait(600)]).then(begin);

    const hurryUp = () => {
      hurry = true;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        hurryUp();
      }
    };
    el.addEventListener("pointerdown", hurryUp);
    window.addEventListener("keydown", onKey);
    // Belt and braces: even if animation frames stall (a background tab), the page arrives.
    const safety = window.setTimeout(finish, cfg.cap + 4000);

    return () => {
      disposed = true;
      teardown();
      tl?.kill();
      if (!finished) inerted.forEach((n) => n.removeAttribute("inert"));
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[300] text-paper">
      <p role="status" className="sr-only">
        Loading {site.name}
      </p>

      {/* Top door: the count sits on the seam. */}
      <div data-door="top" aria-hidden className="boot-door top-0 h-[var(--seam)]">
        <div data-readout data-fade className="label absolute inset-x-gutter top-0 flex h-nav items-center justify-between gap-4">
          <span className="flex items-baseline gap-2">
            <span className="display text-[30px] leading-none">{site.short}</span>
            <span className="text-paper/55">/ Build {site.build}</span>
          </span>
          <span className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 bg-ir" />
            <span data-status>Initializing</span>
          </span>
        </div>
        <p data-count data-readout className="boot-count display tnum absolute bottom-0 left-gutter origin-bottom-left whitespace-nowrap leading-[0.78]">
          <span data-digits>000</span>
          <span className="label ml-[0.06em] align-top text-[clamp(14px,1.4vw,20px)] text-ir">%</span>
        </p>
        <span data-edge className="absolute inset-x-0 bottom-0 h-[2px] bg-ir opacity-0" />
      </div>

      {/* Bottom door: who, and what's actually loading. */}
      <div data-door="bottom" aria-hidden className="boot-door bottom-0 top-[var(--seam)]">
        <span data-edge className="absolute inset-x-0 top-0 h-[2px] bg-ir opacity-0" />
        <div data-readout data-fade className="label absolute inset-x-gutter top-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 md:top-5">
          <span className="text-paper/55">
            <span className="text-paper">{site.name}</span> — Builder / Engineer · {site.location}
          </span>
          <ul className="flex gap-4 md:gap-6">
            {CHECKS.map(([key, text]) => (
              <li key={key} data-check={key} className="boot-check flex gap-2">
                <span className="text-paper/55">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The seam: a hairline that fills with progress, then splits. */}
      <div data-seam aria-hidden className="boot-seam absolute inset-x-0 h-px bg-paper/15">
        <span data-fill className="absolute inset-0 origin-left bg-ir" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
