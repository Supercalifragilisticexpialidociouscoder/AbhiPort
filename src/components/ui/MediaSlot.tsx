import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The designed empty frame shown until a real image exists. It tells you
 * exactly which file to drop into /public to replace it.
 */
export function MediaSlot({
  path,
  label,
  className,
  glow = false,
  compact = false,
}: {
  path: string;
  label?: string;
  className?: string;
  /** Warm IR key-light — used where a portrait will eventually sit. */
  glow?: boolean;
  compact?: boolean;
}) {
  const file = `public/${path.replace(/^\/+/, "")}.jpg`;
  return (
    <div className={cn("slot", className)} role="img" aria-label={label ? `Image placeholder: ${label}` : "Image placeholder"}>
      {glow ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(38% 52% at 50% 64%, rgb(255 69 33 / 0.6), transparent 70%), radial-gradient(70% 60% at 50% 0%, rgb(236 235 230 / 0.07), transparent 70%), #121110",
          }}
        />
      ) : null}
      <span aria-hidden className="tick left-3 top-3 border-l border-t" />
      <span aria-hidden className="tick right-3 top-3 border-r border-t" />
      <span aria-hidden className="tick bottom-3 left-3 border-b border-l" />
      <span aria-hidden className="tick bottom-3 right-3 border-b border-r" />
      {label && !compact ? <span className="label absolute left-6 top-6 text-muted">{label}</span> : null}
      {site.showPlaceholders ? (
        <>
          <span className="absolute inset-0 grid place-items-center">
            <span className="ph">[Add image]</span>
          </span>
          {!compact ? (
            <span className="label absolute bottom-6 left-6 right-6 truncate normal-case text-muted">{file}</span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
