import { renderOg, ogSize } from "@/lib/og";
import { site } from "@/content/site";

export const alt = site.seo.title;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    kicker: "Logbook — Edition 2026",
    aside: "Software × Hardware",
    lines: ["Abhiram", "Reddy"],
    footer: "Builder / Engineer / Creative Technologist — India",
  });
}
