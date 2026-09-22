import type { Project } from "@/content/projects";
import { getNextProject, projects } from "@/content/projects";
import { pad } from "@/lib/cn";
import { CaseHero } from "./case/CaseHero";
import { CaseSection } from "./case/CaseSection";
import { ArchitectureDiagram, FlowChain } from "./case/Diagrams";
import { TransitionLink } from "./PageTransition";
import { ScrollDirector } from "./ScrollDirector";
import { Media } from "./ui/Media";
import { Known, Ph } from "./ui/Ph";
import { Reveal } from "./ui/Reveal";
import { Signature } from "./visuals/Signatures";

/**
 * A full case study (or research note) generated from one entry in
 * content/projects.ts. Products read Overview → Problem → Approach →
 * Architecture → Stack → Challenges → Outcome → Screens; research gets the
 * same bones with research labels and a paper surface.
 */
export function ProjectCaseStudy({ project: p }: { project: Project }) {
  const research = p.kind === "research";
  const base = research ? "paper" : "ink";
  const next = getNextProject(p.slug);
  const L = research
    ? { overview: "Abstract", problem: "Motivation", approach: "Approach", architecture: "Pipeline", stack: "Tooling", challenges: "Open problems", outcome: "Status", screens: "Figures" }
    : { overview: "Overview", problem: "Problem", approach: "Approach", architecture: "Architecture", stack: "Stack", challenges: "Challenges", outcome: "Outcome", screens: "Screens" };

  let n = 0;
  const idx = () => pad(++n);

  return (
    <>
      <main id="main">
        <CaseHero
          project={p}
          cover={<Media src={p.cover} alt={p.coverAlt} eager sizes="100vw" label={`${p.title} — cover`} />}
        />

        <CaseSection n={idx()} title={L.overview} theme={base}>
          <Reveal as="p" className="max-w-[32ch] text-[clamp(24px,2.6vw,44px)] font-medium leading-[1.12] tracking-[-0.02em]">
            {p.study.overview}
          </Reveal>
          {research && p.study.question ? (
            <Reveal className="mt-12 max-w-3xl border-l-2 border-accent pl-6">
              <p className="label text-muted">Research question</p>
              <p className="mt-3 text-[clamp(20px,1.8vw,28px)] leading-snug">{p.study.question}</p>
            </Reveal>
          ) : null}
          {research && p.study.keywords ? (
            <Reveal as="ul" stagger={0.04} className="label mt-10 flex flex-wrap gap-1.5">
              {p.study.keywords.map((k) => (
                <li key={k} className="border border-line px-2.5 py-1.5">
                  {k}
                </li>
              ))}
            </Reveal>
          ) : null}
        </CaseSection>

        <CaseSection n={idx()} title={L.problem} theme={base}>
          <Reveal as="p" className="max-w-[60ch] text-[clamp(18px,1.5vw,22px)] leading-relaxed text-muted">
            {p.study.problem}
          </Reveal>
        </CaseSection>

        <CaseSection n={idx()} title={L.approach} theme={base}>
          <Reveal stagger={0.1} className="grid max-w-5xl gap-6 text-[clamp(18px,1.5vw,22px)] leading-relaxed md:grid-cols-2 md:gap-10">
            {p.study.approach.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </Reveal>
          <Reveal>
            <FlowChain title={p.study.flow.title} steps={p.study.flow.steps} />
          </Reveal>
          {p.study.modules ? (
            <Reveal className="mt-12">
              <p className="label mb-4 flex items-center gap-3 text-muted">
                <span aria-hidden className="h-px w-8 bg-accent" />
                {pad(p.study.modules.length)} modules
              </p>
              <ul className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-7">
                {p.study.modules.map((m, i) => (
                  <li key={m} className="flex min-h-[92px] flex-col justify-between bg-bg p-3">
                    <span className="label tnum text-muted">M{pad(i + 1)}</span>
                    <span className="text-[15px] font-medium">{m}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </CaseSection>

        <CaseSection n={idx()} title={L.architecture} theme="garage">
          <Reveal>
            <ArchitectureDiagram caption={p.study.architecture.caption} layers={p.study.architecture.layers} />
          </Reveal>
          <Reveal className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="min-h-[420px]">
              <Signature project={p} className="bg-bg/70" />
            </div>
            <p className="label self-end text-muted lg:max-w-xs">
              The signature diagram from the work index — an illustration of how {p.title} thinks, not a screenshot.
            </p>
          </Reveal>
        </CaseSection>

        <CaseSection n={idx()} title={L.stack} theme={base}>
          <dl className="border-t border-line">
            {p.study.stack.map((g) => (
              <Reveal key={g.group} className="grid gap-2 border-b border-line py-5 md:grid-cols-9 md:gap-6">
                <dt className="label text-muted md:col-span-3">{g.group}</dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1 text-[clamp(20px,2vw,32px)] font-medium tracking-tight md:col-span-6">
                  {g.items.map((it, i) => (
                    <span key={it}>
                      {it}
                      {i < g.items.length - 1 ? <span className="pl-3 text-muted">/</span> : null}
                    </span>
                  ))}
                </dd>
              </Reveal>
            ))}
          </dl>
          {p.stackTodo || research ? (
            <p className="mt-6">
              <Ph>{research ? "Add tooling — e.g. Python libraries, models" : p.stackTodo ?? ""}</Ph>
            </p>
          ) : null}
        </CaseSection>

        <CaseSection n={idx()} title={L.challenges} theme={base}>
          <ol className="grid gap-px border border-line bg-line md:grid-cols-2">
            {p.study.challenges.map((c, i) => (
              <Reveal as="li" key={c.title} className="flex flex-col gap-5 bg-bg p-6 md:p-8">
                <span className="display hollow text-[72px] leading-[0.8]">{pad(i + 1)}</span>
                <h3 className="display text-[clamp(28px,2.4vw,40px)] leading-[0.92]">{c.title}</h3>
                <p className="text-[17px] leading-relaxed text-muted">{c.body}</p>
              </Reveal>
            ))}
          </ol>
        </CaseSection>

        <CaseSection n={idx()} title={L.outcome} theme={base}>
          <div className="max-w-4xl space-y-6">
            {p.study.outcome.map((o) => (
              <Reveal as="p" key={o.slice(0, 24)} className="text-[clamp(22px,2.2vw,36px)] font-medium leading-[1.15] tracking-[-0.015em]">
                {o}
              </Reveal>
            ))}
            <p>
              <Ph>{p.study.outcomeTodo}</Ph>
            </p>
          </div>
          <div className="label mt-12 flex flex-wrap gap-x-10 gap-y-4">
            <span className="flex items-center gap-3">
              <span className="text-muted">Live</span>
              {p.links.live ? (
                <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="link-line py-1">
                  Visit ↗
                </a>
              ) : (
                <Known value={null} todo="Add link" />
              )}
            </span>
            <span className="flex items-center gap-3">
              <span className="text-muted">Source</span>
              {p.links.repo ? (
                <a href={p.links.repo} target="_blank" rel="noopener noreferrer" className="link-line py-1">
                  Repository ↗
                </a>
              ) : (
                <Known value={null} todo="Add repo" />
              )}
            </span>
          </div>
        </CaseSection>

        <CaseSection n={idx()} title={L.screens} theme={base}>
          <div className="grid gap-6 md:grid-cols-2">
            {p.study.screens.map((s, i) => (
              <Reveal as="figure" key={s.image} className={i === 0 ? "md:col-span-2" : undefined}>
                <div className={`relative overflow-hidden border border-line ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <Media src={s.image} alt={`${p.title} — ${s.caption}`} sizes={i === 0 ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 1024px) 35vw, 100vw"} label={s.caption} />
                </div>
                <figcaption className="label mt-3 flex justify-between gap-4 text-muted">
                  <span>{s.caption}</span>
                  <span className="tnum">
                    {research ? "Fig" : "Screen"} {pad(i + 1)}
                  </span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </CaseSection>

        {/* Next lap */}
        <section data-theme="ink" data-index={pad(n + 1)} data-label="Next" aria-label="Next project" className="relative">
          <TransitionLink
            href={`/work/${next.slug}`}
            transitionLabel={next.title}
            data-cursor="Next"
            className="group block border-t border-line px-gutter pb-[14vh] pt-[12vh]"
          >
            <span className="label flex justify-between text-muted">
              <span>
                Next — <span className="tnum text-accent">{next.number}</span> / {pad(projects.length)}
              </span>
              <span>{next.category}</span>
            </span>
            <span className="display mt-8 block text-balance text-[clamp(64px,12vw,240px)] leading-[0.82] transition-[font-variation-settings] duration-700 ease-[var(--ease-expo)] group-hover:[--wdth:76]">
              {next.title}
              <span className="arrow-nudge-x ml-[0.15em] text-accent">→</span>
            </span>
            <span className="mt-8 block max-w-md text-[clamp(18px,1.4vw,22px)] text-muted">{next.tagline}</span>
          </TransitionLink>
        </section>

        <ScrollDirector total={n + 1} />
      </main>
    </>
  );
}
