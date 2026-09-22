import type { GlyphName } from "@/content/site";

/**
 * Line drawings for the parts bin — schematic, not photographic, so they
 * stay honest until real bench photos exist. 64×64, stroke = currentColor.
 */
export function PartGlyph({ name, label, className }: { name: GlyphName; label?: string; className?: string }) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "square" as const,
    className,
    "aria-hidden": true,
  };

  const pins = (x: number, y: number, count: number, dx: number, dy: number) =>
    Array.from({ length: count }, (_, i) => <rect key={`${x}-${y}-${i}`} x={x + i * dx} y={y + i * dy} width="1.6" height="1.6" fill="currentColor" stroke="none" />);

  switch (name) {
    case "esp32":
      return (
        <svg {...common}>
          <rect x="16" y="6" width="32" height="52" />
          <path d="M20 11h4v4h4v-4h4v4h4v-4h4v4h4" />
          <rect x="21" y="24" width="22" height="22" />
          {pins(13, 20, 10, 0, 3.6)}
          {pins(49.4, 20, 10, 0, 3.6)}
        </svg>
      );
    case "arduino":
      return (
        <svg {...common}>
          <path d="M6 14h46l6 6v26l-6 4H6z" />
          <rect x="2" y="20" width="10" height="10" />
          <rect x="4" y="36" width="8" height="8" />
          {pins(22, 17, 12, 2.8, 0)}
          {pins(28, 45, 10, 2.8, 0)}
          <rect x="28" y="26" width="18" height="8" />
          <circle cx="50" cy="38" r="1.6" />
        </svg>
      );
    case "pico":
      return (
        <svg {...common}>
          <rect x="20" y="4" width="24" height="56" rx="1" />
          <rect x="27" y="1" width="10" height="6" />
          <rect x="26" y="26" width="12" height="12" />
          {pins(21.5, 10, 14, 0, 3.5)}
          {pins(40.9, 10, 14, 0, 3.5)}
        </svg>
      );
    case "imu":
    case "imu9":
      return (
        <svg {...common}>
          <rect x="14" y="14" width="36" height="36" />
          <rect x="25" y="25" width="14" height="14" transform="rotate(45 32 32)" />
          <path d="M32 32h20M48 29l4 3-4 3" />
          <path d="M32 32V10M29 14l3-4 3 4" />
          <path d="M32 32l-12 12M20 38v6h6" />
          {name === "imu9" ? <path d="M10 22a24 24 0 0 1 12-12" strokeDasharray="2 2" /> : null}
          {pins(17, 52.5, 8, 4, 0)}
        </svg>
      );
    case "ultrasonic":
      return (
        <svg {...common}>
          <rect x="4" y="16" width="56" height="32" />
          <circle cx="19" cy="32" r="10" />
          <circle cx="19" cy="32" r="5.5" />
          <circle cx="45" cy="32" r="10" />
          <circle cx="45" cy="32" r="5.5" />
          {pins(26, 49.5, 4, 3.6, 0)}
        </svg>
      );
    case "tof":
      return (
        <svg {...common}>
          <rect x="14" y="22" width="36" height="28" />
          <rect x="27" y="30" width="10" height="6" />
          <path d="M29 30l-9-18M35 30l9-18" strokeDasharray="2 2.5" />
          {pins(19, 51.5, 6, 5, 0)}
        </svg>
      );
    case "ir":
      return (
        <svg {...common}>
          <rect x="8" y="26" width="48" height="22" />
          <circle cx="24" cy="37" r="5" />
          <circle cx="40" cy="37" r="5" />
          <path d="M24 22c-4-4-4-10 0-14M40 22c4-4 4-10 0-14" strokeDasharray="2 2" />
          {pins(24, 49.5, 3, 7, 0)}
        </svg>
      );
    case "led":
      return (
        <svg {...common}>
          <path d="M20 22l16 10-16 10z" />
          <path d="M36 22v20M8 32h12M36 32h16" />
          <path d="M40 18l6-6M44 22l6-6" />
          <path d="M43 12h3v3M47 16h3v3" />
        </svg>
      );
    case "buzzer":
      return (
        <svg {...common}>
          <circle cx="26" cy="32" r="14" />
          <circle cx="26" cy="32" r="4" />
          <path d="M46 22c4 6 4 14 0 20M52 17c7 9 7 21 0 30" strokeDasharray="2 2" />
          {pins(22, 47.5, 2, 6, 0)}
        </svg>
      );
    case "mono":
    default:
      return (
        <svg {...common}>
          <rect x="8" y="8" width="48" height="48" />
          <path d="M8 18h48" />
          <text
            x="32"
            y="44"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            style={{ font: "700 17px var(--font-geist-mono), monospace", letterSpacing: "0.02em" }}
          >
            {label}
          </text>
        </svg>
      );
  }
}
