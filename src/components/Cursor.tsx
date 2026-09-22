"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const FINE = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, [role='button'], [role='tab'], summary, label, input, textarea, select";

/**
 * A small difference-blend dot that grows over links and turns into a
 * contextual label over anything with data-cursor="View" etc.
 * In the garage it also draws a crosshair with live coordinates.
 * Desktop pointers only; touch and reduced-motion get the native cursor.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const crossX = useRef<HTMLDivElement>(null);
  const crossY = useRef<HTMLDivElement>(null);
  const coords = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(FINE);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !bubble.current) return;
    const html = document.documentElement;
    const d = dot.current;
    const b = bubble.current;
    const text = b.firstElementChild as HTMLElement;
    const cx = crossX.current!;
    const cy = crossY.current!;
    const co = coords.current!;

    const dx = gsap.quickTo(d, "x", { duration: 0.14, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.14, ease: "power3" });
    const bx = gsap.quickTo(b, "x", { duration: 0.45, ease: "power3" });
    const by = gsap.quickTo(b, "y", { duration: 0.45, ease: "power3" });

    let shown = false;
    let current: Element | null = null;

    const setTarget = (el: Element | null) => {
      if (el === current) return;
      current = el;
      const labelled = el?.closest<HTMLElement>("[data-cursor]");
      if (labelled && labelled.dataset.cursor) {
        text.textContent = labelled.dataset.cursor;
        b.dataset.on = "true";
        d.dataset.state = "label";
        return;
      }
      b.dataset.on = "false";
      d.dataset.state = el?.closest(INTERACTIVE) ? "link" : "";
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set([d, b], { x: e.clientX, y: e.clientY });
        html.classList.add("has-cursor");
      }
      if (d.dataset.state === "hidden") {
        d.dataset.state = "";
        current = null;
      }
      dx(e.clientX);
      dy(e.clientY);
      bx(e.clientX);
      by(e.clientY);
      cx.style.transform = `translate3d(0, ${e.clientY}px, 0)`;
      cy.style.transform = `translate3d(${e.clientX}px, 0, 0)`;
      co.style.transform = `translate3d(${e.clientX + 14}px, ${e.clientY + 14}px, 0)`;
      co.textContent = `X ${String(Math.round(e.clientX)).padStart(4, "0")}\nY ${String(Math.round(e.clientY)).padStart(4, "0")}`;
      setTarget(e.target as Element);
    };
    const over = (e: PointerEvent) => setTarget(e.target as Element);
    const leave = () => {
      d.dataset.state = "hidden";
      b.dataset.on = "false";
      current = null;
    };
    const down = () => gsap.to(d, { scale: 0.6, duration: 0.2 });
    const up = () => gsap.to(d, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      html.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={crossX} aria-hidden className="cursor-cross" data-axis="x" />
      <div ref={crossY} aria-hidden className="cursor-cross" data-axis="y" />
      <div ref={coords} aria-hidden className="cursor-coords" />
      <div ref={dot} aria-hidden className="cursor-dot" data-state="hidden" />
      <div ref={bubble} aria-hidden className="cursor-label" data-on="false">
        <span />
      </div>
    </>
  );
}
