"use client";

import { useEffect, type RefObject } from "react";

/**
 * Race time — how long you've been inside the site this visit.
 *
 * The head script in layout.tsx stamps the start before first paint, in
 * sessionStorage: it survives reloads and page changes, and a fresh visit
 * starts from zero. One requestAnimationFrame loop drives every readout by
 * writing text straight into the DOM — no React renders — and it only runs
 * while a readout is actually on screen (and the tab is visible).
 */

const KEY = "abhi-race-start";
const visible = new Set<HTMLElement>();
let start = 0;
let raf = 0;
let reduce = false;

export function raceStart() {
  if (start) return start;
  try {
    const stored = Number(sessionStorage.getItem(KEY));
    if (stored > 0) start = stored;
  } catch {
    /* storage blocked — fall back to page load */
  }
  if (!start) {
    start = Math.round(Date.now() - performance.now());
    try {
      sessionStorage.setItem(KEY, String(start));
    } catch {
      /* fine */
    }
  }
  return start;
}

const two = (n: number) => String(n).padStart(2, "0");

/** 00:00.00 — or 1:02:03.45 past the hour. Reduced motion drops the hundredths. */
export function formatRace(ms: number, noHundredths = false) {
  const t = Math.max(0, ms);
  const h = Math.floor(t / 3_600_000);
  const m = Math.floor(t / 60_000) % 60;
  const s = Math.floor(t / 1000) % 60;
  const cs = Math.floor(t / 10) % 100;
  const head = h ? `${h}:${two(m)}` : two(m);
  return noHundredths ? `${head}:${two(s)}` : `${head}:${two(s)}.${two(cs)}`;
}

function frame() {
  const text = formatRace(Date.now() - raceStart(), reduce);
  visible.forEach((el) => {
    if (el.textContent !== text) el.textContent = text;
  });
  raf = visible.size ? requestAnimationFrame(frame) : 0;
}

function show(el: HTMLElement) {
  visible.add(el);
  if (!raf) raf = requestAnimationFrame(frame);
}

function hide(el: HTMLElement) {
  visible.delete(el);
  if (!visible.size && raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

/** Attach a live race-time readout to an element. */
export function useRaceClock(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    raceStart();
    el.textContent = formatRace(Date.now() - start, reduce);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? show(el) : hide(el)));
    io.observe(el);
    return () => {
      io.disconnect();
      hide(el);
    };
  }, [ref]);
}
