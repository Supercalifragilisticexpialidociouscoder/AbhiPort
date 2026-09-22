"use client";

import { useRef } from "react";
import { finale, site } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { Clock } from "./ui/Clock";
import { Known } from "./ui/Ph";

type FooterProps = { cvHref: string | null; variant?: "finale" | "compact" };

function footerLinks(cvHref: string | null) {
  return [
    { k: "Email", href: site.email ? `mailto:${site.email}` : null, external: false, download: false },
    { k: "LinkedIn", href: site.links.linkedin, external: true, download: false },
    { k: "GitHub", href: site.links.github, external: true, download: false },
    { k: "Instagram", href: site.links.instagram, external: true, download: false },
    { k: "CV", href: cvHref, external: false, download: true },
  ].filter((l): l is { k: string; href: string; external: boolean; download: boolean } => Boolean(l.href));
}

/**
 * The sign-off. On the home page it's the final screen — STILL BUILDING —
 * with Project 00's meta layer: you're inside something Abhi built.
 * Everywhere else, a compact footer.
 */
export function Footer({ cvHref, variant = "compact" }: FooterProps) {
  const root = useRef<HTMLElement>(null);
  const links = footerLinks(cvHref);

  useGSAP(
    () => {
      if (variant !== "finale") return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const [still, building] = q("[data-fin]");
        const st = { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 };
        gsap.fromTo(still, { xPercent: -18, x: 0 }, { xPercent: 0, ease: "none", scrollTrigger: st });
        gsap.fromTo(building, { xPercent: 14, x: 0 }, { xPercent: 0, ease: "none", scrollTrigger: { ...st } });
      });
    },
    { scope: root, dependencies: [variant] },
  );

  const linkList = (
    <ul className="label flex flex-wrap gap-x-6 gap-y-2">
      {links.map((l) => (
        <li key={l.k}>
          <a
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noopener noreferrer" : undefined}
            download={l.download || undefined}
            className="link-line py-2 text-fg"
          >
            {l.k}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "compact") {
    return (
      <footer className="relative z-[1] px-gutter pb-6 pt-10">
        <div className="label grid gap-6 border-t border-line pt-6 text-muted md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10">
          <div className="flex items-end gap-4">
            <span className="display text-[64px] leading-[0.8] text-fg">{site.short}</span>
            <span className="pb-1">
              Building since <Known value={site.buildingSince} todo="Add year" />
              <br />
              <Clock />
            </span>
          </div>
          <div className="md:justify-self-center">{linkList}</div>
          <div className="flex items-end justify-between gap-6 md:justify-end">
            <span>
              © {site.edition} {site.name}
            </span>
            <button type="button" onClick={() => scrollToTarget(0)} className="link-line py-2 text-fg">
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer ref={root} className="relative z-[1] overflow-hidden px-gutter pb-6 pt-[12vh]">
      <div className="label flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 text-muted">
        <span>
          <span className="text-accent">00</span> — {finale.projectZero}
        </span>
        <span className="tnum">
          Build / {site.build} · {finale.version}
        </span>
      </div>

      <p className="display mt-10 text-[length:calc((100vw-2*var(--gutter))/4.8)] leading-[0.8]">
        <span className="sr-only">Still building.</span>
        <span aria-hidden data-fin className="hollow block [-webkit-text-stroke-width:2px]">
          {finale.lines[0]}
        </span>
        <span aria-hidden data-fin className="block">
          {finale.lines[1].replace(".", "")}
          <span className="text-accent">.</span>
          <span className="caret ml-[0.06em] inline-block h-[0.66em] w-[0.14em] translate-y-[0.02em] bg-accent" />
        </span>
      </p>

      <p className="mt-10 max-w-[34ch] text-[clamp(22px,2.4vw,40px)] font-medium leading-[1.1] tracking-[-0.02em]">{finale.takeaway}</p>

      <div className="mt-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="display text-[clamp(36px,4vw,72px)] leading-[0.9]">{site.name}</p>
          <p className="label mt-3 text-muted">
            Builder / Engineer · {site.age} · <Clock />
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          {linkList}
          <button type="button" onClick={() => scrollToTarget(0)} className="label link-line self-start py-2 text-fg md:self-end">
            Back to the start ↑
          </button>
        </div>
      </div>

      <div className="label mt-10 grid gap-3 border-t border-line pt-4 text-muted md:grid-cols-4">
        <span>
          © {site.edition} {site.name}
        </span>
        <span>
          Building since <Known value={site.buildingSince} todo="Add year" />
        </span>
        <span className="md:col-span-1">{finale.colophon}</span>
        <span className="md:text-right">Last updated · {site.updated}</span>
      </div>
    </footer>
  );
}
