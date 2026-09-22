"use client";

import { site } from "@/content/site";
import { scrollToTarget } from "@/lib/scroll";
import { Clock } from "./ui/Clock";
import { Known } from "./ui/Ph";

/** Minimal sign-off. No giant sitemap. */
export function Footer() {
  const links = [
    { k: "GitHub", href: site.links.github },
    { k: "LinkedIn", href: site.links.linkedin },
    { k: "Email", href: site.email ? `mailto:${site.email}` : null },
  ];

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

        <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-center">
          {links.map((l) =>
            l.href ? (
              <li key={l.k}>
                <a
                  href={l.href}
                  target={l.k === "Email" ? undefined : "_blank"}
                  rel={l.k === "Email" ? undefined : "noopener noreferrer"}
                  className="link-line py-2 text-fg"
                >
                  {l.k}
                </a>
              </li>
            ) : (
              <li key={l.k} className="flex items-center gap-2">
                {l.k} <Known value={null} todo="Add link" />
              </li>
            ),
          )}
        </ul>

        <div className="flex items-end justify-between gap-6 md:justify-end">
          <span>
            © {site.edition} {site.name}
          </span>
          <button type="button" onClick={() => scrollToTarget(0)} className="link-line py-2 text-fg">
            Back to top ↑
          </button>
        </div>
      </div>
      <p className="label mt-6 text-muted/70">Set in Archivo, Geist &amp; Geist Mono. Built with Next.js and GSAP.</p>
    </footer>
  );
}
