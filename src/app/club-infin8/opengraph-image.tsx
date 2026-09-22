import { renderOg, ogSize } from "@/lib/og";
import { club } from "@/content/site";

export const alt = "Club Infin8 — eight clubs, one ecosystem";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    kicker: `Community — ${club.role}`,
    aside: "8 clubs · ~200 members · ~3,500 students",
    lines: ["Club Infin8"],
    footer: club.tagline,
    paper: true,
  });
}
