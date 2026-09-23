"use client";

import { useEffect, useRef } from "react";
import { gsap, REDUCED } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const WMIN = 62;
const WMAX = 125;
/** The narrowest resting width: leaves every letter room to give way. */
const WREST = 84;
const CAP = 0.7; // Archivo's cap height, in em
const SIGMA = 0.26; // how wide the pointer's "lens" is, as a share of the word
const AMP = 44; // how far a letter can stretch or give way, in wdth units

/**
 * A word set as big as its box allows and fitted edge to edge with
 * Archivo's width axis — then made elastic. Letters near the pointer
 * stretch, the others give way, so the word keeps its length while it
 * follows you like a lens. On touch (or when the pointer rests) it breathes
 * by itself; with reduced motion it simply sits still.
 *
 * Each letter is two spans: the outer one is free for a parent to move
 * (intros, scroll choreography), the inner one belongs to this component.
 */
export function ElasticWord({
  text,
  className,
  heightRatio = 0.62,
  label,
}: {
  text: string;
  className?: string;
  /** Cap height as a share of the box height. */
  heightRatio?: number;
  /** Accessible name, if the word should be read (it's decorative by default). */
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const glyphs = Array.from(el.querySelectorAll<HTMLElement>("[data-glyph]"));
    const outers = glyphs.map((g) => g.parentElement as HTMLElement);
    const reduce = window.matchMedia(REDUCED).matches;
    const touch = window.matchMedia("(hover: none)").matches;

    let size = 0;
    let rest = 80;
    let centers: number[] = [];
    const setW = (g: HTMLElement, w: number) => g.style.setProperty("--wdth", w.toFixed(1));

    /* ── Fit: height first, then stretch until the word spans the box ── */
    const width = () => outers.reduce((sum, o) => sum + o.getBoundingClientRect().width, 0);
    const fit = () => {
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      // A little margin, because stretching one letter never exactly pays for squeezing another.
      const W = (el.clientWidth - pad * 2) * 0.97;
      const H = el.clientHeight;
      if (!W || !H) return;
      size = (H * heightRatio) / CAP;
      el.style.setProperty("--ew-size", `${size.toFixed(2)}px`);
      glyphs.forEach((g) => setW(g, WREST));
      const narrow = width();
      if (narrow >= W) {
        size *= W / narrow;
        el.style.setProperty("--ew-size", `${size.toFixed(2)}px`);
        rest = WREST;
      } else {
        glyphs.forEach((g) => setW(g, WMAX));
        if (width() <= W) rest = WMAX;
        else {
          let lo = WREST;
          let hi = WMAX;
          for (let i = 0; i < 12; i++) {
            const mid = (lo + hi) / 2;
            glyphs.forEach((g) => setW(g, mid));
            if (width() > W) hi = mid;
            else lo = mid;
          }
          rest = lo;
        }
      }
      glyphs.forEach((g, i) => {
        setW(g, rest);
        proxies[i].w = rest;
      });
      const box = el.getBoundingClientRect();
      centers = outers.map((o) => {
        const r = o.getBoundingClientRect();
        return (r.left + r.width / 2 - box.left) / box.width;
      });
    };

    /* ── Elastic: a quickTo per letter, so every change has inertia ──── */
    const proxies = glyphs.map(() => ({ w: rest }));
    const toW = proxies.map((p, i) => gsap.quickTo(p, "w", { duration: 0.75, ease: "power3", onUpdate: () => setW(glyphs[i], p.w) }));
    const toY = glyphs.map((g) => gsap.quickTo(g, "y", { duration: 0.8, ease: "power3" }));

    const lens = (u: number, strength: number) => {
      if (!centers.length) return;
      const g = centers.map((c) => Math.exp(-(((u - c) / SIGMA) ** 2)));
      const mean = g.reduce((a, b) => a + b, 0) / g.length;
      g.forEach((v, i) => {
        toW[i](Math.min(WMAX, Math.max(WMIN, rest + AMP * strength * (v - mean) * 2)));
        toY[i](-v * strength * size * 0.035);
      });
    };
    const settle = () => {
      toW.forEach((f) => f(rest));
      toY.forEach((f) => f(0));
    };

    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(() => fit());
    ro.observe(el);
    if (reduce) return () => ro.disconnect();

    /* ── Visibility: nothing runs while the word is off-screen ───────── */
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else breath.pause();
    });
    io.observe(el);

    /* ── Breathing: a slow sweep when nobody is steering ─────────────── */
    const drift = { u: 0.15 };
    const breath = gsap.to(drift, {
      u: 0.85,
      duration: 4.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      paused: true,
      onUpdate: () => lens(drift.u, 0.55),
    });
    let idle = 0;
    const wake = () => {
      if (!visible) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (visible) breath.play();
      }, touch ? 400 : 2600);
    };

    /* ── Steering: the pointer (or a finger dragged across the word) ─── */
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      if (e.pointerType === "touch" && !el.contains(e.target as Node)) return;
      const r = el.getBoundingClientRect();
      const reach = Math.max(0, 1 - Math.abs(e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.75));
      breath.pause();
      lens((e.clientX - r.left) / r.width, 0.35 + 0.65 * reach);
      wake();
    };
    const onLeave = () => {
      settle();
      wake();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      ro.disconnect();
      io.disconnect();
      breath.kill();
      window.clearTimeout(idle);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [heightRatio, text]);

  return (
    <div ref={root} className={cn("elastic-word", className)} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      {Array.from(text).map((c, i) => (
        <span key={i} data-letter className="elastic-letter">
          <span data-glyph className="display">
            {c}
          </span>
        </span>
      ))}
    </div>
  );
}
