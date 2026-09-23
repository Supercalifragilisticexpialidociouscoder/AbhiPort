/**
 * ──────────────────────────────────────────────────────────────────────────
 *  ABHI — SITE CONTENT
 *
 *  Every word on the site lives in this file. Projects (featured work, the
 *  archive and their case studies) live in ./projects.ts.
 *
 *  Rules of the house:
 *  - Anything set to `null` renders as a visible [ADD …] marker, so nothing
 *    unverified ever gets published as fact. Fill it in or leave it null.
 *  - Numbers are only ever real ones. Counts shown on the site are derived
 *    from this content wherever possible, so they stay true as it changes.
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
  age: 18,
  edition: "2026",
  /** Shown as BUILD / 026 around the site. */
  build: "026",
  /** When the content was last updated — shown on the Currently board and in the footer. */
  updated: "Sep 2026",
  location: "India",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  study: "B.Tech, Computer Science",
  /** The year you started building things, e.g. 2021. */
  buildingSince: null as Maybe<number>,
  email: "abhiram200869@gmail.com" as Maybe<string>,
  /**
   * Your CV. Drop the PDF at public/cv/abhiram-reddy-cv.pdf and every
   * "Download CV" link on the site switches on by itself.
   */
  cv: "cv/abhiram-reddy-cv.pdf",
  links: {
    github: "https://github.com/Supercalifragilisticexpialidociouscoder" as Maybe<string>,
    linkedin: "https://www.linkedin.com/in/abhiram09/" as Maybe<string>,
    /** Optional — the Instagram row only appears once this is set. */
    instagram: null as Maybe<string>,
  },
  /**
   * true  → unknown facts show as [ADD …] markers (good while you fill things in)
   * false → unknown facts are quietly left out (good for launch)
   */
  showPlaceholders: true,
  seo: {
    title: "Abhiram Reddy — Builder / Engineer / Creative Technologist",
    description:
      "Abhiram Reddy (Abhi), 18, builds software that real business owners use every day, plus hardware prototypes, research and communities. 2× SIH internal hackathon winner; founding member and head of the 8-club Club Infin8 ecosystem.",
  },
};

/**
 * BUILD → BREAK → REBUILD. The nav names the phase each chapter belongs to:
 * clean and structured, then experimental, then resolved.
 */
export type Phase = "build" | "break" | "rebuild";

/**
 * One source of truth for section numbers, anchors, phases and the nav's
 * lap counter. Reorder the page and renumber here.
 */
export const sections = {
  hero: { index: "00", id: "top", label: "Start", phase: "build" },
  short: { index: "01", id: "short", label: "Short version", phase: "build" },
  about: { index: "02", id: "about", label: "Who's Abhi", phase: "build" },
  statement: { index: "03", id: "thesis", label: "Work in progress", phase: "build" },
  work: { index: "04", id: "work", label: "Work", phase: "build" },
  community: { index: "05", id: "community", label: "Community", phase: "break" },
  races: { index: "06", id: "races", label: "Race weekends", phase: "break" },
  garage: { index: "07", id: "garage", label: "Garage", phase: "break" },
  how: { index: "08", id: "how", label: "How I build", phase: "rebuild" },
  log: { index: "09", id: "log", label: "Build log", phase: "rebuild" },
  archive: { index: "10", id: "archive", label: "Archive", phase: "rebuild" },
  now: { index: "11", id: "now", label: "Currently", phase: "rebuild" },
  beyond: { index: "12", id: "beyond", label: "Off-track", phase: "rebuild" },
  contact: { index: "13", id: "contact", label: "Contact", phase: "rebuild" },
} as const satisfies Record<string, { index: string; id: string; label: string; phase: Phase }>;

export const SECTION_TOTAL = Object.keys(sections).length - 1;

/**
 * The index — the map of the whole site behind the nav's INDEX button.
 * `room` entries are pages of their own; the rest are chapters of the home
 * page. `preview` picks the little visual each entry shows on hover.
 */
export const indexLinks = [
  { n: "00", label: "Home", href: "/#top", room: false, preview: "home", note: "The name, the figure, the first five seconds." },
  { n: "01", label: "About", href: "/#about", room: false, preview: "story", note: "Who's Abhi — in a few lines." },
  { n: "02", label: "Work", href: "/#work", room: false, preview: "work", note: "The build index: eight projects, one scroll." },
  { n: "03", label: "Archive", href: "/archive", room: true, preview: "archive", note: "Everything I've built, filed and searchable." },
  { n: "04", label: "Garage", href: "/lab", room: true, preview: "lab", note: "The physical side: a prototype and nine experiments." },
  { n: "05", label: "Research", href: "/work/certus-s2", room: true, preview: "research", note: "CERTUS-S2 — when can you trust a pixel?" },
  { n: "06", label: "How I build", href: "/#how", room: false, preview: "how", note: "Same bones, different bodies." },
  { n: "07", label: "Club Infin8", href: "/club-infin8", room: true, preview: "community", note: "Eight clubs, one ecosystem — and the systems behind it." },
  { n: "08", label: "Community", href: "/community", room: true, preview: "race", note: "Hackathons, events, workshops — and 2× SIH." },
  { n: "09", label: "Credentials", href: "/credentials", room: true, preview: "credentials", note: "The paperwork, filed after the work." },
  { n: "10", label: "Experience", href: "/experience", room: true, preview: "experience", note: "Roles, and the receipts in commit order." },
  { n: "11", label: "Contact", href: "/#contact", room: false, preview: "contact", note: "Let's build something." },
] as const;

/* ── 00 · HERO ─────────────────────────────────────────────────────────── */

export const hero = {
  /** The word the whole opening is built around. Its letters react to you. */
  word: "ABHI",
  name: "Abhiram Reddy Palle",
  kicker: "Build 026 — work in progress",
  intro:
    "I'm 18. I build software that real business owners use in their day-to-day work, hardware that reacts to the world, and the systems behind a campus community.",
  meta: [
    { k: "Age / based", v: "18 — India" },
    { k: "Smart India Hackathon", v: "2× Internal Hackathon Winner", accent: true },
    { k: "Club Infin8", v: "Founding member & Head" },
    { k: "Shipped", v: "Used daily by real business owners" },
  ],
  /** Two ways in: the 30-second version, or the whole thing. */
  paths: { fast: "Quick look", deep: "Explore" },
  /** Lands as the letters part on scroll. */
  caption: {
    lines: ["Ideas that", "refuse to stay", "ideas."],
    note: "Sensors, satellite pixels, permission slips, apps real businesses use every day — and a campus of ~3,500 students. So far.",
  },
  image: "images/abhi-hero",
  imageAlt: "Abhi as a low-poly paper figure, giving a thumbs-up",
  /**
   * The hero image is a cut-out on a transparent background: it stands in
   * front of the giant word, bottom-centre. Switching to a regular photo?
   * Set `cutout: false` and it fills the stage behind the letters instead.
   */
  cutout: true,
};

/* ── QUICK LOOK — the recruiter layer, one keypress (Q) from anywhere ──── */

export const quickLook = {
  title: "Quick look",
  aside: "The 30-second version",
  role: "Engineer / Builder",
  lead: "Software × Hardware × Research × Community",
  /** The question every hiring manager has — "anything beyond academic projects?" */
  inUse: "Software I've built is in daily use by real business owners. Which businesses stays private.",
  builds: "Products, systems, security tools, research, hardware prototypes — and the digital plumbing for a campus community.",
  explore: "Or explore the whole thing",
};

/* ── 01 · THE SHORT VERSION (recruiter snapshot) ──────────────────────── */

export const shortVersion = {
  title: "The short version",
  aside: "For people short on time",
  lead: "Name, age, strongest evidence, and where to click next. The long version is everything below.",
  /** The question every hiring manager has — "anything beyond academic projects?" — answered in one line. */
  inUse: {
    label: "Beyond academic projects",
    before: "Software I've built is",
    highlight: "in daily use",
    after: "by real business owners.",
    note: "Which businesses stays private.",
  },
  /** The whole identity in six moves, each linking to its proof. */
  pillars: [
    { verb: "Build", what: "Software", note: "Products, systems, security tools, web apps.", href: "/#work" },
    { verb: "Build", what: "Hardware", note: "Microcontrollers, sensors, physical prototypes.", href: "/lab" },
    { verb: "Build", what: "Research", note: "CERTUS-S2 and technical experiments.", href: "/work/certus-s2" },
    { verb: "Build", what: "Communities", note: "Club Infin8: eight clubs, one umbrella.", href: "/#community" },
    { verb: "Ship", what: "To real users", note: "Apps in daily use by real business owners.", href: "/#work", accent: true },
    { verb: "Compete", what: "Hackathons", note: "2× SIH Internal Hackathon Winner.", href: "/community#hackathons" },
  ],
};

/* ── 02 · WHO'S ABHI ──────────────────────────────────────────────────── */

export const about = {
  title: "Who's Abhi?",
  lead: "I'm Abhi. I'm 18, and I build the things I can't stop thinking about — software real businesses use, hardware prototypes, security tools, research, and the systems behind a campus community.",
  body: [
    "Most of it starts with something that bugs me. A permission slip that has to be walked across campus. A secret that almost ends up in a commit. A satellite image that looks sharper than it has any right to. Then it becomes a project. Then, usually, three.",
    "Some of it doesn't stay a project. It ends up with real business owners who use it every day, and that's a different test from any demo. Add a B.Tech in computer science, two SIH internal hackathon wins, and Club Infin8 — eight student clubs I helped found and now head. Different rooms, same instinct: I'd rather make the thing than talk about it.",
  ],
  facts: [
    { k: "Name", v: "Abhiram Reddy Palle" },
    { k: "Goes by", v: "Abhi" },
    { k: "Age", v: "18" },
    { k: "Based in", v: "India" },
    { k: "Studying", v: "B.Tech, Computer Science" },
    { k: "Shipped", v: "Software in daily use by real business owners" },
    { k: "Hackathons", v: "2× SIH Internal Hackathon Winner" },
    { k: "Community", v: "Founding member & Head, Club Infin8" },
    { k: "Builds with", v: "React, Cloudflare, Python, ESP32" },
    { k: "Off-screen", v: "Blender, DaVinci Resolve, Premiere Pro" },
  ],
  portrait: "images/abhi-portrait",
  portraitAlt: "Abhi, candid",
};

/* ── 03 · STATEMENT ───────────────────────────────────────────────────── */

export const statement = {
  lead: "This is a",
  struck: "Portfolio.",
  replacement: "Work in progress.",
};

/* ── 04 · WORK (projects live in ./projects.ts) ───────────────────────── */

export const work = {
  title: "Work",
  headline: "Things I've built.",
  sub: "Some shipped. Some survived a deadline. A few are still arguing with me.",
  /**
   * The one row in the index with no name on it: work that left the
   * portfolio. Private by default — no business names, industries,
   * screenshots, data or internals unless Abhi decides to publish them.
   */
  inUse: {
    id: "in-use",
    label: "Classified",
    title: "Business software",
    category: "In daily use",
    line: "Used every day by real business owners. Which ones stays private.",
  },
  archiveCta: "Open the archive",
};

/* ── 05 · COMMUNITY — CLUB INFIN8 ─────────────────────────────────────── */

export const club = {
  name: "Club Infin8",
  role: "Founding member & Head",
  roleNote: "Across all eight clubs",
  tagline: "Eight clubs. One umbrella.",
  idea: "A student-led ecosystem that brings multiple campus communities together under one umbrella — one structure, shared systems, eight very different clubs.",
  /** Edit these as the ecosystem grows. `prefix` marks approximate figures. */
  stats: [
    { value: 3500, prefix: "~", label: "Students", note: "The campus it's designed to serve" },
    { value: 8, prefix: "", label: "Clubs", note: "One umbrella" },
    { value: 200, prefix: "~", label: "Members", note: "Across the ecosystem" },
  ],
  clubs: ["Technical", "Innovation & Entrepreneurship", "Media", "Sports", "Financial Literacy", "Cultural", "Women Empowerment", "Film"],
  stages: [
    { label: "Found", note: "Founding member of the ecosystem" },
    { label: "Organise", note: "Eight clubs, one structure" },
    { label: "Build", note: "Registration, selection and onboarding systems" },
    { label: "Grow", note: "~200 members on a ~3,500-student campus" },
  ],
  peopleLine: "I don't just run the clubs. I build what they run on.",
  systems: ["Registration", "Forms", "Member data", "Club selection", "Onboarding", "Permissions", "Student workflows", "Event logistics"],
  operations: ["Department-wise datasets", "Section-wise organisation", "Team formation", "Duplicate detection", "Excel processing", "Event attendance", "Club selection"],
  opsNote: "Hundreds of students at a time — real data, not a demo set.",
  cover: "images/club/infin8-cover",
  photos: [
    { image: "images/club/infin8-01", caption: "The clubs" },
    { image: "images/club/infin8-02", caption: "An event" },
    { image: "images/club/infin8-03", caption: "The team" },
  ],
};

/** The door at the end of the Club Infin8 story. */
export const communityDoor = {
  label: "View community & learning",
  note: "Hackathons, events, workshops and the paperwork — on their own page.",
};

/* ── 06 · RACE WEEKENDS ───────────────────────────────────────────────── */

export type ProblemStatement = {
  code: string;
  title: string;
  org: Maybe<string>;
  concept: Maybe<string>;
  href?: string;
};

export type Race = {
  session: "Race" | "Practice";
  name: string;
  kind: string;
  detail: Maybe<string>;
  /** e.g. "Dec 2024" — leave null if unsure. */
  date: Maybe<string>;
  /** Only real results. */
  result: Maybe<string>;
  /** Your own words: what you built, what happened. */
  notes: Maybe<string>;
  statements?: ProblemStatement[];
};

export const races = {
  title: "Race weekends",
  lead: "Hackathons are the closest thing software has to a race: a fixed clock, a problem you didn't pick, and no time to overthink.",
  note: "They aren't the identity. They're the stress test.",
  credential: {
    value: "2×",
    label: "SIH Internal Hackathon Winner",
    note: "Smart India Hackathon — internal hackathon. Won twice.",
  },
  process: [
    { label: "Problem", note: "Read the statement. Then read it again." },
    { label: "Research", note: "Learn the domain fast enough to be useful." },
    { label: "Idea", note: "Pick one. Kill the other five." },
    { label: "Prototype", note: "Build the thing that proves it." },
    { label: "Debug", note: "Something always breaks. Usually at the worst time." },
    { label: "Pitch", note: "Make it make sense to the judges." },
    { label: "Win", note: "Twice, at the SIH internal hackathon." },
  ],
  entries: [
    {
      session: "Race",
      name: "Smart India Hackathon",
      kind: "Internal hackathon",
      detail: "The Government of India's nationwide hackathon, with problem statements set by ministries, departments and industry. These are the problem statements and concepts I've worked on.",
      date: null,
      result: "Winner ×2",
      notes: null,
      statements: [
        { code: "SIH1775", title: "Fake Social Media Accounts Detection", org: "ITBP", concept: null },
        { code: "SIH25142", title: "Student Innovation in Space Technology", org: null, concept: "AstroNexis / AstroSim" },
        { code: "Concept", title: "Secret Leak Detector", org: null, concept: "Repository secret detection", href: "/work/secret-leak-detector" },
      ],
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
  ] satisfies Race[],
  /** The door to every hackathon, with photos — where the SIH story lives in full. */
  door: { label: "Every race weekend, in full", note: "Hackathons, the 2× SIH story, problem statements and photos.", href: "/community#hackathons" },
  skills: [
    "Interpreting problem statements",
    "Domain research",
    "Team formation",
    "Rapid prototyping",
    "Technical implementation",
    "Presentations",
    "Internal judging",
    "Iteration",
    "Deadlines",
  ],
};

/* ── 07 · THE GARAGE (hardware lab) ───────────────────────────────────── */

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
  | "led"
  | "buzzer"
  | "mono";

export const garage = {
  title: "The Garage",
  lead: "The physical side. Boards, sensors, half-wired ideas — and the occasional prototype that actually works.",
  scope: {
    title: "MPU6050 · CH-01",
    note: "Move your cursor. This is roughly how an accelerometer sees motion — I just swapped the sensor for your mouse.",
    touchNote: "Scroll or drag. This is roughly how an accelerometer sees motion — I just swapped the sensor for your thumb.",
  },
  parts: [
    { id: "P-01", name: "ESP32", kind: "Microcontroller", line: "Wi-Fi and Bluetooth on one chip. The default brain for anything connected.", spec: "Dual-core Xtensa LX6 · up to 240 MHz · Wi-Fi 802.11 b/g/n · Bluetooth", glyph: "esp32" },
    { id: "P-02", name: "Arduino", kind: "Microcontroller", line: "The fastest route from idea to blinking LED.", spec: "Uno: ATmega328P · 16 MHz · 5 V logic", glyph: "arduino" },
    { id: "P-03", name: "Raspberry Pi Pico", kind: "Microcontroller", line: "Cheap, fast, and programmable I/O for the weird timing jobs.", spec: "RP2040 · 2× Arm Cortex-M0+ · up to 133 MHz · 264 KB SRAM", glyph: "pico" },
    { id: "P-04", name: "MPU6050", kind: "IMU", line: "Six axes of motion: how fast it turns, how hard it moves.", spec: "3-axis gyroscope + 3-axis accelerometer · I²C", glyph: "imu" },
    { id: "P-05", name: "MPU9250", kind: "IMU", line: "The MPU6050 plus a compass. Nine axes.", spec: "Gyro + accelerometer + AK8963 magnetometer · I²C / SPI", glyph: "imu9" },
    { id: "P-06", name: "HC-SR04", kind: "Distance", line: "Ping, listen, measure the echo.", spec: "40 kHz ultrasonic ranging · roughly 2–400 cm", glyph: "ultrasonic" },
    { id: "P-07", name: "VL53L0X", kind: "Distance", line: "Distance by timing light instead of sound.", spec: "Laser time-of-flight · 940 nm VCSEL · up to ~2 m · I²C", glyph: "tof" },
    { id: "P-08", name: "IR sensors", kind: "Detection", line: "Is something there? Is the line still under me?", spec: "IR emitter + receiver pair · obstacle and line detection", glyph: "ir" },
    { id: "P-09", name: "LEDs", kind: "Output", line: "The cheapest user interface there is.", spec: "Indicator output · always with a current-limiting resistor", glyph: "led" },
    { id: "P-10", name: "Buzzer", kind: "Output", line: "For when a light isn't loud enough.", spec: "Piezo · audible alerts", glyph: "buzzer" },
  ] satisfies Part[],
  /** The door into the lab: every experiment gets its own page. */
  index: { title: "Lab index", note: "One prototype. Nine experiments. Each one has a page — pick one." },
};

/* ── 08 · HOW I BUILD ─────────────────────────────────────────────────── */

export type StackItem = { name: string; used?: string[] };

export const howIBuild = {
  title: "How I build",
  aside: "Same bones, different bodies",
  lead: "Most of what I make has the same skeleton. Here it is, with the real choices from two projects: one that needs every layer, and one that skips most of them on purpose.",
  layers: ["Frontend", "API", "Database", "Auth", "Infrastructure", "Deployment"],
  /** One column per project; null = not known yet (shows an [ADD …] marker). */
  examples: [
    {
      slug: "infin8-access",
      name: "Infin8 Access",
      choices: ["React · Vite · Tailwind", "Hono on Cloudflare Workers", "Cloudflare D1 (SQL)", "JWT via WebCrypto · role-based access", "Cloudflare's edge", "Deployed on Workers"] as Maybe<string>[],
    },
    {
      slug: "abhiport",
      name: "This website",
      choices: ["Next.js 16 · React 19 · Tailwind 4 · GSAP", "None — nothing to call", "None — the content is two TypeScript files", "None — nothing to log into", "Static pages, prerendered at build time", null] as Maybe<string>[],
    },
  ],
  /** The actual process, every time. */
  loop: [
    { label: "Idea", note: "Something bugs me." },
    { label: "Prototype", note: "The ugliest version that proves it." },
    { label: "Break", note: "It breaks. It always breaks." },
    { label: "Debug", note: "Most of the job, honestly." },
    { label: "Iterate", note: "Version two knows what one didn't." },
    { label: "Ship", note: "Real people, real use." },
  ],
  principles: [
    { name: "Ship", body: "A working system beats an imaginary perfect one. Get it in front of people, then argue about it." },
    { name: "Debug", body: "Things breaking isn't the interruption. It's most of the job." },
    { name: "Learn by building", body: "I pick up a technology when a problem needs it — not to put it on a list." },
    { name: "Keep iterating", body: "First versions are rarely the final versions. Mine definitely aren't." },
    { name: "Make it real", body: "Real users, real data, real constraints. A campus, a business, a satellite — not another to-do app." },
  ],
  /**
   * No percentages, ever — and no logo wall. The stack is told through the
   * work: each row is a project, and what it's built with.
   */
  builtWith: [
    { slug: "infin8-access", items: ["React", "TypeScript", "Cloudflare Workers", "Hono", "D1", "JWT"] },
    { slug: "secret-leak-detector", items: ["Node.js", "Git hooks", "VS Code API", "GitHub Apps", "HMAC-SHA256"] },
    { slug: "certus-s2", items: ["Python", "STAC", "Planetary Computer", "Sentinel-2", "Remote sensing"] },
    { slug: "infin8-calendar", items: ["React", "TypeScript", "Express", "SQLite", "zod"] },
    { slug: "socialguard", items: ["Python", "Streamlit", "scikit-learn", "pandas"] },
    { slug: "hakit", items: ["React", "TypeScript", "MediaPipe", "Express"] },
    { slug: "lab", label: "The Garage", href: "/lab", items: ["ESP32", "Arduino", "Raspberry Pi Pico", "MPU6050", "HC-SR04", "VL53L0X"] },
    { slug: "abhiport", items: ["Next.js", "TypeScript", "Tailwind", "GSAP", "Lenis"] },
  ] as { slug: string; label?: string; href?: string; items: string[] }[],
  /** Used, just not shown off on this site yet. */
  alsoUsed: ["Java", "C#", "AWS", "PostgreSQL", "MySQL", "Docker", "Blender", "DaVinci Resolve", "Premiere Pro"],
};

/* ── 09 · BUILD LOG ───────────────────────────────────────────────────── */

export type Sector = {
  code: string;
  title: string;
  text: string;
  /** Leave null rather than guessing. */
  year: Maybe<string>;
  next?: boolean;
};

export const buildLog = {
  title: "Build log",
  lead: "In order. Dates only where there are receipts.",
  sectors: [
    { code: "S1", title: "JEE prep", text: "The grind before the degree. Physics, chemistry, maths, repeat.", year: null },
    { code: "S2", title: "B.Tech", text: "Computer science, officially.", year: null },
    { code: "S3", title: "First projects", text: "Building before feeling ready. Still the best decision so far.", year: null },
    { code: "S4", title: "Hackathons", text: "Smart India Hackathon internal rounds — won twice. TechFusion. Shipping against a clock.", year: null },
    { code: "S5", title: "Club Infin8", text: "Founding member and head of an eight-club ecosystem.", year: null },
    { code: "S6", title: "Real users", text: "Infin8 Access for the campus — and software that real business owners use in their day-to-day work.", year: null },
    { code: "S7", title: "Research", text: "CERTUS-S2: satellites, super-resolution, and when to trust a pixel.", year: null },
    { code: "→", title: "Next", text: "AI, systems, hardware, security, product. And whatever breaks on the way there.", year: "Next", next: true },
  ] satisfies Sector[],
};

/* ── 10 · ARCHIVE (entries live in ./projects.ts) ─────────────────────── */

export const archive = {
  title: "The archive",
  lead: "Everything — including the small stuff. Some of it started as a weekend idea. Most of it became considerably less of a weekend.",
  /** The home page's door into /archive. */
  door: "The workshop behind the portfolio: hackathon builds, experiments, learning projects, hardware — filed, filterable, searchable.",
  statuses: {
    Shipped: "In use.",
    Active: "Being built right now.",
    Prototype: "Works. Not finished.",
    Research: "Asking a question properly.",
    Experiment: "Poking at something to see what happens.",
    Hackathon: "Built against a clock.",
    Learning: "Built to learn it.",
    Archived: "Done, or parked.",
  },
  /** Explains the one thing the index leaves out on purpose. */
  offList: "Not listed: the applications I've built for real business owners. They're in daily use, and private by default.",
};

/* ── 11 · CURRENTLY ───────────────────────────────────────────────────── */

export const now = {
  title: "Currently",
  building: ["Real-world apps", "Hardware prototypes", "Security tools"],
  learning: "System design",
  exploring: "AI × hardware",
  /** Optional rows — leave null to hide them. */
  testing: null as Maybe<string>,
  thinkingAbout: null as Maybe<string>,
  /** Things I intend to explore. Intentions, not achievements. */
  next: ["AI", "Systems", "Hardware", "Security", "Product", "Entrepreneurship", "Research"],
  label: "Under construction — by design.",
};

/* ── 12 · OFF-TRACK ───────────────────────────────────────────────────── */

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
    { tag: "Events", caption: "Hackathons, workshops, DevFest.", image: "images/beyond/events" },
    { tag: "Community", caption: "Club Infin8 — eight clubs, one umbrella.", image: "images/beyond/community" },
    { tag: "Motorcycles", caption: "Two wheels. See also: the lean-angle prototype in the garage.", image: "images/beyond/motorcycles" },
    { tag: "Creative", caption: null, image: "images/beyond/creative" },
  ] satisfies Frame[],
};

/* ── 13 · CONTACT + THE FINAL SCREEN ──────────────────────────────────── */

export const contact = {
  lines: ["Let's", "build", "something."],
  lead: "Got a project, a hackathon team with a gap, or an idea that needs someone stubborn enough to build it? Say hi.",
};

export const finale = {
  lines: ["Still", "building."],
  /** What a visitor should leave with. */
  takeaway: "Not just demos. Products, systems, tools, hardware, communities — and software that reaches real users.",
  projectZero: "Project 00 — you're inside something I built.",
  colophon: "Set in Archivo, Geist & Geist Mono. Built with Next.js, GSAP and Lenis.",
  version: "v0.1",
};
