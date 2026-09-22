"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/content/site";
import { bootPhase, onBootReveal } from "@/lib/boot";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { useSection } from "@/lib/section-store";
import { TransitionLink } from "./PageTransition";
import { Clock } from "./ui/Clock";

/**
 * Minimal editorial nav: wordmark, a live section "lap" indicator, six
 * chapters and a quiet CV link. Below 1024px it becomes a wordmark, the
 * current section label and a full-screen menu.
 */
export function Navigation({ cvHref }: { cvHref: string | null }) {
  const pathname = usePathname();
  const section = useSection();
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLHeadElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const speed = useRef<HTMLSpanElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);
  const pickFromMenu = useCallback(() => setOpen(false), []);

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

  // Arrives after the hero's type in the opening sequence: as the preloader
  // opens on a first visit, or on a short delay otherwise.
  useGSAP((_ctx, contextSafe) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const booting = bootPhase() === "loading";
      gsap.set(bar.current, { autoAlpha: 0 });
      return onBootReveal(
        contextSafe!(() => {
          gsap.fromTo(bar.current, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.9, delay: booting ? 0.7 : 0.85, ease: "expo.out" });
        }),
      );
    });
  });

  return (
    <>
      {/* Difference-blended so it stays legible over ink, paper, photos and giant type. */}
      <header ref={bar} className="nav-blend fixed inset-x-0 top-0 z-[100]">
        <div className="relative grid h-nav grid-cols-[auto_1fr_auto] items-center gap-4 px-gutter lg:grid-cols-[auto_auto_1fr_auto] lg:gap-6">
          <TransitionLink
            href="/"
            transitionLabel="Abhi"
            aria-label={`${site.short} — home`}
            className="group flex items-baseline gap-2 justify-self-start"
          >
            <span className="display text-[30px] leading-none">{site.short}</span>
            <span className="label text-muted transition-colors group-hover:text-accent">/ {site.edition.slice(2)}</span>
          </TransitionLink>

          {/* Lap indicator: where you are on the page. Compact on small screens. */}
          <div className="label flex min-w-0 items-center justify-center gap-3 lg:justify-start" aria-hidden>
            <span className="tnum text-accent">
              [{section.index}
              <span className="hidden lg:inline">/{section.total}</span>]
            </span>
            <span className="truncate lg:min-w-[10ch]">{section.label}</span>
            <span className="relative hidden h-px w-16 overflow-hidden bg-line lg:block">
              <span ref={progress} className="absolute inset-0 origin-left bg-fg" style={{ transform: "scaleX(0)" }} />
            </span>
            <span className="hud-only tnum hidden xl:inline">
              V <span ref={speed}>0.00</span> k/s
            </span>
          </div>

          <nav aria-label="Primary" className="hidden justify-self-end lg:block">
            <ol className="label flex items-center gap-5 xl:gap-6">
              {navLinks.map((l, i) => (
                <li key={l.href}>
                  <TransitionLink href={`/${l.href}`} transitionLabel={l.label} className="link-line group py-2">
                    <span className="mr-1 text-[9px] text-muted transition-colors group-hover:text-accent">0{i + 1}</span>
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex items-center justify-self-end gap-4">
            <span className="label hidden text-muted 2xl:block">
              <Clock />
            </span>
            {cvHref ? (
              <a
                href={cvHref}
                download
                className="label hidden border border-line px-2.5 py-1.5 transition-colors hover:border-fg md:inline-block"
              >
                CV ↓
              </a>
            ) : null}
            <button
              ref={menuButton}
              type="button"
              className="label -mr-2 px-2 py-3 lg:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
            >
              Menu <span className="text-accent">+</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={closeMenu} onPick={pickFromMenu} cvHref={cvHref} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  onPick,
  cvHref,
}: {
  open: boolean;
  onClose: () => void;
  onPick: () => void;
  cvHref: string | null;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLAnchorElement>(null);
  const mounted = useRef(false);

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
        gsap.fromTo(items, { yPercent: 110, y: 0 }, { yPercent: 0, duration: reduce ? 0 : 0.9, stagger: 0.05, delay: reduce ? 0 : 0.25, ease: "expo.out" });
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

  // Lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => first.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!focusables.length) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, onClose]);

  const socials = [
    { k: "GitHub", href: site.links.github },
    { k: "LinkedIn", href: site.links.linkedin },
    { k: "Email", href: site.email ? `mailto:${site.email}` : null },
  ].filter((s): s is { k: string; href: string } => Boolean(s.href));

  return (
    <div
      ref={panel}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-surface="ink"
      className="invisible fixed inset-0 z-[110] flex flex-col overflow-y-auto px-gutter pb-6 lg:hidden"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      inert={!open}
    >
      <div className="flex h-nav shrink-0 items-center justify-between">
        <span className="display text-[30px] leading-none">{site.short}</span>
        <button type="button" className="label -mr-2 px-2 py-3" onClick={onClose}>
          Close <span className="text-accent">×</span>
        </button>
      </div>

      <nav aria-label="Menu" className="mt-[4vh]">
        <ol>
          {navLinks.map((l, i) => (
            <li key={l.href} className="mask border-b border-line">
              <TransitionLink
                ref={i === 0 ? first : undefined}
                href={`/${l.href}`}
                transitionLabel={l.label}
                onClick={onPick}
                data-menu-item
                className="flex items-end justify-between py-1"
              >
                <span className="display text-[min(15vw,9vh)] leading-[0.86]">{l.label}</span>
                <span className="label mb-2 tnum text-muted">0{i + 1}</span>
              </TransitionLink>
            </li>
          ))}
        </ol>
      </nav>

      <div className="label mt-6 flex flex-wrap gap-2">
        <TransitionLink href="/#short" onClick={onPick} className="border border-line px-3 py-2">
          The short version →
        </TransitionLink>
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
        <span>© {site.edition}</span>
      </div>
    </div>
  );
}
