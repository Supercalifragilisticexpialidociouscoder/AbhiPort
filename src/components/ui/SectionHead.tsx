import { cn } from "@/lib/cn";

/** The editorial rail that opens every section: (03) WORK ———— aside */
export function SectionHead({
  index,
  title,
  aside,
  className,
}: {
  index: string;
  title: string;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("label flex items-center gap-3 md:gap-4", className)}>
      <span className="tnum text-accent">({index})</span>
      <span>{title}</span>
      <span aria-hidden className="h-px min-w-6 flex-1 bg-line" />
      {aside ? <span className="text-muted">{aside}</span> : null}
    </div>
  );
}
