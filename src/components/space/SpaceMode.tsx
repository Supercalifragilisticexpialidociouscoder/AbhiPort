"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getLenis } from "@/lib/scroll";

/**
 * SPACE MODE — the subsystem that isn't in the README.
 *
 * Press S on a desktop and a small craft drops into the page. It isn't a
 * separate game: it flies over the real document, the waypoints are the real
 * sections, and flying past the top or bottom of the viewport scrolls the
 * page — so the film cuts and the telemetry keeps running underneath you.
 * ENTER at a waypoint goes there. ESC puts it away and leaves you exactly
 * where you were.
 *
 * Nothing here loads until the key is pressed: the module is imported on
 * demand, and everything below runs in one requestAnimationFrame loop that
 * writes to a canvas and to HUD nodes directly — React renders once.
 */

/** Sections that are also a room of their own. ENTER takes you there. */
const ROOMS: Record<string, string> = {
  garage: "/lab",
  community: "/club-infin8",
  races: "/community",
  archive: "/archive",
  work: "/archive",
};

/** Arrows and WASD drive the same four controls. */
const BINDINGS: Record<string, string> = {
  ArrowUp: "thrust",
  KeyW: "thrust",
  w: "thrust",
  W: "thrust",
  ArrowDown: "brake",
  KeyS: "brake",
  s: "brake",
  S: "brake",
  ArrowLeft: "left",
  KeyA: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  KeyD: "right",
  d: "right",
  D: "right",
};

type Node = { el: HTMLElement; label: string; index: string; x: number; y: number; href?: string };

const TAU = Math.PI * 2;

export function SpaceMode({ onExit, reduced = false }: { onExit: () => void; reduced?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const pos = useRef<HTMLDivElement>(null);
  const vel = useRef<HTMLDivElement>(null);
  const sector = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const lenis = getLenis();
    lenis?.stop(); // the arrows fly the ship; the page follows it

    // Live: the tokens interpolate as sections change, so the craft picks up
    // whatever surface it is flying over instead of freezing at mount.
    const surface = getComputedStyle(document.documentElement);

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Waypoints are the page's own sections, in document coordinates.
    let nodes: Node[] = [];
    const measure = () => {
      nodes = Array.from(document.querySelectorAll<HTMLElement>("main [data-index][data-label]")).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          label: el.dataset.label ?? "",
          index: el.dataset.index ?? "",
          x: w * 0.5,
          y: r.top + window.scrollY + r.height * 0.5,
          href: ROOMS[el.id],
        };
      });
    };
    measure();

    // State: position in document space, heading, velocity.
    const ship = { x: w * 0.5, y: window.scrollY + h * 0.5, a: -Math.PI / 2, vx: 0, vy: 0, av: 0, thrust: 0 };
    // Reduced motion keeps the subsystem, drops the flourish: no trail, no
    // drifting inertia, and the craft settles instead of coasting.
    const TOP = reduced ? 9 : 16;
    const COAST = reduced ? 0.9 : 0.989;
    const TRAIL = reduced ? 0 : 48;
    const trail: [number, number][] = [];
    const keys = new Set<string>();
    let near: Node | null = null;
    let raf = 0;
    let last = performance.now();
    let intro = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (e.key === "Escape" || e.code === "Escape") {
        e.preventDefault();
        onExit();
        return;
      }
      if ((e.key === "Enter" || e.code === "Enter" || e.code === "NumpadEnter") && near) {
        e.preventDefault();
        const dest = near;
        onExit();
        if (dest.href) router.push(dest.href);
        else dest.el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      // Arrows or WASD — whichever hand is already there. `code` first, with
      // `key` as the fallback for input methods that don't set it.
      const bind = BINDINGS[e.code] ?? BINDINGS[e.key];
      if (bind) {
        e.preventDefault();
        keys.add(bind);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const bind = BINDINGS[e.code] ?? BINDINGS[e.key];
      if (bind) keys.delete(bind);
    };

    const frame = (now: number) => {
      const accent = surface.getPropertyValue("--accent").trim() || "#ff4521";
      const fg = surface.getPropertyValue("--fg").trim() || "#ecebe6";
      const dt = Math.min(3, (now - last) / 16.667);
      last = now;
      intro = reduced ? 1 : Math.min(1, intro + dt * 0.06);

      // ── flight ──────────────────────────────────────────────────────
      if (keys.has("left")) ship.av -= 0.0075 * dt;
      if (keys.has("right")) ship.av += 0.0075 * dt;
      ship.av *= 0.9;
      ship.a += ship.av * dt;

      const forward = keys.has("thrust");
      const reverse = keys.has("brake");
      ship.thrust += ((forward ? 1 : 0) - ship.thrust) * 0.2 * dt;
      const push = forward ? 0.34 : reverse ? -0.16 : 0;
      ship.vx += Math.cos(ship.a) * push * dt;
      ship.vy += Math.sin(ship.a) * push * dt;
      const drag = reverse ? 0.94 : COAST;
      ship.vx *= drag;
      ship.vy *= drag;
      const speed = Math.hypot(ship.vx, ship.vy);
      if (speed > TOP) {
        ship.vx = (ship.vx / speed) * TOP;
        ship.vy = (ship.vy / speed) * TOP;
      }
      ship.x += ship.vx * dt;
      ship.y += ship.vy * dt;

      // walls left/right, the document floor and ceiling
      const docH = document.documentElement.scrollHeight;
      if (ship.x < 14) {
        ship.x = 14;
        ship.vx *= -0.45;
      } else if (ship.x > w - 14) {
        ship.x = w - 14;
        ship.vx *= -0.45;
      }
      if (ship.y < 14) {
        ship.y = 14;
        ship.vy *= -0.45;
      } else if (ship.y > docH - 14) {
        ship.y = docH - 14;
        ship.vy *= -0.45;
      }

      // the page follows the craft
      let scroll = window.scrollY;
      const vy = ship.y - scroll;
      const maxScroll = Math.max(0, docH - h);
      if (vy < h * 0.32) scroll = Math.max(0, ship.y - h * 0.32);
      else if (vy > h * 0.68) scroll = Math.min(maxScroll, ship.y - h * 0.68);
      if (Math.abs(scroll - window.scrollY) > 0.5) window.scrollTo(0, scroll);

      if (TRAIL) {
        trail.push([ship.x, ship.y]);
        if (trail.length > TRAIL) trail.shift();
      }

      // ── nearest waypoint ────────────────────────────────────────────
      near = null;
      let nearest: Node | null = null;
      let nearestD = Infinity;
      for (const nd of nodes) {
        const d = Math.hypot(nd.x - ship.x, nd.y - ship.y);
        if (d < nearestD) {
          nearestD = d;
          nearest = nd;
        }
      }
      if (nearest && nearestD < 170) near = nearest;

      // ── draw ────────────────────────────────────────────────────────
      const sy = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = intro;

      // a grid that belongs to the document, not the screen
      ctx.strokeStyle = fg;
      ctx.globalAlpha = intro * 0.06;
      ctx.lineWidth = 1;
      const step = 88;
      ctx.beginPath();
      for (let x = 0; x < w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = -(sy % step); y < h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // waypoints
      for (const nd of nodes) {
        const y = nd.y - sy;
        if (y < -120 || y > h + 120) continue;
        const hot = near === nd;
        ctx.globalAlpha = intro * (hot ? 1 : 0.5);
        ctx.strokeStyle = hot ? accent : fg;
        ctx.lineWidth = 1;
        const r = hot ? 30 : 22;
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
          const ax = nd.x + (k % 2 ? r : -r);
          const ay = y + (k < 2 ? -r : r);
          const dx = k % 2 ? -9 : 9;
          const dy = k < 2 ? 9 : -9;
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + dx, ay);
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax, ay + dy);
        }
        ctx.stroke();
        // canvas can't read CSS variables — name the stack outright
        ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = hot ? accent : fg;
        ctx.globalAlpha = intro * (hot ? 1 : 0.4);
        ctx.fillText(`${nd.index} ${nd.label.toUpperCase()}`, nd.x - r, y - r - 10);
        if (hot) {
          ctx.globalAlpha = intro;
          ctx.fillText("↵ ENTER", nd.x - r, y + r + 18);
        }
      }

      // trail
      ctx.globalAlpha = intro * 0.5;
      ctx.strokeStyle = accent;
      ctx.beginPath();
      trail.forEach(([tx, ty], i) => {
        const yy = ty - sy;
        if (i === 0) ctx.moveTo(tx, yy);
        else ctx.lineTo(tx, yy);
      });
      ctx.stroke();

      // ── the craft ───────────────────────────────────────────────────
      // Drawn like a schematic of a small experimental spacecraft: blunt
      // nose with an antenna, a cockpit canopy, a body wide enough to read
      // as one, delta wings with tip fins, and three nozzles. Local space
      // points up; it measures roughly 46 × 32.
      const shipY = ship.y - sy;
      ctx.save();
      ctx.translate(ship.x, shipY);
      ctx.rotate(ship.a + Math.PI / 2);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // engines, behind everything
      if (ship.thrust > 0.02) {
        const glow = ctx.createRadialGradient(0, 17, 0, 0, 17, 32);
        glow.addColorStop(0, accent);
        glow.addColorStop(1, "transparent");
        ctx.globalAlpha = intro * ship.thrust * 0.4;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 17, 32, 0, TAU);
        ctx.fill();

        const flicker = 0.7 + Math.random() * 0.3;
        const plume = (10 + ship.thrust * 16) * flicker;
        ctx.globalAlpha = intro * ship.thrust * flicker;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(-2.3, 16.5);
        ctx.lineTo(0, 17 + plume);
        ctx.lineTo(2.3, 16.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(-3.6, 15.5);
        ctx.lineTo(-3.6, 15.5 + plume * 0.45);
        ctx.moveTo(3.6, 15.5);
        ctx.lineTo(3.6, 15.5 + plume * 0.45);
        ctx.stroke();
      }

      ctx.globalAlpha = intro;
      ctx.fillStyle = surface.getPropertyValue("--bg").trim() || "#0b0b0a";
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.3;

      // delta wings, under the hull
      ctx.beginPath();
      ctx.moveTo(6, 1);
      ctx.lineTo(16, 13);
      ctx.lineTo(5.6, 13);
      ctx.closePath();
      ctx.moveTo(-6, 1);
      ctx.lineTo(-16, 13);
      ctx.lineTo(-5.6, 13);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(16, 13);
      ctx.lineTo(16, 8.5);
      ctx.moveTo(-16, 13);
      ctx.lineTo(-16, 8.5);
      ctx.stroke();

      // hull
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.bezierCurveTo(3.5, -16, 5.5, -8, 6, 0);
      ctx.lineTo(5.2, 13);
      ctx.lineTo(-5.2, 13);
      ctx.lineTo(-6, 0);
      ctx.bezierCurveTo(-5.5, -8, -3.5, -16, 0, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // nozzles and nose antenna
      ctx.beginPath();
      ctx.moveTo(-3.6, 13);
      ctx.lineTo(-3.6, 15.8);
      ctx.moveTo(0, 13);
      ctx.lineTo(0, 17);
      ctx.moveTo(3.6, 13);
      ctx.lineTo(3.6, 15.8);
      ctx.moveTo(0, -20);
      ctx.lineTo(0, -26);
      ctx.moveTo(-2, -24);
      ctx.lineTo(2, -24);
      ctx.stroke();

      // cockpit canopy — filled, so it reads as a cockpit at a glance
      ctx.globalAlpha = intro * 0.85;
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(0, -13.5);
      ctx.lineTo(3.2, -8);
      ctx.lineTo(2.4, -2.5);
      ctx.lineTo(-2.4, -2.5);
      ctx.lineTo(-3.2, -8);
      ctx.closePath();
      ctx.fill();

      // panel lines
      ctx.globalAlpha = intro * 0.55;
      ctx.strokeStyle = fg;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 11);
      ctx.moveTo(-4.4, 4);
      ctx.lineTo(0, 6.4);
      ctx.lineTo(4.4, 4);
      ctx.moveTo(-4.9, 8);
      ctx.lineTo(0, 10.4);
      ctx.lineTo(4.9, 8);
      ctx.stroke();

      // wingtip beacons
      ctx.globalAlpha = intro * (0.25 + 0.75 * Math.abs(Math.sin(now / 480)));
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(16, 12.4, 1.6, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-16, 12.4, 1.6, 0, TAU);
      ctx.fill();
      ctx.restore();

      // ── telemetry ───────────────────────────────────────────────────
      if (pos.current) pos.current.textContent = `X ${String(Math.round(ship.x)).padStart(4, "0")} · Y ${String(Math.round(ship.y)).padStart(5, "0")}`;
      if (vel.current) {
        const hdg = Math.round((((ship.a + Math.PI / 2) % TAU) + TAU) % TAU * (180 / Math.PI));
        vel.current.textContent = `VEL ${speed.toFixed(1)} · HDG ${String(hdg).padStart(3, "0")}°`;
      }
      if (sector.current) {
        const here = nodes.filter((nd) => nd.y - 200 < ship.y).pop();
        sector.current.textContent = here ? `SECTOR ${here.index} ${here.label.toUpperCase()}` : "SECTOR —";
      }
      if (target.current) {
        if (near) target.current.textContent = `TARGET ${near.label.toUpperCase()} — ↵ ${near.href ?? "JUMP"}`;
        else if (nearest) {
          // Point at the closest waypoint so nobody flies around lost.
          const dy = nearest.y - ship.y;
          const dx = nearest.x - ship.x;
          const arrow = Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? "↑" : "↓") : dx < 0 ? "←" : "→";
          target.current.textContent = `NEAREST ${nearest.label.toUpperCase()} ${arrow} ${Math.round(nearestD)}`;
        } else target.current.textContent = "NO WAYPOINTS";
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", resize);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", measure);
      lenis?.start();
    };
  }, [onExit, router, reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      <canvas ref={canvas} className="absolute inset-0" />
      <div ref={hud} className="label absolute bottom-6 left-gutter space-y-1.5 border border-accent/40 bg-bg/70 px-4 py-3 text-accent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Space mode // online
        </div>
        <div ref={pos} className="tnum text-fg">X 0000 · Y 00000</div>
        <div ref={vel} className="tnum text-fg">VEL 0.0 · HDG 000°</div>
        <div ref={sector} className="text-muted">SECTOR —</div>
        <div ref={target} className="text-muted">NO TARGET IN RANGE</div>
        <div className="border-t border-accent/30 pt-1.5 text-muted">↑/w thrust · ↓ brake · ← → steer · ↵ enter · esc exit</div>
      </div>
    </div>
  );
}
