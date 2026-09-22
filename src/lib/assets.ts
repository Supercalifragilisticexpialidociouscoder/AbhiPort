import fs from "node:fs";
import path from "node:path";

/**
 * Resolves an asset by base path, e.g. "images/abhi-hero" → the first of
 * .avif / .webp / .jpg / .jpeg / .png / .mp4 / .webm that exists in /public.
 * Runs on the server at build time, so dropping a file into /public is all
 * it takes to replace a placeholder.
 */

const IMAGE_EXTS = [".avif", ".webp", ".jpg", ".jpeg", ".png"];
const VIDEO_EXTS = [".mp4", ".webm"];

export type ResolvedAsset = { url: string; kind: "image" | "video" };

const cache = new Map<string, ResolvedAsset | null>();

export function resolveAsset(base: string): ResolvedAsset | null {
  if (process.env.NODE_ENV === "production" && cache.has(base)) return cache.get(base)!;
  const clean = base.replace(/^\/+/, "").replace(/\.[a-z0-9]+$/i, "");
  const publicDir = path.join(process.cwd(), "public");
  let found: ResolvedAsset | null = null;
  for (const ext of [...VIDEO_EXTS, ...IMAGE_EXTS]) {
    if (fs.existsSync(path.join(publicDir, clean + ext))) {
      found = { url: `/${clean}${ext}`, kind: VIDEO_EXTS.includes(ext) ? "video" : "image" };
      break;
    }
  }
  cache.set(base, found);
  return found;
}
