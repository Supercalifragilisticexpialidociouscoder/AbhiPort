"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { archive } from "@/content/site";
import { CATEGORIES, isExternal, projectHref, projects, type Category, type Project } from "@/content/projects";
import { gsap, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { TransitionLink } from "../PageTransition";
import { Known, Ph } from "../ui/Ph";
import { StatusChip } from "../ui/StatusChip";

type Filter = Category | "All";
type Sort = "number" | "newest";

const slugOf = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const when = (p: Project) => p.created ?? (p.year ? `${p.year}-00` : "");

/** The primary link for an entry: its page, its place on the site, or its code. */
function EntryLink({ p, className, children }: { p: Project; className?: string; children: React.ReactNode }) {
  const href = projectHref(p);
  if (!href) return <span className={className}>{children}</span>;
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <TransitionLink href={href} transitionLabel={p.title} className={className}>
      {children}
    </TransitionLink>
  );
}

/**
 * /archive — every project, prototype, hackathon build, experiment and
 * learning project, filed. Filter by what it is, search by anything, open
 * whatever looks interesting. Filters live in the URL (?cat=security&q=…),
 * so any page can link straight to a slice of it.
 */
export function ArchiveIndex() {
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("number");
  const [open, setOpen] = useState<string | null>(null);
  const [focus, setFocus] = useState<string>(projects.find((p) => p.featured)?.slug ?? projects[0].slug);
  const uid = useId();

  const cats = CATEGORIES.filter((c) => projects.some((p) => p.categories.includes(c)));

  // Deep links in, filters out.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    const q = params.get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on arrival
    if (cat) setFilter(cats.find((c) => slugOf(c) === cat) ?? "All");
    if (q) setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (filter === "All") params.delete("cat");
    else params.set("cat", slugOf(filter));
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    const qs = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [filter, query]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    const list = projects.filter((p) => {
      if (filter !== "All" && !p.categories.includes(filter)) return false;
      if (!words.length) return true;
      const hay = [p.title, p.summary, p.tagline, p.category, p.origin ?? "", p.status ?? "", p.year ?? "", ...p.stack, ...p.categories].join(" ").toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    return list.sort((a, b) => (sort === "number" ? a.number.localeCompare(b.number) : when(b).localeCompare(when(a)) || a.number.localeCompare(b.number)));
  }, [filter, query, sort]);

  const card = projects.find((p) => p.slug === focus) ?? visible[0];

  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    // The margin pulls the root's top edge down to the nav, so a sentinel that
    // has scrolled past sits just above *that* edge, not above the viewport.
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? 0)), {
      rootMargin: "-64px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          gsap.utils.selector(root)("[data-entry]"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.03, ease: "expo.out", scrollTrigger: { trigger: list.current, start: "top 90%", once: true } },
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
    gsap.fromTo(list.current.querySelectorAll("[data-entry]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.025, ease: "expo.out" });
  }, [filter, sort, query]);

  return (
    <div ref={root}>
      <div ref={sentinel} aria-hidden className="h-px" />
      {/* Controls. When they stick, a cover fills the strip under the nav so rows don't show through it. */}
      <div className="sticky top-[var(--nav-h)] z-20 -mx-gutter border-b border-line bg-bg px-gutter pb-3 pt-3">
        <span aria-hidden className={cn("pointer-events-none absolute inset-x-0 bottom-full h-[var(--nav-h)] bg-bg transition-opacity duration-300", stuck ? "opacity-100" : "opacity-0")} />
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="group flex min-w-0 flex-1 items-center gap-3 border border-line px-3 py-2 focus-within:border-fg lg:max-w-md">
            <span className="label text-accent">Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Python, hackathon, security, 2025…"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
              aria-label="Search the archive"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} className="label text-muted hover:text-fg">
                Clear
              </button>
            ) : null}
          </label>
          <div role="group" aria-label="Sort" className="label flex self-start border border-line lg:self-auto">
            {(
              [
                ["number", "By number"],
                ["newest", "Newest first"],
              ] as const
            ).map(([k, label], i) => (
              <button
                key={k}
                type="button"
                aria-pressed={sort === k}
                onClick={() => setSort(k)}
                className={cn("px-3 py-2 transition-colors", sort === k ? "bg-fg text-bg" : "text-muted hover:text-fg", i > 0 && "border-l border-line")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-label="Filter the archive" className="scroll-x -mx-gutter mt-3 flex gap-1.5 overflow-x-auto px-gutter pb-1" data-lenis-prevent-horizontal>
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
                className={cn("label shrink-0 border px-3 py-2 transition-colors", on ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-fg hover:text-fg")}
              >
                {c} <span className={cn("tnum ml-1", on ? "text-accent" : "text-accent/80")}>{pad(n)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-10 xl:grid-cols-12 xl:gap-6">
        {/* Index */}
        <div className="xl:col-span-8">
          <div aria-hidden className="label hidden grid-cols-[4.5rem_1fr_13rem_4.5rem_8.5rem_2.5rem] gap-4 border-b border-fg pb-2 text-muted lg:grid">
            <span>No.</span>
            <span>Project</span>
            <span>What it is</span>
            <span>Year</span>
            <span>Status</span>
            <span />
          </div>

          <p aria-live="polite" className="sr-only">
            Showing {visible.length} {visible.length === 1 ? "entry" : "entries"}
          </p>

          {visible.length ? (
            <ol ref={list}>
              {visible.map((p) => {
                const isOpen = open === p.slug;
                const panelId = `${uid}-${p.slug}`;
                const href = projectHref(p);
                const extra = [
                  p.links.live ? { k: "Live", href: p.links.live } : null,
                  p.links.repo ? { k: "Code", href: p.links.repo } : null,
                  p.links.video ? { k: "Video", href: p.links.video } : null,
                ].filter((x): x is { k: string; href: string } => Boolean(x) && x!.href !== href);
                return (
                  <li key={p.slug} data-entry className="border-b border-line" onMouseEnter={() => setFocus(p.slug)} onFocus={() => setFocus(p.slug)}>
                    <div className="group relative grid grid-cols-[3.25rem_1fr_auto] items-center gap-x-4 gap-y-1.5 py-4 lg:grid-cols-[4.5rem_1fr_13rem_4.5rem_8.5rem_2.5rem]">
                      <span aria-hidden className="absolute bottom-0 left-0 top-0 w-[3px] origin-top scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-y-100" />
                      <span className={cn("label tnum pl-3", p.featured || p.number === "00" ? "text-accent" : "text-muted")}>{pad(Number(p.number), 3)}</span>
                      <EntryLink p={p} className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="display text-[clamp(26px,2.6vw,46px)] leading-[0.9] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
                          {p.title}
                          {href && isExternal(href) ? <span className="label ml-2 align-top text-[10px] text-muted">↗</span> : null}
                        </span>
                        {p.note ? <span className="label text-accent">{p.note}</span> : null}
                      </EntryLink>
                      <span className="label col-start-2 text-muted lg:col-start-auto">{p.category}</span>
                      <span className="label col-start-2 text-muted lg:col-start-auto">
                        <Known value={p.year} todo="Add year" />
                      </span>
                      <span className="col-start-2 lg:col-start-auto">
                        <StatusChip status={p.status} />
                      </span>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        aria-label={`${isOpen ? "Hide" : "Show"} details — ${p.title}`}
                        onClick={() => setOpen(isOpen ? null : p.slug)}
                        className={cn(
                          "col-start-3 row-start-1 grid h-9 w-9 place-items-center justify-self-end rounded-full border border-line text-lg transition-transform duration-500 lg:col-start-auto lg:row-start-auto",
                          isOpen && "rotate-45 border-accent text-accent",
                        )}
                      >
                        +
                      </button>
                    </div>

                    <div id={panelId} hidden={!isOpen} className="grid gap-6 pb-8 lg:grid-cols-[4.5rem_1fr_13rem] lg:gap-x-4">
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
                            <EntryLink p={p} className="group/l inline-flex items-center gap-2 text-fg">
                              <span className="link-line">{p.study ? "Read the case study" : p.file ? "Open the file" : isExternal(href) ? "View the code" : "Go to it"}</span>
                              <span className="text-accent transition-transform group-hover/l:translate-x-1">{isExternal(href) ? "↗" : "→"}</span>
                            </EntryLink>
                          ) : null}
                          {extra.map((x) => (
                            <a key={x.k} href={x.href} target="_blank" rel="noopener noreferrer" className="link-line text-fg">
                              {x.k} ↗
                            </a>
                          ))}
                          {!href && !extra.length ? <Ph>Add a link</Ph> : null}
                        </div>
                      </div>
                      <div className="label space-y-2 pl-3 text-muted lg:pl-0">
                        {p.origin ? (
                          <p>
                            Built at · <span className="normal-case tracking-normal text-[13px] text-fg">{p.origin}</span>
                          </p>
                        ) : null}
                        {p.created ? (
                          <p>
                            First commit · <span className="text-fg">{p.created}</span>
                          </p>
                        ) : null}
                        {p.role ? (
                          <p>
                            Role · <span className="text-fg">{p.role}</span>
                          </p>
                        ) : null}
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
          ) : (
            <div className="border-b border-line py-16">
              <p className="display text-[clamp(40px,5vw,84px)] leading-[0.9]">Nothing filed under that. Yet.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                }}
                className="label link-line mt-6"
              >
                Show everything
              </button>
            </div>
          )}

          {/* The one thing the index leaves out, on purpose. */}
          <p className="mt-5 flex max-w-2xl items-baseline gap-3 pl-3 text-[15px] leading-relaxed text-muted">
            <span aria-hidden className="label text-accent">
              *
            </span>
            {archive.offList}
          </p>
        </div>

        {/* Record card — whatever you're pointing at */}
        <aside aria-hidden className="hidden xl:col-span-4 xl:block">
          {card ? (
            <div className="sticky top-[calc(var(--nav-h)+128px)] border border-line p-6">
              <p className="label flex items-center justify-between gap-4">
                <span className="tnum text-accent">No. {pad(Number(card.number), 3)}</span>
                <StatusChip status={card.status} />
              </p>
              <p className="display hollow mt-6 text-[120px] leading-[0.8]">{card.number}</p>
              <p className="display mt-4 text-[clamp(32px,2.6vw,48px)] leading-[0.9]">{card.title}</p>
              <p className="mt-3 text-[16px] leading-snug text-muted">{card.tagline}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {card.stack.slice(0, 7).map((t) => (
                  <li key={t} className="label border border-line px-2 py-1">
                    {t}
                  </li>
                ))}
              </ul>
              <dl className="label mt-6 grid grid-cols-2 gap-y-2 border-t border-line pt-4 text-muted">
                <dt>Kind</dt>
                <dd className="text-fg">{card.category}</dd>
                <dt>Year</dt>
                <dd className="text-fg">{card.year ?? "—"}</dd>
                {card.origin ? (
                  <>
                    <dt>Built at</dt>
                    <dd className="normal-case tracking-normal text-[13px] text-fg">{card.origin}</dd>
                  </>
                ) : null}
              </dl>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Status legend */}
      <dl className="mt-14 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(archive.statuses).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-3">
            <dt>
              <StatusChip status={k as keyof typeof archive.statuses} />
            </dt>
            <dd className="text-[14px] text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
