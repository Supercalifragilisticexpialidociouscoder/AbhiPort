"use client";

import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { club, howIBuild, indexLinks, races, site } from "@/content/site";
import { credentials, hackathons, roles } from "@/content/community";
import { labEntries } from "@/content/lab";
import { featuredProjects, projects } from "@/content/projects";
import { bootPhase, onBootReveal } from "@/lib/boot";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { overlays, useOverlay, useOverlayKey } from "@/lib/overlays";
import { useSection } from "@/lib/section-store";
import { useDialog } from "@/lib/use-dialog";
import { cn } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { Clock } from "./ui/Clock";
import { RaceTime } from "./ui/RaceTime";
import { PartGlyph } from "./visuals/PartGlyph";
import { QrGlyph } from "./visuals/Signatures";

const PHASE_LABEL = { build: "Build", break: "Break", rebuild: "Rebuild" } as const;

/**
 * Almost invisible until you need it: the wordmark, where you are (chapter,
 * phase, progress) and two buttons — Quick look (the 30-second version) and
 * Index (the whole map). Difference-blended so it reads over anything.
 */
export function Navigation({ cvHref, heroSrc }: { cvHref: string | null; heroSrc: string | null }) {
  const pathname = usePathname();
  const section = useSection();
  const overlay = useOverlay();
  const bar = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const speed = useRef<HTMLSpanElement>(null);

  // Page progress hairline, plus a scroll-velocity readout that only shows
  // in garage (telemetry) mode.
  useGSAP(
    () => {
      let idle = 0;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (progress.current) progress.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          if (speed.current) {
            speed.current.textContent = (Math.abs(self.getVelocity()) / 1000).toFixed(2);
            window.clearTimeout(idle);
            idle = window.setTimeout(() => {
              if (speed.current) speed.current.textContent = "0.00";
            }, 160);
          }
        },
      });
      return () => {
        window.clearTimeout(idle);
        st.kill();
      };
    },
    { dependencies: [pathname] },
  );

  // Arrives after the hero's type in the opening sequence. The media
  // context's own contextSafe, not useGSAP's: with no boot, the reveal runs
  // right away, inside this context, and binding it to the outer one would
  // nest the two contexts in each other (GSAP then recurses forever on revert).
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, (_ctx, contextSafe) => {
      const booting = bootPhase() === "loading";
      gsap.set(bar.current, { autoAlpha: 0 });
      return onBootReveal(
        contextSafe!(() => {
          gsap.fromTo(bar.current, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.9, delay: booting ? 0.9 : 0.85, ease: "expo.out" });
        }) as () => void,
      );
    });
  });

  return (
    <>
      <header ref={bar} className="nav-blend fixed inset-x-0 top-0 z-[100]">
        <div className="relative grid h-nav grid-cols-[auto_1fr_auto] items-center gap-4 px-gutter lg:gap-8">
          <TransitionLink
            href="/"
            transitionLabel="Abhi"
            aria-label={`${site.short} — home`}
            className="group flex items-baseline gap-2 justify-self-start"
          >
            <span className="display text-[30px] leading-none">{site.short}</span>
            <span className="label text-muted transition-colors group-hover:text-accent">/ {site.edition.slice(2)}</span>
          </TransitionLink>

          {/* Where you are: chapter, phase, progress. */}
          <div className="label flex min-w-0 items-center gap-3" aria-hidden>
            <span className="tnum text-accent">
              [{section.index}
              <span className="hidden lg:inline">/{section.total}</span>]
            </span>
            <span className="truncate lg:min-w-[9ch]">{section.label}</span>
            <span className="nav-phase hidden md:inline" data-phase={section.phase}>
              {PHASE_LABEL[section.phase]}
            </span>
            <span className="relative hidden h-px w-16 overflow-hidden bg-line lg:block">
              <span ref={progress} className="absolute inset-0 origin-left bg-fg" style={{ transform: "scaleX(0)" }} />
            </span>
            <span className="hud-only tnum hidden xl:inline">
              V <span ref={speed}>0.00</span> k/s
            </span>
          </div>

          <div className="flex items-center justify-self-end gap-1 md:gap-3">
            <span className="label flex items-center gap-2 pr-1 text-muted md:pr-2" title="Your time in race mode">
              <span className="hidden xl:inline">Race time</span>
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="sr-only">Your time on this site</span>
              <RaceTime className="tnum text-fg" />
            </span>
            <button type="button" onClick={() => overlays.open("quickLook")} className="label link-line hidden px-2 py-3 sm:block">
              Quick look
            </button>
            <button
              type="button"
              aria-expanded={overlay === "index"}
              aria-controls="site-index"
              onClick={() => overlays.toggle("index")}
              className="label group -mr-2 flex items-center gap-2 px-2 py-3"
            >
              Index
              <span aria-hidden className="nav-burger">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <IndexMenu open={overlay === "index"} cvHref={cvHref} heroSrc={heroSrc} />
    </>
  );
}

/** The whole map. Every chapter, each with a small preview of what's there. */
function IndexMenu({ open, cvHref, heroSrc }: { open: boolean; cvHref: string | null; heroSrc: string | null }) {
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const [active, setActive] = useState(0);
  const close = useCallback(() => overlays.close(), []);
  useDialog(panel, open, close);
  useOverlayKey("i", "index");

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      const reduce = window.matchMedia(REDUCED).matches;
      const items = el.querySelectorAll("[data-menu-item]");
      if (open) {
        gsap.set(el, { visibility: "visible" });
        gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0 : 0.7, ease: "expo.inOut" });
        gsap.fromTo(items, { yPercent: 110, y: 0 }, { yPercent: 0, duration: reduce ? 0 : 0.9, stagger: 0.045, delay: reduce ? 0 : 0.25, ease: "expo.out" });
      } else {
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: reduce ? 0 : 0.55,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
          },
        });
      }
    },
    { dependencies: [open] },
  );

  const socials = [
    { k: "GitHub", href: site.links.github },
    { k: "LinkedIn", href: site.links.linkedin },
    { k: "Email", href: site.email ? `mailto:${site.email}` : null },
  ].filter((s): s is { k: string; href: string } => Boolean(s.href));

  return (
    <div
      ref={panel}
      id="site-index"
      role="dialog"
      aria-modal="true"
      aria-label="Index"
      data-surface="ink"
      className="invisible fixed inset-0 z-[110] flex flex-col overflow-y-auto px-gutter pb-6"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      inert={!open}
      data-lenis-prevent
    >
      <div className="flex h-nav shrink-0 items-center justify-between gap-4">
        <span className="display text-[30px] leading-none">{site.short}</span>
        <span className="label hidden text-muted md:block">
          The map — {indexLinks.filter((l) => !l.room).length} chapters · {indexLinks.filter((l) => l.room).length} rooms · <kbd className="text-fg">I</kbd> index · <kbd className="text-fg">Q</kbd> quick look ·{" "}
          <kbd className="text-accent" title="Unlisted subsystem">
            S
          </kbd>{" "}
          <span className="text-accent">?</span>
        </span>
        <button type="button" className="label -mr-2 px-2 py-3" onClick={close}>
          Close <span className="text-accent">×</span>
        </button>
      </div>

      <div className="mt-[3vh] grid flex-1 gap-10 lg:grid-cols-12 lg:gap-6">
        <nav aria-label="Site map" className="lg:col-span-7">
          <p className="label mb-2 flex justify-between gap-4 text-muted">
            <span>
              <span className="text-fg">↓</span> Chapter on the home page · <span className="text-accent">↗</span> Room of its own
            </span>
          </p>
          <ol>
            {indexLinks.map((l, i) => (
              <li key={l.href} className="mask border-b border-line">
                <TransitionLink
                  href={l.href}
                  transitionLabel={l.label}
                  onClick={close}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  data-menu-item
                  data-cursor="Go"
                  className="group flex items-end justify-between gap-4 py-1"
                >
                  <span className="flex items-baseline gap-4">
                    <span className={cn("label tnum transition-colors", active === i ? "text-accent" : "text-muted")}>{l.n}</span>
                    <span className="display text-[min(11vw,6.1vh)] leading-[0.9] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-3">
                      {l.label}
                    </span>
                    <span aria-hidden className={cn("label", l.room ? "text-accent" : "text-muted")}>
                      {l.room ? `↗ ${l.href}` : "↓"}
                    </span>
                  </span>
                  <span className="label mb-2 hidden max-w-[28ch] text-right text-muted xl:block">{l.note}</span>
                </TransitionLink>
              </li>
            ))}
          </ol>
        </nav>

        <aside aria-hidden className="relative hidden lg:col-span-5 lg:block">
          <div key={active} className="index-preview sticky top-0 flex h-full min-h-[50vh] flex-col justify-between border border-line p-6">
            <IndexPreview kind={indexLinks[active].preview} heroSrc={heroSrc} />
            <p className="label mt-6 flex justify-between gap-4 text-muted">
              <span>{indexLinks[active].n}</span>
              <span className="text-right">{indexLinks[active].note}</span>
            </p>
          </div>
        </aside>
      </div>

      <div className="label mt-8 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => overlays.open("quickLook")} className="bg-accent px-3 py-2 text-bg">
          Quick look →
        </button>
        {cvHref ? (
          <a href={cvHref} download className="border border-line px-3 py-2">
            CV ↓
          </a>
        ) : null}
        {socials.map((s) => (
          <a
            key={s.k}
            href={s.href}
            target={s.k === "Email" ? undefined : "_blank"}
            rel={s.k === "Email" ? undefined : "noopener noreferrer"}
            className="border border-line px-3 py-2"
          >
            {s.k}
          </a>
        ))}
      </div>

      <div className="label mt-auto flex items-end justify-between gap-4 pt-8 text-muted">
        <Clock />
        <span>© {site.edition} {site.name}</span>
      </div>
    </div>
  );
}

/** A small, honest glimpse of each chapter — drawn from the same content. */
function IndexPreview({ kind, heroSrc }: { kind: (typeof indexLinks)[number]["preview"]; heroSrc: string | null }) {
  switch (kind) {
    case "home":
      return (
        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          <span className="display text-[9vw] leading-[0.8] [--wdth:110]">ABHI</span>
          {heroSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- a tiny decorative preview of an already-loaded image
            <img src={heroSrc} alt="" className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2 object-contain" />
          ) : null}
        </div>
      );
    case "story":
      return (
        <dl className="grid flex-1 content-center gap-4">
          {[
            ["Age", "18"],
            ["Based", site.location],
            ["Studying", site.study],
            ["Hackathons", `${races.credential.value} ${races.credential.label}`],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-line pb-3">
              <dt className="label text-muted">{k}</dt>
              <dd className="text-[clamp(18px,1.5vw,24px)]">{v}</dd>
            </div>
          ))}
        </dl>
      );
    case "work":
      return (
        <div className="flex flex-1 flex-col justify-center gap-6">
          <QrGlyph className="h-40 w-40 text-fg" />
          <ol className="grid gap-1">
            {featuredProjects.map((p) => (
              <li key={p.slug} className="flex items-baseline gap-3">
                <span className="label tnum text-accent">{p.number}</span>
                <span className="display text-[clamp(22px,1.8vw,32px)] leading-none">{p.title}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case "lab":
      return (
        <div className="flex flex-1 flex-col justify-center gap-6">
          <div className="grid grid-cols-5 gap-4">
            {labEntries.slice(0, 10).map((e) => (
              <PartGlyph key={e.slug} name={e.glyph} className="h-auto w-full text-fg" />
            ))}
          </div>
          <ol className="label grid grid-cols-2 gap-x-6 gap-y-1">
            {labEntries.map((e) => (
              <li key={e.slug} className="flex gap-2">
                <span className="tnum text-accent">{e.number}</span>
                <span>{e.title}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case "research":
      return (
        <div className="flex flex-1 flex-col justify-center gap-5">
          <span className="display text-[clamp(56px,6vw,110px)] leading-[0.8]">Certus-S2</span>
          <p className="text-[18px] leading-snug">When can you trust a pixel a model made up?</p>
          <p className="label text-muted">Sentinel-2 · super-resolution · STAC · Planetary Computer</p>
        </div>
      );
    case "how":
      return (
        <ol className="flex flex-1 flex-col justify-center gap-2">
          {howIBuild.loop.map((st, i) => (
            <li key={st.label} className="flex items-baseline gap-4 border-b border-line pb-2">
              <span className="label tnum text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-[clamp(28px,2.4vw,42px)] leading-none">{st.label}</span>
            </li>
          ))}
        </ol>
      );
    case "credentials":
      return (
        <div className="flex flex-1 flex-col justify-center gap-4">
          <span className="display tnum text-[16vh] leading-[0.8]">{String(credentials.length).padStart(2, "0")}</span>
          <ul className="label grid gap-1 text-muted">
            {credentials.map((c) => (
              <li key={c.slug}>{c.title}</li>
            ))}
          </ul>
        </div>
      );
    case "experience":
      return (
        <ol className="flex flex-1 flex-col justify-center gap-4">
          {roles.map((r) => (
            <li key={r.title + r.org} className="border-b border-line pb-3">
              <span className="display block text-[clamp(26px,2.2vw,38px)] leading-none">{r.title}</span>
              <span className="label mt-1 block text-muted">{r.org}</span>
            </li>
          ))}
        </ol>
      );
    case "community":
      return (
        <div className="flex flex-1 items-center gap-6">
          <span className="display text-[18vh] leading-[0.8] text-accent">8</span>
          <ul className="label grid gap-1">
            {club.clubs.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      );
    case "race":
      return (
        <div className="flex flex-1 flex-col justify-center">
          <span className="display tnum text-[20vh] leading-[0.8] text-accent">{races.credential.value}</span>
          <span className="display mt-4 text-[clamp(26px,2.2vw,38px)] leading-[0.95]">{races.credential.label}</span>
          <ul className="label mt-6 grid gap-1 text-muted">
            {hackathons.map((h) => (
              <li key={h.slug}>{h.name}</li>
            ))}
          </ul>
        </div>
      );
    case "archive":
      return (
        <div className="flex flex-1 flex-col justify-center gap-4">
          <span className="display tnum text-[16vh] leading-[0.8]">{String(projects.length).padStart(2, "0")}</span>
          <p className="text-[15px] leading-relaxed text-muted">{projects.map((p) => p.title).join(" / ")}</p>
        </div>
      );
    case "contact":
      return (
        <div className="flex flex-1 flex-col justify-center gap-4">
          <span className="display text-[clamp(44px,4.4vw,80px)] leading-[0.9]">Build something.</span>
          {site.email ? <span className="text-[17px] text-muted">{site.email}</span> : null}
        </div>
      );
  }
}
