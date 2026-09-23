import type { LabEntry } from "@/content/lab";
import { getLabEntry, getNextLabEntry, labEntries } from "@/content/lab";
import { garage } from "@/content/site";
import { pad } from "@/lib/cn";
import { CaseSection } from "../case/CaseSection";
import { FlowChain } from "../case/Diagrams";
import { TransitionLink } from "../PageTransition";
import { ScrollDirector } from "../ScrollDirector";
import { Media } from "../ui/Media";
import { Ph } from "../ui/Ph";
import { Reveal } from "../ui/Reveal";
import { ImuScope } from "../visuals/ImuScope";
import { LeanDial } from "../visuals/LeanDial";
import { PartGlyph } from "../visuals/PartGlyph";
import { LabHero } from "./LabHero";
import { LabVisual } from "./LabVisuals";

/** A lab page. The prototype gets its own long-form build story; experiments share a frame but each runs its own instrument and storyline. */
export function LabPage({ entry }: { entry: LabEntry }) {
  return entry.visual === "lean" ? <PrototypePage entry={entry} /> : <ExperimentPage entry={entry} />;
}

/* ── Shared endings ───────────────────────────────────────────────────── */

function Bench({ e, n }: { e: LabEntry; n: string }) {
  return (
    <CaseSection n={n} title="On my bench" theme="paper">
      <p className="label text-muted">What I actually did with it</p>
      <ul className="mt-4 max-w-3xl border-t border-fg">
        {e.known.map((k, i) => (
          <li key={k} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-4 text-[clamp(18px,1.6vw,24px)] leading-snug">
            <span className="label tnum pt-1.5 text-accent">{pad(i + 1)}</span>
            {k}
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <Ph>{e.todo}</Ph>
      </p>
    </CaseSection>
  );
}

function Evidence({ e, n }: { e: LabEntry; n: string }) {
  return (
    <CaseSection n={n} title="Evidence" theme="ink">
      <div className="grid gap-6 md:grid-cols-2">
        {e.media.map((m, i) => (
          <Reveal as="figure" key={m.image} className={i === 0 && e.media.length > 1 ? "md:col-span-2" : undefined}>
            <div className={`relative overflow-hidden border border-line ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
              <Media src={m.image} alt={`${e.title} — ${m.caption}`} sizes={i === 0 ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 1024px) 35vw, 100vw"} label={m.caption} />
            </div>
            <figcaption className="label mt-3 flex justify-between gap-4 text-muted">
              <span>{m.caption}</span>
              <span className="tnum">Fig. {pad(i + 1)}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </CaseSection>
  );
}

function Onward({ e, index }: { e: LabEntry; index: number }) {
  const next = getNextLabEntry(e.slug);
  const related = (e.related ?? []).map(getLabEntry).filter((x): x is LabEntry => Boolean(x));
  return (
    <section data-theme="ink" data-index={pad(index)} data-label="Next" aria-label="Next experiment" className="relative">
      {related.length ? (
        <div className="px-gutter pt-[10vh]">
          <p className="label border-b border-line pb-2 text-muted">Related on the bench</p>
          <ul className="grid gap-px border-b border-line sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <TransitionLink href={`/lab/${r.slug}`} transitionLabel={r.title} className="group flex items-center gap-4 py-5 pr-4">
                  <PartGlyph name={r.glyph} className="h-10 w-10 shrink-0 text-fg" />
                  <span>
                    <span className="label tnum block text-accent">Lab / {r.number}</span>
                    <span className="display mt-1 block text-[clamp(22px,1.8vw,30px)] leading-[0.95] transition-transform group-hover:translate-x-1">{r.title}</span>
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <TransitionLink href={`/lab/${next.slug}`} transitionLabel={next.title} data-cursor="Next" className="group block px-gutter pb-[14vh] pt-[12vh]">
        <span className="label flex justify-between text-muted">
          <span>
            Next on the bench — <span className="tnum text-accent">{next.number}</span> / {pad(labEntries.length)}
          </span>
          <span>{next.kind}</span>
        </span>
        <span className="display mt-8 block text-balance text-[clamp(64px,12vw,240px)] leading-[0.82] transition-[font-variation-settings] duration-700 ease-[var(--ease-expo)] group-hover:[--wdth:76]">
          {next.title}
          <span className="arrow-nudge-x ml-[0.15em] text-accent">→</span>
        </span>
        <span className="mt-8 block max-w-md text-[clamp(18px,1.4vw,22px)] text-muted">{next.line}</span>
      </TransitionLink>
    </section>
  );
}

/* ── An experiment ────────────────────────────────────────────────────── */

function ExperimentPage({ entry: e }: { entry: LabEntry }) {
  let n = 0;
  const idx = () => pad(++n);
  return (
    <main id="main">
      <LabHero entry={e} />

      <CaseSection n={idx()} title="The instrument" theme="garage">
        <Reveal>
          <LabVisual entry={e} />
        </Reveal>
        <p className="label mt-4 text-muted">A simulation of how the part behaves — not a recording of mine. Bench photos go in the evidence below.</p>
      </CaseSection>

      <CaseSection n={idx()} title={e.arc.join(" → ")} theme="ink">
        <ol className="grid gap-px border border-line bg-line md:grid-cols-3">
          {e.chapters.map((c, i) => (
            <Reveal as="li" key={c.label} className="relative flex flex-col gap-5 bg-bg p-6 md:p-7">
              <span className="label flex items-center justify-between">
                <span className="tnum text-accent">
                  {pad(i + 1)} · {c.label}
                </span>
                {i < e.chapters.length - 1 ? <span className="hidden text-accent md:inline">→</span> : <span className="text-accent">■</span>}
              </span>
              <h3 className="display text-[clamp(28px,2.4vw,42px)] leading-[0.92]">{c.title}</h3>
              <p className="text-[16px] leading-relaxed text-muted">{c.body}</p>
            </Reveal>
          ))}
        </ol>
      </CaseSection>

      <Bench e={e} n={idx()} />
      <Evidence e={e} n={idx()} />
      <Onward e={e} index={n + 1} />
      <ScrollDirector total={n + 1} />
    </main>
  );
}

/* ── The prototype: problem → physical system → sensors → decision → prototype ── */

function PrototypePage({ entry: e }: { entry: LabEntry }) {
  let n = 0;
  const idx = () => pad(++n);
  const ch = Object.fromEntries(e.chapters.map((c) => [c.label, c]));
  const mpu = garage.parts.find((p) => p.name === "MPU6050");
  const bug = ch.Testing;

  return (
    <main id="main">
      <LabHero entry={e} />
      {e.disclaimer ? (
        <div data-theme="ir" className="px-gutter py-4">
          <p className="label flex flex-wrap items-center justify-between gap-3">
            <span>⚠ {e.disclaimer}</span>
            <span>Prototype — do not ride on it</span>
          </p>
        </div>
      ) : null}

      <CaseSection n={idx()} title={ch.Problem.title} theme="ink">
        <Reveal as="p" className="max-w-[30ch] text-[clamp(26px,3vw,52px)] font-medium leading-[1.08] tracking-[-0.02em]">
          {ch.Problem.body}
        </Reveal>
      </CaseSection>

      <CaseSection n={idx()} title={ch.Built.title} theme="ink">
        <Reveal as="p" className="max-w-[48ch] text-[clamp(19px,1.6vw,24px)] leading-relaxed">
          {ch.Built.body}
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {(
            [
              ["imu", "MPU6050", "Senses"],
              ["mono", "Microcontroller", "Decides"],
              ["led", "LEDs", "Shows"],
              ["buzzer", "Buzzer", "Shouts"],
            ] as const
          ).map(([g, name, role], i) => (
            <li key={name} className="flex flex-col gap-6 bg-bg p-5">
              <span className="label flex justify-between text-muted">
                <span className="tnum text-accent">P-{pad(i + 1)}</span>
                <span>{role}</span>
              </span>
              <PartGlyph name={g} label={g === "mono" ? "MCU" : undefined} className="h-16 w-16 text-fg" />
              <span className="display text-[clamp(24px,2vw,34px)] leading-[0.92]">{name}</span>
            </li>
          ))}
        </ul>
      </CaseSection>

      <CaseSection n={idx()} title={ch.How.title} theme="garage">
        <Reveal as="p" className="max-w-[46ch] text-[clamp(19px,1.6vw,24px)] leading-relaxed">
          {ch.How.body}
        </Reveal>
        <Reveal>
          <FlowChain
            title="The signal chain"
            steps={[
              { label: "Raw readings", note: "Accelerometer + gyroscope" },
              { label: "Angle", note: "Worked out from the readings" },
              { label: "Threshold", note: "Too far? Compare." },
              { label: "Warning", note: "LEDs + buzzer" },
            ]}
          />
        </Reveal>
      </CaseSection>

      <CaseSection n={idx()} title={ch.Sensors.title} theme="garage">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <Reveal as="p" className="text-[clamp(19px,1.6vw,24px)] leading-relaxed">
              {ch.Sensors.body}
            </Reveal>
            {mpu ? (
              <div className="mt-8 grid grid-cols-[72px_1fr] gap-4 border-t border-line pt-5">
                <PartGlyph name={mpu.glyph} className="h-[72px] w-[72px] text-fg" />
                <p className="label normal-case tracking-normal text-[13px] leading-relaxed text-muted">
                  <span className="label block text-accent">Datasheet · {mpu.id}</span>
                  {mpu.spec}
                </p>
              </div>
            ) : null}
          </div>
          <div className="min-h-[420px] lg:col-span-7">
            <ImuScope />
          </div>
        </div>
      </CaseSection>

      <CaseSection n={idx()} title={ch.Data.title} theme="ink">
        <Reveal as="p" className="max-w-[46ch] text-[clamp(19px,1.6vw,24px)] leading-relaxed">
          {ch.Data.body}
        </Reveal>
        <dl className="mt-10 grid grid-cols-3 gap-px border border-line bg-line md:grid-cols-6">
          {["AX", "AY", "AZ", "GX", "GY", "GZ"].map((k, i) => (
            <div key={k} className="flex flex-col gap-4 bg-bg p-4">
              <dt className="label text-muted">{i < 3 ? "Accel" : "Gyro"}</dt>
              <dd className="display text-[clamp(32px,3vw,52px)] leading-none">{k}</dd>
            </div>
          ))}
        </dl>
        <p className="label mt-4 text-muted">Six channels in. One number out: the lean angle.</p>
      </CaseSection>

      <CaseSection n={idx()} title={ch.Logic.title} theme="garage" id="simulation">
        <Reveal as="p" className="max-w-[46ch] text-[clamp(19px,1.6vw,24px)] leading-relaxed">
          {ch.Logic.body}
        </Reveal>
        <div className="mt-12">
          <LeanDial story={e.story ?? []} />
        </div>
      </CaseSection>

      <CaseSection n={idx()} title="The prototype" theme="ink">
        <div className="grid gap-6 md:grid-cols-2">
          {e.media.map((m, i) => (
            <Reveal as="figure" key={m.image} className={i === 0 ? "md:col-span-2" : undefined}>
              <div className={`relative overflow-hidden border border-line ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                <Media src={m.image} alt={`${e.title} — ${m.caption}`} sizes={i === 0 ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 1024px) 35vw, 100vw"} label={m.caption} />
              </div>
              <figcaption className="label mt-3 flex justify-between gap-4 text-muted">
                <span>{m.caption}</span>
                <span className="tnum">Fig. {pad(i + 1)}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </CaseSection>

      {/* Testing — the bug gets the full screen it deserves */}
      <section data-theme="ir" data-index={idx()} data-label="Testing" aria-labelledby="bug-title" className="relative px-gutter py-[12vh]">
        <p className="label flex justify-between border-b border-line pb-3">
          <span>({pad(n)}) Testing</span>
          <span>The sensor had other plans</span>
        </p>
        <h2 id="bug-title" className="display mt-10 text-[clamp(120px,26vw,520px)] leading-[0.78] tracking-[-0.02em]">
          −135°
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p className="display text-[clamp(32px,3.6vw,64px)] leading-[0.92] md:col-span-6">{bug.title}</p>
          <div className="space-y-5 md:col-span-6">
            <p className="text-[clamp(18px,1.5vw,22px)] leading-snug">{bug.body}</p>
            <p className="label">Axes → maths → axes again → fixed.</p>
            <Ph>ADD — how you tested it, and what fixed it</Ph>
          </div>
        </div>
      </section>

      <CaseSection n={idx()} title={ch.Result.title} theme="ink">
        <Reveal as="p" className="display text-[clamp(56px,8vw,160px)] leading-[0.84]">
          It worked<span className="text-accent">.</span> Eventually<span className="text-accent">.</span>
        </Reveal>
        <Reveal as="p" className="mt-8 max-w-[52ch] text-[clamp(18px,1.5vw,22px)] leading-relaxed text-muted">
          {ch.Result.body}
        </Reveal>
        <p className="mt-6">
          <Ph>ADD — where it stands now: parked, next version, or on a bike?</Ph>
        </p>
      </CaseSection>

      <Bench e={e} n={idx()} />
      <Onward e={e} index={n + 1} />
      <ScrollDirector total={n + 1} />
    </main>
  );
}
