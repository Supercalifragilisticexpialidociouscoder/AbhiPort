"use client";

/**
 * The opening sequence's shared clock.
 *
 * The head script in layout.tsx sets <html data-loading="1"> before first
 * paint when the preloader is going to run. Preloader moves it to "reveal"
 * the moment the page starts to show through, and removes it once the page
 * is interactive — firing `boot:reveal` and `boot:done` as it goes. Anything
 * that animates in on arrival waits for the reveal; anything that needs a
 * fully interactive page (scrolling, the custom cursor) waits for done.
 */
export type BootPhase = "loading" | "reveal" | "done";

export function bootPhase(): BootPhase {
  const v = document.documentElement.dataset.loading;
  return v === "1" ? "loading" : v === "reveal" ? "reveal" : "done";
}

function when(event: "boot:reveal" | "boot:done", ready: () => boolean, cb: () => void, fallbackMs: number) {
  if (ready()) {
    cb();
    return () => {};
  }
  let fired = false;
  const run = () => {
    if (fired) return;
    fired = true;
    cleanup();
    cb();
  };
  // The preloader always finishes, but never let a page intro depend on it.
  const timer = window.setTimeout(run, fallbackMs);
  window.addEventListener(event, run);
  const cleanup = () => {
    window.clearTimeout(timer);
    window.removeEventListener(event, run);
  };
  return cleanup;
}

/** Run `cb` when the page starts to show: now, or as the preloader opens. */
export function onBootReveal(cb: () => void, fallbackMs = 9000) {
  return when("boot:reveal", () => bootPhase() !== "loading", cb, fallbackMs);
}

/** Run `cb` once the page is interactive: now, or when the preloader is gone. */
export function onBootDone(cb: () => void, fallbackMs = 10000) {
  return when("boot:done", () => bootPhase() === "done", cb, fallbackMs);
}
