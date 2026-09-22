import { About } from "@/components/About";
import { Archive } from "@/components/Archive";
import { BeyondCode } from "@/components/BeyondCode";
import { Community } from "@/components/Community";
import { Contact } from "@/components/Contact";
import { CurrentlyBuilding } from "@/components/CurrentlyBuilding";
import { Footer } from "@/components/Footer";
import { Hackathons } from "@/components/Hackathons";
import { Hero } from "@/components/Hero";
import { HowIBuild } from "@/components/HowIBuild";
import { Lab } from "@/components/Lab";
import { Projects } from "@/components/Projects";
import { ScrollDirector } from "@/components/ScrollDirector";
import { ShortVersion } from "@/components/ShortVersion";
import { Statement } from "@/components/Statement";
import { Timeline } from "@/components/Timeline";
import { Media } from "@/components/ui/Media";
import { featuredProjects } from "@/content/projects";
import { about, beyond, club, hero, races, SECTION_TOTAL, site } from "@/content/site";
import { publicFile, resolveAsset } from "@/lib/assets";
import { siteUrl } from "@/lib/site-url";

export default function Home() {
  const cvHref = publicFile(site.cv);

  // Media is resolved on the server: real files in /public win, otherwise
  // a labelled placeholder frame renders in their place.
  const covers = Object.fromEntries(
    featuredProjects
      .filter((p) => p.cover && resolveAsset(p.cover))
      .map((p) => [p.slug, <Media key={p.slug} src={p.cover!} alt={p.coverAlt ?? p.title} sizes="(min-width: 1024px) 45vw, 100vw" />]),
  );
  // A cut-out hero stands on the stage; a regular photo (or none yet) fills it.
  const heroCutout = hero.cutout && Boolean(resolveAsset(hero.image));
  const heroPortrait = heroCutout ? (
    <Media src={hero.image} alt={hero.imageAlt} eager fit="contain" className="object-bottom" sizes="(min-aspect-ratio: 1/1) 85vh, 110vw" />
  ) : (
    <Media src={hero.image} alt={hero.imageAlt} eager glow sizes="100vw" />
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
    email: site.email ? `mailto:${site.email}` : undefined,
    homeLocation: { "@type": "Country", name: site.location },
    award: `${races.credential.value} Smart India Hackathon (SIH) Internal Hackathon Winner`,
    memberOf: { "@type": "Organization", name: club.name, description: club.tagline },
    knowsAbout: ["Software engineering", "Full-stack development", "Embedded systems", "Cloud", "AI / ML", "Remote sensing", "Security"],
    sameAs: [site.links.github, site.links.linkedin, site.links.instagram].filter(Boolean),
  };

  return (
    <>
      <main id="main">
        <Hero portrait={heroPortrait} cutout={heroCutout} focus={hero.focus} />
        <ShortVersion cvHref={cvHref} />
        <About portrait={<Media src={about.portrait} alt={about.portraitAlt} sizes="(min-width: 1024px) 33vw, 100vw" label="Portrait" />} />
        <Statement />
        <Projects covers={covers} />
        <Community />
        <Hackathons />
        <Lab />
        <HowIBuild />
        <Timeline />
        <Archive />
        <CurrentlyBuilding />
        <BeyondCode media={frames} />
        <Contact cvHref={cvHref} />
        <ScrollDirector total={SECTION_TOTAL} />
      </main>
      <Footer cvHref={cvHref} variant="finale" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    </>
  );
}
