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
    case "feed":
      return <PostFeed className={className} />;
    case "calendar":
      return <ReadinessCalendar className={className} />;
    case "mentor":
      return <MentorPanel className={className} />;
    case "corridors":
      return <CorridorMap className={className} />;
    case "scan":
      return <RoomScan className={className} />;
    default:
      return null;
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

/* ── 04 · SocialGuard — posts, labelled with reasons ─────────────────── */

const POSTS: { handle: string; text: string; label: "Genuine" | "Bot" | "Suspicious"; why: string }[] = [
  { handle: "@account_01", text: "Enjoying the sunshine today with friends.", label: "Genuine", why: "no signals" },
  { handle: "@account_02", text: "WIN a FREE prize!!! click → link", label: "Suspicious", why: "1 URL · spam words · punctuation" },
  { handle: "@account_03", text: "follow follow follow for follow back", label: "Bot", why: "repetitive text" },
  { handle: "@account_04", text: "Notes from today's workshop, thread below.", label: "Genuine", why: "no signals" },
];

export function PostFeed({ className }: { className?: string }) {
  return (
    <Frame title="Post analysis" aside="Illustration" className={className}>
      <ul className="mt-5 flex flex-1 flex-col justify-between gap-2">
        {POSTS.map((p, i) => (
          <li key={p.handle} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-line pb-3" style={{ transitionDelay: `${i * 90}ms` }}>
            <span className="label text-muted">{p.handle}</span>
            <span
              className={cn(
                "label row-span-2 border px-2 py-1 text-center transition-colors duration-500",
                p.label === "Genuine" ? "border-line text-muted" : "border-accent text-accent group-hover:bg-accent group-hover:text-bg",
              )}
            >
              {p.label}
            </span>
            <span className="truncate text-[15px]">{p.text}</span>
            <span className="label col-span-2 text-[10px] text-muted">Why: {p.why}</span>
          </li>
        ))}
      </ul>
      <p className="label mt-4 flex justify-between gap-4 text-muted">
        <span>Rules first · model second</span>
        <span className="text-accent">SIH1775</span>
      </p>
    </Frame>
  );
}

/* ── 05 · Infin8 Calendar — a month, with readiness ──────────────────── */

export function ReadinessCalendar({ className }: { className?: string }) {
  const events: Record<number, { t: string; warn?: boolean }> = {
    3: { t: "Workshop" },
    9: { t: "Deadline" },
    12: { t: "Club fair" },
    16: { t: "Seminar", warn: true },
    22: { t: "Hackathon" },
    27: { t: "Meeting" },
  };
  const today = 16;
  return (
    <Frame title="This month" aside="Illustration" className={className}>
      <div className="label mt-4 grid grid-cols-7 gap-px text-center text-[10px] text-muted">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="pb-1">
            {d}
          </span>
        ))}
      </div>
      <ol className="grid flex-1 grid-cols-7 gap-px border border-line bg-line">
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 1;
          const ev = events[day];
          const inMonth = day >= 1 && day <= 30;
          return (
            <li key={i} className="relative min-h-[34px] bg-bg p-1">
              <span className={cn("label text-[10px]", day === today ? "text-accent" : "text-muted")}>{inMonth ? day : ""}</span>
              {day === today ? <span aria-hidden className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" /> : null}
              {ev ? (
                <span className={cn("label mt-0.5 block truncate border-l-2 pl-1 text-[9px]", ev.warn ? "border-accent text-accent" : "border-fg/60 text-fg")}>{ev.t}</span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="label text-muted">Readiness</span>
        <span className="relative h-1 bg-line">
          <span className="absolute inset-y-0 left-0 w-4/5 origin-left bg-fg transition-transform duration-700 group-hover:scale-x-[1.25]" />
        </span>
        <span className="label tnum">4 / 5</span>
      </div>
      <p className="label mt-3 text-accent">⚠ Venue already booked at this hour — warning, not a block</p>
    </Frame>
  );
}

/* ── 06 · Project Grit — a mentor that asks instead of answering ─────── */

export function MentorPanel({ className }: { className?: string }) {
  return (
    <Frame title="Project Grit · sidebar" aside="Illustration" className={className}>
      <div className="mt-4 grid grid-cols-4 border border-line">
        {["Analyze", "Debug", "Improve", "Evaluate"].map((m, i) => (
          <span key={m} className={cn("label border-r border-line py-2 text-center text-[10px] last:border-r-0", i === 1 ? "bg-accent text-bg" : "text-muted")}>
            {m}
          </span>
        ))}
      </div>
      <pre className="mt-4 overflow-hidden border-l-2 border-line pl-3 font-mono text-[12px] leading-relaxed text-muted">
        {`for (let i = 0; i <= items.length; i++) {
  total += items[i].price;
}`}
      </pre>
      <div className="mt-4 flex-1 space-y-3 text-[14px] leading-snug">
        <p>
          <span className="label mr-2 text-accent">Grit</span>What happens on the last pass of this loop?
        </p>
        <p className="text-muted transition-colors duration-500 group-hover:text-fg">
          <span className="label mr-2">Hint</span>Compare the condition with the last valid index. Don&apos;t fix it yet — say what breaks first.
        </p>
      </div>
      <p className="label mt-4 flex justify-between gap-4 border-t border-line pt-3 text-muted">
        <span>Root cause first</span>
        <span>No answers handed over</span>
      </p>
    </Frame>
  );
}

/* ── 07 · TerraMatch Nexus — risk queue → cities ─────────────────────── */

export function CorridorMap({ className }: { className?: string }) {
  const people = [
    { y: 40, r: "CRIT" },
    { y: 95, r: "HIGH" },
    { y: 150, r: "HIGH" },
    { y: 205, r: "MED" },
  ];
  const cities = [
    { y: 60, n: "City A" },
    { y: 130, n: "City B" },
    { y: 195, n: "City C" },
  ];
  const links: [number, number][] = [
    [0, 1],
    [1, 0],
    [2, 2],
    [3, 1],
  ];
  return (
    <Frame title="Matching engine" aside="Sample data" className={className}>
      <svg viewBox="0 0 300 240" className="mt-3 w-full flex-1" role="img" aria-label="Illustration: people queued by risk, matched to receiving cities">
        {links.map(([a, b], i) => (
          <path
            key={i}
            d={`M70 ${people[a].y} C150 ${people[a].y}, 150 ${cities[b].y}, 230 ${cities[b].y}`}
            fill="none"
            stroke={i === 0 ? "var(--accent)" : "var(--fg)"}
            strokeWidth={i === 0 ? 2 : 1}
            opacity={i === 0 ? 1 : 0.45}
            strokeDasharray={i === 0 ? undefined : "3 4"}
          />
        ))}
        {people.map((p, i) => (
          <g key={i}>
            <rect x="14" y={p.y - 12} width="56" height="24" fill="var(--bg)" stroke={i === 0 ? "var(--accent)" : "var(--line)"} />
            <text x="42" y={p.y + 4} textAnchor="middle" fill={i === 0 ? "var(--accent)" : "var(--muted)"} style={{ font: "500 9px var(--font-geist-mono), monospace" }}>
              {String(i + 1).padStart(2, "0")} · {p.r}
            </text>
          </g>
        ))}
        {cities.map((c) => (
          <g key={c.n}>
            <circle cx="236" cy={c.y} r="6" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.5" />
            <text x="250" y={c.y + 3} fill="var(--fg)" style={{ font: "500 9px var(--font-geist-mono), monospace" }}>
              {c.n}
            </text>
          </g>
        ))}
      </svg>
      <p className="label mt-3 flex justify-between gap-4 border-t border-line pt-3 text-muted">
        <span>Highest risk first → best available city</span>
        <span className="text-accent">Greedy</span>
      </p>
    </Frame>
  );
}

/* ── 08 · HaKit — a room, as the camera sees it ──────────────────────── */

export function RoomScan({ className }: { className?: string }) {
  const boxes = [
    { x: 30, y: 120, w: 70, h: 60, l: "table 0.78" },
    { x: 130, y: 95, w: 34, h: 70, l: "person 0.91", hot: true },
    { x: 190, y: 138, w: 40, h: 40, l: "chair 0.83" },
  ];
  return (
    <Frame title="Scan · live" aside="Illustration" className={className}>
      <svg viewBox="0 0 260 210" className="mt-3 w-full flex-1" role="img" aria-label="Illustration: object detection boxes over a room, with exits marked">
        <rect x="8" y="8" width="244" height="194" fill="none" stroke="var(--line)" />
        <path d="M8 60 H22 M8 90 H22" stroke="var(--accent)" strokeWidth="3" />
        <text x="26" y="78" fill="var(--accent)" style={{ font: "500 8px var(--font-geist-mono), monospace" }}>
          EXIT · OBSERVED
        </text>
        <path d="M252 150 H238 M252 180 H238" stroke="var(--fg)" strokeWidth="3" opacity="0.6" />
        <text x="178" y="198" fill="var(--muted)" style={{ font: "500 8px var(--font-geist-mono), monospace" }}>
          EXIT · UNKNOWN
        </text>
        {boxes.map((b) => (
          <g key={b.l}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={b.hot ? "var(--accent)" : "var(--fg)"} strokeWidth="1.2" />
            <rect x={b.x} y={b.y - 12} width={b.l.length * 5.2 + 6} height="11" fill={b.hot ? "var(--accent)" : "var(--fg)"} />
            <text x={b.x + 3} y={b.y - 3.5} fill="var(--bg)" style={{ font: "600 8px var(--font-geist-mono), monospace" }}>
              {b.l}
            </text>
          </g>
        ))}
        <line x1="8" x2="252" y1="40" y2="40" stroke="var(--accent)" strokeWidth="1" opacity="0.5" className="motion-safe:animate-pulse" />
      </svg>
      <p className="label mt-3 flex justify-between gap-4 border-t border-line pt-3 text-muted">
        <span>Every value has a source</span>
        <span className="text-accent">What if +50 people?</span>
      </p>
    </Frame>
  );
}
