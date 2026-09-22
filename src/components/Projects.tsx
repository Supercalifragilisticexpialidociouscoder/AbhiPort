"use client";

import { useRef } from "react";
import { projects } from "@/content/projects";
import { work } from "@/content/site";
import { gsap, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { scrollToTarget } from "@/lib/scroll";
import { ProjectCard } from "./ProjectCard";
import { TransitionLink } from "./PageTransition";
import { SectionHead } from "./ui/SectionHead";

/**
 * 03 — Work. On desktop the section pins and the projects travel sideways
 * as you scroll, each spread with its own parallax. On mobile (and for
 * reduced motion) they simply stack.
 */
export function Projects({ covers }: { covers: Record<string, React.ReactNode> }) {
  const root = useRef<HTMLElement>(null);

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
              lefts = spreads.map((s) => s.offsetLeft);
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
          const s = tween.scrollTrigger;
          if (!spread || !s) return;
          rail.scrollLeft = 0;
          const ratio = distance() ? Math.min(1, spread.offsetLeft / distance()) : 0;
          scrollToTarget(s.start + ratio * (s.end - s.start), { immediate: true });
        };
        rail.addEventListener("focusin", onFocus);
        return () => rail.removeEventListener("focusin", onFocus);
      });
    },
    { scope: root },
  );

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
      id="work"
      data-theme="ink"
      data-index="03"
      data-label="Work"
      aria-labelledby="work-title"
      className="relative"
    >
      <header className="px-gutter pb-[10vh] pt-[16vh]">
        <SectionHead index="03" title="Selected work" aside={`${pad(projects.length)} projects`} />
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
                ({pad(projects.length)})
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
      </header>

      <div data-rail className="work-rail relative">
        <div data-track className="work-track relative" onClick={onTrackClick}>
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} total={projects.length} cover={covers[p.slug]} />
          ))}

          <div className="flex flex-col justify-center border-t border-line px-gutter py-20 track:h-full track:w-[44vw] track:shrink-0 track:border-l track:border-t-0">
            <p className="label text-muted">That&apos;s the list — for now.</p>
            <p className="display mt-6 text-[clamp(64px,6.4vw,128px)]">
              More in
              <br />
              the garage<span className="text-accent">.</span>
            </p>
            <p className="mt-6 max-w-sm text-muted">Hardware, experiments and the stuff that isn&apos;t a product yet.</p>
            <TransitionLink href="/#garage" className="group label mt-8 inline-flex items-center gap-3 self-start">
              <span className="link-line">Open the garage</span>
              <span className="arrow-nudge-x text-accent">↓</span>
            </TransitionLink>
          </div>
        </div>

        <div aria-hidden className="label pointer-events-none absolute inset-x-gutter bottom-6 hidden items-center gap-4 track:flex">
          <span data-counter className="tnum text-accent">
            01
          </span>
          <span className="relative h-px flex-1 bg-line">
            <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-fg" />
          </span>
          <span className="tnum text-muted">{pad(projects.length)}</span>
        </div>
      </div>
    </section>
  );
}
