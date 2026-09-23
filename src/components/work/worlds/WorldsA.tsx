"use client";

import { useRef } from "react";
import { mulberry32 } from "@/lib/prng";
import { Plate, T, useWorld, type WorldProps } from "./shared";

const SVG = "absolute inset-0 h-full w-full";

/* ── 01 · Infin8 Access — a permission, end to end ─────────────────────
   The system in one picture: a student's QR is verified, then the request
   walks the real approval chain until someone with authority signs it. */

export function PermissionWorld({ live, className }: WorldProps) {
  const root = useRef<HTMLDivElement>(null);
  const rand = mulberry32(8);
  const modules = Array.from({ length: 100 }, () => rand() > 0.48);
  const chain = ["Request", "Club head", "HOD", "Head of campus"];

  useWorld(
    live,
    (tl, q) => {
      tl.fromTo(q("[data-scan]"), { y: 0 }, { y: 132, duration: 1.3, ease: "none" })
        .fromTo(q("[data-chip]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, ">-0.2")
        .fromTo(q("[data-chip-ok]"), { opacity: 0 }, { opacity: 1, duration: 0.25 });
      chain.forEach((_, i) => {
        tl.to(q("[data-token]"), { y: i * 80, duration: 0.45, ease: "power2.inOut" }, i === 0 ? ">" : ">-0.05")
          .to(q(`[data-node="${i}"]`), { stroke: "var(--accent)", duration: 0.2 }, "<")
          .fromTo(q(`[data-ok="${i}"]`), { opacity: 0 }, { opacity: 1, duration: 0.25 }, "<+0.15");
      });
      tl.to({}, { duration: 1.1 })
        .to([q("[data-chip]"), q("[data-chip-ok]"), q("[data-ok]")], { opacity: 0, duration: 0.4 })
        .to(q("[data-node]"), { stroke: "var(--line)", duration: 0.4 }, "<")
        .set(q("[data-token]"), { y: 0 });
    },
    root,
  );

  return (
    <Plate title="Request → approval" footer={<><span>QR identity · role-based approval</span><span className="text-fg">200+ active club members</span></>} className={className}>
      <div ref={root} className="absolute inset-0">
        <svg viewBox="0 0 620 400" className={SVG} preserveAspectRatio="xMidYMid meet" aria-hidden>
          {/* the student's pass */}
          <T x={24} y={40}>Student pass</T>
          <g transform="translate(24 52)">
            <rect width={144} height={144} fill="none" stroke="var(--line)" />
            {modules.map((on, i) =>
              on ? <rect key={i} x={12 + (i % 10) * 12} y={12 + Math.floor(i / 10) * 12} width={10} height={10} fill="var(--fg)" opacity={0.75} /> : null,
            )}
            {[[12, 12], [104, 12], [12, 104]].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <rect x={x} y={y} width={28} height={28} fill="var(--bg)" stroke="var(--fg)" strokeWidth={3} />
                <rect x={x + 8} y={y + 8} width={12} height={12} fill="var(--fg)" />
              </g>
            ))}
            <rect data-scan x={1} y={6} width={142} height={2} fill="var(--accent)" opacity={0.9} />
          </g>
          <g data-chip transform="translate(24 214)">
            <rect width={144} height={46} fill="none" stroke="var(--accent)" />
            <T x={10} y={19} accent>Identity</T>
            <T x={10} y={35} size={11}>Verified</T>
            <circle data-chip-ok cx={128} cy={23} r={5} fill="var(--accent)" />
          </g>

          {/* the chain that actually signs it */}
          <T x={212} y={40}>Approval chain</T>
          <line x1={232} y1={78} x2={232} y2={318} stroke="var(--line)" />
          {chain.map((label, i) => (
            <g key={label} transform={`translate(212 ${52 + i * 80})`}>
              <rect data-node={i} x={38} width={370} height={52} fill="none" stroke="var(--line)" />
              <T x={54} y={22} size={10}>{`Step ${i + 1}`}</T>
              <text x={54} y={42} fill="var(--fg)" fontSize={17} style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 600 }}>
                {label}
              </text>
              <g data-ok={i}>
                <T x={392} y={32} anchor="end" accent size={10}>
                  Approved
                </T>
              </g>
              <circle cx={20} cy={26} r={4} fill="var(--bg)" stroke="var(--line)" />
            </g>
          ))}
          <circle data-token cx={232} cy={78} r={7} fill="var(--accent)" />
        </svg>
      </div>
    </Plate>
  );
}

/* ── 02 · PlasmaTherm Technologies — waste, taken apart by plasma ──────
   The process drawn as a concept: feedstock in, an arc hot enough to break
   it into its parts, syngas up and vitrified slag down — with the
   engineering that surrounds it named down the side. Stages only. No
   instrument readings, no yields, no numbers: none of that is public. */

export function PlasmaWorld({ live, className }: WorldProps) {
  const root = useRef<HTMLDivElement>(null);
  const layers = ["System design", "Simulation", "Detection · AI / ML", "Automation", "Data analysis"];

  useWorld(
    live,
    (tl, q) => {
      tl.to(q("[data-arc]"), { opacity: 0.35, duration: 0.09, repeat: 17, yoyo: true }, 0)
        .to(q("[data-glow]"), { opacity: 0.5, scale: 1.06, transformOrigin: "center", duration: 1.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0)
        .fromTo(q("[data-feed]"), { attr: { y: 62 }, opacity: 0.9 }, { attr: { y: 164 }, opacity: 0, duration: 1.6, ease: "power1.in", stagger: 0.4 }, 0)
        .fromTo(q("[data-rise]"), { attr: { cy: 170 }, opacity: 0 }, { attr: { cy: 78 }, opacity: 0.85, duration: 1.5, ease: "power1.out", stagger: 0.35 }, 0.6)
        .fromTo(q("[data-slag]"), { attr: { cy: 296 }, opacity: 0 }, { attr: { cy: 344 }, opacity: 0.7, duration: 1.4, ease: "power1.in", stagger: 0.45 }, 1)
        .fromTo(q("[data-layer]"), { opacity: 0.3 }, { opacity: 1, duration: 0.35, stagger: 0.45 }, 0.4)
        .to({}, { duration: 0.8 });
    },
    root,
  );

  return (
    <Plate
      title="Waste → plasma → syngas + slag"
      aside="Concept diagram"
      footer={
        <>
          <span>Plasma gasification · waste-disposal engineering</span>
          <span className="text-fg">Co-founder</span>
        </>
      }
      className={className}
    >
      <div ref={root} className="absolute inset-0">
        <svg viewBox="0 0 620 400" className={SVG} preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            <radialGradient id="pt-glow">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
              <stop offset="70%" stopColor="var(--accent)" stopOpacity={0.08} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* what goes in */}
          <T x={24} y={40}>Waste feed</T>
          <path d="M26 50 H138 L118 88 H46 Z" fill="none" stroke="var(--line)" />
          {[0, 1, 2].map((i) => (
            <rect key={i} data-feed x={62 + i * 16} y={62} width={8} height={8} fill="var(--fg)" opacity={0.9} />
          ))}
          <path d="M82 88 V138 H206" fill="none" stroke="var(--line)" />

          {/* the reactor */}
          <T x={206} y={62}>Plasma reactor</T>
          <rect x={206} y={70} width={194} height={258} rx={6} fill="none" stroke="var(--line)" />
          <circle data-glow cx={303} cy={176} r={72} fill="url(#pt-glow)" />

          {/* torches, and the arc between them */}
          {[
            [188, 146, 248, 172],
            [418, 146, 358, 172],
          ].map(([x1, y1, x2, y2], i) => (
            <g key={i}>
              <rect x={i ? 418 : 170} y={138} width={18} height={14} fill="none" stroke="var(--line)" />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--fg)" strokeWidth={2} opacity={0.75} />
            </g>
          ))}
          <T x={170} y={130} size={8}>Torch</T>
          <T x={436} y={130} size={8} anchor="end">Torch</T>
          <polyline
            data-arc
            points="248,172 266,162 284,180 302,166 320,182 338,168 358,172"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
          />

          {/* what comes out */}
          {[0, 1, 2].map((i) => (
            <circle key={i} data-rise cx={320 + i * 18} cy={170} r={3.5} fill="var(--fg)" opacity={0} />
          ))}
          <path d="M360 70 V44 H470" fill="none" stroke="var(--line)" />
          <T x={478} y={48} accent size={9}>Syngas</T>

          {[0, 1, 2].map((i) => (
            <circle key={i} data-slag cx={286 + i * 16} cy={296} r={3.5} fill="var(--fg)" opacity={0} />
          ))}
          <path d="M303 328 V356" fill="none" stroke="var(--line)" />
          <T x={303} y={372} anchor="middle" size={9}>Vitrified slag</T>

          {/* the engineering around it */}
          <line x1={400} y1={200} x2={452} y2={200} stroke="var(--line)" />
          <line x1={452} y1={92} x2={452} y2={324} stroke="var(--line)" />
          {layers.map((label, i) => (
            <g key={label} transform={`translate(468 ${70 + i * 54})`}>
              <line x1={-16} y1={22} x2={0} y2={22} stroke="var(--line)" />
              <g data-layer>
                <rect width={128} height={44} fill="none" stroke="var(--line)" />
                <text x={10} y={27} fill="var(--fg)" fontSize={11} style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 600 }}>
                  {label}
                </text>
              </g>
            </g>
          ))}

          <T x={24} y={368} size={8}>Process stages only</T>
          <T x={24} y={384} size={8}>No measurements published</T>
        </svg>
      </div>
    </Plate>
  );
}

/* ── 03 · Club Infin8 — people become an organisation, then a system ──── */

export function EcosystemWorld({ live, className }: WorldProps) {
  const root = useRef<HTMLDivElement>(null);
  const rand = mulberry32(3500);
  const field = Array.from({ length: 220 }, () => [40 + rand() * 540, 40 + rand() * 320]);
  const systems = ["Registration", "Club selection", "Onboarding", "Member data", "Calendar"];

  useWorld(
    live,
    (tl, q) => {
      tl.fromTo(q("[data-field] circle"), { opacity: 0 }, { opacity: 0.22, duration: 0.9, stagger: { each: 0.004, from: "random" } })
        .fromTo(q("[data-club]"), { opacity: 0, scale: 0.6, transformOrigin: "center" }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(2)" }, "-=0.4")
        .fromTo(q("[data-link]"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.08 })
        .fromTo(q("[data-sys]"), { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1 }, "-=0.3")
        .to({}, { duration: 1.6 })
        .to([q("[data-sys]"), q("[data-link]")], { opacity: 0, duration: 0.5 })
        .to(q("[data-field] circle"), { opacity: 0, duration: 0.4 }, "<")
        .to(q("[data-club]"), { opacity: 0.25, duration: 0.4 }, "<");
    },
    root,
  );

  // Eight clubs on two rings — the 8 that becomes the ∞ in the Club section.
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const left = i < 4;
    const a = (i % 4) * (Math.PI / 2) + Math.PI / 4;
    return [(left ? 176 : 292) + Math.cos(a) * 58, 190 + Math.sin(a) * 58, left];
  });

  return (
    <Plate title="People → organisation → system" footer={<><span>8 clubs · ~200 members</span><span className="text-fg">~3,500 students on campus</span></>} className={className}>
      <div ref={root} className="absolute inset-0">
        <svg viewBox="0 0 620 400" className={SVG} preserveAspectRatio="xMidYMid meet" aria-hidden>
          <g data-field>
            {field.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.6} fill="var(--fg)" opacity={0.22} />
            ))}
          </g>
          <T x={24} y={32}>~3,500 students</T>

          {/* the eight, as the infinity mark */}
          <circle cx={176} cy={190} r={58} fill="none" stroke="var(--line)" />
          <circle cx={292} cy={190} r={58} fill="none" stroke="var(--line)" />
          {nodes.map(([x, y], i) => (
            <g key={i} data-club>
              <circle cx={x as number} cy={y as number} r={9} fill="var(--bg)" stroke="var(--accent)" />
              <T x={x as number} y={(y as number) + 3} anchor="middle" size={8} accent>
                {String(i + 1)}
              </T>
            </g>
          ))}
          <T x={234} y={274} anchor="middle" size={10}>
            Eight clubs, one umbrella
          </T>

          {/* what the ecosystem actually runs on */}
          {systems.map((s, i) => (
            <g key={s} transform={`translate(392 ${62 + i * 56})`}>
              <line data-link x1={-42} y1={26} x2={0} y2={26} stroke="var(--accent)" />
              <g data-sys>
                <rect width={204} height={44} fill="none" stroke="var(--line)" />
                <text x={14} y={28} fill="var(--fg)" fontSize={14} style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 600 }}>
                  {s}
                </text>
              </g>
            </g>
          ))}
          <T x={392} y={44}>The plumbing</T>
        </svg>
      </div>
    </Plate>
  );
}

/* ── 04 · HaKit — a camera reads the room, the plan argues back ───────── */

export function VisionWorld({ live, className }: WorldProps) {
  const root = useRef<HTMLDivElement>(null);
  const stalls = [
    [70, 90, 110, 70, "Stall"],
    [210, 90, 110, 70, "Stall"],
    [350, 90, 110, 70, "Stall"],
    [70, 210, 110, 70, "Stall"],
    [210, 210, 110, 70, "Aisle"],
    [350, 210, 110, 70, "Stage"],
  ] as const;

  useWorld(
    live,
    (tl, q) => {
      tl.fromTo(q("[data-frustum]"), { rotate: -26, transformOrigin: "265px 356px" }, { rotate: 26, duration: 2.4, ease: "sine.inOut" })
        .fromTo(q("[data-box]"), { opacity: 0, scale: 0.94, transformOrigin: "center" }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.12 }, 0.35)
        .to(q("[data-moved]"), { x: 96, duration: 0.6, ease: "power2.inOut" }, ">-0.2")
        .fromTo(q("[data-conflict]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, "<+0.3")
        .to({}, { duration: 1.4 })
        .to(q("[data-conflict]"), { opacity: 0, duration: 0.3 })
        .to(q("[data-moved]"), { x: 0, duration: 0.5 }, "<")
        .to(q("[data-box]"), { opacity: 0, duration: 0.3 }, "<");
    },
    root,
  );

  return (
    <Plate title="Camera → plan → conflicts" footer={<><span>Computer vision · venue operations</span><span className="text-fg">Prototype</span></>} className={className}>
      <div ref={root} className="absolute inset-0">
        <svg viewBox="0 0 620 400" className={SVG} preserveAspectRatio="xMidYMid meet" aria-hidden>
          <T x={24} y={32}>Floor plan</T>
          <rect x={40} y={48} width={450} height={280} fill="none" stroke="var(--line)" />

          {/* what the camera sees */}
          <g data-frustum opacity={0.5}>
            <path d="M265 356 L150 60 L380 60 Z" fill="var(--accent)" opacity={0.08} />
            <line x1={265} y1={356} x2={150} y2={60} stroke="var(--accent)" strokeDasharray="4 4" opacity={0.5} />
            <line x1={265} y1={356} x2={380} y2={60} stroke="var(--accent)" strokeDasharray="4 4" opacity={0.5} />
          </g>

          {stalls.map(([x, y, w, h, label], i) => (
            <g key={i} data-moved={i === 4 ? "" : undefined}>
              <rect x={x} y={y} width={w} height={h} fill="none" stroke="var(--line)" />
              <T x={x + 10} y={y + 20} size={8}>{label}</T>
              <g data-box>
                <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
                {[[x - 4, y - 4], [x + w + 4, y - 4], [x - 4, y + h + 4], [x + w + 4, y + h + 4]].map(([cx, cy], k) => (
                  <rect key={k} x={cx - 2.5} y={cy - 2.5} width={5} height={5} fill="var(--accent)" />
                ))}
              </g>
            </g>
          ))}

          <g transform="translate(258 344)">
            <rect width={16} height={12} fill="var(--bg)" stroke="var(--fg)" />
            <T x={8} y={30} anchor="middle" size={8}>Camera</T>
          </g>

          <g data-conflict>
            <rect x={510} y={90} width={92} height={92} fill="none" stroke="var(--accent)" />
            <T x={556} y={120} anchor="middle" accent size={9}>Plan moved</T>
            <T x={556} y={140} anchor="middle" size={8}>Clearance</T>
            <T x={556} y={156} anchor="middle" size={8}>lost</T>
          </g>
          <T x={510} y={72}>What breaks</T>
        </svg>
      </div>
    </Plate>
  );
}
