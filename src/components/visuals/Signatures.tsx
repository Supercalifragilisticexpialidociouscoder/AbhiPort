import type { Project, Step } from "@/content/projects";
import { mulberry32 } from "@/lib/prng";
import { cn } from "@/lib/cn";

/**
 * Each project gets a "signature" — a small diagram built from what the
 * project actually is (its real flow, gate or pipeline). They're labelled
 * as illustrations: no fake screenshots, no invented numbers.
 */

export function Signature({ project, className }: { project: Project; className?: string }) {
  switch (project.visual) {
    case "approval":
      return <ApprovalChain steps={project.study?.flow.steps ?? []} className={className} />;
    case "terminal":
      return <CommitGate className={className} />;
    case "pixels":
      return <TrustFigure className={className} />;
  }
}

function Frame({ title, aside, className, children }: { title: string; aside: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative flex h-full flex-col border border-line p-4 md:p-5", className)}>
      <div className="label flex items-center justify-between gap-4 text-muted">
        <span>{title}</span>
        <span>{aside}</span>
      </div>
      {children}
    </div>
  );
}

/* ── 01 · Infin8 Access — the approval chain ─────────────────────────── */

export function ApprovalChain({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <Frame title="Request flow" aside="Illustration" className={className}>
      <ol className="relative mt-6 flex flex-1 flex-col justify-between gap-4">
        <span aria-hidden className="absolute bottom-6 left-[13px] top-6 w-px bg-line" />
        <span
          aria-hidden
          className="absolute bottom-6 left-[13px] top-6 w-px origin-top scale-y-0 bg-accent transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-y-100"
        />
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={s.label} className="relative flex items-center gap-4 md:gap-5">
              <span
                className="label relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-bg text-[10px] transition-colors duration-500 group-hover:border-accent group-hover:text-accent"
                style={{ transitionDelay: `${i * 160}ms` }}
              >
                {i + 1}
              </span>
              <div className="flex-1 border-b border-line pb-3">
                <div className="display text-[clamp(28px,2.7vw,48px)] leading-[0.9]">{s.label}</div>
                <div className="label mt-1.5 text-muted">{s.note}</div>
              </div>
              {last ? <QrGlyph className="h-12 w-12 shrink-0 text-fg md:h-14 md:w-14" /> : <span className="label text-muted">↓</span>}
            </li>
          );
        })}
      </ol>
    </Frame>
  );
}

/** A decorative QR-style mark (not a scannable code). */
export function QrGlyph({ className }: { className?: string }) {
  const n = 21;
  const rand = mulberry32(8);
  let d = "";
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      if (rand() > 0.52) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  const eye = (x: number, y: number) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} aria-hidden shapeRendering="crispEdges">
      <path d={eye(0, 0) + eye(n - 7, 0) + eye(0, n - 7)} fill="currentColor" fillRule="evenodd" />
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/* ── 02 · Secret Leak Detector — the commit gate ─────────────────────── */

export function CommitGate({ className }: { className?: string }) {
  return (
    <Frame title="Pre-commit" aside="Illustrative output" className={cn("font-mono", className)}>
      <div className="mt-5 flex-1 space-y-1.5 text-[12px] leading-relaxed md:text-[13px]">
        <p>
          <span className="text-muted">~/project $</span> git commit -m &quot;update config&quot;
        </p>
        <p className="text-muted">▸ leak-detector · scanning 3 staged files</p>
        <p>
          <span className="text-muted">  ✓</span> src/app/page.tsx
        </p>
        <p>
          <span className="text-muted">  ✓</span> README.md
        </p>
        <p className="flex flex-wrap items-center gap-x-3 text-accent">
          <span>  ✕ config/settings.ts:14</span>
          <span className="text-fg">possible API key</span>
          <span
            aria-label="redacted"
            className="inline-block h-[1em] w-28 bg-fg/80 transition-[width] duration-700 ease-[var(--ease-expo)] group-hover:w-36"
          />
        </p>
        <p className="pt-3 text-accent">✕ commit blocked — 1 finding</p>
        <p className="text-muted">  review it in the dashboard, rotate the key, try again.</p>
        <p className="pt-3">
          <span className="text-muted">~/project $</span> <span className="inline-block h-[1.05em] w-[0.6em] translate-y-[0.15em] animate-pulse bg-fg" />
        </p>
      </div>
      <div className="mt-5 grid grid-cols-3 border-t border-line pt-4 text-center">
        {["Stage", "Scan", "Block"].map((s, i) => (
          <div key={s} className={cn("label", i === 2 ? "text-accent" : "text-muted")}>
            {s}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ── 03 · CERTUS-S2 — the trust figure ───────────────────────────────── */

function cellsPath(cells: Array<[number, number]>, size: number) {
  return cells.map(([x, y]) => `M${x * size} ${y * size}h${size}v${size}h${-size}z`).join("");
}

export function TrustFigure({ className }: { className?: string }) {
  const rand = mulberry32(2);
  const C = 6;
  const F = 24;
  const k = F / C;
  const coarse = Array.from({ length: C * C }, () => 0.15 + rand() * 0.75);
  const LEVELS = 6;
  const q = (v: number) => Math.max(0, Math.min(LEVELS - 1, Math.floor(v * LEVELS)));

  const coarseLv: Array<Array<[number, number]>> = Array.from({ length: LEVELS }, () => []);
  coarse.forEach((v, i) => coarseLv[q(v)].push([i % C, Math.floor(i / C)]));

  const fineLv: Array<Array<[number, number]>> = Array.from({ length: LEVELS }, () => []);
  const flagged: Array<[number, number]> = [];
  for (let y = 0; y < F; y++) {
    for (let x = 0; x < F; x++) {
      const base = coarse[Math.floor(y / k) * C + Math.floor(x / k)];
      const detail = (rand() - 0.5) * 0.5;
      fineLv[q(base + detail)].push([x, y]);
      if (Math.abs(detail) > 0.21) flagged.push([x, y]);
    }
  }

  const panel = (title: string, body: React.ReactNode, note: string) => (
    <figure className="flex min-w-0 flex-col gap-2">
      <div className="label flex justify-between gap-2 whitespace-nowrap text-muted">
        <span>{title}</span>
        <span className="hidden xl:inline">{note}</span>
      </div>
      <svg viewBox="0 0 240 240" className="aspect-square w-full border border-line" shapeRendering="crispEdges" aria-hidden>
        {body}
      </svg>
    </figure>
  );

  return (
    <div className={cn("flex h-full flex-col gap-5 lg:justify-between", className)}>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {panel(
          "A · Input",
          coarseLv.map((cells, lv) => <path key={lv} d={cellsPath(cells, 40)} fill="currentColor" opacity={0.1 + lv * 0.16} />),
          "coarse",
        )}
        {panel(
          "B · Super-res",
          fineLv.map((cells, lv) => <path key={lv} d={cellsPath(cells, 10)} fill="currentColor" opacity={0.1 + lv * 0.16} />),
          "sharp?",
        )}
        {panel(
          "C · Trust",
          <>
            <path d={cellsPath(fineLv.flat(), 10)} fill="currentColor" opacity={0.07} />
            <path
              d={cellsPath(flagged, 10)}
              fill="var(--accent)"
              className="origin-center transition-opacity duration-500 group-hover:opacity-100"
              opacity={0.85}
            />
          </>,
          "flagged",
        )}
      </div>
      <p className="label flex justify-between gap-4 border-t border-line pt-3 text-muted">
        <span>Fig. 1 — Illustration, not results</span>
        <span className="text-accent">■ Don&apos;t trust these pixels</span>
      </p>
    </div>
  );
}
