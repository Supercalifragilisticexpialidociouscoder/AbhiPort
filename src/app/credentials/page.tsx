import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { TransitionLink } from "@/components/PageTransition";
import { RoomHero } from "@/components/room/RoomHero";
import { ScrollDirector } from "@/components/ScrollDirector";
import { Media } from "@/components/ui/Media";
import { Known, Ph } from "@/components/ui/Ph";
import { Reveal } from "@/components/ui/Reveal";
import { credentials, credentialsPage } from "@/content/community";
import { site } from "@/content/site";
import { publicFile } from "@/lib/assets";
import { cn, pad } from "@/lib/cn";

const description = `${site.name}'s credentials: 2× SIH Internal Hackathon Winner, AWS Cloud Practitioner, Python Essentials (Cisco), AI & ML Foundations (Google) and more — filed after the work.`;

export const metadata: Metadata = {
  title: "Credentials",
  description,
  alternates: { canonical: "/credentials" },
  openGraph: { type: "website", url: "/credentials", title: `Credentials — ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `Credentials — ${site.name}`, description },
};

export default function CredentialsPage() {
  const types = new Set(credentials.map((c) => c.type).filter(Boolean));
  return (
    <>
      <main id="main">
        <RoomHero
          room="Room 09 ·"
          path="/credentials"
          title={["Credentials."]}
          lead={credentialsPage.lead}
          theme="paper"
          back={{ href: "/community", label: "Community" }}
          stats={[
            { v: pad(credentials.length), k: "Filed" },
            { v: pad(credentials.filter((c) => c.verify).length), k: "Verifiable online" },
            { v: pad(types.size), k: "Types known" },
          ]}
        >
          <p className="label mt-10 max-w-2xl text-muted">{credentialsPage.note}</p>
        </RoomHero>

        <section data-theme="paper" data-index="01" data-label="The file" aria-label="Credentials" className="relative px-gutter pb-[14vh]">
          <div aria-hidden className="label hidden grid-cols-[3rem_1fr_14rem_7rem_8rem] gap-4 border-b border-fg pb-2 text-muted lg:grid">
            <span>No.</span>
            <span>Title</span>
            <span>Issuer</span>
            <span>Date</span>
            <span>Type</span>
          </div>
          <ol>
            {credentials.map((c, i) => {
              const pdf = c.pdf ? publicFile(c.pdf) : null;
              return (
                <Reveal as="li" key={c.slug} className={cn("grid gap-6 border-b border-line py-8 lg:grid-cols-12 lg:gap-6", c.lead && "lg:py-12")}>
                  <div className="flex flex-col gap-4 lg:col-span-7">
                    <div className="grid gap-x-4 gap-y-2 lg:grid-cols-[3rem_1fr]">
                      <span className="label tnum text-accent">{pad(i + 1)}</span>
                      <h2 className={cn("display leading-[0.9]", c.lead ? "text-[clamp(44px,5vw,92px)] text-accent" : "text-[clamp(30px,3vw,52px)]")}>{c.title}</h2>
                    </div>
                    <dl className="label grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 sm:grid-cols-4 lg:ml-[4rem]">
                      <div>
                        <dt className="text-muted">Issuer</dt>
                        <dd className="mt-1 normal-case tracking-normal text-[14px] text-fg">
                          <Known value={c.issuer} todo="Add issuer" />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Date</dt>
                        <dd className="mt-1 text-fg">
                          <Known value={c.date} todo="Add date" />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Type</dt>
                        <dd className="mt-1 text-fg">
                          <Known value={c.type} todo="Add type" />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Credential ID</dt>
                        <dd className="mt-1 text-fg">{c.credentialId ?? "—"}</dd>
                      </div>
                    </dl>
                    <p className="label flex flex-wrap gap-x-6 gap-y-2 lg:ml-[4rem]">
                      {c.verify ? (
                        <a href={c.verify} target="_blank" rel="noopener noreferrer" className="link-line text-fg">
                          Verify ↗
                        </a>
                      ) : (
                        <span className="text-muted">No online verification</span>
                      )}
                      {pdf ? (
                        <a href={pdf} target="_blank" rel="noopener noreferrer" className="link-line text-fg">
                          Original (PDF) ↗
                        </a>
                      ) : c.pdf ? (
                        <Ph>{`Add PDF — public/${c.pdf}`}</Ph>
                      ) : null}
                    </p>
                  </div>
                  <figure className="lg:col-span-5">
                    <div className="relative aspect-[4/3] overflow-hidden border border-line bg-bg">
                      <Media src={c.image} alt={`${c.title} — certificate`} sizes="(min-width: 1024px) 40vw, 100vw" label={c.title} compact={!c.lead} />
                    </div>
                  </figure>
                </Reveal>
              );
            })}
          </ol>

          <TransitionLink href="/archive" transitionLabel="Archive" className="group mt-14 flex flex-wrap items-center justify-between gap-6 border-y border-fg py-6">
            <span className="display text-[clamp(32px,3.6vw,64px)] leading-[0.9]">
              The work matters more<span className="arrow-nudge-x ml-[0.15em] text-accent">→</span>
            </span>
            <span className="label max-w-sm text-muted">Projects over paperwork, always. The archive is the real résumé.</span>
          </TransitionLink>
        </section>
        <ScrollDirector total={1} />
      </main>
      <Footer cvHref={publicFile(site.cv)} />
    </>
  );
}
