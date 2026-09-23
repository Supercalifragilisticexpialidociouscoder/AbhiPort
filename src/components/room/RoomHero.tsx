"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { onPageEnter, TransitionLink } from "../PageTransition";

type Stat = { v: string; k: string };

/**
 * The opening of every room behind the home page: where you are, a title
 * that rises as the page wipe lifts, one line of why you'd stay, and the
 * room's numbers — counted from content, never typed in.
 */
export function RoomHero({
  room,
  path,
  title,
  lead,
  stats,
  theme = "ink",
  back = { href: "/", label: "Home" },
  children,
}: {
  room: string;
  path: string;
  title: string[];
  lead: string;
  stats?: Stat[];
  theme?: "ink" | "paper" | "garage";
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.fromTo(q("[data-rh-line]"), { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.15, stagger: 0.08 }, 0).fromTo(
          q("[data-rh-in]"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 },
          0.3,
        );
        return onPageEnter(() => tl.play());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme={theme} data-index="00" data-label={title.join(" ").replace(/\.$/, "")} aria-labelledby="room-title" className="relative px-gutter pb-12 pt-[calc(var(--nav-h)+3vh)]">
      <div data-rh-in className="label flex items-center justify-between gap-4 border-b border-line pb-3">
        <TransitionLink href={back.href} transitionLabel={back.label} className="group inline-flex items-center gap-2 py-1">
          <span className="arrow-nudge-x rotate-180">→</span>
          <span className="link-line">{back.label}</span>
        </TransitionLink>
        <span className="text-muted">
          {room} <span className="text-accent">{path}</span>
        </span>
      </div>

      <h1 id="room-title" className="display mt-[7vh] text-[clamp(72px,14vw,280px)] leading-[0.8]">
        <span className="sr-only">{title.join(" ")}</span>
        {title.map((line, i) => (
          <span key={line} aria-hidden className="mask">
            <span data-rh-line className="block">
              {i === title.length - 1 && line.endsWith(".") ? (
                <>
                  {line.slice(0, -1)}
                  <span className="text-accent">.</span>
                </>
              ) : (
                line
              )}
            </span>
          </span>
        ))}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <p data-rh-in className="max-w-[34ch] text-[clamp(22px,2.2vw,36px)] font-medium leading-[1.12] tracking-[-0.02em] lg:col-span-6">
          {lead}
        </p>
        {stats?.length ? (
          <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-5 self-end lg:col-span-6", stats.length > 3 ? "sm:grid-cols-4" : "sm:grid-cols-3")}>
            {stats.map((st) => (
              <div key={st.k} data-rh-in className="flex flex-col border-t border-line pt-3">
                <dt className="label order-2 mt-2 text-muted">{st.k}</dt>
                <dd className="display tnum order-1 text-[clamp(40px,4vw,72px)] leading-[0.8]">{st.v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {children}
    </section>
  );
}
