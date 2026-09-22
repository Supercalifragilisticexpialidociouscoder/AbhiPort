"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { useSection } from "@/lib/section-store";
import { TransitionLink } from "./PageTransition";
import { Clock } from "./ui/Clock";

/**
 * Minimal editorial nav: wordmark, a live section/lap indicator, four links
 * and local time. Collapses to a full-screen menu under 768px.
 */
export function Navigation() {
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

  // Arrives last in the load sequence.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(bar.current, { autoAlpha: 0, y: -12, duration: 0.9, delay: 0.85, ease: "expo.out" });
    });
  });

  return (
    <>
      {/* Difference-blended so it stays legible over ink, paper, photos and giant type. */}
      <header ref={bar} className="nav-blend fixed inset-x-0 top-0 z-[100]">
        <div className="relative grid h-nav grid-cols-[1fr_auto] items-center gap-6 px-gutter md:grid-cols-[1fr_auto_1fr] lg:grid-cols-[1fr_auto_auto_1fr]">
          <TransitionLink
            href="/"
            transitionLabel="Abhi"
            aria-label={`${site.short} — home`}
            className="group flex items-baseline gap-2 justify-self-start"
          >
            <span className="display text-[30px] leading-none">{site.short}</span>
            <span className="label text-muted transition-colors group-hover:text-accent">/ {site.edition.slice(2)}</span>
          </TransitionLink>

          {/* Lap indicator: where you are on the page. */}
          <div className="label hidden items-center gap-3 lg:flex" aria-hidden>
            <span className="tnum text-accent">
              [{section.index}/{section.total}]
            </span>
            <span className="min-w-[9ch]">{section.label}</span>
            <span className="relative h-px w-20 overflow-hidden bg-line">
              <span ref={progress} className="absolute inset-0 origin-left scale-x-0 bg-fg" />
            </span>
            <span className="hud-only tnum">
              V <span ref={speed}>0.00</span> k/s
            </span>
          </div>

          <nav aria-label="Primary" className="hidden justify-self-center md:block lg:justify-self-end">
            <ul className="label flex items-center gap-5 xl:gap-7">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={`/${l.href}`} transitionLabel={l.label} className="link-line py-2">
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="label hidden justify-self-end text-muted md:block">
            <Clock />
          </div>

          <button
            ref={menuButton}
            type="button"
            className="label -mr-2 justify-self-end px-2 py-3 md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            Menu <span className="text-accent">+</span>
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={closeMenu} onPick={pickFromMenu} />
    </>
  );
}

function MobileMenu({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: () => void }) {
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
        gsap.fromTo(items, { yPercent: 110, y: 0 }, { yPercent: 0, duration: reduce ? 0 : 0.9, stagger: 0.06, delay: reduce ? 0 : 0.25, ease: "expo.out" });
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

  return (
    <div
      ref={panel}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-surface="ink"
      className="invisible fixed inset-0 z-[110] flex flex-col px-gutter pb-6 md:hidden"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      inert={!open}
    >
      <div className="flex h-nav items-center justify-between">
        <span className="display text-[30px] leading-none">{site.short}</span>
        <button type="button" className="label -mr-2 px-2 py-3" onClick={onClose}>
          Close <span className="text-accent">×</span>
        </button>
      </div>

      <nav aria-label="Menu" className="mt-[8vh]">
        <ol className="space-y-1">
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
                <span className="display text-[21vw] leading-[0.86]">{l.label}</span>
                <span className="label mb-3 tnum text-muted">0{i + 1}</span>
              </TransitionLink>
            </li>
          ))}
        </ol>
      </nav>

      <div className="label mt-auto flex items-end justify-between gap-4 text-muted">
        <Clock />
        <span>© {site.edition}</span>
      </div>
    </div>
  );
}
