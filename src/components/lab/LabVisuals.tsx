"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { LabEntry } from "@/content/lab";
import { mulberry32 } from "@/lib/prng";
import { cn } from "@/lib/cn";

/**
 * One simulated instrument per lab page. Each is driven by your pointer or
 * a slider (touch and keyboard), labelled as a simulation, runs only while
 * on screen, and holds still under reduced motion. None of them make a sound.
 */

export function LabVisual({ entry }: { entry: LabEntry }) {
  switch (entry.visual) {
    case "tilt":
      return <TiltBoard />;
    case "compass":
      return <CompassRose />;
    case "sonar":
      return <Ranging medium="sound" />;
    case "tof":
      return <Ranging medium="light" />;
    case "ir":
      return <IrStrip />;
    case "radio":
      return <RadioLink />;
    case "pio":
      return <PioTiming />;
    case "blink":
      return <Blink />;
    case "alarm":
      return <Alarm />;
    default:
      return null;
  }
}

/* ── shared ───────────────────────────────────────────────────────────── */

function Panel({ title, aside = "Simulated", children, className }: { title: string; aside?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative border border-line", className)}>
      <div className="label flex items-center justify-between gap-4 border-b border-line px-4 py-3">
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {title}
        </span>
        <span className="text-muted">{aside}</span>
      </div>
      {children}
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div className="px-4 pb-4">
      <label htmlFor={id} className="label flex justify-between text-muted">
        <span>{label}</span>
        <span className="tnum text-fg">
          {value}
          {unit}
        </span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
    </div>
  );
}

function Readouts({ items }: { items: [string, string, string?][] }) {
  return (
    <div className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
      {items.map(([k, v, tone]) => (
        <div key={k} className="label flex items-baseline justify-between gap-2 border-b border-r border-line px-4 py-3 sm:border-b-0">
          <span className="text-muted">{k}</span>
          <span className={cn("tnum text-[13px]", tone ?? "text-fg")}>{v}</span>
        </div>
      ))}
    </div>
  );
}

/** Runs `tick` every frame while `el` is on screen (never under reduced motion). */
function useFrames(el: React.RefObject<HTMLElement | null>, tick: (t: number) => void) {
  const cb = useRef(tick);
  useEffect(() => {
    cb.current = tick;
  });
  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const loop = (t: number) => {
      cb.current(t);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [el]);
}

const fmt = (v: number, d = 2) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(d)}`;
const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

/* ── MPU6050 · tilt → angle ───────────────────────────────────────────── */

function TiltBoard() {
  const [pitch, setPitch] = useState(18);
  const [roll, setRoll] = useState(-24);
  const [bug, setBug] = useState(false);
  const pad = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !pad.current) return;
    const r = pad.current.getBoundingClientRect();
    setRoll(Math.round(((e.clientX - r.left) / r.width - 0.5) * 140));
    setPitch(Math.round(((e.clientY - r.top) / r.height - 0.5) * -140));
  };

  // What the accelerometer reads for this orientation (in g)…
  const ax = -Math.sin(rad(pitch));
  const ay = Math.sin(rad(roll)) * Math.cos(rad(pitch));
  const az = Math.cos(rad(roll)) * Math.cos(rad(pitch));
  // …and the angles you get back from it. The bug: the wrong sign on one axis.
  const rollOut = deg(Math.atan2(ay, bug ? -az : az));
  const pitchOut = deg(Math.atan2(-ax, Math.hypot(ay, az)));

  return (
    <Panel title="MPU6050 · orientation">
      <div className="grid gap-6 p-4 md:grid-cols-2">
        <div ref={pad} onPointerMove={onMove} data-cursor="Tilt" className="relative grid aspect-square place-items-center overflow-hidden border border-line [perspective:700px]">
          <div
            className="relative h-[46%] w-[62%] border border-fg bg-fg/[0.04] transition-transform duration-300 ease-[var(--ease-expo)]"
            style={{ transform: `rotateX(${pitch}deg) rotateY(${roll}deg)` }}
            aria-hidden
          >
            <span className="absolute left-1/2 top-1/2 h-[34%] w-[26%] -translate-x-1/2 -translate-y-1/2 border border-fg bg-bg" />
            <span className="label absolute right-2 top-2 text-[9px] text-accent">X →</span>
            <span className="label absolute bottom-2 left-2 text-[9px] text-muted">Y ↑</span>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="absolute bottom-0 h-1.5 w-1 bg-fg" style={{ left: `${10 + i * 11}%` }} />
            ))}
          </div>
          <span className="label pointer-events-none absolute bottom-3 left-3 text-muted">g ↓ always down</span>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="label text-muted">Angle out</p>
            <p className="display tnum mt-2 text-[clamp(40px,4vw,68px)] leading-[0.85]">
              <span className={cn(bug && Math.abs(rollOut - roll) > 1 && "text-accent")}>R {Math.round(rollOut)}°</span>
              <br />P {Math.round(pitchOut)}°
            </p>
            <p className="label mt-4 normal-case tracking-normal text-[13px] text-muted">roll = atan2(ay, {bug ? "−az" : "az"}) · pitch = atan2(−ax, √(ay² + az²))</p>
          </div>
          <button
            type="button"
            aria-pressed={bug}
            onClick={() => {
              const next = !bug;
              setBug(next);
              // Lean 45° with a flipped axis and you get exactly the number from the story.
              if (next) setRoll(-45);
            }}
            className={cn("label self-start border px-3 py-2 transition-colors", bug ? "border-accent bg-accent text-bg" : "border-line text-muted hover:border-fg hover:text-fg")}
          >
            {bug ? "Axis flipped — confidently wrong. Fix it" : "Flip one axis (the −135° bug)"}
          </button>
        </div>
      </div>
      <Slider label="Roll" value={roll} min={-70} max={70} unit="°" onChange={setRoll} />
      <Slider label="Pitch" value={pitch} min={-70} max={70} unit="°" onChange={setPitch} />
      <Readouts
        items={[
          ["AX", fmt(ax), "text-accent"],
          ["AY", fmt(ay)],
          ["AZ", fmt(az), "text-muted"],
          ["|g|", Math.hypot(ax, ay, az).toFixed(2)],
        ]}
      />
    </Panel>
  );
}

/* ── MPU9250 · heading ────────────────────────────────────────────────── */

function CompassRose() {
  const [heading, setHeading] = useState(42);
  const [noise, setNoise] = useState(false);
  const face = useRef<HTMLDivElement>(null);
  const shown = (heading + (noise ? 23 : 0) + 360) % 360;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !face.current) return;
    const r = face.current.getBoundingClientRect();
    const a = deg(Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))));
    setHeading(Math.round((a + 360) % 360));
  };

  return (
    <Panel title="MPU9250 · magnetometer">
      <div className="grid gap-6 p-4 md:grid-cols-[1fr_auto]">
        <div ref={face} onPointerMove={onMove} data-cursor="Turn" className="relative mx-auto aspect-square w-full max-w-[380px]">
          <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={`Simulated heading ${shown} degrees${noise ? ", with interference" : ""}`}>
            <g style={{ transform: `rotate(${-shown}deg)`, transformOrigin: "100px 100px", transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <circle cx="100" cy="100" r="86" fill="none" stroke="var(--line)" />
              {Array.from({ length: 72 }, (_, i) => {
                const a = rad(i * 5);
                const r1 = i % 18 === 0 ? 70 : i % 2 === 0 ? 76 : 80;
                return <line key={i} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 86} y2={100 - Math.cos(a) * 86} stroke="var(--fg)" strokeWidth={i % 18 === 0 ? 1.4 : 0.6} opacity="0.8" />;
              })}
              {(["N", "E", "S", "W"] as const).map((l, i) => {
                const a = rad(i * 90);
                return (
                  <text key={l} x={100 + Math.sin(a) * 56} y={104 - Math.cos(a) * 56} textAnchor="middle" fill={l === "N" ? "var(--accent)" : "var(--fg)"} style={{ font: "700 13px var(--font-archivo), sans-serif" }}>
                    {l}
                  </text>
                );
              })}
            </g>
            <path d="M100 26 L106 100 L100 108 L94 100 Z" fill={noise ? "var(--accent)" : "var(--fg)"} />
            <circle cx="100" cy="100" r="4" fill="var(--bg)" stroke="var(--fg)" />
          </svg>
        </div>
        <div className="flex flex-col justify-between gap-6 md:w-56">
          <div>
            <p className="label text-muted">Heading</p>
            <p className="display tnum mt-2 text-[clamp(52px,5vw,84px)] leading-[0.8]">{String(Math.round(shown)).padStart(3, "0")}°</p>
            {noise ? <p className="label mt-3 text-accent">Off by 23° — something metal nearby. Calibrate.</p> : <p className="label mt-3 text-muted">Clean field. Believe it.</p>}
          </div>
          <button
            type="button"
            aria-pressed={noise}
            onClick={() => setNoise((n) => !n)}
            className={cn("label self-start border px-3 py-2 transition-colors", noise ? "border-accent bg-accent text-bg" : "border-line text-muted hover:border-fg hover:text-fg")}
          >
            {noise ? "Remove the laptop" : "Put a laptop next to it"}
          </button>
        </div>
      </div>
      <Slider label="True heading" value={heading} min={0} max={359} unit="°" onChange={setHeading} />
    </Panel>
  );
}

/* ── HC-SR04 / VL53L0X · ranging ──────────────────────────────────────── */

const C_SOUND = 343; // m/s
const C_LIGHT = 299_792_458; // m/s

function Ranging({ medium }: { medium: "sound" | "light" }) {
  const sound = medium === "sound";
  const max = sound ? 400 : 200;
  const [d, setD] = useState(sound ? 120 : 80);
  const [dark, setDark] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pulse = useRef<SVGGElement>(null);
  const t = (2 * d) / 100 / (sound ? C_SOUND : C_LIGHT); // seconds
  const wallX = 60 + (d / max) * 470;

  // One round trip every 1.6 s of wall-clock time — slowed down by a lot.
  useFrames(wrap, (now) => {
    const g = pulse.current;
    if (!g) return;
    const phase = (now % 1600) / 1600;
    const out = phase < 0.5;
    const x = out ? 60 + (wallX - 60) * (phase / 0.5) : wallX - (wallX - 60) * ((phase - 0.5) / 0.5);
    g.setAttribute("transform", `translate(${x.toFixed(1)} 0) scale(${out ? 1 : -1} 1)`);
    g.setAttribute("opacity", !sound && dark && !out ? "0.35" : "1");
  });

  const other = sound ? (2 * d) / 100 / C_LIGHT : (2 * d) / 100 / C_SOUND;
  const time = sound ? `${(t * 1000).toFixed(2)} ms` : `${(t * 1e9).toFixed(2)} ns`;

  return (
    <Panel title={sound ? "HC-SR04 · 40 kHz" : "VL53L0X · 940 nm"}>
      <div ref={wrap} className="p-4">
        <svg viewBox="0 0 560 150" className="w-full" role="img" aria-label={`Simulated ${sound ? "ultrasonic" : "laser"} ranging: ${d} centimetres, round trip ${time}`}>
          <rect x="18" y="45" width="34" height="60" fill="var(--bg)" stroke="var(--fg)" />
          {sound ? (
            <>
              <circle cx="35" cy="62" r="9" fill="none" stroke="var(--fg)" />
              <circle cx="35" cy="88" r="9" fill="none" stroke="var(--fg)" />
            </>
          ) : (
            <rect x="29" y="68" width="12" height="14" fill="var(--accent)" />
          )}
          <line x1="60" x2="540" y1="75" y2="75" stroke="var(--line)" strokeDasharray="3 5" />
          <rect x={wallX} y="20" width="10" height="110" fill={!sound && dark ? "var(--muted)" : "var(--fg)"} opacity={!sound && dark ? 0.5 : 0.9} />
          <g ref={pulse} transform="translate(60 0)">
            {sound ? (
              [0, 8, 16].map((o) => <path key={o} d={`M${-o} 55 Q${10 - o} 75 ${-o} 95`} fill="none" stroke="var(--accent)" strokeWidth="2" opacity={1 - o / 24} />)
            ) : (
              <line x1="-26" x2="0" y1="75" y2="75" stroke="var(--accent)" strokeWidth="3" />
            )}
          </g>
          <text x={(60 + wallX) / 2} y="138" textAnchor="middle" fill="var(--muted)" style={{ font: "500 10px var(--font-geist-mono), monospace" }}>
            {d} cm
          </text>
        </svg>
        <p className="label mt-2 normal-case tracking-normal text-[13px] text-muted">
          {sound ? "d = echo time × 343 m/s ÷ 2 — the sound goes there and back." : "Same formula, different speed: light, at ~300,000 km/s."} Slowed down enormously so you can see it.
        </p>
      </div>
      <Slider label="Distance" value={d} min={sound ? 2 : 5} max={max} unit=" cm" onChange={setD} />
      {!sound ? (
        <div className="px-4 pb-4">
          <button
            type="button"
            aria-pressed={dark}
            onClick={() => setDark((x) => !x)}
            className={cn("label border px-3 py-2 transition-colors", dark ? "border-accent bg-accent text-bg" : "border-line text-muted hover:border-fg hover:text-fg")}
          >
            {dark ? "Dark surface — fewer photons back" : "Try a dark surface"}
          </button>
        </div>
      ) : null}
      <Readouts
        items={[
          ["Round trip", time, "text-accent"],
          [sound ? "Light would take" : "Sound would take", sound ? `${(other * 1e9).toFixed(2)} ns` : `${(other * 1000).toFixed(2)} ms`],
          ["Speed ratio", `×${Math.round(C_LIGHT / C_SOUND).toLocaleString("en-US")}`, "text-muted"],
          ["Range", sound ? "2–400 cm" : "≈ 2 m"],
        ]}
      />
    </Panel>
  );
}

/* ── IR · reflect → decide ────────────────────────────────────────────── */

const STRIP = [0.92, 0.9, 0.88, 0.08, 0.06, 0.07, 0.9, 0.93, 0.91, 0.9, 0.05, 0.06, 0.89, 0.92, 0.9];

function IrStrip() {
  const [pos, setPos] = useState(4.5);
  const [threshold, setThreshold] = useState(50);
  const pad = useRef<HTMLDivElement>(null);
  const i = Math.max(0, Math.min(STRIP.length - 1, Math.floor(pos)));
  const reflect = Math.round(STRIP[i] * 100);
  const line = reflect < threshold;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !pad.current) return;
    const r = pad.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(STRIP.length - 0.01, ((e.clientX - r.left) / r.width) * STRIP.length)));
  };

  return (
    <Panel title="IR pair · reflectance">
      <div ref={pad} onPointerMove={onMove} data-cursor="Slide" className="relative m-4 h-40 overflow-hidden border border-line">
        <div className="absolute inset-x-0 bottom-0 flex h-16">
          {STRIP.map((v, k) => (
            <span key={k} className="h-full flex-1" style={{ background: v > 0.5 ? "color-mix(in oklab, var(--fg) 88%, var(--bg))" : "var(--bg)", borderTop: "1px solid var(--line)" }} />
          ))}
        </div>
        <div className="absolute top-3 flex -translate-x-1/2 flex-col items-center transition-[left] duration-200 ease-out" style={{ left: `${(pos / STRIP.length) * 100}%` }} aria-hidden>
          <span className="label border border-fg bg-bg px-2 py-1 text-[10px]">IR</span>
          <span className="h-12 w-px bg-accent" />
          <span className="h-2 w-2 rounded-full bg-accent" />
        </div>
      </div>
      <div className="grid gap-4 px-4 pb-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="label flex justify-between text-muted">
            <span>Reflected</span>
            <span className="tnum text-fg">{reflect}%</span>
          </p>
          <div className="relative mt-2 h-2 bg-line">
            <span className="absolute inset-y-0 left-0 bg-fg transition-[width] duration-200" style={{ width: `${reflect}%` }} />
            <span className="absolute -top-1 bottom-[-4px] w-0.5 bg-accent" style={{ left: `${threshold}%` }} />
          </div>
        </div>
        <p className={cn("label flex items-center gap-2 sm:justify-end", line ? "text-accent" : "text-muted")}>
          <span aria-hidden className={cn("h-3 w-3 rounded-full border", line ? "border-accent bg-accent shadow-[0_0_12px_var(--accent)]" : "border-fg/50")} />
          OUT = {line ? "1 · line under me" : "0 · no line"}
        </p>
      </div>
      <Slider label="Sensor position" value={Number(pos.toFixed(1))} min={0} max={STRIP.length - 0.1} step={0.1} onChange={setPos} />
      <Slider label="Threshold (the tiny potentiometer)" value={threshold} min={10} max={90} unit="%" onChange={setThreshold} />
    </Panel>
  );
}

/* ── ESP32 · device → data → communication ────────────────────────────── */

function RadioLink() {
  const [link, setLink] = useState<"wifi" | "bt">("wifi");
  const wrap = useRef<HTMLDivElement>(null);
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const count = useRef<HTMLSpanElement>(null);
  const sent = useRef(0);
  const last = useRef(0);

  const path = link === "wifi" ? { x1: 250, y1: 90, x2: 470, y2: 45 } : { x1: 250, y1: 90, x2: 470, y2: 135 };

  useFrames(wrap, (now) => {
    dots.current.forEach((c, i) => {
      if (!c) return;
      const p = ((now / 1400 + i / 3) % 1 + 1) % 1;
      c.setAttribute("cx", String(path.x1 + (path.x2 - path.x1) * p));
      c.setAttribute("cy", String(path.y1 + (path.y2 - path.y1) * p));
    });
    if (now - last.current > 467) {
      last.current = now;
      sent.current += 1;
      if (count.current) count.current.textContent = String(sent.current).padStart(5, "0");
    }
  });

  return (
    <Panel title="ESP32 · link">
      <div ref={wrap} className="p-4">
        <svg viewBox="0 0 560 180" className="w-full" role="img" aria-label={`Simulated data flow from sensors through an ESP32 over ${link === "wifi" ? "Wi-Fi to a server" : "Bluetooth to a phone"}`}>
          {["IMU", "Distance", "IR"].map((l, i) => (
            <g key={l}>
              <rect x="20" y={30 + i * 45} width="92" height="30" fill="var(--bg)" stroke="var(--line)" />
              <text x="66" y={49 + i * 45} textAnchor="middle" fill="var(--muted)" style={{ font: "500 10px var(--font-geist-mono), monospace" }}>
                {l}
              </text>
              <line x1="112" y1={45 + i * 45} x2="180" y2="90" stroke="var(--line)" />
            </g>
          ))}
          <rect x="180" y="60" width="70" height="60" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.4" />
          <text x="215" y="94" textAnchor="middle" fill="var(--fg)" style={{ font: "700 12px var(--font-archivo), sans-serif" }}>
            ESP32
          </text>
          <line x1="250" y1="90" x2="470" y2="45" stroke={link === "wifi" ? "var(--accent)" : "var(--line)"} strokeDasharray={link === "wifi" ? undefined : "3 5"} />
          <line x1="250" y1="90" x2="470" y2="135" stroke={link === "bt" ? "var(--accent)" : "var(--line)"} strokeDasharray={link === "bt" ? undefined : "3 5"} />
          <rect x="470" y="28" width="72" height="34" fill="var(--bg)" stroke={link === "wifi" ? "var(--fg)" : "var(--line)"} />
          <text x="506" y="49" textAnchor="middle" fill="var(--fg)" style={{ font: "500 10px var(--font-geist-mono), monospace" }}>
            SERVER
          </text>
          <rect x="484" y="116" width="44" height="40" rx="6" fill="var(--bg)" stroke={link === "bt" ? "var(--fg)" : "var(--line)"} />
          <text x="506" y="140" textAnchor="middle" fill="var(--fg)" style={{ font: "500 10px var(--font-geist-mono), monospace" }}>
            PHONE
          </text>
          {[0, 1, 2].map((i) => (
            <circle key={i} ref={(el) => void (dots.current[i] = el)} r="4" cx={path.x1} cy={path.y1} fill="var(--accent)" />
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
        {(
          [
            ["wifi", "Wi-Fi → server"],
            ["bt", "Bluetooth → phone"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            aria-pressed={link === k}
            onClick={() => setLink(k)}
            className={cn("label border px-3 py-2 transition-colors", link === k ? "border-accent bg-accent text-bg" : "border-line text-muted hover:border-fg hover:text-fg")}
          >
            {l}
          </button>
        ))}
        <span className="label ml-auto text-muted">
          Packets <span ref={count} className="tnum text-fg">00000</span>
        </span>
      </div>
    </Panel>
  );
}

/* ── Pico · CPU timing vs PIO timing ──────────────────────────────────── */

function PioTiming() {
  const [load, setLoad] = useState(60);
  const [seed, setSeed] = useState(1);
  const wrap = useRef<HTMLDivElement>(null);
  const tickAt = useRef(0);

  // The CPU's edges wander a little more every time it gets busier.
  useFrames(wrap, (now) => {
    if (load > 0 && now - tickAt.current > 260) {
      tickAt.current = now;
      setSeed((s) => (s % 9973) + 1);
    }
  });

  const wave = (jitter: number, s: number) => {
    const rand = mulberry32(s);
    let d = "M0 40";
    let high = false;
    for (let k = 1; k <= 16; k++) {
      const x = k * 32 + (jitter ? (rand() - 0.5) * jitter : 0);
      d += ` H${x.toFixed(1)} V${high ? 40 : 8}`;
      high = !high;
    }
    return d + " H540";
  };
  const jitterPx = (load / 100) * 20;
  const us = ((load / 100) * 3.2).toFixed(1);

  return (
    <Panel title="RP2040 · timing">
      <div ref={wrap} className="space-y-5 p-4">
        {[
          { l: "CPU, bit-banged", d: wave(jitterPx, seed), tone: "var(--fg)", note: `edges ±${us} µs` },
          { l: "PIO state machine", d: wave(0, 7), tone: "var(--accent)", note: "edges ±0 — on its own clock" },
        ].map((w) => (
          <figure key={w.l}>
            <figcaption className="label flex justify-between text-muted">
              <span>{w.l}</span>
              <span>{w.note}</span>
            </figcaption>
            <svg viewBox="0 0 540 48" className="mt-2 w-full" aria-hidden preserveAspectRatio="none">
              <path d={w.d} fill="none" stroke={w.tone} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            </svg>
          </figure>
        ))}
        <p className="label normal-case tracking-normal text-[13px] text-muted">Busier CPU, sloppier edges. The PIO block doesn&apos;t care what the cores are doing.</p>
      </div>
      <Slider label="CPU load" value={load} min={0} max={100} unit="%" onChange={setLoad} />
    </Panel>
  );
}

/* ── Arduino · blink ──────────────────────────────────────────────────── */

function Blink() {
  const [ms, setMs] = useState(500);
  const [on, setOn] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const t0 = useRef(0);
  const state = useRef(false);

  useFrames(wrap, (now) => {
    if (!t0.current) t0.current = now;
    const next = Math.floor((now - t0.current) / ms) % 2 === 0;
    if (next !== state.current) {
      state.current = next;
      setOn(next);
      setLog((l) => [...l.slice(-5), `${((now - t0.current) / 1000).toFixed(3)}s  LED ${next ? "ON " : "OFF"}`]);
    }
  });

  return (
    <Panel title="Uno · pin 13">
      <div ref={wrap} className="grid gap-4 p-4 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4 border border-line py-10">
          <span
            aria-hidden
            className={cn("h-14 w-14 rounded-full border-2 transition-all duration-75", on ? "border-accent bg-accent shadow-[0_0_40px_var(--accent)]" : "border-fg/40 bg-transparent")}
          />
          <span className="label text-muted">D13 · {on ? "HIGH" : "LOW"}</span>
        </div>
        <pre className="overflow-hidden border border-line p-4 font-mono text-[12px] leading-relaxed text-muted">
          <span className="text-fg">void</span> loop() {"{"}
          {"\n"}  digitalWrite(13, HIGH);
          {"\n"}  delay(<span className="text-accent">{ms}</span>);
          {"\n"}  digitalWrite(13, LOW);
          {"\n"}  delay(<span className="text-accent">{ms}</span>);
          {"\n"}
          {"}"}
        </pre>
      </div>
      <div className="mx-4 mb-4 border border-line">
        <p className="label border-b border-line px-3 py-2 text-muted">Serial monitor · 9600 baud</p>
        <ol className="h-[7.5em] px-3 py-2 font-mono text-[12px] leading-[1.25em]" aria-live="off">
          {log.length ? log.map((l, k) => <li key={k + l}>{l}</li>) : <li className="text-muted">waiting…</li>}
        </ol>
      </div>
      <Slider label="delay()" value={ms} min={100} max={1000} step={50} unit=" ms" onChange={(v) => setMs(v)} />
    </Panel>
  );
}

/* ── LEDs & buzzer · the warning ──────────────────────────────────────── */

function Alarm() {
  const [reading, setReading] = useState(30);
  const threshold = 45;
  const on = reading > threshold;
  const wrap = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  useFrames(wrap, (now) => {
    bars.current.forEach((b, i) => {
      if (!b) return;
      const h = on ? 20 + Math.abs(Math.sin(now / 90 + i * 0.7)) * 80 : 6;
      b.style.height = `${h.toFixed(0)}%`;
    });
  });

  return (
    <Panel title="Outputs · LEDs + piezo" aside="Simulated · silent">
      <div ref={wrap} className="grid gap-6 p-4 md:grid-cols-3">
        <div className="flex flex-col justify-between gap-4 border border-line p-4">
          <p className="label text-muted">Reading vs threshold</p>
          <p className="display tnum text-[clamp(48px,5vw,80px)] leading-[0.8]">
            <span className={on ? "text-accent" : undefined}>{reading}°</span>
          </p>
          <p className="label text-muted">Threshold {threshold}°</p>
        </div>
        <div className="flex items-center justify-center gap-6 border border-line p-4">
          {[0, 1].map((k) => (
            <span key={k} className="flex flex-col items-center gap-3">
              <span aria-hidden className={cn("h-10 w-10 rounded-full border-2 transition-all duration-200", on ? "border-accent bg-accent shadow-[0_0_28px_var(--accent)]" : "border-fg/40")} />
              <span className="label text-muted">LED {k + 1}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-3 border border-line p-4">
          <p className="label flex justify-between text-muted">
            <span>Buzzer</span>
            <span className={on ? "text-accent" : undefined}>{on ? "BEEP" : "off"}</span>
          </p>
          <div aria-hidden className="flex h-16 items-end gap-1">
            {Array.from({ length: 16 }, (_, k) => (
              <span key={k} ref={(el) => void (bars.current[k] = el)} className={cn("w-full", on ? "bg-accent" : "bg-line")} style={{ height: "6%" }} />
            ))}
          </div>
          <p className="label normal-case tracking-normal text-[12px] text-muted">Drawn, never played. This site doesn&apos;t make noise.</p>
        </div>
      </div>
      <Slider label="Reading" value={reading} min={0} max={90} unit="°" onChange={setReading} />
    </Panel>
  );
}
