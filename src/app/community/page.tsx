import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { TransitionLink } from "@/components/PageTransition";
import { RoomHero } from "@/components/room/RoomHero";
import { ScrollDirector } from "@/components/ScrollDirector";
import { Media } from "@/components/ui/Media";
import { Known, Ph } from "@/components/ui/Ph";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { communityPage, credentials, events, hackathons, learning, sih, workshops, type CommunityEntry } from "@/content/community";
import { getProject } from "@/content/projects";
import { club, site } from "@/content/site";
import { publicFile } from "@/lib/assets";
import { cn, pad } from "@/lib/cn";

const description = `Where ${site.name} builds in public: 2× SIH Internal Hackathon Winner, the OpenAI Codex Community Hackathon, a Microsoft hackathon, AI-THON2K25, GDG DevFest 2025, the Google AI Agents Workshop and more.`;

export const metadata: Metadata = {
  title: "Community & learning",
  description,
  alternates: { canonical: "/community" },
  openGraph: { type: "website", url: "/community", title: `Community & learning — ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `Community & learning — ${site.name}`, description },
};

/** One row of the record: an event, what happened, what got built, and the photo. */
function Entry({ e, i }: { e: CommunityEntry; i: number }) {
  const built = e.built ? getProject(e.built) : undefined;
  return (
    <li className={cn("grid gap-6 border-b border-line py-8 lg:grid-cols-12 lg:gap-6", e.lead ? "lg:py-12" : "")}>
      <div className="flex flex-col gap-4 lg:col-span-7">
        <p className="label flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="tnum text-accent">{pad(i + 1)}</span>
          <span className="border border-line px-2 py-1">{e.kind}</span>
          <span className="text-muted">
            <Known value={e.date} todo="Add date" />
            {e.where ? ` · ${e.where}` : ""}
          </span>
        </p>
        <h3 className={cn("display leading-[0.88]", e.lead ? "text-[clamp(44px,5vw,92px)]" : "text-[clamp(32px,3.2vw,56px)]")}>{e.name}</h3>
        {e.note ? <p className="max-w-[46ch] text-[clamp(17px,1.4vw,21px)] leading-snug text-muted">{e.note}</p> : <Ph>Add — what it was, and what you did there</Ph>}
        <div className="label mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          {e.kind === "Hackathon" ? (
            <span>
              <span className="text-muted">Result · </span>
              <span className={e.result ? "text-accent" : undefined}>
                <Known value={e.result} todo="Add result" />
              </span>
            </span>
          ) : null}
          {built ? (
            <TransitionLink href={`/work/${built.slug}`} transitionLabel={built.title} className="group inline-flex items-center gap-2">
              <span className="text-muted">Built ·</span>
              <span className="link-line">{built.title}</span>
              <span className="arrow-nudge-x text-accent">→</span>
            </TransitionLink>
          ) : e.kind === "Hackathon" ? (
            <span>
              <span className="text-muted">Built · </span>
              <Ph>Add what you built</Ph>
            </span>
          ) : null}
        </div>
      </div>
      <figure className="lg:col-span-5">
        <div className={cn("relative overflow-hidden border border-line", e.lead ? "aspect-[4/3]" : "aspect-[16/9]")}>
          <Media src={e.photo} alt={`${e.name} — photo`} sizes="(min-width: 1024px) 40vw, 100vw" label={e.name} compact={!e.lead} />
        </div>
      </figure>
    </li>
  );
}

export default function CommunityPage() {
  const photos = [
    ...sih.photos.map((p) => ({ image: p.image, caption: p.caption })),
    ...[...hackathons, ...events, ...workshops].map((e) => ({ image: e.photo, caption: e.name })),
  ];
  let n = 0;
  const idx = () => pad(++n);

  return (
    <>
      <main id="main">
        <RoomHero
          room="Room 08 ·"
          path="/community"
          title={["Community", "& learning."]}
          lead={communityPage.lead}
          back={{ href: "/#community", label: "Home" }}
          stats={[
            { v: sih.value, k: "SIH internal wins" },
            { v: pad(hackathons.length + 1), k: "Hackathons" },
            { v: pad(events.length), k: "Events & communities" },
            { v: pad(workshops.length), k: "Workshops" },
          ]}
        >
          <p className="label mt-10 max-w-2xl text-muted">{communityPage.note}</p>
        </RoomHero>

        {/* The credential — told once, here */}
        <section id="sih" data-theme="garage" data-index={idx()} data-label="2× SIH" aria-labelledby="sih-title" className="relative scroll-mt-16 px-gutter py-[12vh]">
          <SectionHead index={pad(n)} title="Smart India Hackathon" aside="Internal hackathon · won twice" />
          <div className="mt-10 grid items-end gap-6 border-b border-fg pb-8 lg:grid-cols-12">
            <p className="display tnum text-[clamp(160px,24vw,440px)] leading-[0.76] text-accent lg:col-span-5">{sih.value}</p>
            <div className="lg:col-span-7 lg:pb-4">
              <h2 id="sih-title" className="display text-[clamp(44px,5.4vw,104px)] leading-[0.86]">
                {sih.label}
              </h2>
              <p className="label mt-4 text-muted">{sih.note}</p>
            </div>
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="max-w-[52ch] text-[clamp(17px,1.4vw,21px)] leading-relaxed text-muted">{sih.body}</p>
              <ul className="mt-8 border-t border-line">
                {sih.statements.map((ps) => {
                  const inner = (
                    <>
                      <span className="label tnum text-accent">{ps.code}</span>
                      <span className="text-[18px] font-medium">{ps.title}</span>
                      <span className="label text-muted">{[ps.org, ps.concept].filter(Boolean).join(" · ")}</span>
                    </>
                  );
                  return (
                    <li key={ps.code + ps.title} className="border-b border-line">
                      {ps.href ? (
                        <TransitionLink href={ps.href} transitionLabel={ps.concept ?? ps.title} className="group grid gap-1 py-4 md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-4">
                          {inner}
                        </TransitionLink>
                      ) : (
                        <div className="grid gap-1 py-4 md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-4">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6">
                <Ph>Add dates and which statements won</Ph>
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-5">
              {sih.photos.map((p) => (
                <figure key={p.image}>
                  <div className="relative aspect-[4/3] overflow-hidden border border-line">
                    <Media src={p.image} alt={p.caption} sizes="(min-width: 1024px) 40vw, 100vw" label={p.caption} />
                  </div>
                  <figcaption className="label mt-2 text-muted">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="hackathons" data-theme="ink" data-index={idx()} data-label="Hackathons" aria-labelledby="hack-title" className="relative scroll-mt-16 px-gutter py-[12vh]">
          <SectionHead index={pad(n)} title="Hackathons" aside="Built against a clock" />
          <h2 id="hack-title" className="display mt-8 text-[clamp(64px,10vw,190px)] leading-[0.82]">
            Race weekends<span className="text-accent">.</span>
          </h2>
          <ol className="mt-8 border-t border-fg">
            {hackathons.map((e, i) => (
              <Entry key={e.slug} e={e} i={i} />
            ))}
          </ol>
        </section>

        <section id="events" data-theme="paper" data-index={idx()} data-label="Events" aria-labelledby="events-title" className="relative scroll-mt-16 px-gutter py-[12vh]">
          <SectionHead index={pad(n)} title="Events & workshops" aside="Rooms full of people building" />
          <h2 id="events-title" className="display mt-8 text-[clamp(64px,10vw,190px)] leading-[0.82]">
            In the room<span className="text-accent">.</span>
          </h2>
          <ol className="mt-8 border-t border-fg">
            {[...events, ...workshops].map((e, i) => (
              <Entry key={e.slug} e={e} i={i} />
            ))}
          </ol>
        </section>

        <section id="learning" data-theme="ink" data-index={idx()} data-label="Learning" aria-labelledby="learning-title" className="relative scroll-mt-16 px-gutter py-[12vh]">
          <SectionHead index={pad(n)} title="Learning" aside="Shows up as work, not as a badge" />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-5">
              <p className="label text-muted">Currently learning</p>
              <h2 id="learning-title" className="display mt-3 text-[clamp(48px,6vw,110px)] leading-[0.84]">
                {learning.now}
                <span className="text-accent">.</span>
              </h2>
            </div>
            <ul className="border-t border-fg lg:col-span-7">
              {learning.lines.map((l) => (
                <li key={l.k} className="border-b border-line">
                  {l.href ? (
                    <TransitionLink href={l.href} transitionLabel={l.k} className="group grid gap-2 py-5 md:grid-cols-[14rem_1fr_auto] md:items-baseline md:gap-6">
                      <span className="label text-accent">{l.k}</span>
                      <span className="text-[17px] leading-snug">{l.v}</span>
                      <span className="arrow-nudge-x hidden text-accent md:inline-block">→</span>
                    </TransitionLink>
                  ) : (
                    <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr_auto] md:items-baseline md:gap-6">
                      <span className="label text-accent">{l.k}</span>
                      <span className="text-[17px] leading-snug">{l.v}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="achievements" data-theme="garage" data-index={idx()} data-label="Achievements" aria-labelledby="ach-title" className="relative scroll-mt-16 px-gutter py-[12vh]">
          <SectionHead index={pad(n)} title="Achievements" aside="The short list" />
          <h2 id="ach-title" className="sr-only">
            Achievements
          </h2>
          <ul className="mt-10 grid gap-px border border-line bg-line md:grid-cols-3">
            {[
              { v: sih.value, k: sih.label, href: "/community#sih", label: "The story" },
              { v: "Head", k: `${club.role} — ${club.name}, across all ${club.clubs.length} clubs`, href: "/club-infin8", label: "Enter the ecosystem" },
              { v: pad(credentials.length), k: "Credentials, filed after the work", href: "/credentials", label: "The paperwork" },
            ].map((a) => (
              <li key={a.k} className="bg-bg">
                <TransitionLink href={a.href} transitionLabel={a.label} className="group flex h-full min-h-[260px] flex-col justify-between gap-8 p-6">
                  <span className="display tnum text-[clamp(64px,7vw,128px)] leading-[0.8] text-accent">{a.v}</span>
                  <span>
                    <span className="block text-[18px] leading-snug">{a.k}</span>
                    <span className="label mt-4 inline-flex items-center gap-2">
                      <span className="link-line">{a.label}</span>
                      <span className="arrow-nudge-x text-accent">→</span>
                    </span>
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </section>

        <section id="photos" data-theme="ink" data-index={idx()} data-label="Photographs" aria-labelledby="photos-title" className="relative scroll-mt-16 px-gutter py-[12vh]">
          <SectionHead index={pad(n)} title="Photographs" aside="The real ones — no stock" />
          <h2 id="photos-title" className="display mt-8 text-[clamp(64px,10vw,190px)] leading-[0.82]">
            Proof<span className="text-accent">.</span>
          </h2>
          <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {photos.map((p, i) => (
              <li key={p.image} className="mb-4 break-inside-avoid">
                <Reveal as="figure">
                  <div className={cn("relative overflow-hidden border border-line", i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-[4/3]" : "aspect-square")}>
                    <Media src={p.image} alt={p.caption} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" label={p.caption} compact />
                  </div>
                  <figcaption className="label mt-2 text-muted">{p.caption}</figcaption>
                </Reveal>
              </li>
            ))}
          </ul>
          {site.links.linkedin ? (
            <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="group mt-12 flex flex-wrap items-center justify-between gap-6 border-y border-line py-6">
              <span className="display text-[clamp(32px,3.6vw,64px)] leading-[0.9]">
                View LinkedIn <span className="arrow-nudge text-accent">↗</span>
              </span>
              <span className="label max-w-sm text-muted">Posts, event photos and the long version of all of this.</span>
            </a>
          ) : null}
        </section>

        <ScrollDirector total={n} />
      </main>
      <Footer cvHref={publicFile(site.cv)} />
    </>
  );
}
