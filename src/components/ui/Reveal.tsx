"use client";

import { useRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Animate direct children one after another instead of the whole block. */
  stagger?: number;
  y?: number;
  delay?: number;
  start?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Level-2 motion: a quiet rise-and-fade when a block scrolls into view.
 * Initial hidden state comes from CSS (see [data-reveal] in globals.css),
 * so there's no flash, and focus always reveals instantly.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  stagger,
  y = 28,
  delay = 0,
  start = "clamp(top 88%)",
  children,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = stagger ? Array.from(el.children) : el;
        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            delay,
            stagger: stagger ?? 0,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal={stagger ? "children" : ""} {...rest}>
      {children}
    </Tag>
  );
}
