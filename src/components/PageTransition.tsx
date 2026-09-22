"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps } from "react";
import { onBootReveal } from "@/lib/boot";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/scroll";

/**
 * Page transitions: a fast ink wipe that carries the destination's name.
 * ~1.1s door to door. Same-page hash links just scroll. Reduced motion
 * (and modifier-clicks, which Next hands to the browser) skip it entirely.
 */

type Nav = { navigate: (href: string, label?: string) => void };
const TransitionContext = createContext<Nav>({ navigate: () => {} });

export function usePageNav() {
  return useContext(TransitionContext);
}

/** Run `cb` once the page is visible: now, after an in-flight wipe, or as the preloader opens. */
export function onPageEnter(cb: () => void) {
  if (document.documentElement.dataset.transitioning === "true") {
    window.addEventListener("page:enter", cb, { once: true });
    return () => window.removeEventListener("page:enter", cb);
  }
  return onBootReveal(cb);
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const path = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string, text?: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        if (url.hash) scrollToTarget(url.hash);
        else scrollToTarget(0);
        return;
      }
      if (busy.current) return;
      if (window.matchMedia(REDUCED).matches || !overlay.current || !label.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      document.documentElement.dataset.transitioning = "true";
      label.current.textContent = text ?? "";
      if (path.current) path.current.textContent = url.pathname;
      getLenis()?.stop();
      gsap
        .timeline()
        .set(overlay.current, { visibility: "visible", yPercent: 100, y: 0 })
        .to(overlay.current, { yPercent: 0, duration: 0.6, ease: "expo.inOut" })
        .fromTo(label.current, { yPercent: 110, y: 0 }, { yPercent: 0, duration: 0.55, ease: "expo.out" }, 0.28)
        .add(() => router.push(href, { scroll: false }));
    },
    [router],
  );

  // The new route has committed (its effects already ran): reset scroll,
  // re-measure, then lift the wipe.
  useEffect(() => {
    if (!busy.current) return;
    const lenis = getLenis();
    lenis?.start();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (window.location.hash.length > 1) {
          try {
            scrollToTarget(window.location.hash, { immediate: true });
          } catch {
            /* ignore bad selectors */
          }
        }
        delete document.documentElement.dataset.transitioning;
        window.dispatchEvent(new Event("page:enter"));
        gsap
          .timeline({
            onComplete: () => {
              busy.current = false;
              gsap.set(overlay.current, { visibility: "hidden" });
            },
          })
          .to(label.current, { yPercent: -110, duration: 0.4, ease: "expo.in" })
          .to(overlay.current, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 0.12);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlay}
        aria-hidden
        className="invisible fixed inset-0 z-[150] flex items-end bg-ink px-gutter pb-[6vh] text-paper"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-[5px] bg-ir" />
        <span className="label absolute left-gutter top-6 flex gap-3 text-paper/60">
          <span>Now entering</span>
          <span ref={path} className="normal-case text-paper" />
        </span>
        <span className="mask">
          <span ref={label} className="display block text-[clamp(56px,14vw,260px)]" />
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = ComponentProps<typeof Link> & {
  href: string;
  /** Big word shown on the wipe. */
  transitionLabel?: string;
};

/** A Next <Link> that plays the page wipe for client-side navigations. */
export function TransitionLink({ href, transitionLabel, onNavigate, ...rest }: TransitionLinkProps) {
  const { navigate } = usePageNav();
  return (
    <Link
      href={href}
      onNavigate={(e) => {
        onNavigate?.(e);
        e.preventDefault();
        navigate(href, transitionLabel);
      }}
      {...rest}
    />
  );
}
