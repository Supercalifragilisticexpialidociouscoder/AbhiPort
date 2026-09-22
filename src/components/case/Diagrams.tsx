import type { Layer, Step } from "@/content/projects";
import { cn, pad } from "@/lib/cn";

/** A left-to-right chain of steps (vertical on small screens). */
export function FlowChain({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <figure className="mt-12">
      <figcaption className="label mb-4 flex items-center gap-3 text-muted">
        <span aria-hidden className="h-px w-8 bg-accent" />
        {title}
      </figcaption>
      <ol className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
        {steps.map((s, i) => (
          <li key={s.label} className="relative flex min-h-[170px] flex-col justify-between gap-6 bg-bg p-5">
            <span className="label tnum text-muted">
              {pad(i + 1)}
              {i < steps.length - 1 ? <span className="ml-2 text-accent">→</span> : <span className="ml-2 text-accent">■</span>}
            </span>
            <span>
              <span className="display block text-[clamp(30px,2.6vw,46px)] leading-[0.9]">{s.label}</span>
              <span className="mt-2 block text-[15px] leading-snug text-muted">{s.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** System architecture as layers. Up to four sit in one row; more wrap into a 3-up grid. */
export function ArchitectureDiagram({ caption, layers }: { caption: string; layers: Layer[] }) {
  const wide = layers.length > 4;
  return (
    <figure>
      <ol className={cn("grid gap-px border border-line bg-line sm:grid-cols-2", wide ? "lg:grid-cols-3" : "lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none")}>
        {layers.map((l, i) => {
          const last = i === layers.length - 1;
          const rowEnd = wide ? i % 3 === 2 : last;
          return (
            <li key={l.tier} className="relative min-w-0 bg-bg p-5 lg:min-h-[300px]">
              <p className="label text-accent">
                L{pad(i + 1)} · {l.tier}
              </p>
              <p className="display mt-8 text-[clamp(26px,2vw,36px)] leading-[0.92] [overflow-wrap:anywhere]">{l.name}</p>
              {l.items.length ? (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {l.items.map((it) => (
                    <li key={it} className="label border border-line px-2 py-1 normal-case tracking-normal text-[12px]">
                      {it}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-5 text-[15px] leading-snug text-muted">{l.note}</p>
              {!last ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-[14px] left-1/2 z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-line bg-bg text-[13px] text-accent sm:hidden",
                  )}
                >
                  ↓
                </span>
              ) : null}
              {!rowEnd ? (
                <span
                  aria-hidden
                  className="absolute -right-[14px] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg text-[13px] text-accent lg:grid"
                >
                  →
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <figcaption className="label mt-4 flex justify-between gap-4 text-muted">
        <span>Fig. — {caption}</span>
        <span className="hidden md:inline">Simplified</span>
      </figcaption>
    </figure>
  );
}
