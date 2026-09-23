import type { Project, ProjectFile as File } from "@/content/projects";
import { getNextProject, projectPages } from "@/content/projects";
import { pad } from "@/lib/cn";
import { CaseHero } from "./case/CaseHero";
import { CaseSection } from "./case/CaseSection";
import { FlowChain } from "./case/Diagrams";
import { TransitionLink } from "./PageTransition";
import { ScrollDirector } from "./ScrollDirector";
import { Media } from "./ui/Media";
import { Known } from "./ui/Ph";
import { Reveal } from "./ui/Reveal";
import { Signature } from "./visuals/Signatures";
import { World } from "./work/worlds";
import { hasWorld } from "./work/worlds/slugs";

const month = (ym?: string) => {
  if (!ym) return null;
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, 1)).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
};

/**
 * A project file: the lighter page, for builds that don't need a full case
 * study. Read off the code and the README — what it is, how it works, what's
 * actually inside, and the honest bit (sample data, mocked AI, prototype
 * limits) set loudly on signal red instead of buried in a footnote.
 */
export function ProjectFile({ project: p }: { project: Project & { file: File } }) {
  const f = p.file;
  const next = getNextProject(p.slug);
  const position = projectPages.findIndex((x) => x.slug === p.slug) + 1;
  const first = month(p.created);
  let n = 0;
  const idx = () => pad(++n);

  const links = [
    { k: "Live", href: p.links.live, text: "Open it ↗" },
    { k: "Code", href: p.links.repo, text: "View the code ↗" },
    ...(f.repos ?? []).filter((r) => r.href !== p.links.repo).map((r) => ({ k: r.label, href: r.href as string | null, text: "Repo ↗" })),
  ];

  return (
    <main id="main">
      <CaseHero
        project={p}
        eyebrow={
          <>
            Project file <span className="tnum text-accent">{p.number}</span> / {pad(projectPages.length)}
          </>
        }
        cover={
          // A real screen when there is one; otherwise the project's own
          // world, rather than an empty frame pointing at a file that
          // doesn't exist.
          f.screens[0] ? (
            <Media src={f.screens[0].image} alt={`${p.title} — ${f.screens[0].caption}`} eager sizes="100vw" label={`${p.title} — screen`} />
          ) : hasWorld(p.slug) ? (
            <div className="absolute inset-0 p-4 md:p-6">
              <World slug={p.slug} live />
            </div>
          ) : null
        }
      />

      <CaseSection n={idx()} title="What it is" theme="ink">
        <Reveal as="p" className="max-w-[38ch] text-[clamp(22px,2.3vw,38px)] font-medium leading-[1.14] tracking-[-0.02em]">
          {f.what}
        </Reveal>
        <dl className="label mt-10 grid gap-x-8 gap-y-4 border-t border-line pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-muted">Built at</dt>
            <dd className="mt-1.5 normal-case tracking-normal text-[15px] text-fg">{p.origin ?? "On my own time"}</dd>
          </div>
          <div>
            <dt className="text-muted">First commit</dt>
            <dd className="mt-1.5 normal-case tracking-normal text-[15px] text-fg">
              <Known value={first} todo="Add date" />
            </dd>
          </div>
          <div>
            <dt className="text-muted">File</dt>
            <dd className="mt-1.5 normal-case tracking-normal text-[15px] text-fg">
              {pad(position)} of {pad(projectPages.length)} project pages
            </dd>
          </div>
        </dl>
      </CaseSection>

      <CaseSection n={idx()} title="How it works" theme="garage">
        <Reveal>
          <FlowChain title={f.flow.title} steps={f.flow.steps} />
        </Reveal>
      </CaseSection>

      <CaseSection n={idx()} title="What's inside" theme="ink">
        <ol className="grid gap-px border border-line bg-line md:grid-cols-3">
          {f.inside.map((c, i) => (
            <Reveal as="li" key={c.title} className="flex flex-col gap-5 bg-bg p-6 md:p-7">
              <span className="display hollow text-[64px] leading-[0.8]">{pad(i + 1)}</span>
              <h3 className="display text-[clamp(26px,2.2vw,38px)] leading-[0.92]">{c.title}</h3>
              <p className="text-[16px] leading-relaxed text-muted">{c.body}</p>
            </Reveal>
          ))}
        </ol>
      </CaseSection>

      <CaseSection n={idx()} title="The honest bit" theme="ir">
        <ul className="max-w-4xl space-y-5">
          {f.honest.map((h) => (
            <Reveal as="li" key={h} className="flex gap-5 text-[clamp(22px,2.4vw,40px)] font-medium leading-[1.12] tracking-[-0.02em]">
              <span aria-hidden className="display pt-[0.1em] text-[0.8em] leading-none">
                !
              </span>
              <span>{h}</span>
            </Reveal>
          ))}
        </ul>
        <p className="label mt-10">No fake users, no invented numbers. If it&apos;s a demo, it says so.</p>
      </CaseSection>

      <CaseSection n={idx()} title="Built with" theme="ink">
        <dl className="border-t border-line">
          {f.stack.map((g) => (
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
      </CaseSection>

      {hasWorld(p.slug) ? (
        <CaseSection n={idx()} title="The world" theme="garage">
          <Reveal className="group grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
            <div className="min-h-[440px]">
              <World slug={p.slug} live />
            </div>
            <p className="label self-end text-muted lg:max-w-xs">The same picture the film runs — {p.title} drawn from what it actually does, never a screenshot.</p>
          </Reveal>
        </CaseSection>
      ) : p.visual ? (
        <CaseSection n={idx()} title="Signature" theme="garage">
          <Reveal className="group grid gap-6 lg:grid-cols-2">
            <div className="min-h-[420px]">
              <Signature project={p} className="bg-bg/70" />
            </div>
            <p className="label self-end text-muted lg:max-w-xs">An illustration of how {p.title} works — drawn from its code, not a screenshot.</p>
          </Reveal>
        </CaseSection>
      ) : null}

      <CaseSection n={idx()} title="Links" theme="ink">
        <ul className="label flex flex-col border-t border-line">
          {links.map((l) => (
            <li key={l.k + (l.href ?? "")} className="grid grid-cols-[8rem_1fr] items-center gap-4 border-b border-line py-4">
              <span className="text-muted">{l.k}</span>
              {l.href ? (
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-line justify-self-start py-1 text-fg">
                  {l.text}
                </a>
              ) : (
                <Known value={null} todo={l.k === "Live" ? "No live demo yet" : "Add link"} />
              )}
            </li>
          ))}
        </ul>
      </CaseSection>

      <CaseSection n={idx()} title="Screens" theme="ink">
        <div className="grid gap-6 md:grid-cols-2">
          {f.screens.map((sc, i) => (
            <Reveal as="figure" key={sc.image} className={i === 0 && f.screens.length > 1 ? "md:col-span-2" : undefined}>
              <div className={`relative overflow-hidden border border-line ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                <Media src={sc.image} alt={`${p.title} — ${sc.caption}`} sizes={i === 0 ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 1024px) 35vw, 100vw"} label={sc.caption} />
              </div>
              <figcaption className="label mt-3 flex justify-between gap-4 text-muted">
                <span>{sc.caption}</span>
                <span className="tnum">Screen {pad(i + 1)}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </CaseSection>

      {/* Next lap */}
      <section data-theme="ink" data-index={pad(n + 1)} data-label="Next" aria-label="Next project" className="relative">
        <TransitionLink href={`/work/${next.slug}`} transitionLabel={next.title} data-cursor="Next" className="group block border-t border-line px-gutter pb-[14vh] pt-[12vh]">
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
