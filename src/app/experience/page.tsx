import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { TransitionLink } from "@/components/PageTransition";
import { RoomHero } from "@/components/room/RoomHero";
import { ScrollDirector } from "@/components/ScrollDirector";
import { Known } from "@/components/ui/Ph";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { experiencePage, roles } from "@/content/community";
import { isExternal, projectHref, projects } from "@/content/projects";
import { site } from "@/content/site";
import { publicFile } from "@/lib/assets";
import { pad } from "@/lib/cn";

const description = `${site.name}'s experience: founding member and head of Club Infin8, software in daily use by real business owners, and a dated record of what he's built.`;

export const metadata: Metadata = {
  title: "Experience",
  description,
  alternates: { canonical: "/experience" },
  openGraph: { type: "website", url: "/experience", title: `Experience — ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `Experience — ${site.name}`, description },
};

const monthName = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
};

export default function ExperiencePage() {
  // Receipts: every project with a first commit, in order.
  const dated = projects.filter((p) => p.created).sort((a, b) => a.created!.localeCompare(b.created!) || a.number.localeCompare(b.number));
  const byYear = dated.reduce<Record<string, typeof dated>>((acc, p) => {
    const y = p.created!.slice(0, 4);
    (acc[y] ??= []).push(p);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort();

  return (
    <>
      <main id="main">
        <RoomHero
          room="Room 10 ·"
          path="/experience"
          title={["Experience."]}
          lead={experiencePage.lead}
          back={{ href: "/#about", label: "Home" }}
          stats={[
            { v: pad(roles.length), k: "Roles" },
            { v: pad(dated.length), k: "Dated builds" },
            { v: pad(years.length), k: years.length ? `Years on record · ${years[0]}–${years[years.length - 1]}` : "Years on record" },
          ]}
        >
          <p className="label mt-10 max-w-2xl text-muted">{experiencePage.note}</p>
        </RoomHero>

        <section data-theme="ink" data-index="01" data-label="Roles" aria-labelledby="roles-title" className="relative px-gutter py-[10vh]">
          <SectionHead index="01" title="Roles" aside="What I do, not just what I've made" />
          <h2 id="roles-title" className="sr-only">
            Roles
          </h2>
          <ol className="mt-8 border-t border-fg">
            {roles.map((r, i) => {
              const body = (
                <>
                  <span className="label tnum pt-2 text-accent">R{pad(i + 1)}</span>
                  <span>
                    <span className="display block text-[clamp(36px,4vw,72px)] leading-[0.88]">{r.title}</span>
                    <span className="label mt-3 block">{r.org}</span>
                  </span>
                  <span className="max-w-[40ch] text-[16px] leading-snug text-muted">{r.note}</span>
                  <span className="label text-muted lg:text-right">
                    <Known value={r.when} todo="Add dates" />
                  </span>
                </>
              );
              return (
                <Reveal as="li" key={r.title + r.org} className="border-b border-line">
                  {r.href ? (
                    <TransitionLink href={r.href} transitionLabel={r.org} className="group grid gap-4 py-8 lg:grid-cols-[4rem_1.2fr_1fr_10rem] lg:items-baseline lg:gap-6">
                      {body}
                    </TransitionLink>
                  ) : (
                    <div className="grid gap-4 py-8 lg:grid-cols-[4rem_1.2fr_1fr_10rem] lg:items-baseline lg:gap-6">{body}</div>
                  )}
                </Reveal>
              );
            })}
          </ol>
        </section>

        <section data-theme="garage" data-index="02" data-label="Receipts" aria-labelledby="receipts-title" className="relative px-gutter py-[10vh]">
          <SectionHead index="02" title="Receipts" aside="Dated by the first commit" />
          <h2 id="receipts-title" className="display mt-8 text-[clamp(64px,10vw,190px)] leading-[0.82]">
            In commit order<span className="text-accent">.</span>
          </h2>
          {years.map((y) => (
            <div key={y} className="mt-12 grid gap-6 lg:grid-cols-12">
              <p className="display hollow text-[clamp(72px,9vw,160px)] leading-[0.8] lg:col-span-3">{y}</p>
              <ol className="border-t border-fg lg:col-span-9">
                {byYear[y].map((p) => {
                  const href = projectHref(p);
                  const inner = (
                    <>
                      <span className="label tnum text-accent">{monthName(p.created!)}</span>
                      <span>
                        <span className="display block text-[clamp(26px,2.6vw,44px)] leading-[0.9] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">{p.title}</span>
                        <span className="mt-1 block text-[15px] text-muted">{p.origin ?? p.category}</span>
                      </span>
                      <span className="label hidden text-muted md:block">{p.status ?? ""}</span>
                    </>
                  );
                  return (
                    <li key={p.slug} className="border-b border-line">
                      {href && !isExternal(href) ? (
                        <TransitionLink href={href} transitionLabel={p.title} className="group grid grid-cols-[4rem_1fr] items-baseline gap-4 py-4 md:grid-cols-[4rem_1fr_8rem]">
                          {inner}
                        </TransitionLink>
                      ) : href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[4rem_1fr] items-baseline gap-4 py-4 md:grid-cols-[4rem_1fr_8rem]">
                          {inner}
                        </a>
                      ) : (
                        <div className="grid grid-cols-[4rem_1fr] items-baseline gap-4 py-4 md:grid-cols-[4rem_1fr_8rem]">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
          {site.links.linkedin ? (
            <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="group mt-16 flex flex-wrap items-center justify-between gap-6 border-y border-line py-6">
              <span className="display text-[clamp(32px,3.6vw,64px)] leading-[0.9]">
                The full CV is on LinkedIn <span className="arrow-nudge text-accent">↗</span>
              </span>
              <span className="label max-w-sm text-muted">Roles with dates, as they get added.</span>
            </a>
          ) : null}
        </section>
        <ScrollDirector total={2} />
      </main>
      <Footer cvHref={publicFile(site.cv)} />
    </>
  );
}
