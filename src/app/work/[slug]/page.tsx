import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";
import { ProjectFile } from "@/components/ProjectFile";
import { getProject, projectPages } from "@/content/projects";
import { site } from "@/content/site";
import { publicFile } from "@/lib/assets";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectPages.map((p) => ({ slug: p.slug }));
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

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const cv = publicFile(site.cv);
  if (project.study) {
    return (
      <>
        <ProjectCaseStudy project={{ ...project, study: project.study }} />
        <Footer cvHref={cv} />
      </>
    );
  }
  if (project.file) {
    return (
      <>
        <ProjectFile project={{ ...project, file: project.file }} />
        <Footer cvHref={cv} />
      </>
    );
  }
  notFound();
}
