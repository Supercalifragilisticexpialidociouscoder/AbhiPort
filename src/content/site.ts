/**
 * ──────────────────────────────────────────────────────────────────────────
 *  ABHI — SITE CONTENT
 *
 *  Every word on the home page lives in this file. Projects and their case
 *  studies live in ./projects.ts.
 *
 *  Rules of the house:
 *  - Anything set to `null` renders as a visible [ADD …] marker, so nothing
 *    unverified ever gets published as fact. Fill it in or leave it null.
 *  - Images are referenced by base path (no extension) under /public.
 *    Drop `public/images/abhi-hero.jpg` (or .png/.webp/.avif/.mp4) and it
 *    replaces the placeholder automatically. See README.md.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type Maybe<T> = T | null;

export const site = {
  name: "Abhiram Reddy",
  fullName: "Abhiram Reddy Palle",
  short: "Abhi",
  edition: "2026",
  location: "India",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  study: "B.Tech, Computer Science",
  /** The year you started building things, e.g. 2021. */
  buildingSince: null as Maybe<number>,
  /** Public contact email. */
  email: "abhiram200869@gmail.com" as Maybe<string>,
  links: {
    github: "https://github.com/Supercalifragilisticexpialidociouscoder" as Maybe<string>,
    linkedin: "https://www.linkedin.com/in/abhiram09/" as Maybe<string>,
  },
  /**
   * true  → unknown facts show as [ADD …] markers (good while you fill things in)
   * false → unknown facts are quietly left out (good for launch)
   */
  showPlaceholders: true,
  seo: {
    title: "Abhiram Reddy — Builder / Engineer / Creative Technologist",
    description:
      "Abhiram Reddy (Abhi) builds across software and hardware: full-stack products on Next.js and Cloudflare, ESP32 and sensor prototypes, developer security tools and satellite-imagery research. Based in India.",
  },
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Lab", href: "#garage" },
  { label: "Contact", href: "#contact" },
] as const;

/* ── 00 · HERO ─────────────────────────────────────────────────────────── */

export const hero = {
  lines: ["Abhiram", "Reddy"] as const,
  kicker: "Logbook — Edition 2026",
  intro:
    "I build software for real businesses, hardware that reacts to the world, and tools that catch mistakes before they ship.",
  meta: [
    { k: "Based", v: "India" },
    { k: "Studying", v: "B.Tech, Computer Science" },
    { k: "Works across", v: "Software × Hardware" },
  ],
  /** Revealed when the portrait frame opens up on scroll. */
  caption: {
    lines: ["Building", "things that", "move."],
    note: "Trucks, sensors, satellite pixels and permission slips — so far.",
  },
  image: "images/abhi-hero",
  imageAlt: "Portrait of Abhiram Reddy",
};

/* ── 01 · WHO'S ABHI ──────────────────────────────────────────────────── */

export const about = {
  title: "Who's Abhi?",
  lead: "I'm Abhi. I build the things I can't stop thinking about — full-stack products, hardware prototypes, security tools and the occasional research rabbit hole.",
  body: [
    "Most of it starts with something that bugs me. A permission slip that has to be walked across campus. A transport business that can't easily tell which truck is actually making money. A secret that almost ends up in a commit. Then it becomes a project. Then, usually, three.",
    "Right now that means a B.Tech in computer science, as many hackathons as I can get into, and video edits and Blender renders on the side. Different tools, same instinct: I'd rather make the thing than talk about it.",
  ],
  facts: [
    { k: "Name", v: "Abhiram Reddy Palle" },
    { k: "Goes by", v: "Abhi" },
    { k: "Based in", v: "India" },
    { k: "Studying", v: "B.Tech, Computer Science" },
    { k: "Builds with", v: "React, Python, Cloudflare, ESP32" },
    { k: "Off-screen", v: "Blender, DaVinci Resolve, Premiere Pro" },
  ],
  portrait: "images/abhi-portrait",
  portraitAlt: "Abhi, candid",
};

/* ── 02 · STATEMENT ───────────────────────────────────────────────────── */

export const statement = {
  lead: "This is a",
  struck: "Portfolio.",
  replacement: "Logbook.",
  note: "Not a highlights reel. A running record of what I've built, what broke, and what I'm building next.",
};

/* ── 03 · WORK (projects live in ./projects.ts) ───────────────────────── */

export const work = {
  title: "Work",
  lead: "Two products built for real organisations, one tool for developers, one research question.",
};

/* ── 04 · THE GARAGE ──────────────────────────────────────────────────── */

export type Part = {
  id: string;
  name: string;
  kind: string;
  line: string;
  spec: string;
  glyph: GlyphName;
};

export type GlyphName =
  | "esp32"
  | "arduino"
  | "pico"
  | "imu"
  | "imu9"
  | "ultrasonic"
  | "tof"
  | "ir"
  | "mono";

export const garage = {
  title: "The Garage",
  lead: "Where the unfinished stuff lives. Boards, sensors, half-wired ideas — and the software that holds them together.",
  scope: {
    title: "MPU6050 · CH-01",
    note: "Move your cursor. This is roughly how an accelerometer sees motion — I just swapped the sensor for your mouse.",
    touchNote: "Scroll or drag. This is roughly how an accelerometer sees motion — I just swapped the sensor for your thumb.",
  },
  bins: {
    hardware: [
      { id: "P-01", name: "ESP32", kind: "Microcontroller", line: "Wi-Fi and Bluetooth on one chip. The default brain for anything connected.", spec: "Dual-core Xtensa LX6 · up to 240 MHz · Wi-Fi 802.11 b/g/n · Bluetooth", glyph: "esp32" },
      { id: "P-02", name: "Arduino", kind: "Microcontroller", line: "The fastest route from idea to blinking LED.", spec: "Uno: ATmega328P · 16 MHz · 5 V logic", glyph: "arduino" },
      { id: "P-03", name: "Raspberry Pi Pico", kind: "Microcontroller", line: "Cheap, fast, and programmable I/O for the weird timing jobs.", spec: "RP2040 · 2× Arm Cortex-M0+ · up to 133 MHz · 264 KB SRAM", glyph: "pico" },
      { id: "P-04", name: "MPU6050", kind: "IMU", line: "Six axes of motion: how fast it turns, how hard it moves.", spec: "3-axis gyroscope + 3-axis accelerometer · I²C", glyph: "imu" },
      { id: "P-05", name: "MPU9250", kind: "IMU", line: "The MPU6050 plus a compass. Nine axes.", spec: "Gyro + accelerometer + AK8963 magnetometer · I²C / SPI", glyph: "imu9" },
      { id: "P-06", name: "HC-SR04", kind: "Distance", line: "Ping, listen, measure the echo.", spec: "40 kHz ultrasonic ranging · roughly 2–400 cm", glyph: "ultrasonic" },
      { id: "P-07", name: "VL53L0X", kind: "Distance", line: "Distance by timing light instead of sound.", spec: "Laser time-of-flight · 940 nm VCSEL · up to ~2 m · I²C", glyph: "tof" },
      { id: "P-08", name: "IR sensors", kind: "Detection", line: "Is something there? Is the line still under me?", spec: "IR emitter + receiver pair · obstacle and line detection", glyph: "ir" },
    ] satisfies Part[],
    software: [
      { id: "S-01", name: "Python", kind: "Language", line: "Scripts, data work and ML experiments.", spec: "PY", glyph: "mono" },
      { id: "S-02", name: "C#", kind: "Language", line: "Strongly typed and at home anywhere .NET runs.", spec: "C#", glyph: "mono" },
      { id: "S-03", name: "Java", kind: "Language", line: "The JVM classic.", spec: "JV", glyph: "mono" },
      { id: "S-04", name: "React", kind: "Frontend", line: "Infin8 Access runs on it.", spec: "RE", glyph: "mono" },
      { id: "S-05", name: "Next.js", kind: "Framework", line: "Sri Ram Enterprises — and this website.", spec: "NX", glyph: "mono" },
      { id: "S-06", name: "Cloudflare", kind: "Edge", line: "Workers and D1 behind Infin8 Access.", spec: "CF", glyph: "mono" },
      { id: "S-07", name: "Docker", kind: "Tooling", line: "Packages Sri Ram Enterprises for deployment.", spec: "DK", glyph: "mono" },
    ] satisfies Part[],
    creative: [
      { id: "C-01", name: "Blender", kind: "3D", line: "Modelling, lighting, renders.", spec: "BL", glyph: "mono" },
      { id: "C-02", name: "DaVinci Resolve", kind: "Video", line: "Editing and colour.", spec: "DR", glyph: "mono" },
      { id: "C-03", name: "Premiere Pro", kind: "Video", line: "Editing.", spec: "PR", glyph: "mono" },
    ] satisfies Part[],
  },
  /** The full technical spec sheet. */
  spec: [
    { group: "Languages", items: ["Python", "Java", "C#", "JavaScript", "HTML", "CSS", "SQL"] },
    { group: "Frontend", items: ["React", "Next.js", "Vite", "Tailwind CSS"] },
    { group: "Backend / Cloud", items: ["Node.js", "Cloudflare Workers", "Cloudflare D1", "Firebase", "AWS"] },
    { group: "Databases", items: ["PostgreSQL", "MySQL", "Cloudflare D1"] },
    { group: "Tooling", items: ["Docker", "Git"] },
    { group: "Hardware", items: ["Arduino", "ESP32", "Raspberry Pi Pico", "Sensors", "Embedded systems"] },
    { group: "Creative", items: ["Blender", "DaVinci Resolve", "Adobe Premiere Pro"] },
    { group: "Exploring", items: ["AI / ML", "Computer vision", "Cloud", "Product"] },
  ],
};

/* ── 05 · RACE WEEKENDS ───────────────────────────────────────────────── */

export type Race = {
  session: "Race" | "Community" | "Practice";
  name: string;
  kind: string;
  detail: Maybe<string>;
  /** e.g. "Dec 2024" — leave null if unsure. */
  date: Maybe<string>;
  /** e.g. "Finalist", "Built X" — leave null if you'd rather not say. */
  result: Maybe<string>;
  /** Your own words: what you built, what happened. */
  notes: Maybe<string>;
};

export const races = {
  title: "Race weekends",
  lead: "Hackathons are the closest thing software has to a race: a fixed clock, a problem you didn't pick, and no time to overthink.",
  entries: [
    {
      session: "Race",
      name: "Smart India Hackathon",
      kind: "National hackathon",
      detail: "The Government of India's nationwide hackathon — problem statements set by ministries, departments and industry.",
      date: null,
      result: null,
      notes: null,
    },
    {
      session: "Race",
      name: "TechFusion",
      kind: "Hackathon",
      detail: null,
      date: null,
      result: null,
      notes: null,
    },
    {
      session: "Community",
      name: "GDG events",
      kind: "Google Developer Groups",
      detail: "Community meetups, talks and build sessions.",
      date: null,
      result: null,
      notes: null,
    },
    {
      session: "Practice",
      name: "AI Agents Workshop",
      kind: "Workshop",
      detail: "A hands-on session on building with AI agents.",
      date: null,
      result: null,
      notes: null,
    },
  ] satisfies Race[],
};

/* ── 06 · THE LINE SO FAR (timeline) ──────────────────────────────────── */

export type Sector = {
  code: string;
  title: string;
  text: string;
  /** Leave null rather than guessing. */
  year: Maybe<string>;
  next?: boolean;
};

export const timeline = {
  title: "The line so far",
  lead: "No dates where I'm not sure of them. Just the order things happened in.",
  sectors: [
    { code: "S1", title: "JEE prep", text: "The grind before the degree. Physics, chemistry, maths, repeat.", year: null },
    { code: "S2", title: "B.Tech", text: "Computer science, officially.", year: null },
    { code: "S3", title: "First projects", text: "Building before feeling ready. Still the best decision so far.", year: null },
    { code: "S4", title: "Hackathons", text: "Smart India Hackathon, TechFusion, GDG. Shipping against a clock.", year: null },
    { code: "S5", title: "Club Infin8", text: "Campus community, events, people.", year: null },
    { code: "S6", title: "Products", text: "Infin8 Access and Sri Ram Enterprises — software for real workflows, not tutorials.", year: null },
    { code: "S7", title: "Research", text: "CERTUS-S2: satellites, super-resolution, and when to trust a pixel.", year: null },
    { code: "→", title: "Next", text: "AI × hardware. And whatever breaks on the way there.", year: "Next", next: true },
  ] satisfies Sector[],
};

/* ── 07 · CURRENTLY ───────────────────────────────────────────────────── */

export const now = {
  title: "Currently",
  updated: "Sep 2026",
  building: ["Sri Ram Enterprises", "Hardware prototypes", "Security tools"],
  learning: "System design",
  exploring: "AI × hardware",
};

/* ── 08 · OFF-TRACK ───────────────────────────────────────────────────── */

export type Frame = {
  tag: string;
  caption: Maybe<string>;
  image: string;
};

export const beyond = {
  title: "Off-track",
  lead: "Not everything I make compiles.",
  frames: [
    { tag: "Video", caption: "Cut in DaVinci Resolve and Premiere Pro.", image: "images/beyond/video" },
    { tag: "3D", caption: "Blender — renders, props, things that don't exist yet.", image: "images/beyond/3d" },
    { tag: "Hardware", caption: "Breadboards, jumper wires, the occasional magic smoke.", image: "images/beyond/hardware" },
    { tag: "Design", caption: "Interfaces, type — and this website.", image: "images/beyond/design" },
    { tag: "Events", caption: "Hackathons, workshops, GDG meetups.", image: "images/beyond/events" },
    { tag: "Community", caption: "Club Infin8 and the people in it.", image: "images/beyond/community" },
    { tag: "Motorcycles", caption: null, image: "images/beyond/motorcycles" },
    { tag: "Creative", caption: null, image: "images/beyond/creative" },
  ] satisfies Frame[],
};

/* ── 09 · CONTACT ─────────────────────────────────────────────────────── */

export const contact = {
  lines: ["Let's", "build", "something."],
  lead: "Got a project, a hackathon team with a gap, or an idea that needs someone stubborn enough to build it? Say hi.",
};
