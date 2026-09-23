/**
 * Which projects have a world, as plain data — importable from server
 * components. The components themselves live in the client registry next
 * to this file and are keyed by the same slugs.
 */
export const WORLD_SLUGS = ["infin8-access", "plasmatherm", "club-infin8", "hakit", "certus-s2", "astrosim", "sandgate", "abhiport"] as const;

export const hasWorld = (slug: string) => (WORLD_SLUGS as readonly string[]).includes(slug);
