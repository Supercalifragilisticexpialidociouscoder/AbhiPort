"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Engine = React.ComponentType<{ onExit: () => void; reduced: boolean }>;

/** Desktop, and not a touch-only device. Checked on the keypress, never at
 *  mount, so a window that starts narrow — or a viewport that settles late —
 *  still finds it. Reduced motion doesn't lock anyone out: it flies calmer. */
function allowed() {
  return window.innerWidth >= 1024 && !window.matchMedia("(pointer: coarse)").matches;
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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!flight.on || Engine || loading.current) return;
    loading.current = true;
    void import("./SpaceMode").then((m) => setEngine(() => m.SpaceMode));
  }, [flight.on, Engine]);

  const exit = useCallback(() => setFlight((s) => ({ ...s, on: false })), []);
  return flight.on && Engine ? <Engine onExit={exit} reduced={flight.reduced} /> : null;
}
