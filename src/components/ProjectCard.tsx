import type { Project } from "@/content/projects";
import { cn, pad } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { site } from "@/content/site";
import { Known, Ph } from "./ui/Ph";
import { Signature } from "./visuals/Signatures";

/**
 * One project as an editorial spread: rail of metadata, a giant hollow
 * number, the title, a signature diagram and a framed cover slot.
 * On desktop these sit side by side in the horizontal track.
 */
export function ProjectCard({
  project: p,
  total,
  cover,
}: {
  project: Project;
  total: number;
  /** Only passed when a real cover file exists in /public. */
  cover?: React.ReactNode;
}) {
  const research = p.kind === "research";
  const longest = Math.max(...p.titleLines.map((l) => l.length));

  return (
    <article
      data-spread
      data-surface={research ? "paper" : undefined}
      data-cursor={research ? "Read" : "Open"}
      aria-labelledby={`spread-${p.slug}`}
      className={cn(
        "group relative border-t border-line track:h-full track:w-[86vw] track:shrink-0 track:border-l track:border-t-0",
        research && "track:w-[92vw]",
      )}
    >
      <div className="flex h-full flex-col px-gutter pb-16 pt-10 lg:pb-20 track:pt-[calc(var(--nav-h)+22px)]">
        {/* Metadata rail */}
        <div className="label flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line pb-3">
          <span className="tnum text-accent">
            {p.number} / {pad(total)}
          </span>
          <span>{p.category}</span>
          <span className="ml-auto text-muted">
            <Known value={p.status} todo="Add status" />
          </span>
          <span className="text-muted">
            <Known value={p.year} todo="Add year" />
          </span>
        </div>

        <div className="mt-8 grid min-h-0 flex-1 grid-cols-1 gap-10 lg:mt-6 lg:grid-cols-12 lg:gap-6">
          {/* Words */}
          <div className="relative flex min-w-0 flex-col justify-end lg:col-span-6">
            <span
              data-num
              aria-hidden
              className="display hollow pointer-events-none absolute right-0 top-0 text-[clamp(120px,30vw,260px)] leading-[0.8] opacity-70 transition-[color] duration-500 lg:left-0 lg:right-auto lg:top-[-1vh] lg:text-[clamp(160px,36vh,440px)] group-hover:text-accent/15"
            >
              {p.number}
            </span>

            {research ? <p className="label relative mb-4 text-accent">Research note</p> : null}

            <h3
              id={`spread-${p.slug}`}
              className="spread-title display relative transition-[font-variation-settings] duration-700 ease-[var(--ease-expo)] group-hover:[--wdth:70]"
              style={{ "--n": longest } as React.CSSProperties}
            >
              {p.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>

            {research ? (
              <>
                <p className="relative mt-6 max-w-[38ch] text-[clamp(19px,1.5vw,24px)] leading-snug">{p.tagline}</p>
                <div className="relative mt-5 max-w-[52ch] border-l-2 border-accent pl-4">
                  <p className="label text-muted">Research question</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed">{p.study.question}</p>
                </div>
                <ul className="label relative mt-5 flex flex-wrap gap-1.5">
                  {(p.study.keywords ?? []).slice(0, 6).map((k) => (
                    <li key={k} className="border border-line px-2 py-1">
                      {k}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="relative mt-6 max-w-[30ch] text-[clamp(20px,1.6vw,26px)] leading-snug">{p.tagline}</p>
                <p className="relative mt-2 max-w-[46ch] text-muted">{p.summary}</p>
                <ul className="label relative mt-5 flex flex-wrap gap-x-1 gap-y-1 text-muted">
                  {p.stack.map((s, i) => (
                    <li key={s}>
                      {s}
                      {i < p.stack.length - 1 ? <span className="px-1.5 text-line">/</span> : null}
                    </li>
                  ))}
                  {p.stackTodo ? (
                    <li className="ml-2">
                      <Known value={null} todo={p.stackTodo} />
                    </li>
                  ) : null}
                </ul>
              </>
            )}

            <TransitionLink
              href={`/work/${p.slug}`}
              transitionLabel={p.title}
              data-primary
              className="label relative mt-8 inline-flex items-center gap-3 self-start py-1"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                <span className="arrow-nudge-x">→</span>
              </span>
              <span className="link-line">{research ? "Read the research note" : "Open case study"}</span>
            </TransitionLink>
          </div>

          {/* Visual: the real cover once it exists, otherwise the project's diagram. */}
          <div data-visual className="relative min-h-[380px] min-w-0 lg:col-span-6 lg:min-h-0 lg:pb-6 lg:pl-10">
            {cover ? (
              <div className="relative h-full min-h-[380px] overflow-hidden border border-line">
                <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]">{cover}</div>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="min-h-0 flex-1 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.012]">
                  <Signature project={p} className={research ? "" : "bg-bg/60"} />
                </div>
                {site.showPlaceholders ? (
                  <p className="label mt-3 flex items-center gap-3 text-muted">
                    <span>Cover</span>
                    <Ph>Add image</Ph>
                    <span className="min-w-0 truncate normal-case">public/{p.cover}.jpg</span>
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
