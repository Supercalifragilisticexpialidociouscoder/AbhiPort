"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the
 * scroll position never disagree. Lenis honours prefers-reduced-motion on its
 * own (smoothing off, programmatic scrolls instant), and touch stays native.
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

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
