/**
 * ──────────────────────────────────────────────────────────────────────────
 *  ABHI — COMMUNITY, CREDENTIALS, EXPERIENCE
 *
 *  The documentary layer behind the home page: /community, /credentials
 *  and /experience. Photos and certificate scans are base paths under
 *  /public (no extension) — drop a file in and the placeholder frame
 *  becomes the real thing. `null` renders as an [ADD …] marker.
 * ──────────────────────────────────────────────────────────────────────────
 */

import type { Maybe } from "./site";

/* ── /community ────────────────────────────────────────────────────────── */

export type CommunityEntry = {
  slug: string;
  name: string;
  kind: "Hackathon" | "Event" | "Workshop" | "Community";
  /** Only real dates. A year on its own is fine. */
  date: Maybe<string>;
  where?: Maybe<string>;
  /** Only real results. */
  result?: Maybe<string>;
  /** What I built there — a project slug on this site. */
  built?: string;
  note: Maybe<string>;
  /** Bigger rows for the ones that matter most. */
  lead?: boolean;
  photo: string;
};

export const communityPage = {
  title: "Community & learning",
  lead: "I'd rather learn in rooms full of people building things.",
  note: "Hackathons, events, workshops and the paperwork — curated, not a feed. The photos are the real ones, as soon as they're in.",
};

/** The one credential worth a full-screen moment — told once, here. */
export const sih = {
  value: "2×",
  label: "SIH Internal Hackathon Winner",
  note: "Smart India Hackathon — the internal hackathon round. Won twice.",
  body: "The Smart India Hackathon is the Government of India's nationwide hackathon, with problem statements set by ministries, departments and industry. These are the statements and concepts I've worked on.",
  statements: [
    { code: "SIH1775", title: "Fake Social Media Accounts Detection", org: "ITBP", concept: "SocialGuard", href: "/work/socialguard" },
    { code: "SIH25142", title: "Student Innovation in Space Technology", org: null, concept: "AstroNexis / AstroSim", href: null },
    { code: "Concept", title: "Secret Leak Detector", org: null, concept: "Repository secret detection", href: "/work/secret-leak-detector" },
  ],
  photos: [
    { image: "images/community/sih-01", caption: "SIH internal hackathon" },
    { image: "images/community/sih-02", caption: "SIH internal hackathon — the second win" },
  ],
};

export const hackathons: CommunityEntry[] = [
  {
    slug: "codex-hackathon",
    name: "OpenAI Codex Community Hackathon",
    kind: "Hackathon",
    date: "2026",
    where: "Hyderabad",
    result: null,
    built: "project-grit",
    note: "Built Project Grit: a strict AI mentor inside the IDE.",
    lead: true,
    photo: "images/community/codex-hackathon",
  },
  {
    slug: "microsoft-hackathon",
    name: "Microsoft hackathon",
    kind: "Hackathon",
    date: "2026",
    result: null,
    built: "career-intelligence-os",
    note: "Two rounds: a career-discovery app, then Career Intelligence OS.",
    lead: true,
    photo: "images/community/microsoft-hackathon",
  },
  {
    slug: "ai-thon",
    name: "AI-THON2K25",
    kind: "Hackathon",
    date: "2025",
    result: null,
    built: "student-wellness-monitor",
    note: "Built the Student Wellness Monitor.",
    photo: "images/community/ai-thon",
  },
  {
    slug: "base44",
    name: "Base44 Hackathon",
    kind: "Hackathon",
    date: null,
    result: null,
    note: null,
    photo: "images/community/base44",
  },
  {
    slug: "techfusion",
    name: "TechFusion",
    kind: "Hackathon",
    date: null,
    result: null,
    note: null,
    photo: "images/community/techfusion",
  },
];

export const events: CommunityEntry[] = [
  {
    slug: "devfest-2025",
    name: "GDG DevFest 2025",
    kind: "Event",
    date: "2025",
    note: "Google Developer Groups' annual developer festival.",
    lead: true,
    photo: "images/community/devfest-2025",
  },
  {
    slug: "microsoft-neurora",
    name: "Microsoft Neurora",
    kind: "Event",
    date: null,
    note: null,
    lead: true,
    photo: "images/community/microsoft-neurora",
  },
  {
    slug: "gdg-on-campus",
    name: "GDG on Campus",
    kind: "Community",
    date: null,
    note: "The campus chapter of the developer community — on the radar.",
    photo: "images/community/gdg-on-campus",
  },
];

export const workshops: CommunityEntry[] = [
  {
    slug: "google-ai-agents",
    name: "Google AI Agents Workshop",
    kind: "Workshop",
    date: null,
    note: "Hands-on with building AI agents.",
    lead: true,
    photo: "images/community/google-ai-agents",
  },
];

/** Learning that shows up as work, not as a badge. */
export const learning = {
  now: "System design",
  lines: [
    { k: "Learning by building", v: "Most of the archive is this: pick a problem, pick up whatever it needs." },
    { k: "Built twice to learn", v: "The expense tracker, in plain JavaScript, then twice in React.", href: "/work/expense-tracker" },
    { k: "Where it started", v: "A calculator, a card game, a typing test — the first web pages.", href: "/archive" },
  ],
};

/* ── /credentials ──────────────────────────────────────────────────────── */

export type Credential = {
  slug: string;
  title: string;
  issuer: Maybe<string>;
  /** Only real dates. */
  date: Maybe<string>;
  type: Maybe<string>;
  /** A verification URL, only if one exists. Never invented. */
  verify: Maybe<string>;
  credentialId: Maybe<string>;
  /** Scan of the certificate (image or first page of the PDF). */
  image: string;
  /** Original PDF under /public, e.g. "certificates/aws.pdf". */
  pdf?: string;
  lead?: boolean;
};

export const credentialsPage = {
  title: "Credentials",
  lead: "The paperwork. Real, filed, and deliberately after the work.",
  note: "Nothing here has an invented verification link. Where there isn't one, it says so.",
};

export const credentials: Credential[] = [
  { slug: "sih-internal", title: "2× SIH Internal Hackathon Winner", issuer: "Smart India Hackathon (internal round)", date: null, type: "Award", verify: null, credentialId: null, image: "images/credentials/sih-internal", lead: true },
  { slug: "aws-cloud-practitioner", title: "AWS Cloud Practitioner", issuer: "Amazon Web Services", date: null, type: null, verify: null, credentialId: null, image: "images/credentials/aws-cloud-practitioner", pdf: "certificates/aws-cloud-practitioner.pdf" },
  { slug: "python-essentials", title: "Python Essentials", issuer: "Cisco", date: null, type: null, verify: null, credentialId: null, image: "images/credentials/python-essentials", pdf: "certificates/python-essentials.pdf" },
  { slug: "ai-ml-foundations", title: "AI & ML Foundations", issuer: "Google", date: null, type: null, verify: null, credentialId: null, image: "images/credentials/ai-ml-foundations", pdf: "certificates/ai-ml-foundations.pdf" },
  { slug: "java-assessment", title: "Java Programming Assessment", issuer: null, date: null, type: "Assessment", verify: null, credentialId: null, image: "images/credentials/java-assessment", pdf: "certificates/java-assessment.pdf" },
  { slug: "google-ai-agents", title: "Google AI Agents Workshop", issuer: "Google", date: null, type: "Workshop", verify: null, credentialId: null, image: "images/credentials/google-ai-agents", pdf: "certificates/google-ai-agents.pdf" },
  { slug: "devfest-2025", title: "GDG DevFest 2025", issuer: "Google Developer Groups", date: "2025", type: "Event", verify: null, credentialId: null, image: "images/credentials/devfest-2025", pdf: "certificates/devfest-2025.pdf" },
  { slug: "jetbrains", title: "JetBrains developer tooling", issuer: "JetBrains", date: null, type: null, verify: null, credentialId: null, image: "images/credentials/jetbrains", pdf: "certificates/jetbrains.pdf" },
];

/* ── /experience ───────────────────────────────────────────────────────── */

export type Role = {
  title: string;
  org: string;
  /** e.g. "2025 — now". Null until confirmed. */
  when: Maybe<string>;
  note: string;
  href?: string;
};

export const experiencePage = {
  title: "Experience",
  lead: "Roles first, then the receipts: what I built, dated by the commits.",
  note: "Dates below come from GitHub — the first commit of each project. Roles stay undated until I add them properly.",
};

export const roles: Role[] = [
  { title: "Founding member & Head", org: "Club Infin8", when: null, note: "Head across all eight clubs of a student-led ecosystem: ~200 members on a ~3,500-student campus.", href: "/club-infin8" },
  { title: "Builder", org: "Software for real business owners", when: null, note: "Applications in daily use by business owners. Which businesses stays private." },
  { title: "Student", org: "B.Tech, Computer Science", when: null, note: "The degree. The rest of this page happens alongside it." },
];
