"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Ecosystem } from "./Ecosystem";

/** The ecosystem with its scroll choreography built in: the ring turns, the 8 becomes ∞. */
export function EcosystemAnimated({ clubs }: { clubs: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom 25%", scrub: 0.8 } });
        tl.fromTo(q("[data-eco-ring]"), { rotate: -22.5 }, { rotate: 22.5, ease: "none" }, 0)
          .fromTo(q("[data-eco-label]"), { rotate: 22.5 }, { rotate: -22.5, ease: "none" }, 0)
          .fromTo(q("[data-eco-eight]"), { rotate: 0 }, { rotate: 90, ease: "power2.inOut" }, 0);
      });
    },
    { scope: root },
  );
  return (
    <div ref={root}>
      <Ecosystem clubs={clubs} />
    </div>
  );
}
