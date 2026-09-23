import type { MetadataRoute } from "next";
import { labEntries } from "@/content/lab";
import { projectPages } from "@/content/projects";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const room = (path: string, priority = 0.8) => ({ url: `${siteUrl}${path}`, changeFrequency: "monthly" as const, priority });
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    room("/archive", 0.9),
    room("/lab"),
    room("/club-infin8"),
    room("/community"),
    room("/credentials", 0.6),
    room("/experience", 0.7),
    ...projectPages.map((p) => room(`/work/${p.slug}`, p.study ? 0.8 : 0.6)),
    ...labEntries.map((e) => room(`/lab/${e.slug}`, e.status === "Prototype" ? 0.8 : 0.5)),
  ];
}
