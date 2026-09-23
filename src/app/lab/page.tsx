import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LabIndex } from "@/components/lab/LabIndex";
import { RoomHero } from "@/components/room/RoomHero";
import { ScrollDirector } from "@/components/ScrollDirector";
import { ImuScope } from "@/components/visuals/ImuScope";
import { lab, labEntries } from "@/content/lab";
import { garage, site } from "@/content/site";
import { publicFile } from "@/lib/assets";
import { pad } from "@/lib/cn";

const description = `${site.name}'s hardware lab: a motorcycle safety prototype and nine bench experiments with ESP32, Arduino, Raspberry Pi Pico, MPU6050, MPU9250, HC-SR04, VL53L0X and IR sensors.`;

export const metadata: Metadata = {
  title: "The lab",
  description,
  alternates: { canonical: "/lab" },
  openGraph: { type: "website", url: "/lab", title: `The lab — ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `The lab — ${site.name}`, description },
};

export default function LabIndexPage() {
  const prototypes = labEntries.filter((e) => e.status === "Prototype").length;
  return (
    <>
      <main id="main">
        <RoomHero
          room="Room 04 ·"
          path="/lab"
          title={["The", "lab."]}
          lead={lab.lead}
          theme="garage"
          back={{ href: "/#garage", label: "Home" }}
          stats={[
            { v: pad(labEntries.length), k: "Builds filed" },
            { v: pad(prototypes), k: "Prototype" },
            { v: pad(labEntries.length - prototypes), k: "Experiments" },
            { v: pad(garage.parts.length), k: "Parts on the bench" },
          ]}
        />
        <section data-theme="garage" data-index="01" data-label="Index" aria-label="Lab index" className="relative px-gutter pb-[12vh]">
          <p className="label mb-6 flex flex-wrap justify-between gap-4 border-b border-fg pb-3">
            <span>Lab index — pick one</span>
            <span className="text-muted">One prototype · nine experiments</span>
          </p>
          <LabIndex fill="note" />
        </section>
        <section data-theme="garage" data-index="02" data-label="Live" aria-label="A live sensor trace" className="relative px-gutter pb-[14vh]">
          <p className="label mb-6 border-b border-fg pb-3">While you&apos;re here — a live trace, with your cursor as the sensor</p>
          <div className="min-h-[420px]">
            <ImuScope />
          </div>
        </section>
        <ScrollDirector total={2} />
      </main>
      <Footer cvHref={publicFile(site.cv)} />
    </>
  );
}
