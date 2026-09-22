"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

/** Local time where Abhi is. Rendered client-side only to avoid hydration drift. */
export function Clock({ withPlace = true }: { withPlace?: boolean }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: site.timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tnum whitespace-nowrap">
      {withPlace ? `${site.location} ` : ""}
      <span aria-hidden className="text-accent">
        ●
      </span>{" "}
      <time suppressHydrationWarning>{time ?? "--:--"}</time> {site.timeZoneLabel}
    </span>
  );
}
