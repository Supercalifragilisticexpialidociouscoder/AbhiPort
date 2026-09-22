"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { archive, sections } from "@/content/site";
import { CATEGORIES, projectHref, projects, type Category } from "@/content/projects";
import { gsap, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { Known, Ph } from "./ui/Ph";
import { SectionHead } from "./ui/SectionHead";
import { StatusChip } from "./ui/StatusChip";

type Filter = Category | "All";

/**
 * 10 — The archive. Every project, prototype, hackathon build and
 * experiment in one editorial index. Filter by what it is; open a row for
 * the details. Built to hold dozens of entries without cluttering the page.
 */
export function Archive() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const s = sections.archive;

  const sorted = useMemo(() => [...projects].sort((a, b) => a.number.localeCompare(b.number)), []);
  const cats = CATEGORIES.filter((c) => projects.some((p) => p.categories.includes(c)));
  const visible = filter === "All" ? sorted : sorted.filter((p) => p.categories.includes(filter));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-ar-line]"),
          { yPercent: 105, y: 0 },
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: q("[data-ar-title]")[0], start: "top 85%", once: true } },
        );
        gsap.fromTo(
          q("[data-entry]"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: list.current, start: "top 85%", once: true } },
        );
      });
    },
    { scope: root },
  );

  // Re-filtering: the remaining rows settle in.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!list.current || window.matchMedia(REDUCED).matches) return;
    gsap.fromTo(list.current.querySelectorAll("[data-entry]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.035, ease: "expo.out" });
  }, [filter]);

  return (
    <section
      ref={root}
      id={s.id}
      data-theme="paper"
      data-index={s.index}
      data-label={s.label}
      aria-labelledby="archive-title"
      className="relative px-gutter pb-[14vh] pt-[16vh]"
    >
      <SectionHead index={s.index} title="The archive" aside={`${pad(projects.length)} entries · filter by what it is`} />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <h2 id="archive-title" data-ar-title className="display text-[clamp(72px,12vw,230px)] lg:col-span-7">
          <span className="mask">
            <span data-ar-line className="block">
              The
            </span>
          </span>
          <span className="mask">
            <span data-ar-line className="block">
              archive<span className="text-accent">.</span>
            </span>
          </span>
        </h2>
        <p className="max-w-md self-end text-[clamp(18px,1.4vw,22px)] leading-snug text-muted lg:col-span-5">{archive.lead}</p>
      </div>

      {/* Filters */}
      <div role="group" aria-label="Filter the archive" className="scroll-x -mx-gutter mt-14 flex gap-1.5 overflow-x-auto px-gutter pb-1" data-lenis-prevent-horizontal>
        {(["All", ...cats] as Filter[]).map((c) => {
          const n = c === "All" ? projects.length : projects.filter((p) => p.categories.includes(c as Category)).length;
          const on = filter === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setFilter(c);
                setOpen(null);
              }}
              className={cn(
                "label shrink-0 border px-3 py-2 transition-colors",
                on ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-fg hover:text-fg",
              )}
            >
              {c} <span className={cn("tnum ml-1", on ? "text-accent" : "text-accent/80")}>{pad(n)}</span>
            </button>
          );
        })}
      </div>

      {/* Index */}
      <div className="mt-8">
        <div aria-hidden className="label hidden grid-cols-[4rem_1fr_16rem_6rem_9rem_2.5rem] gap-4 border-b border-fg pb-2 text-muted lg:grid">
          <span>No.</span>
          <span>Project</span>
          <span>What it is</span>
          <span>Year</span>
          <span>Status</span>
          <span />
        </div>

        <p aria-live="polite" className="sr-only">
          Showing {visible.length} {filter === "All" ? "" : filter} {visible.length === 1 ? "entry" : "entries"}
        </p>
        <ol ref={list}>
          {visible.map((p) => {
            const isOpen = open === p.slug;
            const panelId = `${uid}-${p.slug}`;
            const href = projectHref(p);
            const extra = [
              p.links.live ? { k: "Live", href: p.links.live } : null,
              p.links.repo ? { k: "Code", href: p.links.repo } : null,
              p.links.video ? { k: "Video", href: p.links.video } : null,
            ].filter((x): x is { k: string; href: string } => Boolean(x));

            return (
              <li key={p.slug} data-entry className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : p.slug)}
                  className="group relative grid w-full grid-cols-[3rem_1fr_auto] items-center gap-x-4 gap-y-1.5 py-5 text-left lg:grid-cols-[4rem_1fr_16rem_6rem_9rem_2.5rem]"
                >
                  <span aria-hidden className="absolute bottom-0 left-0 top-0 w-[3px] origin-top scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-y-100" />
                  <span className={cn("label tnum pl-3", p.number === "00" ? "text-accent" : "text-muted")}>{p.number}</span>
                  <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="display text-[clamp(28px,3vw,52px)] leading-[0.9] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
                      {p.title}
                    </span>
                    {p.note ? <span className="label text-accent">{p.note}</span> : null}
                  </span>
                  <span className="label col-start-2 text-muted lg:col-start-auto">{p.category}</span>
                  <span className="label col-start-2 text-muted lg:col-start-auto">
                    <Known value={p.year} todo="Add year" />
                  </span>
                  <span className="col-start-2 lg:col-start-auto">
                    <StatusChip status={p.status} />
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "col-start-3 row-start-1 grid h-9 w-9 place-items-center justify-self-end rounded-full border border-line text-lg transition-transform duration-500 lg:col-start-auto lg:row-start-auto",
                      isOpen && "rotate-45 border-accent text-accent",
                    )}
                  >
                    +
                  </span>
                </button>

                <div id={panelId} hidden={!isOpen} className="grid gap-6 pb-8 lg:grid-cols-[4rem_1fr_16rem_6rem_9rem_2.5rem] lg:gap-x-4">
                  <span className="hidden lg:block" />
                  <div className="space-y-5 pl-3 lg:pl-0">
                    <p className="max-w-2xl text-[17px] leading-relaxed">{p.summary}</p>
                    {p.stack.length || p.stackTodo ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {p.stack.map((t) => (
                          <li key={t} className="label border border-line px-2 py-1">
                            {t}
                          </li>
                        ))}
                        {p.stackTodo ? (
                          <li>
                            <Ph>{p.stackTodo}</Ph>
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                    <div className="label flex flex-wrap items-center gap-x-6 gap-y-3">
                      {href ? (
                        <TransitionLink href={href} transitionLabel={p.title} className="group/l inline-flex items-center gap-2 text-fg">
                          <span className="link-line">{p.study ? "Read the case study" : "Go to it"}</span>
                          <span className="text-accent transition-transform group-hover/l:translate-x-1">→</span>
                        </TransitionLink>
                      ) : null}
                      {extra.map((x) => (
                        <a key={x.k} href={x.href} target="_blank" rel="noopener noreferrer" className="link-line text-fg">
                          {x.k} ↗
                        </a>
                      ))}
                      {!href && !extra.length ? <Ph>Add a link</Ph> : null}
                    </div>
                  </div>
                  <div className="label space-y-2 pl-3 text-muted lg:col-span-3 lg:pl-0">
                    <p>
                      Role · <span className="text-fg">{p.role ?? <Ph>Add role</Ph>}</span>
                    </p>
                    {p.status ? (
                      <p>
                        {p.status} · <span className="normal-case tracking-normal text-[13px] text-fg">{archive.statuses[p.status]}</span>
                      </p>
                    ) : null}
                    <p>
                      Filed under · <span className="text-fg">{p.categories.join(", ")}</span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {/* The one thing the index leaves out, on purpose. */}
        <p className="mt-5 flex max-w-2xl items-baseline gap-3 pl-3 text-[15px] leading-relaxed text-muted">
          <span aria-hidden className="label text-accent">
            *
          </span>
          {archive.offList}
        </p>
      </div>

      {/* Status legend */}
      <dl className="mt-12 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(archive.statuses).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-3">
            <dt>
              <StatusChip status={k as keyof typeof archive.statuses} />
            </dt>
            <dd className="text-[14px] text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
