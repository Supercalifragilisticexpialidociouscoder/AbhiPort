import type { Metadata } from "next";
import { ArchiveIndex } from "@/components/archive/ArchiveIndex";
import { Footer } from "@/components/Footer";
import { RoomHero } from "@/components/room/RoomHero";
import { ScrollDirector } from "@/components/ScrollDirector";
import { archive, site } from "@/content/site";
import { CATEGORIES, projects } from "@/content/projects";
import { publicFile } from "@/lib/assets";
import { pad } from "@/lib/cn";

const description = `Everything ${site.name} has built: ${projects.length} projects, prototypes, hackathon builds, experiments and learning projects — filterable and searchable.`;

export const metadata: Metadata = {
  title: "Archive",
  description,
  alternates: { canonical: "/archive" },
  openGraph: { type: "website", url: "/archive", title: `Archive — ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `Archive — ${site.name}`, description },
};

export default function ArchivePage() {
  const withPages = projects.filter((p) => p.study || p.file).length;
  const years = projects
    .map((p) => p.year ?? p.created?.slice(0, 4))
    .filter((y): y is string => Boolean(y))
    .sort();
  const cats = CATEGORIES.filter((c) => projects.some((p) => p.categories.includes(c)));

  return (
    <>
      <main id="main">
        <RoomHero
          room="Room 03 ·"
          path="/archive"
          title={["The", "archive."]}
          lead={archive.lead}
          theme="paper"
          back={{ href: "/#archive", label: "Home" }}
          stats={[
            { v: pad(projects.length), k: "Entries" },
            { v: pad(withPages), k: "With their own page" },
            { v: pad(cats.length), k: "Categories" },
            { v: pad(new Set(years).size), k: years.length ? `Years on record · ${years[0]}–${years[years.length - 1]}` : "Years on record" },
          ]}
        />
        <section data-theme="paper" data-index="01" data-label="Index" aria-label="The index" className="relative px-gutter pb-[14vh]">
          <ArchiveIndex />
        </section>
        <ScrollDirector total={1} />
      </main>
      <Footer cvHref={publicFile(site.cv)} />
    </>
  );
}
