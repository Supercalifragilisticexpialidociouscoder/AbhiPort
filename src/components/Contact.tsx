"use client";

import { useRef, useState } from "react";
import { contact, sections, site } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { Magnetic } from "./ui/Magnetic";
import { Ph } from "./ui/Ph";
import { SectionHead } from "./ui/SectionHead";

/** Offer clean line-break points: before "@" (not at the start) and after "/". */
function breakable(value: string | null) {
  if (!value) return value;
  return value.split(/(?=@)|(?<=\/)/).map((part, i) => (
    <span key={i}>
      {i > 0 ? <wbr /> : null}
      {part}
    </span>
  ));
}

/**
 * 13 — Contact. Three words that converge as you arrive, then every way to
 * reach Abhi. Unknown links stay visibly unfinished.
 */
export function Contact({ cvHref }: { cvHref: string | null }) {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const offsets = [-14, 16, -10];
        q("[data-drift]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { xPercent: offsets[i % offsets.length], x: 0 },
            { xPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: 0.6 } },
          );
        });
      });
    },
    { scope: root },
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

  const handle = (url: string | null) => url?.replace(/\/+$/, "").split("/").pop() ?? null;
  const rows = [
    { k: "Email", href: site.email ? `mailto:${site.email}` : null, v: site.email, todo: "Add email", external: false },
    { k: "LinkedIn", href: site.links.linkedin, v: site.links.linkedin ? `in/${handle(site.links.linkedin)}` : null, todo: "Add LinkedIn", external: true },
    { k: "GitHub", href: site.links.github, v: site.links.github ? `@${handle(site.links.github)}` : null, todo: "Add GitHub", external: true },
    ...(site.links.instagram
      ? [{ k: "Instagram", href: site.links.instagram, v: `@${handle(site.links.instagram)}`, todo: "", external: true }]
      : []),
    { k: "CV", href: cvHref, v: cvHref ? "Download — PDF" : null, todo: "Add file — public/cv/abhiram-reddy-cv.pdf", external: false },
  ];

  return (
    <section
      ref={root}
      id={sections.contact.id}
      data-theme="ink"
      data-index={sections.contact.index}
      data-label={sections.contact.label}
      aria-labelledby="contact-title"
      className="relative overflow-hidden px-gutter pb-[10vh] pt-[16vh]"
    >
      <SectionHead index={sections.contact.index} title="Contact" aside="Pit wall is open" />

      <h2 id="contact-title" className="display mt-10 text-[length:calc((100vw-2*var(--gutter))/4.85)] leading-[0.8]">
        {contact.lines.map((line, i) => (
          <span
            key={line}
            data-drift
            className={cn("block", i === 1 && "pl-[12vw]", i === 2 && "text-right")}
          >
            {i === contact.lines.length - 1 ? (
              <>
                {line.replace(".", "")}
                <span className="text-accent">.</span>
              </>
            ) : (
              line
            )}
          </span>
        ))}
      </h2>

      <div className="mt-[10vh] grid gap-12 lg:grid-cols-12 lg:gap-6">
        <p className="max-w-md text-[clamp(20px,1.7vw,26px)] leading-snug lg:col-span-4">{contact.lead}</p>

        <ul className="border-t border-line lg:col-span-7 lg:col-start-6">
          {rows.map((r, i) => (
            <li key={r.k} className="border-b border-line">
              {r.href ? (
                <a
                  href={r.href}
                  target={r.external ? "_blank" : undefined}
                  rel={r.external ? "noopener noreferrer" : undefined}
                  download={r.k === "CV" ? true : undefined}
                  aria-label={`${r.k}: ${r.v}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[4rem_8rem_1fr_auto]"
                >
                  <span className="label tnum text-muted">{pad(i + 1)}</span>
                  <span className="label hidden md:block">{r.k}</span>
                  <span className="min-w-0 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
                    <span className="label block text-muted md:hidden">{r.k}</span>
                    <span className="block text-[17px] font-medium leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-[clamp(19px,2.2vw,38px)]">
                      {breakable(r.v)}
                    </span>
                  </span>
                  <Magnetic>
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                      <span className="arrow-nudge">{r.k === "CV" ? "↓" : "↗"}</span>
                    </span>
                  </Magnetic>
                </a>
              ) : (
                <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[4rem_8rem_1fr_auto]">
                  <span className="label tnum text-muted">{pad(i + 1)}</span>
                  <span className="label hidden md:block">{r.k}</span>
                  <span className="text-[clamp(20px,2.4vw,40px)] font-medium tracking-tight text-muted">
                    <span className="md:hidden">{r.k} </span>
                    <Ph>{r.todo}</Ph>
                  </span>
                  <span aria-hidden className="grid h-12 w-12 place-items-center rounded-full border border-dashed border-line text-muted">
                    ↗
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {site.email ? (
        <div className="mt-8 flex justify-end">
          <button type="button" onClick={copy} data-cursor="Copy" className="label link-line py-2 text-muted hover:text-fg">
            {copied ? "Copied to clipboard ✓" : "Copy email address"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
