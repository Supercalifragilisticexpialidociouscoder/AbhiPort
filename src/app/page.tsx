import { About } from "@/components/About";
import { BeyondCode } from "@/components/BeyondCode";
import { Contact } from "@/components/Contact";
import { CurrentlyBuilding } from "@/components/CurrentlyBuilding";
import { Footer } from "@/components/Footer";
import { Hackathons } from "@/components/Hackathons";
import { Hero } from "@/components/Hero";
import { Lab } from "@/components/Lab";
import { Projects } from "@/components/Projects";
import { ScrollDirector } from "@/components/ScrollDirector";
import { Statement } from "@/components/Statement";
import { Timeline } from "@/components/Timeline";
import { Media } from "@/components/ui/Media";
import { projects } from "@/content/projects";
import { about, beyond, hero, site } from "@/content/site";
import { resolveAsset } from "@/lib/assets";
import { siteUrl } from "@/lib/site-url";

export default function Home() {
  // Media is resolved on the server: real files in /public win, otherwise
  // a labelled placeholder frame renders in their place.
  const covers = Object.fromEntries(
    projects
      .filter((p) => resolveAsset(p.cover))
      .map((p) => [p.slug, <Media key={p.slug} src={p.cover} alt={p.coverAlt} sizes="(min-width: 1024px) 45vw, 100vw" />]),
  );
  const frames = beyond.frames.map((f) => (
    <Media key={f.tag} src={f.image} alt={`${f.tag} — Abhi, off-track`} sizes="(min-width: 1024px) 30vw, 75vw" label={f.tag} compact />
  ));

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    alternateName: [site.name, site.short],
    url: siteUrl,
    description: site.seo.description,
    homeLocation: { "@type": "Country", name: site.location },
    knowsAbout: ["Software engineering", "Full-stack development", "Embedded systems", "Cloud", "AI / ML", "Remote sensing"],
    email: site.email ? `mailto:${site.email}` : undefined,
    sameAs: [site.links.github, site.links.linkedin].filter(Boolean),
  };

  return (
    <>
      <main id="main">
        <Hero portrait={<Media src={hero.image} alt={hero.imageAlt} eager glow sizes="100vw" />} />
        <About portrait={<Media src={about.portrait} alt={about.portraitAlt} sizes="(min-width: 1024px) 33vw, 100vw" label="Portrait" />} />
        <Statement />
        <Projects covers={covers} />
        <Lab />
        <Hackathons />
        <Timeline />
        <CurrentlyBuilding />
        <BeyondCode media={frames} />
        <Contact />
        <ScrollDirector total={9} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    </>
  );
}
