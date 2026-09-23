"use client";

import { useSyncExternalStore } from "react";
import { SECTION_TOTAL, type Phase } from "@/content/site";

/** What the nav's chapter indicator shows. Written by ScrollDirector. */
export type SectionState = { index: string; label: string; total: string; phase: Phase };

const initial: SectionState = { index: "00", label: "Start", total: String(SECTION_TOTAL).padStart(2, "0"), phase: "build" };
let state = initial;
const listeners = new Set<() => void>();

export const sectionStore = {
  get: () => state,
  set(next: Partial<SectionState>) {
    const merged = { ...state, ...next };
    if (merged.index === state.index && merged.label === state.label && merged.total === state.total && merged.phase === state.phase) return;
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
