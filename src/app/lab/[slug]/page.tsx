import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { LabPage } from "@/components/lab/LabPage";
import { getLabEntry, labEntries } from "@/content/lab";
import { site } from "@/content/site";
import { publicFile } from "@/lib/assets";

export const dynamicParams = false;

export function generateStaticParams() {
  return labEntries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = getLabEntry(slug);
  if (!e) return {};
  const description = `${e.title} — ${e.status.toLowerCase()} in ${site.name}'s lab. ${e.line}`;
  return {
    title: `${e.title} · Lab`,
    description,
    alternates: { canonical: `/lab/${e.slug}` },
    openGraph: { type: "article", url: `/lab/${e.slug}`, title: `${e.title} — ${site.name}`, description },
    twitter: { card: "summary_large_image", title: `${e.title} — ${site.name}`, description },
  };
}

export default async function LabEntryPage({ params }: PageProps<"/lab/[slug]">) {
  const { slug } = await params;
  const entry = getLabEntry(slug);
  if (!entry) notFound();
  return (
    <>
      <LabPage entry={entry} />
      <Footer cvHref={publicFile(site.cv)} />
    </>
  );
}
