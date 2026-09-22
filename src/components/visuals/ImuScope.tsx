"use client";

import { useEffect, useRef, useState } from "react";
import { garage } from "@/content/site";

const N = 220; // samples on screen
const RANGE = 2.2; // ±g shown

/**
 * A pretend MPU6050: your pointer (or scroll, on touch) is the sensor.
 * Pointer acceleration is mapped to X/Y "g", with Z sitting at 1 g like a
 * board lying flat on a desk. Runs only while visible; still under reduced motion.
 */
export function ImuScope() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ax = useRef<HTMLSpanElement>(null);
  const ay = useRef<HTMLSpanElement>(null);
  const az = useRef<HTMLSpanElement>(null);
  const pk = useRef<HTMLSpanElement>(null);
  const ns = useRef<HTMLSpanElement>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const cv = canvas.current;
    const w = wrap.current;
    if (!cv || !w) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    setTouch(window.matchMedia("(hover: none)").matches);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const bx = new Float32Array(N);
    const by = new Float32Array(N);
    const bz = new Float32Array(N).fill(1);
    let head = 0;
    let samples = 0;
    let peak = 0;
    let px = 0;
    let py = 0;
    let hasPointer = false;
    let dxAcc = 0;
    let dyAcc = 0;
    let vx = 0;
    let vy = 0;
    let last = performance.now();
    let lastScroll = window.scrollY;
    let raf = 0;
    let running = false;
    let frame = 0;
    let colors = { fg: "#e3e6e4", muted: "#7f8985", accent: "#ff4521", line: "rgba(227,230,228,0.12)" };

    const readColors = () => {
      const cs = getComputedStyle(w);
      colors = {
        fg: cs.getPropertyValue("--fg").trim() || colors.fg,
        muted: cs.getPropertyValue("--muted").trim() || colors.muted,
        accent: cs.getPropertyValue("--accent").trim() || colors.accent,
        line: cs.getPropertyValue("--line").trim() || colors.line,
      };
    };

    const clamp = (v: number) => Math.max(-RANGE, Math.min(RANGE, v));

    const step = (now: number) => {
      const dt = Math.max(8, Math.min(50, now - last));
      last = now;
      const nvx = dxAcc / dt;
      const nvy = dyAcc / dt;
      dxAcc = 0;
      dyAcc = 0;
      const svx = vx + (nvx - vx) * 0.3;
      const svy = vy + (nvy - vy) * 0.3;
      const gx = ((svx - vx) / dt) * 42;
      const gy = ((svy - vy) / dt) * 42;
      vx = svx;
      vy = svy;
      const noise = () => (reduce ? 0 : (Math.random() - 0.5) * 0.025);
      const x = clamp(gx + noise());
      const y = clamp(-gy + noise());
      const z = clamp(1 + noise() - Math.min(0.35, Math.hypot(gx, gy) * 0.06));
      bx[head] = x;
      by[head] = y;
      bz[head] = z;
      head = (head + 1) % N;
      samples++;
      peak = Math.max(peak * 0.996, Math.hypot(x, y));
      return { x, y, z };
    };

    const draw = () => {
      const W = cv.clientWidth;
      const H = cv.clientHeight;
      ctx.clearRect(0, 0, W, H);
      const yOf = (g: number) => H / 2 - (g / RANGE) * (H / 2 - 6);

      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.line;
      ctx.beginPath();
      for (const g of [-2, -1, 1, 2]) {
        ctx.moveTo(0, Math.round(yOf(g)) + 0.5);
        ctx.lineTo(W, Math.round(yOf(g)) + 0.5);
      }
      const spacing = W / (N / 20);
      const offset = ((samples % 20) / 20) * spacing;
      for (let x = W - offset; x > 0; x -= spacing) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, H);
      }
      ctx.stroke();

      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = colors.muted;
      ctx.beginPath();
      ctx.moveTo(0, Math.round(yOf(0)) + 0.5);
      ctx.lineTo(W, Math.round(yOf(0)) + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);

      const trace = (buf: Float32Array, color: string, width: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const v = buf[(head + i) % N];
          const x = (i / (N - 1)) * W;
          if (i === 0) ctx.moveTo(x, yOf(v));
          else ctx.lineTo(x, yOf(v));
        }
        ctx.stroke();
      };
      trace(bz, colors.muted, 1);
      trace(by, colors.fg, 1.25);
      trace(bx, colors.accent, 1.5);
    };

    const fmt = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}`;
    const readout = (v: { x: number; y: number; z: number }) => {
      if (ax.current) ax.current.textContent = fmt(v.x);
      if (ay.current) ay.current.textContent = fmt(v.y);
      if (az.current) az.current.textContent = fmt(v.z);
      if (pk.current) pk.current.textContent = peak.toFixed(2);
      if (ns.current) ns.current.textContent = String(samples).padStart(6, "0");
    };

    const loop = (now: number) => {
      const v = step(now);
      draw();
      if (frame++ % 5 === 0) readout(v);
      if (frame % 60 === 0) readColors();
      raf = requestAnimationFrame(loop);
    };

    // Reduced motion: no free-running trace — sample only when you move.
    let pending = false;
    const nudge = () => {
      if (!reduce || pending) return;
      pending = true;
      requestAnimationFrame((now) => {
        pending = false;
        readout(step(now));
        draw();
      });
    };

    const onMove = (e: PointerEvent) => {
      if (hasPointer) {
        dxAcc += e.clientX - px;
        dyAcc += e.clientY - py;
      }
      px = e.clientX;
      py = e.clientY;
      hasPointer = true;
      nudge();
    };
    const onScroll = () => {
      const y = window.scrollY;
      dyAcc += (y - lastScroll) * 0.5;
      lastScroll = y;
      nudge();
    };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible && !running) {
          running = true;
          lastScroll = window.scrollY;
          window.addEventListener("pointermove", onMove, { passive: true });
          window.addEventListener("scroll", onScroll, { passive: true });
          if (!reduce) {
            last = performance.now();
            raf = requestAnimationFrame(loop);
          }
        } else if (!visible && running) {
          running = false;
          hasPointer = false;
          cancelAnimationFrame(raf);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("scroll", onScroll);
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(w);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrap} className="flex h-full flex-col border border-line">
      <div className="label flex items-center justify-between gap-4 border-b border-line px-4 py-3">
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {garage.scope.title}
        </span>
        <span className="text-muted">Simulated · 60 Hz</span>
      </div>

      <div className="relative min-h-[220px] flex-1">
        <canvas
          ref={canvas}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Live accelerometer-style trace driven by your pointer or scrolling"
        />
        <div aria-hidden className="label pointer-events-none absolute right-3 top-2 flex gap-4 text-[10px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-3 bg-accent" />X
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-px w-3 bg-fg" />Y
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-px w-3 border-t border-dashed border-muted" />Z
          </span>
          <span>±{RANGE}g</span>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-line sm:grid-cols-5">
        {(
          [
            ["AX", ax, "text-accent"],
            ["AY", ay, "text-fg"],
            ["AZ", az, "text-muted"],
            ["PEAK", pk, "text-fg"],
            ["N", ns, "text-muted"],
          ] as const
        ).map(([k, ref, tone]) => (
          <div key={k} className="label flex items-baseline justify-between gap-2 border-b border-r border-line px-4 py-3 sm:border-b-0">
            <span className="text-muted">{k}</span>
            <span ref={ref} className={`tnum text-[13px] ${tone}`}>
              {k === "AZ" ? "+1.00" : k === "N" ? "000000" : "+0.00"}
            </span>
          </div>
        ))}
      </div>

      <p className="px-4 py-3 text-[14px] leading-snug text-muted">{touch ? garage.scope.touchNote : garage.scope.note}</p>
    </div>
  );
}
