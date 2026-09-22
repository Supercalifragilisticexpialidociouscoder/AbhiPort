import { cn } from "@/lib/cn";

/**
 * A numbered case-study chapter: sticky label on the left, content on the
 * right. `theme` feeds the page-wide surface shift (garage for the
 * technical bits, same as the home page).
 */
export function CaseSection({
  n,
  title,
  theme,
  children,
  className,
  id,
}: {
  n: string;
  title: string;
  theme: "ink" | "paper" | "garage";
  children: React.ReactNode;
  className?: string;
  /** Anchor, e.g. "under-the-hood". */
  id?: string;
}) {
  const headingId = `case-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section
      id={id}
      data-theme={theme}
      data-index={n}
      data-label={title}
      aria-labelledby={headingId}
      className={cn("relative scroll-mt-4 px-gutter py-[12vh]", className)}
    >
      <div className="grid gap-8 border-t border-line pt-6 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-3">
          <h2 id={headingId} className="label flex gap-3 lg:sticky lg:top-[calc(var(--nav-h)+20px)]">
            <span className="tnum text-accent">({n})</span>
            <span>{title}</span>
          </h2>
        </div>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
