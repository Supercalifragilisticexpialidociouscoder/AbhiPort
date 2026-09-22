"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { UnderTheHood as Hood } from "@/content/projects";
import { gsap, REDUCED } from "@/lib/gsap";
import { cn, pad } from "@/lib/cn";
import { ArchitectureDiagram, FlowChain } from "./Diagrams";
import { Ph } from "../ui/Ph";

type Tab = { key: string; label: string };

/**
 * UNDER THE HOOD → an engine bay for technical visitors. Closed by default
 * (the story comes first); opens into tabs for architecture, data model,
 * request flow, auth, infrastructure and quality. Arriving at
 * #under-the-hood opens it straight away.
 */
export function UnderTheHood({ hood, title }: { hood: Hood; title: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("architecture");
  const panel = useRef<HTMLDivElement>(null);
  const uid = useId();

  const tabs: Tab[] = [
    { key: "architecture", label: "Architecture" },
    hood.data ? { key: "data", label: "Data model" } : null,
    hood.flow ? { key: "flow", label: "Request flow" } : null,
    hood.auth?.length ? { key: "auth", label: "Auth" } : null,
    hood.infra?.length ? { key: "infra", label: "Infrastructure" } : null,
    hood.quality?.length || hood.qualityTodo ? { key: "quality", label: "Quality" } : null,
  ].filter((t): t is Tab => Boolean(t));

  // Deep links (#under-the-hood) open the bay — on arrival or on a same-page hash change.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#under-the-hood") setOpen(true);
    };
    const raf = requestAnimationFrame(check);
    window.addEventListener("hashchange", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", check);
    };
  }, []);

  useEffect(() => {
    const el = panel.current;
    if (!el || !open || window.matchMedia(REDUCED).matches) return;
    gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" });
  }, [open]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[next].key);
    document.getElementById(`${uid}-tab-${tabs[next].key}`)?.focus();
  };

  const list = (items: string[]) => (
    <ul className="max-w-3xl border-t border-line">
      {items.map((x, i) => (
        <li key={x} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-4 text-[clamp(17px,1.4vw,21px)] leading-snug">
          <span className="label tnum pt-1 text-accent">{pad(i + 1)}</span>
          {x}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${uid}-bay`}
        onClick={() => setOpen((o) => !o)}
        data-cursor={open ? "Close" : "Open"}
        className="group flex w-full items-center justify-between gap-6 border border-line px-5 py-6 text-left transition-colors hover:border-accent md:px-8"
      >
        <span>
          <span className="label block text-muted">For the technically curious</span>
          <span className="display mt-2 block text-[clamp(34px,4vw,72px)] leading-[0.9]">
            Under the hood <span className={cn("inline-block text-accent transition-transform duration-500", open && "rotate-90")}>→</span>
          </span>
        </span>
        <span className="label hidden text-right text-muted md:block">
          {tabs.map((t) => t.label).join(" · ")}
        </span>
      </button>

      <div id={`${uid}-bay`} ref={panel} hidden={!open} className="border-x border-b border-line px-5 pb-10 pt-6 md:px-8">
        <div role="tablist" aria-label={`${title} internals`} className="scroll-x -mx-1 flex gap-1 overflow-x-auto px-1 pb-1" data-lenis-prevent-horizontal>
          {tabs.map((t, i) => (
            <button
              key={t.key}
              id={`${uid}-tab-${t.key}`}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              aria-controls={`${uid}-panel`}
              tabIndex={tab === t.key ? 0 : -1}
              onClick={() => setTab(t.key)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn("label shrink-0 border px-3 py-2 transition-colors", tab === t.key ? "border-accent bg-accent text-bg" : "border-line text-muted hover:text-fg")}
            >
              <span className="tnum mr-1.5 opacity-60">{pad(i + 1)}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="mt-8">
          {tab === "architecture" ? <ArchitectureDiagram caption={hood.architecture.caption} layers={hood.architecture.layers} /> : null}

          {tab === "data" && hood.data ? (
            <figure>
              <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
                {hood.data.entities.map((en, i) => (
                  <li key={en.name} className="flex min-h-[170px] flex-col justify-between gap-6 bg-bg p-5">
                    <span className="label tnum text-accent">E{pad(i + 1)}</span>
                    <span>
                      <span className="display block text-[clamp(26px,2.2vw,38px)] leading-[0.9]">{en.name}</span>
                      <span className="mt-2 block text-[15px] leading-snug text-muted">{en.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <figcaption className="label mt-4 text-muted">Fig. — {hood.data.caption}</figcaption>
            </figure>
          ) : null}

          {tab === "flow" && hood.flow ? <FlowChain title={hood.flow.caption} steps={hood.flow.steps} /> : null}
          {tab === "auth" && hood.auth ? list(hood.auth) : null}
          {tab === "infra" && hood.infra ? list(hood.infra) : null}
          {tab === "quality" ? (
            <div className="space-y-6">
              {hood.quality?.length ? list(hood.quality) : null}
              {hood.qualityTodo ? <Ph>{hood.qualityTodo}</Ph> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
