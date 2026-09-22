"use client";

import type Lenis from "lenis";

/** The active Lenis instance (null under reduced motion or before mount). */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Scroll to a selector / element / y-position, smoothly when allowed. */
export function scrollToTarget(target: string | HTMLElement | number, opts: { immediate?: boolean; offset?: number } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    // start() resets Lenis (and kills any running scroll), so wake it first —
    // e.g. when a link in the open mobile menu, which stops Lenis, is tapped.
    if (lenis.isStopped) lenis.start();
    lenis.scrollTo(el, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: 1.4, force: true });
    return;
  }
  if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: opts.immediate ? "instant" : "smooth" });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
    window.scrollTo({ top, behavior: opts.immediate ? "instant" : "smooth" });
  }
}
