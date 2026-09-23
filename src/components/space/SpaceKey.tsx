"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Engine = React.ComponentType<{ onExit: () => void; reduced: boolean }>;

/** Desktop, with a real pointer somewhere. Checked on the keypress, never at
 *  mount, so a window that starts narrow — or a viewport that settles late —
 *  still finds it. `any-pointer: fine` rather than `pointer: coarse`, so a
 *  laptop with a touchscreen still qualifies. Reduced motion doesn't lock
 *  anyone out either: it flies calmer. */
function allowed() {
  // A mouse or trackpad is the real test for "desktop" — a phone has neither.
  // Width only rules out windows too small to fly in; 1024 was wrong, since
  // plenty of real desktop windows (split screens, 13" laptops) sit below it.
  if (!window.matchMedia("(any-pointer: fine)").matches) return false;
  if (window.innerWidth < 720) return false;
  // Not over the boot sequence.
  return !document.documentElement.dataset.loading;
}

/**
 * Everything the site carries for Space Mode until someone finds it: one
 * keydown listener. The engine is imported the first time S is pressed, and
 * never at all on a phone.
 */
export function SpaceKey() {
  const [Engine, setEngine] = useState<Engine | null>(null);
  const [flight, setFlight] = useState({ on: false, reduced: false });
  const loading = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Either signal: `code` survives caps lock and layout changes, `key` is
      // all some input methods (and automation) ever set.
      if (e.code !== "KeyS" && e.key !== "s" && e.key !== "S") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (!allowed()) return;
      e.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Already flying? S is the brake there (WASD) and belongs to the engine.
      // ESC is the way out, so this only ever switches Space Mode on.
      setFlight((s) => (s.on ? s : { on: true, reduced }));
    };
    // Capture phase: nothing downstream gets to swallow the key first.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  useEffect(() => {
    if (!flight.on || Engine || loading.current) return;
    loading.current = true;
    void import("./SpaceMode").then((m) => setEngine(() => m.SpaceMode));
  }, [flight.on, Engine]);

  const exit = useCallback(() => setFlight((s) => ({ ...s, on: false })), []);
  return flight.on && Engine ? <Engine onExit={exit} reduced={flight.reduced} /> : null;
}
