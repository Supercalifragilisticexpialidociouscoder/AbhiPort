import type { CaseStudy, Project } from "@/content/projects";
import { getNextProject, projectPages } from "@/content/projects";
import { pad } from "@/lib/cn";
import { CaseHero } from "./case/CaseHero";
import { CaseSection } from "./case/CaseSection";
import { FlowChain } from "./case/Diagrams";
import { UnderTheHood } from "./case/UnderTheHood";
import { TransitionLink } from "./PageTransition";
import { ScrollDirector } from "./ScrollDirector";
import { Media } from "./ui/Media";
import { Known, Ph } from "./ui/Ph";
import { Reveal } from "./ui/Reveal";
import { Signature } from "./visuals/Signatures";
import { World } from "./work/worlds";
import { hasWorld } from "./work/worlds/slugs";

/**
 * A full case study (or research note) generated from one entry in
 * content/projects.ts. It reads like engineering thinking:
 * problem → idea → build → hard part → result → what's next, with the
 * technical depth one click away under the hood.
 */
export function ProjectCaseStudy({ project: p }: { project: Project & { study: CaseStudy } }) {
  const research = p.kind === "research";
  const base = research ? "paper" : "ink";
  const next = getNextProject(p.slug);
  const study = p.study;
  const L = research
    ? { problem: "Motivation", idea: "Abstract", build: "Approach", hard: "Open problems", result: "Status", next: "What's next", hood: "Under the hood", screens: "Figures" }
    : { problem: "The problem", idea: "The idea", build: "The build", hard: "The hard part", result: "The result", next: "What's next", hood: "Under the hood", screens: "Screens" };

  let n = 0;
  const idx = () => pad(++n);

  return (
    <main id="main">
      <CaseHero project={p} cover={<Media src={p.cover ?? ""} alt={p.coverAlt ?? p.title} eager sizes="100vw" label={`${p.title} — cover`} />} />

      {p.metrics?.length ? (
        <section aria-label="In numbers" className="px-gutter pt-16">
          <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
            {p.metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-3 border-r border-line py-6 pl-4 last:border-r-0">
                <dt className="label order-2 text-muted">{m.label}</dt>
                <dd className="display tnum order-1 text-[clamp(44px,5vw,96px)] leading-[0.8]">{m.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <CaseSection n={idx()} title={L.problem} theme={base}>
        <Reveal as="p" className="max-w-[34ch] text-[clamp(24px,2.6vw,44px)] font-medium leading-[1.12] tracking-[-0.02em]">
          {study.problem}
        </Reveal>
      </CaseSection>

      <CaseSection n={idx()} title={L.idea} theme={base}>
        <Reveal as="p" className="max-w-[60ch] text-[clamp(18px,1.6vw,24px)] leading-relaxed">
          {study.idea}
        </Reveal>
        {research && study.question ? (
          <Reveal className="mt-12 max-w-3xl border-l-2 border-accent pl-6">
            <p className="label text-muted">Research question</p>
            <p className="mt-3 text-[clamp(20px,1.8vw,28px)] leading-snug">{study.question}</p>
          </Reveal>
        ) : null}
        {research && study.keywords ? (
          <Reveal as="ul" stagger={0.04} className="label mt-10 flex flex-wrap gap-1.5">
            {study.keywords.map((k) => (
              <li key={k} className="border border-line px-2.5 py-1.5">
                {k}
              </li>
            ))}
          </Reveal>
        ) : null}
      </CaseSection>

      <CaseSection n={idx()} title={L.build} theme={base}>
        <Reveal stagger={0.1} className="grid max-w-5xl gap-6 text-[clamp(18px,1.5vw,22px)] leading-relaxed md:grid-cols-2 md:gap-10">
          {study.build.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </Reveal>

        <Reveal>
          <FlowChain title={study.flow.title} steps={study.flow.steps} />
        </Reveal>

        {study.roles ? (
          <Reveal className="mt-12">
            <p className="label mb-4 flex items-center gap-3 text-muted">
              <span aria-hidden className="h-px w-8 bg-accent" />
              {pad(study.roles.length)} roles, each with its own workflow
            </p>
            <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {study.roles.map((r, i) => (
                <li key={r.name} className="flex min-h-[150px] flex-col justify-between gap-6 bg-bg p-5">
                  <span className="label tnum text-accent">R{pad(i + 1)}</span>
                  <span>
                    <span className="display block text-[clamp(28px,2.4vw,40px)] leading-[0.9]">{r.name}</span>
                    <span className="mt-2 block text-[15px] leading-snug text-muted">{r.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <dl className="mt-12 border-t border-line">
          {study.stack.map((g) => (
            <div key={g.group} className="grid gap-2 border-b border-line py-4 md:grid-cols-9 md:gap-6">
              <dt className="label text-muted md:col-span-3">{g.group}</dt>
              <dd className="flex flex-wrap gap-x-3 gap-y-1 text-[clamp(18px,1.7vw,26px)] font-medium tracking-tight md:col-span-6">
                {g.items.map((it, i) => (
                  <span key={it}>
                    {it}
                    {i < g.items.length - 1 ? <span className="pl-3 text-muted">/</span> : null}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        {p.stackTodo ? (
          <p className="mt-4">
            <Ph>{p.stackTodo}</Ph>
          </p>
        ) : null}
      </CaseSection>

      <CaseSection n={idx()} title={L.hard} theme={base}>
        <ol className="grid gap-px border border-line bg-line md:grid-cols-2">
          {study.hardPart.map((c, i) => (
            <Reveal as="li" key={c.title} className="flex flex-col gap-5 bg-bg p-6 md:p-8">
              <span className="display hollow text-[72px] leading-[0.8]">{pad(i + 1)}</span>
              <h3 className="display text-[clamp(28px,2.4vw,40px)] leading-[0.92]">{c.title}</h3>
              <p className="text-[17px] leading-relaxed text-muted">{c.body}</p>
            </Reveal>
          ))}
        </ol>
      </CaseSection>

      <CaseSection n={idx()} title={L.result} theme={base}>
        <div className="max-w-4xl space-y-6">
          {study.result.map((o) => (
            <Reveal as="p" key={o.slice(0, 24)} className="text-[clamp(22px,2.2vw,36px)] font-medium leading-[1.15] tracking-[-0.015em]">
              {o}
            </Reveal>
          ))}
          <p>
            <Ph>{study.resultTodo}</Ph>
          </p>
        </div>
        <div className="label mt-12 flex flex-wrap gap-x-10 gap-y-4">
          {[
            { k: "Live", href: p.links.live, text: "Visit ↗" },
            { k: "Code", href: p.links.repo, text: "View the code ↗" },
            { k: "Video", href: p.links.video ?? null, text: "Watch ↗" },
          ].map((l) => (
            <span key={l.k} className="flex items-center gap-3">
              <span className="text-muted">{l.k}</span>
              {l.href ? (
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-line py-1">
                  {l.text}
                </a>
              ) : (
                <Known value={null} todo="Add link" />
              )}
            </span>
          ))}
        </div>
      </CaseSection>

      <CaseSection n={idx()} title={L.next} theme={base}>
        {study.next?.length ? (
          <ul className="max-w-3xl border-t border-line">
            {study.next.map((x, i) => (
              <li key={x} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-4 text-[clamp(18px,1.5vw,22px)]">
                <span className="label tnum pt-1 text-accent">{pad(i + 1)}</span>
                {x}
              </li>
            ))}
          </ul>
        ) : (
          <div className="max-w-2xl space-y-4">
            <p className="text-[clamp(18px,1.5vw,22px)] leading-relaxed text-muted">
              First versions are rarely the final versions. This one won&apos;t be either.
            </p>
            <Ph>Add what you&apos;d improve next</Ph>
          </div>
        )}
      </CaseSection>

      <CaseSection n={idx()} title={L.hood} theme="garage" id="under-the-hood">
        <UnderTheHood hood={study.underTheHood} title={p.title} />
        <Reveal className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="min-h-[440px]">
            {hasWorld(p.slug) ? <World slug={p.slug} live /> : <Signature project={p} className="bg-bg/70" />}
          </div>
          <p className="label self-end text-muted lg:max-w-xs">
            The same picture the film runs — an illustration of how {p.title} thinks, not a screenshot.
          </p>
        </Reveal>
      </CaseSection>

      <CaseSection n={idx()} title={L.screens} theme={base}>
        <div className="grid gap-6 md:grid-cols-2">
          {study.screens.map((sc, i) => (
            <Reveal as="figure" key={sc.image} className={i === 0 ? "md:col-span-2" : undefined}>
              <div className={`relative overflow-hidden border border-line ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                <Media src={sc.image} alt={`${p.title} — ${sc.caption}`} sizes={i === 0 ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 1024px) 35vw, 100vw"} label={sc.caption} />
              </div>
              <figcaption className="label mt-3 flex justify-between gap-4 text-muted">
                <span>{sc.caption}</span>
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
              Next — <span className="tnum text-accent">{next.number}</span> / {pad(projectPages.length)}
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
  );
}
