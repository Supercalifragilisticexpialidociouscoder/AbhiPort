"use client";

import type { WorldProps } from "./shared";
import { EcosystemWorld, PermissionWorld, PlasmaWorld, VisionWorld } from "./WorldsA";
import { CertificationWorld, OrbitWorld, SealedWorld, SelfWorld } from "./WorldsB";

/** Eight projects, eight worlds. Keyed by slug so the film and the project
 *  page show the same picture. */
const WORLDS: Record<string, React.ComponentType<WorldProps>> = {
  "infin8-access": PermissionWorld,
  plasmatherm: PlasmaWorld,
  "club-infin8": EcosystemWorld,
  hakit: VisionWorld,
  "certus-s2": CertificationWorld,
  astrosim: OrbitWorld,
  sandgate: SealedWorld,
  abhiport: SelfWorld,
};

export function World({ slug, live, className }: { slug: string } & WorldProps) {
  const Component = WORLDS[slug];
  return Component ? <Component live={live} className={className} /> : null;
}
