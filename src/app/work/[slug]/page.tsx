import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";
import { caseStudies, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { publicFile } from "@/lib/assets";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const description = `${p.summary} ${p.tagline}`;
  return {
    title: p.title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${p.slug}`,
      title: `${p.title} — ${site.name}`,
      description,
    },
    twitter: { card: "summary_large_image", title: `${p.title} — ${site.name}`, description },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.study) notFound();
  return (
    <>
      <ProjectCaseStudy project={{ ...project, study: project.study }} />
      <Footer cvHref={publicFile(site.cv)} />
    </>
  );
}
