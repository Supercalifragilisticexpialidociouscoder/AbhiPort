"use client";

import { useCallback, useRef, useState } from "react";
import { club, now, quickLook, races, site } from "@/content/site";
import { featuredProjects, projectHref, projects } from "@/content/projects";
import { gsap, useGSAP, REDUCED } from "@/lib/gsap";
import { overlays, useOverlay, useOverlayKey } from "@/lib/overlays";
import { useDialog } from "@/lib/use-dialog";
import { TransitionLink } from "./PageTransition";
import { Clock } from "./ui/Clock";
import { Ph } from "./ui/Ph";
import { StatusChip } from "./ui/StatusChip";

/**
 * The fast path. Whatever the experience is doing, Q (or the Quick look
 * button) opens a plain, scannable summary: who he is, what he builds,
 * where he is, what he's doing now, the strongest evidence, the best work
 * and every way to get in touch. Experimental never has to mean confusing.
 */
export function QuickLook({ cvHref }: { cvHref: string | null }) {
  const open = useOverlay() === "quickLook";
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const [copied, setCopied] = useState(false);
  const close = useCallback(() => overlays.close(), []);
  useDialog(panel, open, close);
  useOverlayKey("q", "quickLook");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      const reduce = window.matchMedia(REDUCED).matches;
      const q = gsap.utils.selector(el);
      if (open) {
        gsap.set(el, { visibility: "visible" });
        gsap.fromTo(q("[data-ql-backdrop]"), { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.5, ease: "power2.out" });
        gsap.fromTo(q("[data-ql-panel]"), { xPercent: reduce ? 0 : 100, opacity: reduce ? 0 : 1 }, { xPercent: 0, opacity: 1, duration: reduce ? 0.2 : 0.8, ease: "expo.out" });
        gsap.fromTo(q("[data-ql-row]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: reduce ? 0 : 0.6, stagger: 0.03, delay: reduce ? 0 : 0.2, ease: "expo.out" });
      } else {
        gsap.to(q("[data-ql-backdrop]"), { opacity: 0, duration: reduce ? 0 : 0.4 });
        gsap.to(q("[data-ql-panel]"), {
          xPercent: reduce ? 0 : 100,
          opacity: reduce ? 0 : 1,
          duration: reduce ? 0.15 : 0.55,
          ease: "expo.in",
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
          },
        });
      }
    },
    { dependencies: [open] },
  );

  const [students, clubs, members] = club.stats;
  const n = (st: (typeof club.stats)[number]) => `${st.prefix}${st.value.toLocaleString("en-US")}`;
  const facts = [
    { k: races.credential.value, v: races.credential.label, accent: true },
    { k: "Founding", v: `Founding member — ${club.name}` },
    { k: "Head", v: `Head — across all ${clubs.value} clubs` },
    { k: n(members), v: "Members in the ecosystem" },
    { k: n(students), v: "Students on the campus it serves" },
    { k: "Shipped", v: quickLook.inUse },
  ];
  const best = featuredProjects.slice(0, 5);
  const current = [...now.building, now.learning ? `Learning: ${now.learning}` : null, now.exploring ? `Exploring: ${now.exploring}` : null].filter(
    (x): x is string => Boolean(x),
  );

  const copy = async () => {
    if (!site.email) return;
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <div ref={root} className="invisible fixed inset-0 z-[120]" inert={!open}>
      <div data-ql-backdrop aria-hidden className="absolute inset-0 bg-ink/70" onClick={close} />
      <div
        ref={panel}
        data-ql-panel
        role="dialog"
        aria-modal="true"
        aria-labelledby="ql-title"
        data-surface="paper"
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto overscroll-contain sm:w-[min(640px,100vw)]"
      >
        <div className="flex h-nav shrink-0 items-center justify-between gap-4 border-b border-line px-6 md:px-8">
          <p className="label flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
            {quickLook.title} <span className="text-muted">— {quickLook.aside}</span>
          </p>
          <button type="button" data-autofocus onClick={close} className="label -mr-2 px-2 py-3">
            Close <span className="text-accent">×</span>
          </button>
        </div>

        <div className="flex-1 px-6 pb-8 pt-8 md:px-8">
          <h2 id="ql-title" data-ql-row className="display text-[clamp(48px,7vw,84px)] leading-[0.86]">
            {site.name}
          </h2>
          <p data-ql-row className="label mt-4 flex flex-wrap gap-x-3 gap-y-1">
            <span>{quickLook.role}</span>
            <span className="text-muted">·</span>
            <span>{site.age}</span>
            <span className="text-muted">·</span>
            <span>{site.location}</span>
            <span className="text-muted">·</span>
            <span>{site.study}</span>
          </p>
          <p data-ql-row className="display-wide mt-6 text-[clamp(18px,2.4vw,26px)] leading-[1]">
            {quickLook.lead}
          </p>

          {/* What he builds · where he is · what he's doing now */}
          <dl className="mt-8 grid gap-px border-y border-fg bg-line sm:grid-cols-3">
            <div data-ql-row className="bg-bg py-4 sm:pr-4">
              <dt className="label text-muted">Builds</dt>
              <dd className="mt-2 text-[14px] leading-snug">{quickLook.builds}</dd>
            </div>
            <div data-ql-row className="bg-bg py-4 sm:px-4">
              <dt className="label text-muted">Where</dt>
              <dd className="mt-2 text-[14px] leading-snug">
                <span className="label block">
                  <Clock />
                </span>
                <span className="mt-1 block">{site.study}</span>
              </dd>
            </div>
            <div data-ql-row className="bg-bg py-4 sm:pl-4">
              <dt className="label text-muted">Currently</dt>
              <dd className="mt-2">
                <ul className="space-y-0.5 text-[14px] leading-snug">
                  {current.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <dl className="mt-8 border-t border-fg">
            {facts.map((f) => (
              <div key={f.v} data-ql-row className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-line py-3">
                <dt className={`display tnum text-[26px] leading-none ${f.accent ? "text-accent" : ""}`}>{f.k}</dt>
                <dd className="text-[15px] leading-snug">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div data-ql-row className="mt-10">
            <p className="label flex items-center justify-between border-b border-fg pb-2">
              <span>Best work</span>
              <TransitionLink href="/archive" transitionLabel="Archive" onClick={close} className="group inline-flex items-center gap-2 text-muted hover:text-fg">
                <span className="link-line">All {projects.length} in the archive</span>
                <span className="arrow-nudge-x text-accent">→</span>
              </TransitionLink>
            </p>
            <ul>
              {best.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <TransitionLink href={projectHref(p) ?? "/archive"} transitionLabel={p.title} onClick={close} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-3">
                    <span className="label tnum text-accent">{p.number}</span>
                    <span>
                      <span className="display block text-[24px] leading-none transition-transform group-hover:translate-x-1">{p.title}</span>
                      <span className="mt-1 block text-[14px] text-muted">{p.reel?.line ?? p.tagline}</span>
                    </span>
                    <StatusChip status={p.status} />
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          <div data-ql-row className="mt-10 flex flex-wrap gap-2">
            {cvHref ? (
              <a href={cvHref} download className="label bg-accent px-4 py-3 text-bg">
                Download CV ↓
              </a>
            ) : (
              <span className="label border border-dashed border-line px-4 py-3 text-muted">
                CV <Ph>Add file — public/cv/abhiram-reddy-cv.pdf</Ph>
              </span>
            )}
            {site.links.github ? (
              <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="label border border-line px-4 py-3 transition-colors hover:border-fg">
                GitHub ↗
              </a>
            ) : null}
            {site.links.linkedin ? (
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="label border border-line px-4 py-3 transition-colors hover:border-fg">
                LinkedIn ↗
              </a>
            ) : null}
            {site.email ? (
              <>
                <a href={`mailto:${site.email}`} className="label border border-line px-4 py-3 transition-colors hover:border-fg">
                  Email →
                </a>
                <button type="button" onClick={copy} className="label px-2 py-3 text-muted hover:text-fg">
                  {copied ? "Copied ✓" : "Copy address"}
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-line">
          <button type="button" onClick={close} className="label group flex items-center justify-between px-6 py-5 text-left md:px-8">
            <span>{quickLook.explore}</span>
            <span className="arrow-nudge-x text-accent">→</span>
          </button>
          <button type="button" onClick={() => overlays.open("index")} className="label group flex items-center justify-between border-l border-line px-6 py-5 text-left md:px-8">
            <span>Open the index</span>
            <span className="arrow-nudge-x text-accent">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
