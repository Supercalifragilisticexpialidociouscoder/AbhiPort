import { renderOg, ogSize } from "@/lib/og";
import { caseStudies, getProject } from "@/content/projects";

export const alt = "Case study by Abhiram Reddy";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug) ?? caseStudies[0];
  return renderOg({
    kicker: `${p.kind === "research" ? "Research note" : "Case study"} ${p.number}`,
    aside: p.category,
    lines: p.titleLines,
    footer: p.tagline,
    paper: p.kind === "research",
  });
}
