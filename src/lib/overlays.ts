"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * The site's full-screen layers — Quick look (the recruiter summary), the
 * index, and the keyboard-shortcut card. One at a time: opening one closes
 * whatever else was open. Anything can open them (nav, hero, keyboard).
 */
export type Overlay = "quickLook" | "index" | "help";

let current: Overlay | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const overlays = {
  get: () => current,
  open(o: Overlay) {
    if (current === o) return;
    current = o;
    emit();
  },
  close() {
    if (!current) return;
    current = null;
    emit();
  },
  toggle(o: Overlay) {
    if (current === o) overlays.close();
    else overlays.open(o);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useOverlay() {
  return useSyncExternalStore(overlays.subscribe, overlays.get, () => null);
}

/** A single-key shortcut (Q, I) that toggles a layer — never while typing, never during the boot. */
export function useOverlayKey(key: string, overlay: Overlay) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.key.toLowerCase() !== key) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (document.documentElement.dataset.loading) return;
      e.preventDefault();
      overlays.toggle(overlay);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, overlay]);
}
