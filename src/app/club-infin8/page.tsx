import type { Metadata } from "next";
import { ClubCaseStudy } from "@/components/ClubCaseStudy";
import { Footer } from "@/components/Footer";
import { club, site } from "@/content/site";
import { publicFile } from "@/lib/assets";

const description = `${club.name}: a student-led ecosystem of ${club.clubs.length} clubs on a ~3,500-student campus. ${site.name} is a founding member and head across all eight.`;

export const metadata: Metadata = {
  title: club.name,
  description,
  alternates: { canonical: "/club-infin8" },
  openGraph: { type: "article", url: "/club-infin8", title: `${club.name} — ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `${club.name} — ${site.name}`, description },
};

export default function ClubPage() {
  return (
    <>
      <ClubCaseStudy />
      <Footer cvHref={publicFile(site.cv)} />
    </>
  );
}
