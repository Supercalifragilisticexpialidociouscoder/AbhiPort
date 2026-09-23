"use client";

import { useEffect, type RefObject } from "react";
import { getLenis } from "./scroll";

/**
 * Everything a modal layer owes the user while it's open: scroll stays put,
 * focus moves in and can't wander out, Escape closes it, and focus goes
 * back to wherever it came from afterwards.
 */
export function useDialog(panel: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();

    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? []).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
    const t = window.setTimeout(() => (panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      returnTo?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, panel]);
}
