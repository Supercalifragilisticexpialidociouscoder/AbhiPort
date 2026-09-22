import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.seo.title,
    short_name: `${site.short} / ${site.edition.slice(2)}`,
    description: site.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0a",
    theme_color: "#0b0b0a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
