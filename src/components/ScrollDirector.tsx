"use client";

import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import { sectionStore } from "@/lib/section-store";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Watches every [data-theme] section on the page and hands its theme to
 * <html>, so the whole page shifts surface as you scroll (ink → paper →
 * garage telemetry → IR …). Also feeds the nav's section indicator.
 *
 * Mount it LAST inside a page so every section's pins already exist.
 */
export function ScrollDirector({ total }: { total?: number }) {
  useGSAP(() => {
    const html = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-theme]"));
    if (!sections.length) return;

    html.classList.add("theme-sync");
    const count = total ?? sections.filter((s) => s.dataset.index).length - 1;

    const activate = (el: HTMLElement) => {
      html.dataset.theme = el.dataset.theme;
      if (el.dataset.index && el.dataset.label) {
        sectionStore.set({ index: el.dataset.index, label: el.dataset.label, total: String(count).padStart(2, "0") });
      }
    };
    activate(sections[0]);

    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && activate(el),
      }),
    );

    ScrollTrigger.refresh();

    // Arriving with a hash (e.g. /#work from a case study): jump there once
    // every pin has measured itself.
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      requestAnimationFrame(() => {
        try {
          scrollToTarget(hash, { immediate: true });
        } catch {
          /* invalid selector — ignore */
        }
      });
    }

    return () => {
      triggers.forEach((t) => t.kill());
      html.classList.remove("theme-sync");
      html.dataset.theme = "ink";
    };
  });

  return null;
}
