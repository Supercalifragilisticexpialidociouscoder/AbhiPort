import { renderOg, ogSize } from "@/lib/og";
import { getProject, projectPages } from "@/content/projects";

export const alt = "Case study by Abhiram Reddy";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projectPages.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug) ?? projectPages[0];
  return renderOg({
    kicker: `${p.kind === "research" ? "Research note" : p.study ? "Case study" : "Project file"} ${p.number}`,
    aside: p.category,
    lines: p.titleLines,
    footer: p.tagline,
    paper: p.kind === "research",
  });
}
