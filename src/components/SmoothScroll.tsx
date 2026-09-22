"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the
 * scroll position never disagree. Lenis honours prefers-reduced-motion on its
 * own (smoothing off, programmatic scrolls instant), and touch stays native.
 *
 * Also keeps every ScrollTrigger honest when the page changes height without
 * a window resize — filtering the archive, opening an accordion, switching a
 * tab — by re-measuring (debounced) whenever the document height moves.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, stopInertiaOnNavigate: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts change line lengths; recompute every trigger once they settle.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    const height = () => document.body.scrollHeight;
    let last = height();
    let timer = 0;
    const onRefresh = () => {
      last = height();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const ro = new ResizeObserver(() => {
      if (Math.abs(height() - last) < 2) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
    });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
