import { club } from "@/content/site";
import { getProject } from "@/content/projects";
import { pad } from "@/lib/cn";
import { CaseHero } from "./case/CaseHero";
import { CaseSection } from "./case/CaseSection";
import { TransitionLink } from "./PageTransition";
import { ScrollDirector } from "./ScrollDirector";
import { CountUp } from "./ui/CountUp";
import { Media } from "./ui/Media";
import { Reveal } from "./ui/Reveal";
import { EcosystemAnimated } from "./visuals/EcosystemAnimated";

/**
 * Club Infin8 as its own case study: not a club, an ecosystem.
 * The idea → structure → people → scale → operations → technology → role.
 */
export function ClubCaseStudy() {
  const entry = getProject("club-infin8")!;
  const [students, clubs, members] = club.stats;
  let n = 0;
  const idx = () => pad(++n);

  return (
    <main id="main">
      <CaseHero
        project={entry}
        eyebrow={
          <>
            Community · <span className="text-accent">{club.role}</span>
          </>
        }
        cover={<Media src={club.cover} alt="Club Infin8" eager sizes="100vw" label="Club Infin8 — cover" />}
      />

      <CaseSection n={idx()} title="The idea" theme="paper">
        <Reveal as="p" className="max-w-[30ch] text-[clamp(26px,2.8vw,48px)] font-medium leading-[1.1] tracking-[-0.02em]">
          {club.idea}
        </Reveal>
        <p className="label mt-8 text-muted">{club.tagline}</p>
      </CaseSection>

      <CaseSection n={idx()} title="The structure" theme="paper">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <figure className="lg:col-span-7">
            <EcosystemAnimated clubs={club.clubs} />
            <figcaption className="label mt-6 text-muted">Fig. — Eight clubs, one core</figcaption>
          </figure>
          <ol className="self-center border-t border-fg lg:col-span-5">
            {club.clubs.map((c, i) => (
              <li key={c} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-line py-3">
                <span className="label tnum text-accent">{pad(i + 1)}</span>
                <span className="display text-[clamp(24px,2.1vw,36px)] leading-[0.95]">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </CaseSection>

      <CaseSection n={idx()} title="The people" theme="paper">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <p className="display tnum text-[clamp(84px,12.5vw,240px)] leading-[0.78] lg:col-span-8">
            <CountUp value={members.value} prefix={members.prefix} />
          </p>
          <div className="lg:col-span-4 lg:pb-6">
            <p className="display text-[clamp(32px,3vw,56px)] leading-[0.9]">{members.label}</p>
            <p className="mt-3 text-[17px] text-muted">{members.note} — spread across eight clubs with very different jobs.</p>
          </div>
        </div>
      </CaseSection>

      <CaseSection n={idx()} title="The scale" theme="paper">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <p className="display tnum text-[clamp(84px,12.5vw,240px)] leading-[0.78] lg:col-span-8">
            <CountUp value={students.value} prefix={students.prefix} />
          </p>
          <div className="lg:col-span-4 lg:pb-6">
            <p className="display text-[clamp(32px,3vw,56px)] leading-[0.9]">{students.label}</p>
            <p className="mt-3 text-[17px] text-muted">
              {students.note}. {clubs.value} {clubs.label.toLowerCase()}, {clubs.note.toLowerCase()}.
            </p>
          </div>
        </div>
      </CaseSection>

      <CaseSection n={idx()} title="The operations" theme="paper">
        <p className="max-w-[40ch] text-[clamp(22px,2vw,32px)] font-medium leading-snug">{club.opsNote}</p>
        <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {club.operations.map((op, i) => (
            <li key={op} className="flex min-h-[130px] flex-col justify-between gap-6 bg-bg p-5">
              <span className="label tnum text-accent">O{pad(i + 1)}</span>
              <span className="display text-[clamp(24px,2vw,34px)] leading-[0.92]">{op}</span>
            </li>
          ))}
        </ul>
      </CaseSection>

      <CaseSection n={idx()} title="The technology" theme="ink">
        <p className="max-w-[24ch] text-[clamp(30px,3.6vw,64px)] font-medium leading-[1.02] tracking-[-0.02em]">{club.peopleLine}</p>
        <ul className="mt-10 flex flex-wrap gap-1.5">
          {club.systems.map((x) => (
            <li key={x} className="label border border-line px-2.5 py-1.5">
              {x}
            </li>
          ))}
        </ul>
        <TransitionLink
          href="/work/infin8-access"
          transitionLabel="Infin8 Access"
          data-cursor="Open"
          className="group mt-12 grid items-center gap-6 border border-line p-6 transition-colors hover:border-accent md:grid-cols-[1fr_auto] md:p-8"
        >
          <span>
            <span className="label text-muted">The system behind it</span>
            <span className="display mt-2 block text-[clamp(44px,5.5vw,100px)] leading-[0.85]">Infin8 Access</span>
            <span className="mt-3 block max-w-lg text-muted">Campus permissions with QR identity verification and role-based workflows — built on Cloudflare Workers and D1.</span>
          </span>
          <span className="grid h-14 w-14 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
            <span className="arrow-nudge-x">→</span>
          </span>
        </TransitionLink>
      </CaseSection>

      <CaseSection n={idx()} title="The role" theme="paper">
        <p className="display-wide text-[clamp(36px,5.2vw,96px)] leading-[0.92]">{club.role}</p>
        <p className="label mt-4 flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
          {club.roleNote}
        </p>
        <ol className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {club.stages.map((st, i) => (
            <li key={st.label} className="flex min-h-[170px] flex-col justify-between gap-6 bg-bg p-5">
              <span className="label tnum text-muted">{pad(i + 1)}</span>
              <span>
                <span className="display block text-[clamp(32px,2.8vw,50px)] leading-[0.9]">
                  {st.label}
                  {i < club.stages.length - 1 ? <span className="text-accent"> →</span> : null}
                </span>
                <span className="mt-2 block text-[15px] text-muted">{st.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </CaseSection>

      <CaseSection n={idx()} title="In pictures" theme="paper">
        <div className="grid gap-6 md:grid-cols-3">
          {club.photos.map((ph) => (
            <figure key={ph.image}>
              <div className="relative aspect-[4/5] overflow-hidden border border-line">
                <Media src={ph.image} alt={`Club Infin8 — ${ph.caption}`} sizes="(min-width: 768px) 33vw, 100vw" label={ph.caption} />
              </div>
              <figcaption className="label mt-3 text-muted">{ph.caption}</figcaption>
            </figure>
          ))}
        </div>
      </CaseSection>

      <section data-theme="ink" data-index={pad(n + 1)} data-label="Next" aria-label="Next" className="relative">
        <TransitionLink href="/work/infin8-access" transitionLabel="Infin8 Access" data-cursor="Next" className="group block border-t border-line px-gutter pb-[14vh] pt-[12vh]">
          <span className="label flex justify-between text-muted">
            <span>Next — the system</span>
            <span>Product · Access & permissions</span>
          </span>
          <span className="display mt-8 block text-[clamp(64px,12vw,240px)] leading-[0.82] transition-[font-variation-settings] duration-700 ease-[var(--ease-expo)] group-hover:[--wdth:76]">
            Infin8 Access<span className="arrow-nudge-x ml-[0.15em] text-accent">→</span>
          </span>
        </TransitionLink>
      </section>

      <ScrollDirector total={n + 1} />
    </main>
  );
}
