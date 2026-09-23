"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { featuredProjects, isExternal, projectHref, projects, type Project } from "@/content/projects";
import { sections, work } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { scrollToTarget } from "@/lib/scroll";
import { TransitionLink } from "../PageTransition";
import { Known } from "../ui/Ph";
import { SectionHead } from "../ui/SectionHead";
import { StatusChip } from "../ui/StatusChip";
import { World } from "./worlds";

/**
 * 04 — Work, as a film.
 *
 * Eight projects, eight scenes, one viewport. Scrolling cuts between them:
 * the next scene wipes across the last one while its world — a diagram built
 * from what the project actually is — starts running. The visitor always
 * knows where they are (03 / 08), can jump with the strip along the bottom
 * or the arrow keys, and is never trapped: the film ends and the page
 * carries on. Mobile and reduced motion get the same eight scenes stacked,
 * still, and fully readable.
 */

/** What one scene has to do with the next. Shown mid-cut. */
const BRIDGES = [
  "Campus system → company",
  "Company → organisation",
  "People → the room they fill",
  "One room → the whole planet",
  "Earth data → orbit",
  "Simulation → something unnamed",
  "Unnamed → the thing you are inside",
];

export function WorkFilm() {
  const root = useRef<HTMLElement>(null);
  const bridge = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const current = useRef(0);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const s = sections.work;
  const films = featuredProjects;
  const n = films.length;
  const more = projects.length - n;

  /** Jump the film to scene i (desktop only — elsewhere it's a plain page). */
  const goto = useCallback((i: number) => {
    const st = trigger.current;
    if (!st) return;
    scrollToTarget(st.start + ((st.end - st.start) * i) / (n - 1) + 2);
  }, [n]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          q("[data-work-char]"),
          { yPercent: 105, y: 0 },
          { yPercent: 0, duration: 1.2, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: q("[data-work-title]")[0], start: "top 85%", once: true } },
        );
        gsap.fromTo(
          q("[data-work-intro]"),
          { yPercent: 105, y: 0 },
          { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: q("[data-work-intro]")[0], start: "top 88%", once: true } },
        );
      });

      // The film: one viewport, pinned, cutting between eight scenes.
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const host = root.current;
        const stage = q("[data-stage]")[0] as HTMLElement;
        const scenes = q("[data-scene]") as HTMLElement[];
        const inners = scenes.map((el) => el.querySelector<HTMLElement>("[data-scene-inner]"));
        if (!host || !stage || scenes.length < 2) return;
        host.dataset.film = "pinned";
        setPinned(true);

        // A film holds on a shot, cuts quickly, then holds again — so most of
        // the scroll sits on a settled scene and the wipe happens in between.
        const CUT_IN = 0.36;
        const CUT_OUT = 0.76;
        const worlds = scenes.map((el) => el.querySelector<HTMLElement>("[data-world]"));
        const edge = q("[data-cut]")[0] as HTMLElement | undefined;

        const render = (p: number) => {
          const x = p * (n - 1);
          const i = Math.min(n - 2, Math.floor(x + 1e-6));
          const f = Math.max(0, Math.min(1, x - i));
          const u = Math.max(0, Math.min(1, (f - CUT_IN) / (CUT_OUT - CUT_IN)));
          const w = u * u * (3 - 2 * u); // smoothstep
          const live = w > 0.5 ? i + 1 : i;
          if (live !== current.current) {
            current.current = live;
            setActive(live);
          }
          scenes.forEach((el, j) => {
            const outgoing = j === i;
            const incoming = j === i + 1 && w > 0;
            if (!outgoing && !incoming) {
              if (el.style.visibility !== "hidden") el.style.visibility = "hidden";
              return;
            }
            el.style.visibility = "visible";
            el.style.clipPath = incoming ? `inset(0 0 0 ${((1 - w) * 100).toFixed(2)}%)` : "inset(0 0 0 0)";
            el.style.opacity = outgoing ? String(1 - w * 0.45) : "1";
            // Depth on the diagram only — the title never leaves the gutter.
            const world = worlds[j];
            if (world) world.style.transform = `translate3d(${((incoming ? 1 - w : -w) * 4).toFixed(2)}%,0,0)`;
          });
          // The cut itself: a hard edge, like a splice.
          if (edge) {
            edge.style.opacity = w > 0.01 && w < 0.99 ? "1" : "0";
            edge.style.left = `${((1 - w) * 100).toFixed(2)}%`;
          }
          // Mid-cut, name the relationship between the two scenes.
          if (bridge.current) {
            bridge.current.style.opacity = w > 0.08 && w < 0.92 ? String(Math.min(1, Math.sin(w * Math.PI) * 1.6)) : "0";
            const text = BRIDGES[Math.min(BRIDGES.length - 1, i)];
            if (bridge.current.textContent !== text) bridge.current.textContent = text;
          }
        };

        const st = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 0.9) * (n - 1)}`,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => render(self.progress),
        });
        trigger.current = st;
        render(0);
        // The pin adds page height, so every section below it moves: force one
        // refresh so the theme director re-measures with the film in place.
        requestAnimationFrame(() => ScrollTrigger.refresh());

        // Arrow keys move scene to scene while the film has the viewport.
        const onKey = (e: KeyboardEvent) => {
          if (!st.isActive || e.metaKey || e.ctrlKey || e.altKey) return;
          const el = document.activeElement;
          if (el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
          const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          goto(Math.max(0, Math.min(n - 1, current.current + dir)));
        };
        window.addEventListener("keydown", onKey);

        return () => {
          window.removeEventListener("keydown", onKey);
          st.kill();
          trigger.current = null;
          delete host.dataset.film;
          setPinned(false);
          scenes.forEach((el, j) => {
            el.style.cssText = "";
            const inner = inners[j];
            if (inner) inner.style.transform = "";
          });
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={s.id} data-theme="ink" data-index={s.index} data-label={s.label} aria-labelledby="work-title" className="relative">
      {/* Title card */}
      <div className="px-gutter pt-[14vh]">
        <SectionHead index={s.index} title="Work — the film" aside={`${pad(n)} scenes · ${pad(more)} more in the archive`} />
        <div className="mt-6 overflow-hidden">
          <h2 id="work-title" data-work-title className="display whitespace-nowrap text-[length:calc((100vw-2*var(--gutter))/2.1)] leading-[0.78] lg:text-[min(26vw,54vh)]">
            {"Work".split("").map((c, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <span data-work-char className="inline-block">
                  {c}
                </span>
              </span>
            ))}
          </h2>
        </div>
        <div className="mt-6 max-w-[62ch] border-t border-line pt-5 lg:mt-8">
          <p className="overflow-hidden">
            <span data-work-intro className="inline-block text-[clamp(17px,2vw,24px)] leading-[1.35]">{work.headline}</span>
          </p>
          <p className="overflow-hidden">
            <span data-work-intro className="mt-1 inline-block text-[clamp(17px,2vw,24px)] leading-[1.35] text-muted">{work.sub}</span>
          </p>
        </div>
      </div>

      {/* The film */}
      <div data-stage className="film-stage relative mt-[8vh] lg:mt-[10vh]">
        <div className="film-scenes">
          {films.map((p, i) => (
            <Scene key={p.slug} p={p} i={i} n={n} pinned={pinned} filmActive={active === i} />
          ))}
        </div>

        <span data-cut aria-hidden className="film-cut pointer-events-none absolute inset-y-0 z-40 w-px bg-accent opacity-0" />

        {/* Where you are, and how to move */}
        <div className="film-hud pointer-events-none absolute inset-x-0 bottom-0 z-50 hidden items-end justify-between gap-6 px-gutter pb-6">
          <div className="label pointer-events-auto flex items-center gap-4">
            <span className="tnum text-accent">{pad(active + 1)}</span>
            <span className="text-muted">/ {pad(n)}</span>
            <span className="max-w-[28ch] truncate text-fg">{films[active]?.title}</span>
          </div>
          <div ref={bridge} className="label absolute inset-x-0 bottom-7 text-center text-muted opacity-0" aria-hidden />
          <div className="pointer-events-auto flex items-center gap-1.5">
            {films.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goto(i)}
                aria-label={`Scene ${i + 1}: ${p.title}`}
                aria-current={active === i}
                className={cn("h-6 border-b-2 transition-all duration-300", active === i ? "w-10 border-accent" : "w-5 border-line hover:border-fg")}
              />
            ))}
            <span className="label ml-3 hidden text-muted xl:inline">← → to cut</span>
          </div>
        </div>
      </div>

      {/* The row with no name on it, then the way out */}
      <div className="px-gutter pb-[14vh] pt-[10vh]">
        <div id={work.inUse.id} className="grid gap-6 border-y border-line py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
          <div className="flex items-baseline gap-4">
            <span className="label text-accent">{work.inUse.label}</span>
            <h3 className="display text-[clamp(30px,5vw,64px)] leading-[0.9]">{work.inUse.title}</h3>
          </div>
          <div>
            <p className="text-[clamp(15px,1.6vw,19px)] leading-[1.45] text-muted">{work.inUse.line}</p>
            <p className="label mt-2 text-muted">{work.inUse.category}</p>
          </div>
        </div>
        <TransitionLink
          href="/archive"
          transitionLabel="Archive"
          className="label group mt-8 inline-flex items-center gap-3 border border-line px-5 py-4 transition-colors hover:border-fg"
        >
          {work.archiveCta} <span className="arrow-nudge-x text-accent">→</span>
        </TransitionLink>
      </div>
    </section>
  );
}

/* ── One scene ─────────────────────────────────────────────────────────── */

function Scene({ p, i, n, pinned, filmActive }: { p: Project; i: number; n: number; pinned: boolean; filmActive: boolean }) {
  const el = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Pinned, the film says which scene is live. Stacked — mobile, reduced
  // motion — each scene wakes its own world as it arrives.
  useEffect(() => {
    if (pinned) return;
    const node = el.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "5% 0px" });
    io.observe(node);
    return () => io.disconnect();
  }, [pinned]);

  const live = pinned ? filmActive : inView;
  const href = projectHref(p);
  const meta: [string, React.ReactNode][] = [
    ["Role", <Known key="r" value={p.role} todo="ADD ROLE" />],
    ["Status", p.status ? <StatusChip key="s" status={p.status} /> : <Known key="s" value={null} todo="ADD STATUS" />],
    ["Year", <Known key="y" value={p.year} todo="ADD YEAR" />],
  ];

  return (
    <article ref={el} data-scene style={{ zIndex: i }} className="film-scene relative">
      <div data-scene-inner className="grid h-full gap-8 px-gutter py-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12 lg:py-[9vh]">
        <div className="flex min-w-0 flex-col justify-center">
          <div className="label flex items-center gap-3">
            <span className="tnum text-accent">{pad(i + 1)}</span>
            <span className="text-muted">/ {pad(n)}</span>
            <span aria-hidden className="h-px w-8 bg-line" />
            <span className="truncate text-muted">{p.reel?.category ?? p.category}</span>
          </div>

          <h3 className="display mt-4 text-[clamp(38px,9vw,92px)] leading-[0.86] lg:text-[clamp(44px,4.6vw,96px)]">
            {p.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h3>

          <p className="mt-5 max-w-[46ch] text-[clamp(16px,1.7vw,21px)] leading-[1.4] text-muted">{p.reel?.line ?? p.tagline}</p>

          <dl className="label mt-7 grid grid-cols-3 gap-4 border-t border-line pt-4">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="mt-1.5 text-fg">{v}</dd>
              </div>
            ))}
          </dl>

          {href ? (
            isExternal(href) ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="label group mt-7 inline-flex w-fit items-center gap-3 border border-line px-5 py-3.5 transition-colors hover:border-fg">
                Open <span className="arrow-nudge-x text-accent">↗</span>
              </a>
            ) : (
              <TransitionLink
                href={href}
                transitionLabel={p.title}
                className="label group mt-7 inline-flex w-fit items-center gap-3 border border-line px-5 py-3.5 transition-colors hover:border-fg"
              >
                Open {p.title} <span className="arrow-nudge-x text-accent">→</span>
              </TransitionLink>
            )
          ) : null}
        </div>

        <div data-world className="min-h-[46vh] lg:h-[68vh]">
          <World slug={p.slug} live={live} />
        </div>
      </div>
    </article>
  );
}
