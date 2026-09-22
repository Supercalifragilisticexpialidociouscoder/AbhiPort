import type { Layer, Step } from "@/content/projects";
import { pad } from "@/lib/cn";

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

/** System architecture as stacked layers — the page is in garage mode here. */
export function ArchitectureDiagram({ caption, layers }: { caption: string; layers: Layer[] }) {
  return (
    <figure>
      <ol className="grid gap-3 lg:grid-flow-col lg:auto-cols-fr lg:gap-0">
        {layers.map((l, i) => (
          <li key={l.tier} className="relative border border-line bg-bg/70 p-5 lg:-ml-px lg:min-h-[320px] lg:first:ml-0">
            <p className="label flex justify-between">
              <span className="text-accent">
                L{pad(i + 1)} · {l.tier}
              </span>
            </p>
            <p className="display mt-8 text-[clamp(28px,2.3vw,40px)] leading-[0.9]">{l.name}</p>
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
            {i < layers.length - 1 ? (
              <span
                aria-hidden
                className="absolute -bottom-[15px] left-1/2 z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-line bg-bg text-[13px] text-accent lg:-right-[15px] lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0"
              >
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <figcaption className="label mt-4 flex justify-between gap-4 text-muted">
        <span>Fig. — {caption}</span>
        <span className="hidden md:inline">Simplified</span>
      </figcaption>
    </figure>
  );
}
