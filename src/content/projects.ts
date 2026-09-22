/**
 * ──────────────────────────────────────────────────────────────────────────
 *  ABHI — PROJECTS
 *
 *  One list powers everything: the featured track on the home page
 *  (`featured: true`), the filterable archive (all entries), and full case
 *  studies at /work/[slug] (entries with a `study`).
 *
 *  Add a project → add an object. The archive, filters, counts, sitemap and
 *  OG images pick it up automatically.
 *
 *  `null` = unknown → rendered as an [ADD …] marker. Never guess.
 *  Images: base paths under /public, no extension (see README.md).
 * ──────────────────────────────────────────────────────────────────────────
 */

import type { Maybe } from "./site";

export type ProjectKind = "product" | "tool" | "research" | "community" | "hardware" | "creative" | "hackathon" | "web";
export type SignatureVisual = "approval" | "terminal" | "pixels";

export type ProjectStatus = "Shipped" | "Active" | "Prototype" | "Research" | "Experiment" | "Hackathon" | "Archived";

export type Category =
  | "Web"
  | "Software"
  | "AI / ML"
  | "Security"
  | "Hardware"
  | "Research"
  | "Cloud"
  | "Products"
  | "Community"
  | "Creative"
  | "Experiments";

/** Filter order in the archive. Categories with no entries are hidden. */
export const CATEGORIES: Category[] = ["Web", "Software", "AI / ML", "Security", "Hardware", "Research", "Cloud", "Products", "Community", "Creative", "Experiments"];

export type Step = { label: string; note: string };

export type Layer = {
  tier: string;
  name: string;
  items: string[];
  note: string;
};

export type UnderTheHood = {
  architecture: { caption: string; layers: Layer[] };
  data?: { caption: string; entities: { name: string; note: string }[] };
  flow?: { caption: string; steps: Step[] };
  auth?: string[];
  infra?: string[];
  quality?: string[];
  qualityTodo?: string;
};

export type CaseStudy = {
  /** THE PROBLEM — what was wrong. */
  problem: string;
  /** THE IDEA — what should exist. (Research: the abstract.) */
  idea: string;
  /** Research only. */
  question?: string;
  /** THE BUILD — how it was implemented. */
  build: string[];
  flow: { title: string; steps: Step[] };
  roles?: { name: string; note: string }[];
  /** THE HARD PART. */
  hardPart: { title: string; body: string }[];
  /** THE RESULT — what actually exists now. */
  result: string[];
  resultTodo: string;
  /** WHAT'S NEXT — null until there's a real answer. */
  next: Maybe<string[]>;
  underTheHood: UnderTheHood;
  stack: { group: string; items: string[] }[];
  keywords?: string[];
  screens: { image: string; caption: string }[];
};

export type Project = {
  slug: string;
  /** "00" is reserved for this website. */
  number: string;
  title: string;
  /** How the title breaks across lines when it's set huge. */
  titleLines: string[];
  kind: ProjectKind;
  featured: boolean;
  categories: Category[];
  status: Maybe<ProjectStatus>;
  year: Maybe<string>;
  role: Maybe<string>;
  /** One-line "what it is", e.g. "Product · Access & permissions". */
  category: string;
  tagline: string;
  summary: string;
  stack: string[];
  /** Shown as an [ADD …] marker next to the stack when the stack is incomplete. */
  stackTodo?: string;
  cover?: string;
  coverAlt?: string;
  visual?: SignatureVisual;
  /** A page elsewhere on the site (for entries without a /work case study). */
  href?: string;
  links: { live: Maybe<string>; repo: Maybe<string>; video?: Maybe<string> };
  /** Real numbers only (users, records, tests …). Rendered when present. */
  metrics?: { value: string; label: string }[];
  /** Tiny archive microcopy. */
  note?: string;
  study?: CaseStudy;
};

export const projects: Project[] = [
  /* ── Featured ─────────────────────────────────────────────────────── */
  {
    slug: "infin8-access",
    number: "01",
    title: "Infin8 Access",
    titleLines: ["Infin8", "Access"],
    kind: "product",
    featured: true,
    categories: ["Web", "Cloud", "Products", "Security"],
    status: "Shipped",
    year: null,
    role: null,
    category: "Product · Access & permissions",
    tagline: "Permission slips, minus the paper.",
    summary: "A campus permission system built around QR identity verification and role-based workflows.",
    stack: ["React", "Vite", "Tailwind CSS", "Cloudflare Workers", "Hono", "Cloudflare D1", "JWT", "WebCrypto", "QR"],
    cover: "images/work/infin8-cover",
    coverAlt: "Infin8 Access interface",
    visual: "approval",
    links: { live: null, repo: null, video: null },
    study: {
      problem:
        "Paper permission workflows are slow and opaque. A request has to physically travel from desk to desk, it can stall anywhere, it's easy to lose, and nobody can see where it's stuck. When it's finally approved, the only proof is a sheet of paper.",
      idea:
        "One flow instead of a paper trail. A request moves Student → HOD → Coordinator, every role only sees what it can act on, admins see the whole picture, and the end result is a QR code anyone can verify on the spot.",
      build: [
        "The frontend is React on Vite, styled with Tailwind. The API is Hono running on Cloudflare Workers, backed by Cloudflare D1 — SQL at the edge, no server to babysit.",
        "Identity travels in JWTs signed and verified with the Web Crypto API. Four roles — Student, HOD, Coordinator and Admin — each get their own workflow, with admin dashboards on top.",
        "Student data arrives as Excel sheets, so the importer is deterministic, idempotent and duplicate-safe: it synchronises structured student records into D1 without creating duplicates, however many times it runs.",
      ],
      flow: {
        title: "The approval chain",
        steps: [
          { label: "Student", note: "Raises the request" },
          { label: "HOD", note: "Reviews it" },
          { label: "Coordinator", note: "Final review" },
          { label: "Completion", note: "A verifiable QR is issued" },
        ],
      },
      roles: [
        { name: "Student", note: "Raises requests, tracks them, carries the QR." },
        { name: "HOD", note: "Reviews requests for their department." },
        { name: "Coordinator", note: "Gives the final review." },
        { name: "Admin", note: "Dashboards, imports and oversight." },
      ],
      hardPart: [
        { title: "Roles are the whole product", body: "An HOD shouldn't touch the coordinator's stage, and a student shouldn't approve anything. Every transition is authorised server-side, not just checked at login." },
        { title: "Import it twice, get the same database", body: "Excel is messy and people re-upload files. The importer is deterministic and idempotent, so running it again changes nothing — and duplicates never get in." },
        { title: "State that can't slip backwards", body: "Each request is a small state machine. Every move between stages has to be valid, deliberate and visible to the people waiting on it." },
        { title: "Designing for the edge", body: "Workers and D1 remove the server entirely — great, until you have to think in short-lived requests against a serverless SQL database." },
      ],
      result: [
        "Real users on a real campus: requests flow through the approval chain to QR-verified completion, with role-specific views, admin dashboards and bulk student import.",
      ],
      resultTodo: "ADD NUMBERS — users, requests, departments (only real ones)",
      next: null,
      underTheHood: {
        architecture: {
          caption: "Everything past the browser runs on Cloudflare's edge.",
          layers: [
            { tier: "Client", name: "React + Vite", items: ["React", "Vite", "Tailwind"], note: "Role-specific views for students, HODs, coordinators and admins." },
            { tier: "Edge API", name: "Hono on Workers", items: ["Cloudflare Workers", "Hono"], note: "Routing, role checks and every stage transition." },
            { tier: "Auth", name: "JWT + WebCrypto", items: ["JWT", "Web Crypto API"], note: "Tokens signed and verified with the platform's native crypto." },
            { tier: "Data", name: "Cloudflare D1", items: ["D1", "SQL"], note: "Serverless SQL for students, requests and their stages." },
            { tier: "Import", name: "Excel → D1", items: ["Idempotent", "Duplicate-safe"], note: "A student-data sync you can safely re-run." },
            { tier: "Verify", name: "QR", items: ["QR"], note: "A completed request becomes a code you can check in seconds." },
          ],
        },
        data: {
          caption: "Conceptual model — simplified.",
          entities: [
            { name: "Student", note: "Imported from Excel. Unique — never duplicated." },
            { name: "User & role", note: "Student · HOD · Coordinator · Admin." },
            { name: "Request", note: "What's being asked for, by whom, and where it is." },
            { name: "Approval", note: "One decision per stage, in order." },
          ],
        },
        flow: {
          caption: "A request's life, simplified.",
          steps: [
            { label: "Sign in", note: "JWT issued, signed with WebCrypto" },
            { label: "Raise", note: "A student creates a request" },
            { label: "Authorise", note: "Role checked on every transition" },
            { label: "Advance", note: "HOD → Coordinator, written to D1" },
            { label: "Complete", note: "A QR is generated" },
            { label: "Verify", note: "Scanned and checked on the spot" },
          ],
        },
        auth: [
          "JWTs signed and verified with the Web Crypto API — native to Workers.",
          "Role-based access: each role can only act on its own stage.",
          "Authorisation is enforced on every transition, server-side.",
        ],
        infra: ["Cloudflare Workers for compute, D1 for data.", "No servers to provision or patch."],
        quality: ["Deterministic, idempotent Excel import — safe to re-run.", "Duplicate-safe student records.", "Role checks on every state change."],
        qualityTodo: "ADD — tests, smoke tests, deployment checks",
      },
      stack: [
        { group: "Frontend", items: ["React", "Vite", "Tailwind CSS"] },
        { group: "Backend", items: ["Cloudflare Workers", "Hono"] },
        { group: "Data", items: ["Cloudflare D1", "SQL"] },
        { group: "Auth & verification", items: ["JWT", "Web Crypto API", "QR"] },
      ],
      screens: [
        { image: "images/work/infin8-01", caption: "Raising a request" },
        { image: "images/work/infin8-02", caption: "An approval stage" },
        { image: "images/work/infin8-03", caption: "QR verification" },
      ],
    },
  },
  {
    slug: "secret-leak-detector",
    number: "02",
    title: "Secret Leak Detector",
    titleLines: ["Secret Leak", "Detector"],
    kind: "tool",
    featured: true,
    categories: ["Security", "Software"],
    status: "Hackathon",
    year: null,
    role: null,
    category: "Developer tool · Security",
    tagline: "Catches the key before it's in your git history.",
    summary: "A pre-commit security utility and web dashboard that stops exposed secrets before they're committed. Built as a Smart India Hackathon concept.",
    stack: ["Git pre-commit hook", "Web dashboard"],
    stackTodo: "ADD STACK",
    cover: "images/work/sld-cover",
    coverAlt: "Secret Leak Detector dashboard",
    visual: "terminal",
    links: { live: null, repo: null, video: null },
    study: {
      problem:
        "Once a secret is committed and pushed, deleting the file doesn't fix anything — it lives on in the history, in forks and in every clone. Most leaks aren't malicious. They're a config file added by accident, at the end of a long day, by someone who knows better.",
      idea: "Stop leaks at the earliest possible moment — the commit — and give the findings somewhere to live that isn't a terminal scrollback.",
      build: [
        "A pre-commit hook inspects what's staged and blocks the commit when it finds something that looks like a secret: API keys, tokens, credentials or sensitive configuration.",
        "A web dashboard turns findings into something you can review and act on. It started life as a Smart India Hackathon concept — security automation that sits inside the tools developers already use.",
      ],
      flow: {
        title: "The checkpoint",
        steps: [
          { label: "git commit", note: "Commit as usual" },
          { label: "Scan", note: "Staged changes are checked" },
          { label: "Decide", note: "Clean → through · Suspicious → blocked" },
          { label: "Review", note: "Findings land in the dashboard" },
        ],
      },
      hardPart: [
        { title: "Noise vs. misses", body: "Too strict and people learn to skip the hook. Too loose and it's decoration. The whole tool lives or dies on that balance." },
        { title: "It has to feel instant", body: "A pre-commit check runs every single time. If it's slow, it gets bypassed." },
        { title: "Never become the leak", body: "A secret scanner handles exactly the data it's meant to protect. This page deliberately shows no real — or realistic — secrets." },
      ],
      result: ["A checkpoint between a developer and their git history, plus a dashboard to review what it catches."],
      resultTodo: "ADD OUTCOME — repo link, detection approach, what it has caught",
      next: null,
      underTheHood: {
        architecture: {
          caption: "It runs where the mistake happens: on the developer's machine, before history is written.",
          layers: [
            { tier: "Trigger", name: "Pre-commit hook", items: ["Git"], note: "Fires on every commit, before anything reaches history." },
            { tier: "Scanner", name: "Detection", items: ["API keys", "Tokens", "Credentials", "Sensitive config"], note: "Flags anything that looks like it shouldn't be committed." },
            { tier: "Gate", name: "Pass / block", items: [], note: "Clean commits go through. Risky ones stop, with a reason." },
            { tier: "Review", name: "Web dashboard", items: [], note: "Findings in one place — reviewed, not scrolled past." },
          ],
        },
        flow: {
          caption: "One commit, start to finish.",
          steps: [
            { label: "Stage", note: "git add" },
            { label: "Commit", note: "Hook fires" },
            { label: "Scan", note: "Staged diff checked" },
            { label: "Gate", note: "Pass or block" },
            { label: "Review", note: "Dashboard" },
          ],
        },
        quality: ["Findings never display the secret itself on this site."],
        qualityTodo: "ADD — detection rules, false-positive handling, tests",
      },
      stack: [
        { group: "Integration", items: ["Git pre-commit hook"] },
        { group: "Interface", items: ["Web dashboard"] },
      ],
      screens: [
        { image: "images/work/sld-01", caption: "A blocked commit" },
        { image: "images/work/sld-02", caption: "Dashboard overview" },
        { image: "images/work/sld-03", caption: "A finding, redacted" },
      ],
    },
  },
  {
    slug: "certus-s2",
    number: "03",
    title: "CERTUS-S2",
    titleLines: ["Certus-S2"],
    kind: "research",
    featured: true,
    categories: ["Research", "AI / ML"],
    status: "Research",
    year: null,
    role: null,
    category: "Research · Remote sensing",
    tagline: "When can you trust a pixel a model made up?",
    summary: "Trust and decision certification for Sentinel-2 super-resolution.",
    stack: ["Python", "Sentinel-2", "Super-resolution", "STAC", "Microsoft Planetary Computer"],
    cover: "images/work/certus-cover",
    coverAlt: "CERTUS-S2 figure",
    visual: "pixels",
    links: { live: null, repo: null, video: null },
    study: {
      problem:
        "Sentinel-2 gives free, global, multispectral imagery at 10, 20 and 60 m resolution — detailed enough for a lot, not enough for everything. Super-resolution fills the gap, but a sharper image isn't automatically a truer one. Without a way to validate outputs, a confident-looking image can quietly carry a wrong answer into a real decision.",
      idea:
        "Super-resolution models can make Sentinel-2 imagery look sharper than the sensor actually captured. That's useful right up until a decision depends on detail the model invented. CERTUS-S2 is research into trust and decision certification for super-resolved Sentinel-2 imagery: instead of asking whether an output looks good, it asks whether a decision made from it can be relied on.",
      question:
        "When a super-resolved Sentinel-2 image feeds a real decision, can we certify when that decision is trustworthy — and flag it when it isn't?",
      build: [
        "Treat trust as something to validate, not assume: check super-resolved outputs and certify the decisions made from them, instead of scoring images on how sharp they look.",
        "Written in Python. Imagery comes from Microsoft Planetary Computer, searched and loaded through its STAC API, so the pipeline starts from real, well-catalogued Sentinel-2 scenes — with testing and validation built into the workflow.",
      ],
      flow: {
        title: "Pipeline",
        steps: [
          { label: "Search", note: "STAC query on Planetary Computer" },
          { label: "Scenes", note: "Sentinel-2 imagery" },
          { label: "Super-resolve", note: "Model output" },
          { label: "Validate", note: "Trust checks" },
          { label: "Certify", note: "Trusted — or flagged" },
        ],
      },
      hardPart: [
        { title: "Sharp isn't the same as right", body: "Standard image-quality scores reward outputs that look convincing. Trust needs a different yardstick." },
        { title: "Certify the decision, not the picture", body: "The same image can be fine for one decision and dangerous for another, so trust has to be tied to what the output is used for." },
        { title: "Knowing when to say no", body: "A useful system has to be able to flag an output as untrustworthy instead of always producing an answer." },
      ],
      result: [],
      resultTodo: "ADD STATUS & FINDINGS — paper, preprint, results",
      next: null,
      underTheHood: {
        architecture: {
          caption: "From catalogue to certified decision.",
          layers: [
            { tier: "Catalogue", name: "STAC API", items: ["Microsoft Planetary Computer"], note: "Search Sentinel-2 scenes by place, time and cloud cover." },
            { tier: "Imagery", name: "Sentinel-2", items: ["Multispectral", "10 / 20 / 60 m"], note: "Free and global — and the reason super-resolution is tempting." },
            { tier: "Model", name: "Super-resolution", items: [], note: "Produces the sharper image, and the risk that comes with it." },
            { tier: "Trust", name: "Validate + certify", items: [], note: "Decides whether a decision made from the output can be relied on." },
          ],
        },
        flow: {
          caption: "Pipeline, simplified.",
          steps: [
            { label: "Search", note: "STAC query" },
            { label: "Load", note: "Sentinel-2 scenes" },
            { label: "Super-resolve", note: "Model output" },
            { label: "Validate", note: "Tests and trust checks" },
            { label: "Certify", note: "Trusted or flagged" },
          ],
        },
        infra: ["Python.", "Microsoft Planetary Computer via the STAC API."],
        quality: ["Testing and validation are part of the pipeline, not an afterthought."],
        qualityTodo: "ADD — datasets, metrics, test suite",
      },
      stack: [
        { group: "Language", items: ["Python"] },
        { group: "Data", items: ["Sentinel-2", "Microsoft Planetary Computer", "STAC"] },
        { group: "Method", items: ["Super-resolution", "Validation", "Decision certification"] },
      ],
      keywords: ["Satellite imagery", "Sentinel-2", "Super-resolution", "Trust", "Validation", "Decision certification", "STAC", "Microsoft Planetary Computer", "Python"],
      screens: [
        { image: "images/work/certus-01", caption: "Fig. 1 — Input vs. super-resolved" },
        { image: "images/work/certus-02", caption: "Fig. 2 — Trust map" },
        { image: "images/work/certus-03", caption: "Fig. 3 — Pipeline" },
      ],
    },
  },

  /* ── Archive ──────────────────────────────────────────────────────── */
  {
    slug: "project-zero",
    number: "00",
    title: "This website",
    titleLines: ["This website"],
    kind: "web",
    featured: false,
    categories: ["Web", "Creative"],
    status: "Active",
    year: "2026",
    role: null,
    category: "Project 00 · Web",
    tagline: "You're inside it.",
    summary: "A portfolio that's also a project: Next.js, GSAP, a variable font doing gymnastics, and a lot of opinions about type.",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "GSAP", "Lenis"],
    links: { live: null, repo: null },
    note: "You are here.",
  },
  {
    slug: "club-infin8",
    number: "04",
    title: "Club Infin8",
    titleLines: ["Club Infin8"],
    kind: "community",
    featured: false,
    categories: ["Community", "Products"],
    status: "Active",
    year: null,
    role: "Founding member & Head",
    category: "Community · 8-club ecosystem",
    tagline: "Eight clubs. One umbrella.",
    summary: "A student-led ecosystem of eight clubs, designed around a ~3,500-student campus. Founding member, and head across all eight.",
    stack: [],
    href: "/club-infin8",
    links: { live: null, repo: null },
  },
  {
    slug: "club-member-systems",
    number: "05",
    title: "Member systems",
    titleLines: ["Member systems"],
    kind: "product",
    featured: false,
    categories: ["Software", "Products"],
    status: null,
    year: null,
    role: null,
    category: "Club Infin8 · Operations",
    tagline: "The plumbing behind eight clubs.",
    summary: "Registration, forms, club selection, onboarding and member data for hundreds of students — department-wise datasets, team formation, duplicate detection and Excel processing.",
    stack: ["Forms", "Excel processing", "Duplicate detection"],
    href: "/club-infin8",
    links: { live: null, repo: null },
  },
  {
    slug: "sih1775-fake-accounts",
    number: "06",
    title: "Fake account detection",
    titleLines: ["Fake account", "detection"],
    kind: "hackathon",
    featured: false,
    categories: ["Security", "Software"],
    status: "Hackathon",
    year: null,
    role: null,
    category: "SIH1775 · Set by ITBP",
    tagline: "Spotting the accounts that aren't who they say they are.",
    summary: "Smart India Hackathon problem statement SIH1775 — Fake Social Media Accounts Detection, set by ITBP.",
    stack: [],
    stackTodo: "ADD APPROACH & STACK",
    href: "/#races",
    links: { live: null, repo: null },
  },
  {
    slug: "astronexis",
    number: "07",
    title: "AstroNexis / AstroSim",
    titleLines: ["AstroNexis"],
    kind: "hackathon",
    featured: false,
    categories: ["Software", "Research"],
    status: "Hackathon",
    year: null,
    role: null,
    category: "SIH25142 · Space technology",
    tagline: "A concept for student innovation in space technology.",
    summary: "A concept for Smart India Hackathon problem statement SIH25142 — Student Innovation in Space Technology.",
    stack: [],
    stackTodo: "ADD WHAT IT DOES & STACK",
    href: "/#races",
    links: { live: null, repo: null },
  },
  {
    slug: "lean-angle-prototype",
    number: "08",
    title: "Motorcycle safety prototype",
    titleLines: ["Motorcycle safety", "prototype"],
    kind: "hardware",
    featured: false,
    categories: ["Hardware", "Experiments"],
    status: "Prototype",
    year: null,
    role: null,
    category: "Hardware · Embedded",
    tagline: "It worked. Eventually.",
    summary: "Lean-angle sensing with an MPU6050 and a warning system of LEDs and a buzzer. An experimental safety concept — not a production safety system.",
    stack: ["MPU6050", "Microcontroller", "LEDs", "Buzzer"],
    href: "/#garage",
    links: { live: null, repo: null, video: null },
  },
  {
    slug: "sensor-experiments",
    number: "09",
    title: "Sensor experiments",
    titleLines: ["Sensor experiments"],
    kind: "hardware",
    featured: false,
    categories: ["Hardware", "Experiments"],
    status: "Experiment",
    year: null,
    role: null,
    category: "Hardware · The bench",
    tagline: "Motion, distance, detection — poked at until they made sense.",
    summary: "Motion, distance and detection on the bench — MPU6050, MPU9250, HC-SR04, VL53L0X and IR sensors on ESP32, Arduino and Raspberry Pi Pico boards.",
    stack: ["ESP32", "Arduino", "Raspberry Pi Pico", "MPU6050", "MPU9250", "HC-SR04", "VL53L0X", "IR"],
    href: "/#garage",
    links: { live: null, repo: null },
  },
  {
    slug: "visual-work",
    number: "10",
    title: "3D & video",
    titleLines: ["3D & video"],
    kind: "creative",
    featured: false,
    categories: ["Creative"],
    status: null,
    year: null,
    role: null,
    category: "Creative · Visuals",
    tagline: "The non-compiling side.",
    summary: "Blender for 3D. DaVinci Resolve and Premiere Pro for video.",
    stack: ["Blender", "DaVinci Resolve", "Premiere Pro"],
    href: "/#beyond",
    links: { live: null, repo: null, video: null },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const caseStudies = projects.filter((p) => p.study);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Next case study in the featured order (wraps around). */
export function getNextProject(slug: string) {
  const list = caseStudies;
  const i = list.findIndex((p) => p.slug === slug);
  return list[(i + 1) % list.length];
}

/** Where an entry lives: its case study, a custom page, or nowhere (expand in place). */
export function projectHref(p: Project) {
  if (p.study) return `/work/${p.slug}`;
  return p.href ?? null;
}
