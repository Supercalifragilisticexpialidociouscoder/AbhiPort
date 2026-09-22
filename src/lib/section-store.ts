"use client";

import { useSyncExternalStore } from "react";

/** What the nav's section indicator shows. Written by ScrollDirector. */
export type SectionState = { index: string; label: string; total: string };

const initial: SectionState = { index: "00", label: "Start", total: "09" };
let state = initial;
const listeners = new Set<() => void>();

export const sectionStore = {
  get: () => state,
  set(next: Partial<SectionState>) {
    const merged = { ...state, ...next };
    if (merged.index === state.index && merged.label === state.label && merged.total === state.total) return;
    state = merged;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useSection() {
  return useSyncExternalStore(sectionStore.subscribe, sectionStore.get, () => initial);
}
