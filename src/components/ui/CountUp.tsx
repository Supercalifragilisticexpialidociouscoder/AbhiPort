"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * A real number that counts up once when it scrolls into view. The final
 * value is what's server-rendered, so no-JS and reduced-motion readers
 * always see the true figure.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = (n: number) => `${prefix}${n.toLocaleString("en-US")}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const obj = { v: 0 };
        el.textContent = text(0);
        gsap.to(obj, {
          v: value,
          duration: value > 50 ? 2 : 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "clamp(top 92%)", once: true },
          onUpdate: () => {
            el.textContent = text(Math.round(obj.v));
          },
        });
        return () => {
          el.textContent = text(value);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {text(value)}
    </span>
  );
}
