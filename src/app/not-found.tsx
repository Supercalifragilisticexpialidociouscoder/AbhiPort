import type { Metadata } from "next";
import { TransitionLink } from "@/components/PageTransition";

export const metadata: Metadata = { title: "DNF" };

/** 404 — in race terms, a DNF. */
export default function NotFound() {
  return (
    <main id="main" data-theme="ink" className="flex min-h-svh flex-col justify-between px-gutter pb-8 pt-[calc(var(--nav-h)+4vh)]">
      <p className="label flex justify-between text-muted">
        <span>
          <span className="text-accent">(404)</span> Did not finish
        </span>
        <span>Classified: off track</span>
      </p>
      <div>
        <h1 className="display text-[length:calc((100vw-2*var(--gutter))/1.75)] leading-[0.8]">
          DNF<span className="text-accent">.</span>
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-[clamp(20px,1.8vw,28px)] leading-snug">This page didn&apos;t make it to the finish line. Wrong turn, or it was never built.</p>
          <TransitionLink href="/" transitionLabel="Abhi" className="group label inline-flex items-center gap-3 self-start md:self-auto">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
              <span className="arrow-nudge-x">→</span>
            </span>
            <span className="link-line">Back to the pit lane</span>
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}
