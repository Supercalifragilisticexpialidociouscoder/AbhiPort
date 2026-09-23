import type { ProjectStatus } from "@/content/projects";
import { cn } from "@/lib/cn";
import { Ph } from "./Ph";

const STYLE: Record<ProjectStatus, string> = {
  Shipped: "border-accent bg-accent text-bg",
  Active: "border-fg text-fg",
  Prototype: "border-fg/60 text-fg",
  Research: "border-fg/60 text-fg",
  Experiment: "border-dashed border-fg/50 text-muted",
  Hackathon: "border-accent text-accent",
  Learning: "border-dotted border-fg/50 text-muted",
  Archived: "border-line text-muted line-through",
};

/** STATUS / SHIPPED — the little badge that keeps the archive feeling alive. */
export function StatusChip({ status, className }: { status: ProjectStatus | null; className?: string }) {
  if (!status) return <Ph>Add status</Ph>;
  return (
    <span className={cn("label inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-1", STYLE[status], className)}>
      {status === "Active" ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" /> : null}
      {status}
    </span>
  );
}
