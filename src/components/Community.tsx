"use client";

import { useRef } from "react";
import { club, community, sections } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { pad } from "@/lib/cn";
import { TransitionLink } from "./PageTransition";
import { CountUp } from "./ui/CountUp";
import { SectionHead } from "./ui/SectionHead";
import { Ecosystem } from "./visuals/Ecosystem";

/**
 * 05 — Community. Club Infin8 as a real organisation, not an
 * "extracurriculars" bullet: the scale, the eight-club structure, the role,
 * and the thread back to the software built for it. Then the wider
 * community and learning — certificates deliberately last and smallest.
 */
export function Community() {
  const root = useRef<HTMLElement>(null);
  const s = sections.community;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-cm-line]"),
          { yPercent: 105, y: 0 },
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: q("[data-cm-title]")[0], start: "top 85%", once: true } },
        );

        // The ring turns an eighth; the 8 tips over into ∞.
        const eco = q("[data-eco]")[0];
        const tl = gsap.timeline({ scrollTrigger: { trigger: eco, start: "top 85%", end: "bottom 25%", scrub: 0.8 } });
        tl.fromTo(q("[data-eco-ring]"), { rotate: -22.5 }, { rotate: 22.5, ease: "none" }, 0)
          .fromTo(q("[data-eco-label]"), { rotate: 22.5 }, { rotate: -22.5, ease: "none" }, 0)
          .fromTo(q("[data-eco-eight]"), { rotate: 0 }, { rotate: 90, ease: "power2.inOut" }, 0);

        gsap.fromTo(
          q("[data-role]"),
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", scrollTrigger: { trigger: q("[data-role]")[0], start: "top 85%", once: true } },
        );

        gsap.fromTo(
          q("[data-stage]"),
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.9, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: q("[data-stages]")[0], start: "top 85%", once: true } },
        );

        gsap.fromTo(
          q("[data-times]"),
          { rotate: -90, scale: 0.4, opacity: 0 },
          { rotate: 0, scale: 1, opacity: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: q("[data-px]")[0], start: "top 80%", once: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={s.id}
      data-theme="paper"
      data-index={s.index}
      data-label={s.label}
      aria-labelledby="community-title"
      className="relative overflow-hidden px-gutter pb-[14vh] pt-[16vh]"
    >
      <SectionHead index={s.index} title={`Community — ${club.name}`} aside={club.role} />

      {/* Headline + role */}
      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <h2 id="community-title" data-cm-title className="display text-[clamp(64px,10.5vw,200px)] lg:col-span-8">
          <span className="mask">
            <span data-cm-line className="block">
              8 clubs.
            </span>
          </span>
          <span className="mask">
            <span data-cm-line className="block">
              One ecosystem<span className="text-accent">.</span>
            </span>
          </span>
        </h2>
        <div className="self-end lg:col-span-4">
          <p className="label text-muted">Role</p>
          <p data-role className="display-wide mt-2 text-[clamp(26px,2.5vw,44px)] leading-[0.95]">
            {club.role}
          </p>
          <p className="label mt-3 flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
            {club.roleNote} · {club.name}
          </p>
        </div>
      </div>

      {/* Scale */}
      <dl className="mt-14 grid grid-cols-3 border-y border-fg">
        {club.stats.map((st, i) => (
          <div key={st.label} className={`flex flex-col justify-between gap-6 py-6 ${i > 0 ? "border-l border-line pl-4 md:pl-6" : "pr-4"}`}>
            <dt className="label order-2 text-muted">
              <span className="block text-fg">{st.label}</span>
              <span className="hidden md:block">{st.note}</span>
            </dt>
            <dd className="display tnum order-1 text-[clamp(44px,8.6vw,170px)] leading-[0.8]">
              <CountUp value={st.value} prefix={st.prefix} />
            </dd>
          </div>
        ))}
      </dl>

      {/* Structure: the ecosystem + the story */}
      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-6">
        <figure data-eco className="lg:col-span-7">
          <Ecosystem clubs={club.clubs} />
          <figcaption className="label mt-6 flex justify-between gap-4 text-muted">
            <span>Fig. — The Infin8 ecosystem</span>
            <span className="hidden md:inline">Hover a club</span>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-10 lg:col-span-5">
          <p className="text-[clamp(20px,1.7vw,26px)] leading-snug">{club.idea}</p>

          <ol className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line pt-4 text-[15px]">
            {club.clubs.map((c, i) => (
              <li key={c} className="flex gap-3 py-1">
                <span className="label tnum pt-1 text-accent">{pad(i + 1)}</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>

          <ol data-stages className="border-t border-fg">
            {club.stages.map((st, i) => (
              <li key={st.label} data-stage className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-line py-4">
                <span className="label tnum text-muted">{pad(i + 1)}</span>
                <span>
                  <span className="display block text-[clamp(30px,2.6vw,46px)] leading-[0.9]">
                    {st.label}
                    {i < club.stages.length - 1 ? <span className="text-accent"> →</span> : null}
                  </span>
                  <span className="mt-1 block text-[15px] text-muted">{st.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* People × Systems */}
      <div data-px data-surface="ink" className="-mx-gutter mt-20 px-gutter py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          <div>
            <p className="label text-muted">People</p>
            <p className="display mt-3 text-[clamp(48px,6vw,110px)]">{club.name}</p>
            <p className="label mt-4">
              {club.stats
                .slice()
                .reverse()
                .map((st) => `${st.prefix}${st.value.toLocaleString("en-US")} ${st.label.toLowerCase()}`)
                .join(" · ")}
            </p>
          </div>
          <span data-times aria-hidden className="display justify-self-center text-[clamp(80px,9vw,170px)] leading-[0.8] text-accent">
            ×
          </span>
          <div>
            <p className="label text-muted">Systems</p>
            <p className="display mt-3 text-[clamp(48px,6vw,110px)]">Infin8 Access</p>
            <TransitionLink href="/work/infin8-access" transitionLabel="Infin8 Access" className="group label mt-4 inline-flex items-center gap-3">
              <span className="link-line">The case study</span>
              <span className="arrow-nudge-x text-accent">→</span>
            </TransitionLink>
          </div>
        </div>

        <p className="mt-14 max-w-4xl text-[clamp(26px,3.2vw,54px)] font-medium leading-[1.05] tracking-[-0.02em]">{club.peopleLine}</p>

        <div className="mt-12 grid gap-10 border-t border-line pt-8 lg:grid-cols-2">
          <div>
            <p className="label text-muted">What I&apos;ve built around the clubs</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {club.systems.map((x) => (
                <li key={x} className="label border border-line px-2.5 py-1.5">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-muted">Operating at campus scale</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {club.operations.map((x) => (
                <li key={x} className="label border border-dashed border-line px-2.5 py-1.5">
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] text-muted">{club.opsNote}</p>
          </div>
        </div>

        <TransitionLink href="/club-infin8" transitionLabel="Club Infin8" data-cursor="Read" className="group mt-12 inline-flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
            <span className="arrow-nudge-x">→</span>
          </span>
          <span className="display text-[clamp(26px,2.4vw,40px)]">The full Club Infin8 story</span>
        </TransitionLink>
      </div>

      {/* Community & learning */}
      <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <h3 className="display text-[clamp(40px,4vw,72px)]">{community.title}</h3>
          <p className="mt-4 max-w-sm text-[17px] leading-snug text-muted">{community.lead}</p>
        </div>
        <div className="lg:col-span-8">
          <ul className="border-t border-fg">
            {community.items.map((it) => (
              <li key={it.name} className="grid gap-2 border-b border-line py-5 md:grid-cols-[1fr_9rem_1.2fr] md:items-baseline md:gap-6">
                <span className="display text-[clamp(26px,2.4vw,40px)] leading-[0.95]">{it.name}</span>
                <span className="label text-accent">{it.kind}</span>
                <span className="text-[15px] text-muted">{it.note}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="label flex items-center justify-between gap-4 text-muted">
              <span>The paperwork</span>
              <span>Secondary, as it should be</span>
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3">
              {community.certificates.map((c) => (
                <li key={c} className="label">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
