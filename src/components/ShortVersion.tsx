import { club, races, sections, shortVersion, site } from "@/content/site";
import { featuredProjects, projects } from "@/content/projects";
import { cn, pad } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { CountUp } from "./ui/CountUp";
import { Ph } from "./ui/Ph";
import { Reveal } from "./ui/Reveal";
import { SectionHead } from "./ui/SectionHead";

/**
 * 01 — The short version. The recruiter layer: name, age, strongest
 * evidence and every useful link, readable in fifteen seconds. Every number
 * here comes from content, never typed in for effect.
 */
export function ShortVersion({ cvHref }: { cvHref: string | null }) {
  const s = sections.short;
  const [students, clubs, members] = club.stats;

  const links = [
    { k: "GitHub", href: site.links.github, external: true },
    { k: "LinkedIn", href: site.links.linkedin, external: true },
    { k: "Email", href: site.email ? `mailto:${site.email}` : null, external: false },
  ];

  return (
    <section
      id={s.id}
      data-theme="ink"
      data-index={s.index}
      data-label={s.label}
      aria-labelledby="short-title"
      className="relative px-gutter pb-[12vh] pt-[16vh]"
    >
      <SectionHead index={s.index} title={shortVersion.title} aside={shortVersion.aside} />

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-6">
        <h2 id="short-title" className="display text-[clamp(56px,8.4vw,150px)] lg:col-span-7">
          The short
          <br />
          version<span className="text-accent">.</span>
        </h2>
        <p className="max-w-md self-end text-[clamp(18px,1.4vw,22px)] leading-snug text-muted lg:col-span-4 lg:col-start-9">
          {shortVersion.lead}
        </p>
      </div>

      {/* The evidence strip */}
      <div className="mt-14 grid grid-cols-2 border-y border-line lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-6 border-b border-r border-line py-6 pr-4 lg:col-span-2 lg:border-b-0">
          <p className="label text-muted">Years old</p>
          <p className="display tnum text-[clamp(72px,8.5vw,164px)] leading-[0.8]">
            <CountUp value={site.age} />
          </p>
        </div>
        <div className="flex flex-col justify-between gap-6 border-b border-line py-6 pl-4 lg:col-span-3 lg:border-b-0 lg:border-r lg:pr-4">
          <p className="label text-muted">{races.credential.label}</p>
          <p className="display tnum text-[clamp(72px,8.5vw,164px)] leading-[0.8] text-accent">{races.credential.value}</p>
        </div>
        <div className="col-span-2 grid grid-cols-3 lg:col-span-7">
          <p className="label col-span-3 flex items-center justify-between gap-4 border-b border-line px-0 py-3 lg:pl-4">
            <span>{club.name}</span>
            <span className="text-muted">{club.role}</span>
          </p>
          {[clubs, members, students].map((st, i) => (
            <div key={st.label} className={`flex flex-col justify-between gap-6 py-6 ${i > 0 ? "border-l border-line pl-4" : "lg:pl-4"}`}>
              <p className="label text-muted">{st.label}</p>
              <p className="display tnum text-[clamp(44px,5.6vw,110px)] leading-[0.8]">
                <CountUp value={st.value} prefix={st.prefix} />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* "Anything beyond academic projects?" — yes. */}
      <div className="grid gap-4 border-b border-line py-8 lg:grid-cols-12 lg:gap-6 lg:py-10">
        <p className="label flex items-center gap-2 text-muted lg:col-span-3 lg:pt-2">
          <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
          {shortVersion.inUse.label}
        </p>
        <div className="lg:col-span-9">
          <Reveal as="p" className="max-w-[26ch] text-[clamp(28px,3.4vw,60px)] font-medium leading-[1.04] tracking-[-0.025em]">
            {shortVersion.inUse.before} <span className="text-accent">{shortVersion.inUse.highlight}</span> {shortVersion.inUse.after}
          </Reveal>
          <p className="label mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted">
            <span>{shortVersion.inUse.note}</span>
            <TransitionLink href="/#in-use" className="group inline-flex items-center gap-2 text-fg">
              <span className="link-line">From code to use</span>
              <span className="arrow-nudge-x text-accent">↓</span>
            </TransitionLink>
          </p>
        </div>
      </div>

      {/* The identity, in six moves — each one links to its proof. */}
      <div className="mt-12">
        <p className="label flex justify-between gap-4 border-b border-fg pb-2">
          <span>What I do</span>
          <span className="text-muted">Each one links to the proof</span>
        </p>
        <ul className="grid grid-cols-2 gap-px bg-line md:grid-cols-3 xl:grid-cols-6">
          {shortVersion.pillars.map((p, i) => (
            <li key={p.what} className="bg-bg">
              <TransitionLink href={p.href} className="group flex h-full min-h-[150px] flex-col justify-between gap-6 p-4 transition-colors hover:bg-fg/[0.04] md:p-5">
                <span className="label flex items-center justify-between gap-2 text-muted">
                  <span>
                    <span className="tnum text-accent">{pad(i + 1)}</span> · {p.verb}
                  </span>
                  <span aria-hidden className="arrow-nudge-x text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    →
                  </span>
                </span>
                <span>
                  <span className={cn("display block text-[clamp(22px,2.2vw,40px)] leading-[0.9]", p.accent && "text-accent")}>{p.what}</span>
                  <span className="mt-2 block text-[14px] leading-snug text-muted">{p.note}</span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-6">
        <p className="label text-muted lg:col-span-3">
          {featuredProjects.length} in the film · {projects.length} in the archive · all numbers real
        </p>
        <nav aria-label="Quick links" className="flex flex-wrap gap-2.5 lg:col-span-9">
          {cvHref ? (
            <a href={cvHref} download className="label group inline-flex items-center gap-2 bg-accent px-4 py-3 text-bg">
              Download CV <span className="arrow-nudge-x">↓</span>
            </a>
          ) : (
            <span className="label inline-flex items-center gap-2 border border-dashed border-line px-4 py-3 text-muted">
              CV <Ph>Add file — public/cv/abhiram-reddy-cv.pdf</Ph>
            </span>
          )}
          {links.map((l) =>
            l.href ? (
              <a
                key={l.k}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="label group inline-flex items-center gap-2 border border-line px-4 py-3 transition-colors hover:border-fg"
              >
                {l.k} <span className="arrow-nudge">{l.external ? "↗" : "→"}</span>
              </a>
            ) : null,
          )}
          <TransitionLink href="/#work" className="label group inline-flex items-center gap-2 border border-line px-4 py-3 transition-colors hover:border-fg">
            The work <span className="arrow-nudge-x">↓</span>
          </TransitionLink>
          <TransitionLink href="/archive" transitionLabel="Archive" className="label group inline-flex items-center gap-2 border border-line px-4 py-3 transition-colors hover:border-fg">
            The archive <span className="arrow-nudge-x">→</span>
          </TransitionLink>
        </nav>
      </div>
    </section>
  );
}
