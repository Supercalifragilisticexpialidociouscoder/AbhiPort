import Image from "next/image";
import { resolveAsset } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { MediaSlot } from "./MediaSlot";
import { MediaVideo } from "./MediaVideo";

type MediaProps = {
  /** Base path under /public without extension, e.g. "images/abhi-hero". */
  src: string;
  alt: string;
  sizes?: string;
  /** Load immediately (above the fold). */
  eager?: boolean;
  className?: string;
  /** Shown on the placeholder frame. */
  label?: string;
  glow?: boolean;
  compact?: boolean;
  /** "contain" for cut-outs on transparency, which shouldn't be cropped. */
  fit?: "cover" | "contain";
};

/**
 * Server component: renders the real image/video if it exists in /public,
 * otherwise a clearly-marked placeholder frame. Always fills its parent,
 * so give the parent a size (aspect ratio or explicit height).
 */
export function Media({ src, alt, sizes = "100vw", eager, className, label, glow, compact, fit = "cover" }: MediaProps) {
  const asset = resolveAsset(src);
  if (!asset) return <MediaSlot path={src} label={label} glow={glow} compact={compact} />;
  if (asset.kind === "video") {
    return <MediaVideo src={asset.url} label={alt} critical={eager} className={cn("absolute inset-0 h-full w-full object-cover", className)} />;
  }
  return (
    <Image
      src={asset.url}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      // Above-the-fold media: the preloader waits for it (and only it).
      data-critical={eager ? "" : undefined}
      className={cn(fit === "contain" ? "object-contain" : "object-cover", className)}
    />
  );
}
