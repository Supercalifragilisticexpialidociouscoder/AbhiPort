"use client";

import { useEffect, useRef } from "react";
import { featuredProjects, projects } from "@/content/projects";
import { sections, work } from "@/content/site";
import { gsap, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { scrollToTarget } from "@/lib/scroll";
import { ProjectCard } from "./ProjectCard";
import { TransitionLink } from "./PageTransition";
import { SectionHead } from "./ui/SectionHead";

/**
 * 04 — Featured work. Desktop: the section pins and the flagships travel
 * sideways as you scroll, each spread with its own parallax. Mobile: a
 * swipeable row of cards. Reduced motion on desktop: they simply stack.
 */
export function Projects({ covers }: { covers: Record<string, React.ReactNode> }) {
  const root = useRef<HTMLElement>(null);
  const swipeCount = useRef<HTMLSpanElement>(null);
  const swipeBar = useRef<HTMLSpanElement>(null);
  const s = sections.work;
  const total = featuredProjects.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          q("[data-work-char]"),
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.05,
            ease: "expo.out",
            scrollTrigger: { trigger: q("[data-work-title]")[0], start: "top 85%", once: true },
          },
        );
        // Three lines, the last one lands on its own beat.
        const use = q("[data-in-use]")[0];
        gsap
          .timeline({ scrollTrigger: { trigger: use, start: "top 78%", once: true } })
          .fromTo(q("[data-use-line]"), { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.1, stagger: 0.14, ease: "expo.out" })
          .fromTo(q("[data-use-step]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "expo.out" }, 0.45);
      });

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const rail = q("[data-rail]")[0] as HTMLElement;
        const track = q("[data-track]")[0] as HTMLElement;
        const bar = q("[data-bar]")[0] as HTMLElement;
        const counter = q("[data-counter]")[0] as HTMLElement;
        const spreads = q("[data-spread]") as HTMLElement[];
        const distance = () => Math.max(0, track.scrollWidth - rail.clientWidth);
        let lefts: number[] = [];

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: rail,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefresh: () => {
              lefts = spreads.map((el) => el.offsetLeft);
            },
            onUpdate: (self) => {
              bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
              const x = self.progress * distance() + window.innerWidth * 0.45;
              let i = 0;
              lefts.forEach((l, j) => {
                if (l <= x) i = j;
              });
              counter.textContent = pad(i + 1);
            },
          },
        });

        spreads.forEach((spread) => {
          const num = spread.querySelector("[data-num]");
          const visual = spread.querySelector("[data-visual]");
          const st = { trigger: spread, containerAnimation: tween, start: "left right", end: "right left", scrub: true };
          if (num) gsap.fromTo(num, { xPercent: 35, x: 0 }, { xPercent: -35, ease: "none", scrollTrigger: st });
          if (visual) gsap.fromTo(visual, { x: 120 }, { x: -60, ease: "none", scrollTrigger: { ...st } });
        });

        // Keyboard: tabbing into an off-screen spread scrolls the page so the
        // track brings it into view (instead of the browser scrolling the rail).
        const onFocus = (e: FocusEvent) => {
          const spread = (e.target as HTMLElement).closest<HTMLElement>("[data-spread]");
          const st = tween.scrollTrigger;
          if (!spread || !st) return;
          rail.scrollLeft = 0;
          const ratio = distance() ? Math.min(1, spread.offsetLeft / distance()) : 0;
          scrollToTarget(st.start + ratio * (st.end - st.start), { immediate: true });
        };
        rail.addEventListener("focusin", onFocus);
        return () => rail.removeEventListener("focusin", onFocus);
      });
    },
    { scope: root },
  );

  // Mobile swipe row: live "02 / 04" counter and progress hairline.
  useEffect(() => {
    const track = root.current?.querySelector<HTMLElement>("[data-track]");
    if (!track) return;
    const onScroll = () => {
      if (window.innerWidth >= 1024) return;
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      if (swipeBar.current) swipeBar.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
      if (swipeCount.current) swipeCount.current.textContent = pad(Math.min(total, Math.round(p * (total - 1)) + 1));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [total]);

  // The whole spread is clickable; the real link stays the accessible target.
  const onTrackClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) return;
    const spread = target.closest<HTMLElement>("[data-spread]");
    spread?.querySelector<HTMLAnchorElement>("a[data-primary]")?.click();
  };

  return (
    <section
      ref={root}
      id={s.id}
      data-theme="ink"
      data-index={s.index}
      data-label={s.label}
      aria-labelledby="work-title"
      className="relative"
    >
      <header className="px-gutter pb-[8vh] pt-[16vh]">
        <SectionHead index={s.index} title="Featured work" aside={`${pad(total)} flagships · ${pad(projects.length)} in the archive`} />
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="work-title" data-work-title className="display whitespace-nowrap text-[length:calc((100vw-2*var(--gutter))/2.9)] leading-[0.78] lg:text-[min(25vw,52vh)]">
            <span className="sr-only">{work.title}</span>
            <span aria-hidden className="mask">
              {Array.from(work.title).map((c, i) => (
                <span key={i} data-work-char className="inline-block">
                  {c}
                </span>
              ))}
              <sup data-work-char className="label ml-2 inline-block align-top text-[clamp(14px,1.4vw,20px)] text-accent">
                ({pad(total)})
              </sup>
            </span>
          </h2>
          <div className="max-w-sm lg:pb-6">
            <p className="text-[clamp(20px,1.7vw,26px)] leading-snug">{work.lead}</p>
            <p className="label mt-6 hidden items-center gap-3 text-muted lg:flex">
              <span>Keep scrolling — the work moves sideways</span>
              <span aria-hidden className="text-accent">→</span>
            </p>
          </div>
        </div>
        {/* From code to use: some of the work leaves the portfolio. */}
        <div id={work.inUse.id} data-in-use className="mt-[12vh] scroll-mt-[calc(var(--nav-h)+24px)] border-t border-line pt-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <p className="display text-[clamp(34px,4.6vw,88px)] leading-[0.94] lg:col-span-7">
              {work.inUse.lines.map((line, i) => {
                const last = i === work.inUse.lines.length - 1;
                return (
                  <span key={line} className="mask">
                    <span data-use-line className={last ? "block" : "block text-muted"}>
                      {last ? (
                        <>
                          {line.replace(/\.$/, "")}
                          <span className="text-accent">.</span>
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  </span>
                );
              })}
            </p>
            <div className="flex flex-col justify-end gap-5 lg:col-span-5 lg:pb-2">
              <p className="label flex items-center gap-2 text-accent">
                <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
                {work.inUse.label}
              </p>
              <p className="max-w-[40ch] text-[clamp(19px,1.5vw,24px)] leading-snug">{work.inUse.body}</p>
              <p className="max-w-[44ch] text-[15px] leading-relaxed text-muted">{work.inUse.privacy}</p>
            </div>
          </div>
          <ol aria-label="How the work leaves the portfolio" className="mt-10 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
            {work.inUse.path.map((step, i) => {
              const last = i === work.inUse.path.length - 1;
              return (
                <li key={step} data-use-step className="flex items-center justify-between gap-3 bg-bg px-4 py-4 md:px-5">
                  <span className="label">
                    <span className="tnum text-muted">{pad(i + 1)}</span>
                    <span className={last ? "ml-3 text-accent" : "ml-3"}>{step}</span>
                  </span>
                  <span aria-hidden className="label text-accent">
                    {last ? "■" : "→"}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile: swipe hint + progress */}
        <div aria-hidden className="label mt-10 flex items-center gap-4 lg:hidden">
          <span className="tnum text-accent">
            <span ref={swipeCount}>01</span> / {pad(total)}
          </span>
          <span className="relative h-px flex-1 bg-line">
            <span ref={swipeBar} className="absolute inset-0 origin-left bg-fg" style={{ transform: "scaleX(0.04)" }} />
          </span>
          <span className="text-muted">Swipe →</span>
        </div>
      </header>

      <div data-rail className="work-rail relative">
        <div
          data-track
          data-lenis-prevent-horizontal
          className="work-track scroll-x relative max-lg:flex max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:border-y max-lg:border-line"
          onClick={onTrackClick}
        >
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} total={total} cover={covers[p.slug]} />
          ))}

          <div className="flex flex-col justify-center px-gutter py-16 max-lg:w-[80vw] max-lg:shrink-0 max-lg:snap-start lg:border-t lg:border-line lg:py-20 track:h-full track:w-[44vw] track:shrink-0 track:border-l track:border-t-0">
            <p className="label text-muted">That&apos;s the shortlist.</p>
            <p className="display mt-6 text-[clamp(56px,6.4vw,128px)]">
              {projects.length - total} more
              <br />
              in the archive<span className="text-accent">.</span>
            </p>
            <p className="mt-6 max-w-sm text-muted">Prototypes, hackathon builds, hardware experiments, community systems — and this website.</p>
            <TransitionLink href="/#archive" className="group label mt-8 inline-flex items-center gap-3 self-start">
              <span className="link-line">Open the archive</span>
              <span className="arrow-nudge-x text-accent">↓</span>
            </TransitionLink>
          </div>
        </div>

        <div aria-hidden className="label pointer-events-none absolute inset-x-gutter bottom-6 hidden items-center gap-4 track:flex">
          <span data-counter className="tnum text-accent">
            01
          </span>
          <span className="relative h-px flex-1 bg-line">
            <span data-bar className="absolute inset-0 origin-left bg-fg" style={{ transform: "scaleX(0)" }} />
          </span>
          <span className="tnum text-muted">{pad(total)}</span>
        </div>
      </div>
    </section>
  );
}
