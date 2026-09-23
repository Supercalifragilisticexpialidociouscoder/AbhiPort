"use client";

import { useEffect, useRef } from "react";
import { useRaceClock } from "@/lib/race-clock";
import { Plate, T, useWorld, type WorldProps } from "./shared";

const SVG = "absolute inset-0 h-full w-full";

/* ── 05 · CERTUS-S2 — a reconstruction you're allowed to trust ──────────
   Two halves of the actual project: the tile that gets super-resolved, and
   the claims ledger that decides what may be said about it. Every claim and
   status below is quoted from the repository's own CLAIMS.md. */

const LEDGER: [string, "Safe" | "Assumption" | "Experiment" | "Do not claim"][] = [
  ["Track A · E[FD/N] ≤ α", "Safe"],
  ["Track B · FDR over the selected set", "Assumption"],
  ["2.5 m sampling output", "Safe"],
  ["s/ν improves the risk score", "Experiment"],
  ["2.5 m resolved detail", "Do not claim"],
  ["Hallucination probability", "Do not claim"],
];

const CHIP: Record<string, string> = { Safe: "var(--fg)", Assumption: "var(--muted)", Experiment: "var(--muted)", "Do not claim": "var(--accent)" };

export function CertificationWorld({ live, className }: WorldProps) {
  const root = useRef<HTMLDivElement>(null);

  useWorld(
    live,
    (tl, q) => {
      tl.fromTo(q("[data-fine] rect"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: { each: 0.002, from: "start" } })
        .fromTo(q("[data-caution]"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.2")
        .fromTo(q("[data-claim]"), { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.09 }, "-=0.3")
        .fromTo(q("[data-cand]"), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.05 })
        .to(q("[data-pass]"), { x: 150, duration: 0.7, ease: "power2.inOut", stagger: 0.05 })
        .to(q("[data-abstain]"), { y: 34, opacity: 0.45, duration: 0.5, ease: "power2.in" }, "<")
        .to({}, { duration: 1.5 })
        .to([q("[data-claim]"), q("[data-caution]"), q("[data-cand]")], { opacity: 0, duration: 0.4 })
        .to(q("[data-fine] rect"), { opacity: 0, duration: 0.3 }, "<")
        .set([q("[data-pass]"), q("[data-abstain]")], { x: 0, y: 0, opacity: 1 });
    },
    root,
  );

  return (
    <Plate title="Reconstruct → certify → abstain" aside="From the repo's claims ledger" footer={<><span>Conformal risk control · site-disjoint splits</span><span className="text-fg">Sentinel-2</span></>} className={className}>
      <div ref={root} className="absolute inset-0">
        <svg viewBox="0 0 620 400" className={SVG} preserveAspectRatio="xMidYMid meet" aria-hidden>
          {/* the tile: 10 m in, 2.5 m sampling out */}
          <T x={24} y={32}>Sentinel-2 · 10 m</T>
          <g transform="translate(24 44)">
            {Array.from({ length: 64 }, (_, i) => {
              const v = 0.12 + ((i * 37) % 11) / 22;
              return <rect key={i} x={(i % 8) * 25} y={Math.floor(i / 8) * 25} width={25} height={25} fill="var(--fg)" opacity={v} />;
            })}
            <g data-fine>
              {Array.from({ length: 256 }, (_, i) => {
                const v = 0.08 + ((i * 53) % 17) / 30;
                return <rect key={i} x={(i % 16) * 12.5} y={Math.floor(i / 16) * 12.5} width={12.5} height={12.5} fill="var(--fg)" opacity={v} />;
              })}
            </g>
            <rect width={200} height={200} fill="none" stroke="var(--line)" />
          </g>
          <T x={24} y={264} size={8}>2.5 m sampling · 4× from 10 m</T>
          <g data-caution>
            <rect x={24} y={274} width={200} height={28} fill="none" stroke="var(--accent)" strokeDasharray="5 4" />
            <T x={124} y={292} anchor="middle" accent size={8}>
              Sampling — not resolved detail
            </T>
          </g>

          {/* what may be said about it */}
          <T x={256} y={32}>Claims ledger</T>
          {/* The row is placed by the outer group; GSAP moves the inner one —
              tweening x on a transformed <g> would overwrite its position. */}
          {LEDGER.map(([claim, status], i) => (
            <g key={claim} transform={`translate(256 ${44 + i * 34})`}>
              <g data-claim>
                <rect width={340} height={28} fill="none" stroke="var(--line)" />
                <T x={10} y={18} size={8.5}>{claim}</T>
                <rect x={244} y={6} width={88} height={16} fill="none" stroke={CHIP[status]} />
                <text x={288} y={18} fill={CHIP[status]} fontSize={7.5} textAnchor="middle" style={{ fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {status}
                </text>
              </g>
            </g>
          ))}

          {/* the gate */}
          <T x={256} y={266}>The gate</T>
          <line x1={256} y1={300} x2={596} y2={300} stroke="var(--line)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} data-cand {...(i === 3 ? { "data-abstain": "" } : { "data-pass": "" })} cx={272 + i * 22} cy={300} r={5} fill={i === 3 ? "var(--muted)" : "var(--accent)"} />
          ))}
          <T x={256} y={324} size={8}>Candidates</T>
          <T x={430} y={290} size={8} anchor="middle">λ̂ threshold</T>
          <line x1={430} y1={286} x2={430} y2={314} stroke="var(--accent)" strokeDasharray="3 3" />
          <T x={596} y={324} size={8} anchor="end">Certified</T>
          <T x={392} y={348} size={8}>Below the bar: abstain, don&apos;t guess</T>
        </svg>
      </div>
    </Plate>
  );
}

/* ── 06 · AstroSim — the concept, instrumented but not overstated ─────── */

export function OrbitWorld({ live, className }: WorldProps) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<SVGGElement>(null);
  const vec = useRef<SVGLineElement>(null);

  useWorld(
    live,
    (tl) => {
      // Kepler-ish: faster at periapsis, slower at apoapsis.
      const state = { a: 0 };
      tl.to(state, {
        a: Math.PI * 2,
        duration: 9,
        ease: "none",
        onUpdate: () => {
          const rx = 198;
          const ry = 104;
          const a = state.a;
          const x = 310 + Math.cos(a) * rx;
          const y = 196 + Math.sin(a) * ry;
          body.current?.setAttribute("transform", `translate(${x} ${y})`);
          const sp = 1 / (1.35 - 0.55 * Math.cos(a));
          vec.current?.setAttribute("x1", String(x));
          vec.current?.setAttribute("y1", String(y));
          vec.current?.setAttribute("x2", String(x - Math.sin(a) * 46 * sp));
          vec.current?.setAttribute("y2", String(y + Math.cos(a) * 24 * sp));
        },
      });
    },
    root,
  );

  return (
    <Plate title="Simulate → observe → iterate" aside="Concept" footer={<><span>SIH25142 · space technology</span><span className="text-fg">Concept — not a shipped simulator</span></>} className={className}>
      <div ref={root} className="absolute inset-0">
        <svg viewBox="0 0 620 400" className={SVG} preserveAspectRatio="xMidYMid meet" aria-hidden>
          {/* frame of reference */}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={40 + i * 45} y1={40} x2={40 + i * 45} y2={352} stroke="var(--line)" opacity={0.25} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`h${i}`} x1={40} y1={40 + i * 45} x2={580} y2={40 + i * 45} stroke="var(--line)" opacity={0.25} />
          ))}

          <ellipse cx={310} cy={196} rx={198} ry={104} fill="none" stroke="var(--line)" strokeDasharray="6 5" />
          <circle cx={310} cy={196} r={15} fill="none" stroke="var(--fg)" />
          <circle cx={310} cy={196} r={4} fill="var(--fg)" />
          <line x1={112} y1={196} x2={508} y2={196} stroke="var(--line)" opacity={0.5} />
          <T x={112} y={214} size={8}>Periapsis</T>
          <T x={508} y={214} size={8} anchor="end">Apoapsis</T>

          <line ref={vec} x1={508} y1={196} x2={508} y2={220} stroke="var(--accent)" strokeWidth={1.5} />
          <g ref={body} transform="translate(508 196)">
            <circle r={7} fill="var(--accent)" />
            <circle r={13} fill="none" stroke="var(--accent)" opacity={0.4} />
          </g>

          {/* the honest panel */}
          <g transform="translate(40 300)">
            <rect width={250} height={56} fill="none" stroke="var(--line)" />
            <T x={12} y={20} size={8}>Model · integrator · bodies</T>
            <rect x={12} y={28} width={160} height={18} fill="none" stroke="var(--accent)" strokeDasharray="4 4" />
            <T x={92} y={41} anchor="middle" accent size={7.5}>
              Add what it simulates
            </T>
          </g>
          <T x={580} y={356} anchor="end" size={8}>Orbit shown as illustration</T>
        </svg>
      </div>
    </Plate>
  );
}

/* ── 07 · Sandgate — a slot, held open honestly ───────────────────────── */

export function SealedWorld({ live, className }: WorldProps) {
  const root = useRef<HTMLDivElement>(null);

  useWorld(
    live,
    (tl, q) => {
      tl.fromTo(q("[data-scan]"), { attr: { y: 96 } }, { attr: { y: 300 }, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 1 })
        .fromTo(q("[data-seal]"), { opacity: 0.4 }, { opacity: 1, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
    },
    root,
  );

  return (
    <Plate title="Private \u00b7 sealed" aside="Held shut on purpose" footer={<><span>Private build</span><span className="text-fg">It opens when there is something real</span></>} className={className}>
      <div ref={root} className="absolute inset-0">
        <svg viewBox="0 0 620 400" className={SVG} preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            <linearGradient id="sg-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* the gate */}
          <rect x={150} y={80} width={36} height={240} fill="none" stroke="var(--line)" />
          <rect x={434} y={80} width={36} height={240} fill="none" stroke="var(--line)" />
          <rect x={150} y={56} width={320} height={24} fill="none" stroke="var(--line)" />
          <rect x={186} y={96} width={248} height={208} fill="url(#sg-fade)" opacity={0.5} />
          <rect x={186} y={96} width={248} height={208} fill="none" stroke="var(--line)" strokeDasharray="7 6" />
          <rect data-scan x={186} y={96} width={248} height={2} fill="var(--accent)" opacity={0.8} />

          <g data-seal transform="translate(310 196)">
            <rect x={-92} y={-20} width={184} height={40} fill="var(--bg)" stroke="var(--accent)" />
            <T x={0} y={4} anchor="middle" accent size={11}>
              Private / sealed
            </T>
          </g>

          {[
            ["Name", "Sandgate"],
            ["State", "Private"],
            ["Detail", "Sealed"],
          ].map(([k, v], i) => (
            <g key={k} transform={`translate(${150 + i * 110} 340)`}>
              <T x={0} y={0} size={8}>{k}</T>
              <text x={0} y={20} fill={v === "Sealed" ? "var(--accent)" : "var(--fg)"} fontSize={13} style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 600 }}>
                {v}
              </text>
            </g>
          ))}
          <T x={310} y={40} anchor="middle" size={8}>
            A name with nothing invented behind it
          </T>
        </svg>
      </div>
    </Plate>
  );
}

/* ── 08 · AbhiPort — the website, drawing itself, live ─────────────────── */

export function SelfWorld({ live, className }: WorldProps) {
  const root = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const port = useRef<SVGRectElement>(null);
  const scrollTxt = useRef<SVGTextElement>(null);
  const sizeTxt = useRef<SVGTextElement>(null);
  const fpsTxt = useRef<SVGTextElement>(null);
  useRaceClock(clock);

  // One loop, only while the scene is live: the wireframe tracks the real page.
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, window.scrollY / max);
      port.current?.setAttribute("y", String(56 + p * 250));
      if (scrollTxt.current) scrollTxt.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
      if (sizeTxt.current) sizeTxt.current.textContent = `${window.innerWidth}×${window.innerHeight}`;
      frames++;
      if (now - last >= 500) {
        if (fpsTxt.current) fpsTxt.current.textContent = String(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  const blocks = [28, 20, 24, 14, 40, 26, 22, 30, 24, 18, 20, 16, 26];

  return (
    <Plate
      title="This page, from the outside"
      aside="Live"
      footer={
        <>
          <span>Next.js · GSAP · Lenis · 52 prerendered pages</span>
          <span className="text-fg">
            Session <span ref={clock}>00:00.00</span>
          </span>
        </>
      }
      className={className}
    >
      <div ref={root} className="absolute inset-0">
        <svg viewBox="0 0 620 400" className={SVG} preserveAspectRatio="xMidYMid meet" aria-hidden>
          <T x={24} y={32}>Document</T>
          {/* the page as a column of sections, with the real viewport on it */}
          <g transform="translate(24 44)">
            <rect width={150} height={320} fill="none" stroke="var(--line)" />
            <rect x={6} y={6} width={138} height={10} fill="var(--fg)" opacity={0.5} />
            {blocks.reduce<{ y: number; els: React.ReactNode[] }>(
              (acc, h, i) => {
                acc.els.push(<rect key={i} x={6} y={acc.y} width={138} height={h - 4} fill="var(--fg)" opacity={i % 2 ? 0.14 : 0.22} />);
                acc.y += h;
                return acc;
              },
              { y: 22, els: [] },
            ).els}
          </g>
          <rect ref={port} x={18} y={56} width={162} height={62} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
          <T x={24} y={382} size={8}>Viewport</T>

          {/* live readouts */}
          {[
            ["Scroll", scrollTxt],
            ["Viewport", sizeTxt],
            ["Frames/s", fpsTxt],
          ].map(([label, ref], i) => (
            <g key={label as string} transform={`translate(206 ${52 + i * 62})`}>
              <rect width={180} height={48} fill="none" stroke="var(--line)" />
              <T x={12} y={18} size={8}>{label as string}</T>
              <text
                ref={ref as React.RefObject<SVGTextElement>}
                x={12}
                y={38}
                fill="var(--fg)"
                fontSize={16}
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                —
              </text>
            </g>
          ))}

          {[
            ["Routes", "9"],
            ["Pages", "52"],
            ["Sections", "13"],
            ["Frameworks", "1"],
          ].map(([k, v], i) => (
            <g key={k} transform={`translate(404 ${52 + i * 62})`}>
              <rect width={192} height={48} fill="none" stroke="var(--line)" />
              <T x={12} y={18} size={8}>{k}</T>
              <text x={12} y={38} fill="var(--fg)" fontSize={16} style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
                {v}
              </text>
            </g>
          ))}
          <T x={206} y={382} accent size={8}>
            You are inside project 08
          </T>
        </svg>
      </div>
    </Plate>
  );
}
