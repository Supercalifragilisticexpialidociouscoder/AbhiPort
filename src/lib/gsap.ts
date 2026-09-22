"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED = "(prefers-reduced-motion: reduce)";
export const DESKTOP = "(min-width: 1024px)";

export { gsap, ScrollTrigger, useGSAP };
