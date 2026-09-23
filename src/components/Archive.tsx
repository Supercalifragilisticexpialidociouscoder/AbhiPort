"use client";

import { useRef } from "react";
import { archive, sections } from "@/content/site";
import { CATEGORIES, projects } from "@/content/projects";
import { labEntries } from "@/content/lab";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { SectionHead } from "./ui/SectionHead";

/**
 * 10 — The archive, as a door. The home page stays curated: a ticker of
 * everything that's been filed, a few counts, and the way in. The index
 * itself — filters, search, every entry — lives at /archive.
 */
export function Archive() {
  const root = useRef<HTMLElement>(null);
  const s = sections.archive;
  const titles = [...projects].sort((a, b) => a.number.localeCompare(b.number)).map((p) => p.title);
  const years = projects.map((p) => p.year ?? p.created?.slice(0, 4)).filter((y): y is string => Boolean(y) && /^\d{4}$/.test(y!)).sort();
  const span = years.length ? (years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`) : null;
  const cats = CATEGORIES.filter((c) => projects.some((p) => p.categories.includes(c)));

  const stats = [
    { v: pad(projects.length), k: "Entries in the archive" },
    { v: pad(labEntries.length), k: "Builds in the lab" },
    { v: pad(cats.length), k: "Categories" },
    { v: span ?? "—", k: "Years with receipts" },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-ar-line]"),
          { yPercent: 105, y: 0 },
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: q("[data-ar-title]")[0], start: "top 85%", once: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={s.id}
      data-theme="paper"
      data-index={s.index}
      data-label={s.label}
      aria-labelledby="archive-title"
      className="relative overflow-hidden px-gutter pb-[14vh] pt-[16vh]"
    >
      <SectionHead index={s.index} title="The archive" aside={`${pad(projects.length)} entries · /archive`} />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <h2 id="archive-title" data-ar-title className="display text-[clamp(72px,12vw,230px)] lg:col-span-7">
          <span className="mask">
            <span data-ar-line className="block">
              The
            </span>
          </span>
          <span className="mask">
            <span data-ar-line className="block">
              archive<span className="text-accent">.</span>
            </span>
          </span>
        </h2>
        <p className="max-w-md self-end text-[clamp(18px,1.4vw,22px)] leading-snug text-muted lg:col-span-5">{archive.door}</p>
      </div>

      {/* Everything that's been filed, running past. */}
      <div aria-hidden className="archive-ticker -mx-gutter mt-14 border-y border-fg py-5">
        <div className="archive-ticker-track flex w-max">
          {[...titles, ...titles].map((t, i) => (
            <span key={i} className={`display whitespace-nowrap pr-10 text-[clamp(40px,5vw,96px)] leading-[0.9] ${i % 2 ? "hollow" : ""}`}>
              {t}
              <span className="text-accent"> /</span>
            </span>
          ))}
        </div>
      </div>

      <dl className="mt-10 grid grid-cols-2 border-b border-line md:grid-cols-4">
        {stats.map((st) => (
          <div key={st.k} className="flex flex-col gap-2 py-5 pr-4 md:border-r md:border-line md:pl-4 md:first:pl-0 md:last:border-r-0">
            <dt className="label order-2 text-muted">{st.k}</dt>
            <dd className="display tnum order-1 text-[clamp(44px,5vw,92px)] leading-[0.8]">{st.v}</dd>
          </div>
        ))}
      </dl>

      <TransitionLink
        href="/archive"
        transitionLabel="Archive"
        data-cursor="Open"
        className="group mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <span className="display text-[clamp(56px,8.6vw,170px)] leading-[0.84]">
          Open the archive
          <span className="arrow-nudge-x ml-[0.12em] text-accent">→</span>
        </span>
        <span className="label max-w-xs text-muted md:pb-4">Filter it, search it, open anything. {cats.slice(0, 5).join(" · ")} and more.</span>
      </TransitionLink>

      {/* The one thing the index leaves out, on purpose. */}
      <p className="mt-10 flex max-w-2xl items-baseline gap-3 text-[15px] leading-relaxed text-muted">
        <span aria-hidden className="label text-accent">
          *
        </span>
        {archive.offList}
      </p>
    </section>
  );
}
