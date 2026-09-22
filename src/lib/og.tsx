import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };

const INK = "#0b0b0a";
const PAPER = "#ecebe6";
const MUTED = "#8f8d86";
const IR = "#ff4521";

async function fonts() {
  const dir = join(process.cwd(), "node_modules/@fontsource/archivo/files");
  const [black, medium] = await Promise.all([
    readFile(join(dir, "archivo-latin-900-normal.woff")),
    readFile(join(dir, "archivo-latin-500-normal.woff")),
  ]);
  return [
    { name: "Archivo", data: black, weight: 900 as const, style: "normal" as const },
    { name: "Archivo", data: medium, weight: 500 as const, style: "normal" as const },
  ];
}

/** The shared social card: kicker, giant stacked title, footer line. */
export async function renderOg({
  kicker,
  lines,
  footer,
  aside,
  paper = false,
}: {
  kicker: string;
  lines: string[];
  footer: string;
  aside: string;
  paper?: boolean;
}) {
  const bg = paper ? PAPER : INK;
  const fg = paper ? INK : PAPER;
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.min(210, Math.floor(1020 / (longest * 0.74)));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          color: fg,
          padding: "56px 64px",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: MUTED }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 14, height: 14, background: IR }} />
            <span style={{ color: fg }}>{kicker}</span>
          </div>
          <span>{aside}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: size, lineHeight: 0.84, fontWeight: 900, textTransform: "uppercase", letterSpacing: -3 }}>
          {lines.map((l, i) => (
            <div key={l} style={{ display: "flex" }}>
              {l}
              {i === lines.length - 1 ? <span style={{ color: IR }}>.</span> : null}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 500, borderTop: `2px solid ${paper ? "rgba(11,11,10,0.2)" : "rgba(236,235,230,0.2)"}`, paddingTop: 22 }}>
          <span>{footer}</span>
          <span style={{ color: MUTED }}>ABHI / 26</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
