"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { gsap } from "@/lib/gsap";

/**
 * The opening title sequence: ABHI boots — and then you're thrown into it.
 *
 * Power on: a seam draws across the dark. Rev: a 000 → 100 count that
 * stretches along Archivo's width axis, leans into its own speed and kicks
 * through three gear shifts, while a row of tach ticks climbs to the
 * redline — where the number shakes against the limiter. It's honest about
 * what it waits for — the type, the first screen's media and the hero's
 * layout, nothing below the fold. Impact: at 100 the last zero turns signal
 * red, heat blooms behind it and the frame takes the hit. Dive: the camera
 * plunges through that zero; its counter opens into a window and the hero
 * rushes up to meet you from the exact point you're diving into.
 * Project 00 — you enter through the 0.
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

const MODES: Record<Mode, { target: number; floor: number; cap: number; hold: number; zoom: number }> = {
  // target: when (ms after navigation start) the count should land if everything is ready
  // floor:  the count never runs faster than this, so fast connections still see it
  // cap:    after counting this long, stop waiting for anything and go
  // hold:   the impact beat at 100; zoom: the dive
  full: { target: 1300, floor: 750, cap: 6000, hold: 0.24, zoom: 0.95 },
  short: { target: 650, floor: 400, cap: 4000, hold: 0.14, zoom: 0.72 },
  still: { target: 450, floor: 250, cap: 4000, hold: 0, zoom: 0 },
};

const STATUS: [number, string][] = [
  [0, "Initializing"],
  [20, "Loading the work"],
  [44, "Calibrating"],
  [66, "Breaking things"],
  [84, "Rebuilding"],
];

/** Tach ticks along the seam; the last few are the redline. */
const TICKS = 48;
const REDLINE = 40;

/** What the first screen actually needs, shown as a live checklist. */
const CHECKS = [
  ["type", "Type"],
  ["media", "Media"],
  ["layout", "Layout"],
] as const;
type Check = (typeof CHECKS)[number][0];

/**
 * Archivo 900's "0", measured from the font at four widths (in em): half
 * the width and height of its counter and of its outer contour, and its
 * centre above the baseline. The window we dive through sits between the
 * two contours, so the strokes always cover its edge.
 */
const ZERO: [number, { counter: [number, number]; outer: [number, number] }][] = [
  [75, { counter: [0.055, 0.2213], outer: [0.2275, 0.3563] }],
  [87.5, { counter: [0.075, 0.2213], outer: [0.26, 0.3563] }],
  [100, { counter: [0.09625, 0.2213], outer: [0.29125, 0.3563] }],
  [125, { counter: [0.13375, 0.215], outer: [0.36375, 0.3563] }],
];
const ZERO_CY = 0.34375;
function windowOf(wdth: number) {
  let i = ZERO.findIndex(([w]) => w >= wdth);
  if (i <= 0) i = i === 0 ? 1 : ZERO.length - 1;
  const [w0, a] = ZERO[i - 1];
  const [w1, b] = ZERO[i];
  const t = Math.min(1, Math.max(0, (wdth - w0) / (w1 - w0)));
  const lerp = (x: number, y: number) => x + (y - x) * t;
  return {
    hw: (lerp(a.counter[0], b.counter[0]) + lerp(a.outer[0], b.outer[0])) / 2,
    hh: (lerp(a.counter[1], b.counter[1]) + lerp(a.outer[1], b.outer[1])) / 2,
  };
}

/** The ink veil with a stadium-shaped hole at (cx, cy) — as a clip-path. */
function veilWithHole(W: number, H: number, cx: number, cy: number, hw: number, hh: number) {
  const f = (n: number) => n.toFixed(1);
  const outer = `M0 0H${W}V${H}H0Z`;
  if (hh >= hw) {
    const r = hw;
    return `path(evenodd, "${outer} M${f(cx - hw)} ${f(cy - hh + r)} A${f(r)} ${f(r)} 0 0 1 ${f(cx + hw)} ${f(cy - hh + r)} V${f(cy + hh - r)} A${f(r)} ${f(r)} 0 0 1 ${f(cx - hw)} ${f(cy + hh - r)} Z")`;
  }
  const r = hh;
  return `path(evenodd, "${outer} M${f(cx - hw + r)} ${f(cy - hh)} H${f(cx + hw - r)} A${f(r)} ${f(r)} 0 0 1 ${f(cx + hw - r)} ${f(cy + hh)} H${f(cx - hw + r)} A${f(r)} ${f(r)} 0 0 1 ${f(cx - hw + r)} ${f(cy - hh)} Z")`;
}

/** The veil overhangs the screen by this much, so the impact shake never shows an edge. */
const OVERSCAN = 24;

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
    const moving = mode !== "still";
    const q = gsap.utils.selector(el);
    const digits = q("[data-d]") as HTMLElement[];
    const count = q("[data-count]")[0] as HTMLElement;
    const baseline = q("[data-baseline]")[0] as HTMLElement;
    const veil = q("[data-veil]")[0] as HTMLElement;
    const heat = q("[data-heat]")[0] as HTMLElement;
    const seam = q("[data-seam]")[0] as HTMLElement;
    const ticks = q("[data-tick]") as HTMLElement[];
    const tickRow = q("[data-ticks]")[0] as HTMLElement;
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
    let gear = 0;
    let litCount = 0;
    let label = "";
    let hurry = false;
    let t0 = 0;
    let last = 0;
    let minMs = cfg.floor;
    let tl: gsap.core.Timeline | null = null;
    let lean = 0;
    let fontPx = 0;
    const setX = gsap.quickSetter(count, "x", "px");
    const setY = gsap.quickSetter(count, "y", "px");
    const setSkew = gsap.quickSetter(count, "skewX", "deg");

    // At 25, 50 and 75 the number shifts up a gear: it snaps upright for a
    // beat and kicks, then leans back into the speed.
    const shift = () => {
      lean *= 0.3;
      gsap.fromTo(count, { scaleY: 1.1, scaleX: 0.975 }, { scaleY: 1, scaleX: 1, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    };

    // The number leans into its own speed, and near the redline it shakes
    // like an engine against the limiter while the red ticks blink.
    const drive = (speed: number, dt: number) => {
      lean += (Math.min(9, speed * 0.06) - lean) * (1 - Math.exp(-dt / 90));
      const rev = Math.max(0, (v - 78) / 22);
      const amp = v < 100 ? rev * rev * fontPx * 0.013 : 0;
      setSkew(-lean);
      setX(amp ? gsap.utils.random(-amp, amp) : 0);
      setY(amp ? gsap.utils.random(-amp, amp) * 0.5 : 0);
      tickRow.classList.toggle("is-limit", v >= 86 && v < 100);
    };

    const render = (waiting: boolean) => {
      const n = v >= 100 ? 100 : Math.floor(v);
      if (n !== shown) {
        shown = n;
        const str = String(n).padStart(3, "0");
        digits.forEach((d, i) => (d.textContent = str[i]));
        if (moving && Math.floor(n / 25) > gear && n < 100) shift();
        gear = Math.floor(n / 25);
      }
      // On the element that carries `display`: font-variation-settings is
      // computed there, so a child's --wdth would never reach it.
      if (moving) count.style.setProperty("--wdth", (wMin + ((wMax - wMin) * v) / 100).toFixed(2));
      const lit = Math.round((v / 100) * TICKS);
      if (lit !== litCount) {
        for (let i = Math.min(lit, litCount); i < Math.max(lit, litCount); i++) ticks[i]?.classList.toggle("is-lit", i < lit);
        litCount = lit;
      }
      let next = STATUS[0][1];
      for (const [at, text] of STATUS) if (n >= at) next = text;
      if (waiting && n >= 88) next = "Almost there";
      if (n === 100) next = "Ready";
      if (next !== label) {
        label = next;
        status.textContent = next;
        // "Ready" lands with the impact, so it doesn't slide in.
        if (moving && n < 100) gsap.fromTo(status, { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out", overwrite: "auto" });
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
      const from = v;
      // Without the essentials the count may lead, but it can't finish…
      const target = ready ? 100 * ease(time) : Math.min(100 * ease(time), 56 + (38 * (CHECKS.length - pending.size)) / CHECKS.length);
      v = Math.max(v, v + (target - v) * (1 - Math.exp(-dt / 60)));
      // …and on a slow connection it keeps creeping instead of freezing.
      const waiting = !ready && time >= 1;
      if (waiting) v = Math.max(v, v + (97 - v) * (1 - Math.exp(-dt / 2600)));
      if (ready && time >= 1 && v > 99.4) v = 100;
      render(waiting);
      if (moving && dt > 0) drive(((v - from) / dt) * 1000, dt);
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
      if (!moving) {
        tl = gsap.timeline({ onComplete: finish }).add(reveal).to(el, { autoAlpha: 0, duration: 0.25, ease: "power1.out" });
        return;
      }
      gsap.killTweensOf([count, status]);
      gsap.set(count, { clearProps: "transform" });
      gsap.set(status, { yPercent: 0 });

      // Aim at the last zero: the number will scale around its counter while
      // a matching window opens in the veil at exactly the same rate.
      const zero = digits[digits.length - 1];
      const zr = zero.getBoundingClientRect();
      const F = parseFloat(getComputedStyle(count).fontSize);
      const win = windowOf(wMax);
      const cx = zr.left + zr.width / 2;
      const cy = baseline.getBoundingClientRect().top - ZERO_CY * F;
      const hw = win.hw * F;
      const hh = win.hh * F;
      const W = window.innerWidth;
      const H = window.innerHeight;
      // Scale at which the window covers the whole screen, with room to spare.
      const end = 1.12 * Math.max(Math.max(cx, W - cx) / (hw * 0.82), Math.max(cy, H - cy) / (hh * 0.82));
      const box = count.getBoundingClientRect();
      count.style.transformOrigin = `${(cx - box.left).toFixed(1)}px ${(cy - box.top).toFixed(1)}px`;
      // Where the hero should rush out from.
      html.dataset.bootOrigin = `${cx.toFixed(0)} ${cy.toFixed(0)}`;

      const z = { t: 0, punch: 1 };
      const draw = () => {
        const s = z.punch * Math.pow(end, z.t);
        count.style.transform = `scale(${s.toFixed(4)})`;
        veil.style.clipPath = veilWithHole(W + 2 * OVERSCAN, H + 2 * OVERSCAN, cx + OVERSCAN, cy + OVERSCAN, hw * s, hh * s);
      };
      draw();
      // The heat that blooms behind it on impact.
      const R = F * 0.95;
      gsap.set(heat, { width: R * 2, height: R * 2, x: cx - R, y: cy - R });

      const h = cfg.hold;
      tl = gsap
        .timeline({ onComplete: finish })
        // IMPACT — the zero we're going through goes signal red; the redline
        // flashes; the frame takes the hit.
        .add(() => {
          zero.classList.add("is-hot");
          tickRow.classList.add("is-redline");
          ticks.forEach((t) => t.classList.add("is-lit"));
        }, 0)
        .to(z, { punch: 1.045, duration: 0.07, ease: "power2.out", yoyo: true, repeat: 1, onUpdate: draw }, 0)
        .to(el, { keyframes: [{ x: -8, y: 3 }, { x: 7, y: -4 }, { x: -5, y: 2 }, { x: 3, y: -1 }, { x: 0, y: 0 }], duration: 0.2, ease: "none" }, 0)
        .fromTo(heat, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.09, ease: "power2.out" }, 0)
        .to(heat, { autoAlpha: 0, scale: 1.7, duration: 0.4, ease: "power1.out" }, 0.09)
        .to(q("[data-fade]"), { autoAlpha: 0, duration: 0.18, ease: "power1.in" }, h * 0.55)
        // DIVE — slow for a heartbeat, then violent.
        .to(z, { t: 1, duration: cfg.zoom, ease: "power4.in", onUpdate: draw }, h)
        .add(reveal, h + 0.06);
    };

    // The readouts appear once their typeface has (no fallback-font flash),
    // or after a beat regardless — and the count starts from there.
    const begin = () => {
      if (disposed || finished || t0) return;
      t0 = last = performance.now();
      minMs = Math.max(cfg.floor, cfg.target - t0);
      fontPx = parseFloat(getComputedStyle(count).fontSize);
      const readouts = q("[data-readout]");
      if (moving) {
        gsap.to(readouts, { autoAlpha: 1, duration: 0.35, ease: "power1.out" });
        gsap.fromTo(seam, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.inOut" });
      } else gsap.set(readouts, { autoAlpha: 1 });
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

      {/* The veil: ink, until a window opens in it. */}
      <div data-veil aria-hidden className="boot-veil absolute" style={{ inset: -OVERSCAN }} />
      <div data-heat aria-hidden className="boot-heat pointer-events-none invisible absolute left-0 top-0 opacity-0" />

      {/* Top rail — lines up with the nav that replaces it. */}
      <div data-readout data-fade aria-hidden className="label absolute inset-x-gutter top-0 flex h-nav items-center justify-between gap-4">
        <span className="flex items-baseline gap-2">
          <span className="display text-[30px] leading-none">{site.short}</span>
          <span className="text-paper/55">/ Build {site.build}</span>
        </span>
        <span className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 bg-ir" />
          <span className="mask-inline">
            <span data-status className="inline-block">
              Initializing
            </span>
          </span>
        </span>
      </div>

      {/* The count, standing on the seam. */}
      <p data-count data-readout aria-hidden className="boot-count display tnum absolute left-gutter origin-bottom-left whitespace-nowrap leading-[0.78]">
        <span data-d>0</span>
        <span data-d>0</span>
        <span data-d>0</span>
        <span data-baseline className="inline-block h-0 w-0 align-baseline" />
        <span data-fade className="label ml-[0.06em] align-top text-[clamp(14px,1.4vw,20px)] text-ir">
          %
        </span>
      </p>

      {/* The seam, and the tach climbing along it. */}
      <div data-seam data-fade aria-hidden className="boot-seam absolute inset-x-0 h-px bg-paper/20" />
      <div data-ticks data-readout data-fade aria-hidden className="boot-ticks absolute inset-x-gutter flex items-end justify-between">
        {Array.from({ length: TICKS }, (_, i) => (
          <span key={i} data-tick className={i >= REDLINE ? "boot-tick is-red" : "boot-tick"} />
        ))}
      </div>

      {/* Bottom rail: who, and what's actually loading. */}
      <div data-readout data-fade aria-hidden className="boot-rail label absolute inset-x-gutter flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
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
  );
}
