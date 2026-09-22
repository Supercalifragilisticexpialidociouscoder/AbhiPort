/**
 * ──────────────────────────────────────────────────────────────────────────
 *  ABHI — PROJECTS
 *
 *  Each entry powers both the horizontal feature on the home page and the
 *  full case study at /work/[slug]. Add a project by adding an object here.
 *
 *  `null` = unknown → rendered as an [ADD …] marker. Never guess.
 *  Images: base paths under /public, no extension (see README.md).
 * ──────────────────────────────────────────────────────────────────────────
 */

import type { Maybe } from "./site";

export type ProjectKind = "product" | "tool" | "research";
export type SignatureVisual = "approval" | "modules" | "terminal" | "pixels";

export type Step = { label: string; note: string };

export type Layer = {
  tier: string;
  name: string;
  items: string[];
  note: string;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  /** How the title breaks across lines when it's set huge. */
  titleLines: string[];
  kind: ProjectKind;
  category: string;
  tagline: string;
  summary: string;
  year: Maybe<string>;
  role: Maybe<string>;
  status: Maybe<string>;
  stack: string[];
  /** Shown as an [ADD …] marker next to the stack when the stack is incomplete. */
  stackTodo?: string;
  cover: string;
  coverAlt: string;
  visual: SignatureVisual;
  links: { live: Maybe<string>; repo: Maybe<string> };
  study: {
    overview: string;
    /** Research only. */
    question?: string;
    problem: string;
    approach: string[];
    flow: { title: string; steps: Step[] };
    /** Sri Ram Enterprises only — the module map. */
    modules?: string[];
    architecture: { caption: string; layers: Layer[] };
    stack: { group: string; items: string[] }[];
    challenges: { title: string; body: string }[];
    outcome: string[];
    outcomeTodo: string;
    keywords?: string[];
    screens: { image: string; caption: string }[];
  };
};

export const projects: Project[] = [
  {
    slug: "infin8-access",
    number: "01",
    title: "Infin8 Access",
    titleLines: ["Infin8", "Access"],
    kind: "product",
    category: "Product · Access & permissions",
    tagline: "Permission slips, minus the paper.",
    summary: "A digital access and permission-management system for campus organisations.",
    year: null,
    role: null,
    status: null,
    stack: ["React", "Vite", "Cloudflare Workers", "Hono", "Cloudflare D1", "JWT", "QR"],
    cover: "images/work/infin8-cover",
    coverAlt: "Infin8 Access interface",
    visual: "approval",
    links: { live: null, repo: null },
    study: {
      overview:
        "Infin8 Access is a digital access and permission-management system for campus organisations. It takes a process that usually lives on paper — a request, a chain of signatures, a final go-ahead — and turns it into one flow that everyone involved can see and act on.",
      problem:
        "Paper permission workflows are slow and opaque. A request has to physically travel from person to person, it can stall on any desk, it's easy to lose, and nobody can tell where it's stuck without walking around asking. When it's finally approved, the only proof is a piece of paper.",
      approach: [
        "Model the process for what it really is: a chain of stages — Student → HOD → Coordinator → Completion — where each role can only act on the stage that belongs to it.",
        "The frontend is a React single-page app built with Vite. The API runs on Cloudflare Workers using Hono, with Cloudflare D1 as the database, so the whole backend lives at the edge with no server to babysit. Identity and role travel in JWTs, and a completed request produces a QR code that can be checked on the spot.",
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
      architecture: {
        caption: "Everything past the browser runs on Cloudflare's edge.",
        layers: [
          { tier: "Client", name: "React + Vite", items: ["React", "Vite"], note: "One app for students, HODs and coordinators — each sees the actions that belong to their role." },
          { tier: "Edge API", name: "Hono on Workers", items: ["Cloudflare Workers", "Hono"], note: "Routing, role checks and every stage transition." },
          { tier: "Auth", name: "JWT", items: ["JWT"], note: "Signed tokens carry who you are and what you're allowed to approve." },
          { tier: "Data", name: "Cloudflare D1", items: ["Cloudflare D1"], note: "Serverless SQLite holding requests and their stages." },
          { tier: "Verify", name: "QR", items: ["QR"], note: "A completed request becomes a code you can check in seconds." },
        ],
      },
      stack: [
        { group: "Frontend", items: ["React", "Vite"] },
        { group: "Backend", items: ["Cloudflare Workers", "Hono"] },
        { group: "Data", items: ["Cloudflare D1"] },
        { group: "Auth & verification", items: ["JWT", "QR"] },
      ],
      challenges: [
        { title: "Roles are the whole product", body: "An HOD shouldn't be able to act on the coordinator's stage, and a student shouldn't be able to approve anything. That means authorisation on every single transition, not just a check at login." },
        { title: "State that can't slip backwards", body: "Each request is a small state machine. Every move between stages has to be valid, deliberate and visible to the people waiting on it." },
        { title: "Designing for the edge", body: "Workers and D1 remove the server entirely — great, until you have to think in short-lived requests against a serverless SQLite database instead of a long-running backend." },
        { title: "Private by default", body: "The system handles real student information. None of it appears in this case study, and none of it ever should." },
      ],
      outcome: [
        "A complete path from request to QR-verified completion: the student asks, the HOD and the coordinator review in order, and the result is a code instead of a signed sheet.",
      ],
      outcomeTodo: "ADD OUTCOME — where it's deployed, who uses it, what changed",
      screens: [
        { image: "images/work/infin8-01", caption: "Raising a request" },
        { image: "images/work/infin8-02", caption: "An approval stage" },
        { image: "images/work/infin8-03", caption: "QR verification" },
      ],
    },
  },
  {
    slug: "sri-ram-enterprises",
    number: "02",
    title: "Sri Ram Enterprises",
    titleLines: ["Sri Ram", "Enterprises"],
    kind: "product",
    category: "Product · Fleet & transport",
    tagline: "Software for a business that runs on trucks.",
    summary: "A fleet and transport management platform for a real transport business.",
    year: null,
    role: null,
    status: "In development",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Docker"],
    cover: "images/work/sre-cover",
    coverAlt: "Sri Ram Enterprises dashboard",
    visual: "modules",
    links: { live: null, repo: null },
    study: {
      overview:
        "Sri Ram Enterprises is a fleet and transport management platform built for a real transport business. Vehicles, drivers, trips, tonnage, fuel, FASTag, tyres, maintenance, salaries, advances, income and expenses — in one system, with profit and loss that's computed rather than guessed.",
      problem:
        "A transport business produces a constant stream of small, messy numbers. Every trip has tonnage, fuel and tolls. Every driver has salaries and advances. Every truck has tyres and maintenance. When all of that is scattered across different records, the most important question — is each vehicle actually making money? — becomes surprisingly hard to answer.",
      approach: [
        "One data model with the vehicle and the trip at the centre. Every fuel fill, FASTag deduction, expense and payment attaches to something real, so reports and profit/loss fall out of the data instead of being assembled by hand.",
        "It's a Next.js and TypeScript app styled with Tailwind, with Prisma over PostgreSQL for a typed, relational core, and Docker so it runs the same everywhere.",
      ],
      flow: {
        title: "Where the money goes",
        steps: [
          { label: "Trip", note: "Vehicle, driver, tonnage" },
          { label: "Costs", note: "Fuel, FASTag, tyres, maintenance, expenses" },
          { label: "People", note: "Salaries and advances" },
          { label: "Result", note: "Income, profit / loss, analytics" },
        ],
      },
      modules: ["Vehicles", "Drivers", "Trips", "Tonnage", "Fuel", "Expenses", "Salaries", "Advances", "Maintenance", "FASTag", "Tyres", "Income", "Profit / loss", "Analytics"],
      architecture: {
        caption: "A deliberately boring, reliable stack. A business needs software that just works.",
        layers: [
          { tier: "App", name: "Next.js + TypeScript", items: ["Next.js", "TypeScript", "Tailwind CSS"], note: "Interface and server logic in one typed codebase." },
          { tier: "ORM", name: "Prisma", items: ["Prisma"], note: "The schema is the source of truth; queries are type-checked." },
          { tier: "Data", name: "PostgreSQL", items: ["PostgreSQL"], note: "Vehicles, trips and money are relational by nature." },
          { tier: "Runtime", name: "Docker", items: ["Docker"], note: "The same container on a laptop and in production." },
        ],
      },
      stack: [
        { group: "App", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
        { group: "Data", items: ["Prisma", "PostgreSQL"] },
        { group: "Infrastructure", items: ["Docker"] },
      ],
      challenges: [
        { title: "Money has rules", body: "Advances, salaries and expenses interact. An advance isn't a cost the way fuel is, and getting that modelling wrong quietly breaks every report downstream." },
        { title: "Fourteen modules, one truth", body: "Tonnage, fuel, tolls and tyres all have to roll up into per-trip and per-vehicle numbers without anything being entered twice." },
        { title: "Built for people running a business", body: "The people entering data aren't testing software — they're running trucks. Every form has to be faster than whatever they did before." },
        { title: "Real data, real stakes", body: "A business depends on these numbers, so correctness beats cleverness every time." },
      ],
      outcome: [
        "In active development, scoped across fourteen modules: vehicles, drivers, trips, tonnage, fuel, expenses, salaries, advances, maintenance, FASTag, tyres, income, profit/loss and analytics.",
      ],
      outcomeTodo: "ADD OUTCOME — what's live today, what changed for the business",
      screens: [
        { image: "images/work/sre-01", caption: "Fleet overview" },
        { image: "images/work/sre-02", caption: "Trip ledger" },
        { image: "images/work/sre-03", caption: "Profit & loss" },
      ],
    },
  },
  {
    slug: "secret-leak-detector",
    number: "03",
    title: "Secret Leak Detector",
    titleLines: ["Secret", "Leak Detector"],
    kind: "tool",
    category: "Developer tool · Security",
    tagline: "Catches the key before it's in your git history.",
    summary: "A pre-commit security utility and web dashboard that stops exposed secrets before they're committed.",
    year: null,
    role: null,
    status: null,
    stack: ["Git pre-commit hook", "Web dashboard"],
    stackTodo: "ADD STACK",
    cover: "images/work/sld-cover",
    coverAlt: "Secret Leak Detector dashboard",
    visual: "terminal",
    links: { live: null, repo: null },
    study: {
      overview:
        "Secret Leak Detector is a developer security tool: a pre-commit utility that scans changes before they become commits, plus a web dashboard for reviewing what it finds. It looks for the things that should never leave a laptop — API keys, tokens, credentials and sensitive configuration.",
      problem:
        "Once a secret is committed and pushed, deleting the file doesn't fix anything — it lives on in the history, in forks and in every clone. Most leaks aren't malicious. They're a config file added by accident, at the end of a long day, by someone who knows better.",
      approach: [
        "Stop leaks at the earliest possible moment: the commit. The pre-commit hook inspects what's staged and blocks the commit when it finds something that looks like a secret.",
        "The dashboard turns findings into something you can review and act on, instead of a wall of terminal output that scrolls away.",
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
      architecture: {
        caption: "It runs where the mistake happens: on the developer's machine, before history is written.",
        layers: [
          { tier: "Trigger", name: "Pre-commit hook", items: ["Git"], note: "Fires on every commit, before anything reaches history." },
          { tier: "Scanner", name: "Detection", items: ["API keys", "Tokens", "Credentials", "Sensitive config"], note: "Flags anything that looks like it shouldn't be committed." },
          { tier: "Gate", name: "Pass / block", items: [], note: "Clean commits go through. Risky ones stop, with a reason." },
          { tier: "Review", name: "Web dashboard", items: [], note: "Findings in one place — reviewed, not scrolled past." },
        ],
      },
      stack: [
        { group: "Integration", items: ["Git pre-commit hook"] },
        { group: "Interface", items: ["Web dashboard"] },
      ],
      challenges: [
        { title: "Noise vs. misses", body: "Too strict and people learn to skip the hook. Too loose and it's decoration. The whole tool lives or dies on that balance." },
        { title: "It has to feel instant", body: "A pre-commit check runs every single time. If it's slow, it gets bypassed." },
        { title: "Never become the leak", body: "A secret scanner handles exactly the data it's meant to protect. This page deliberately shows no real — or realistic — secrets." },
      ],
      outcome: [
        "A checkpoint between a developer and their git history, plus a dashboard to review what it catches.",
      ],
      outcomeTodo: "ADD OUTCOME — repo link, detection approach, what it has caught",
      screens: [
        { image: "images/work/sld-01", caption: "A blocked commit" },
        { image: "images/work/sld-02", caption: "Dashboard overview" },
        { image: "images/work/sld-03", caption: "A finding, redacted" },
      ],
    },
  },
  {
    slug: "certus-s2",
    number: "04",
    title: "CERTUS-S2",
    titleLines: ["Certus-S2"],
    kind: "research",
    category: "Research · Remote sensing",
    tagline: "When can you trust a pixel a model made up?",
    summary: "Trust and decision certification for Sentinel-2 super-resolution.",
    year: null,
    role: null,
    status: null,
    stack: ["Sentinel-2", "Super-resolution", "STAC", "Microsoft Planetary Computer"],
    cover: "images/work/certus-cover",
    coverAlt: "CERTUS-S2 figure",
    visual: "pixels",
    links: { live: null, repo: null },
    study: {
      overview:
        "Super-resolution models can make Sentinel-2 imagery look sharper than the sensor actually captured. That's useful right up until a decision depends on detail the model invented. CERTUS-S2 is research into trust and decision certification for super-resolved Sentinel-2 imagery: instead of asking whether an output looks good, it asks whether a decision made from it can be relied on.",
      question:
        "When a super-resolved Sentinel-2 image feeds a real decision, can we certify when that decision is trustworthy — and flag it when it isn't?",
      problem:
        "Sentinel-2 gives free, global, multispectral imagery at 10, 20 and 60 m resolution — detailed enough for a lot, not enough for everything. Super-resolution fills the gap, but a sharper image isn't automatically a truer one. Without a way to validate outputs, a confident-looking image can quietly carry a wrong answer into a real decision.",
      approach: [
        "Treat trust as something to validate, not assume. The work centres on checking super-resolved outputs and certifying the decisions made from them, rather than scoring images on how sharp they look.",
        "Imagery comes from Microsoft Planetary Computer, searched and loaded through its STAC API — so the pipeline starts from real, well-catalogued Sentinel-2 scenes.",
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
      architecture: {
        caption: "From catalogue to certified decision.",
        layers: [
          { tier: "Catalogue", name: "STAC API", items: ["Microsoft Planetary Computer"], note: "Search Sentinel-2 scenes by place, time and cloud cover." },
          { tier: "Imagery", name: "Sentinel-2", items: ["Multispectral", "10 / 20 / 60 m"], note: "Free and global — and the reason super-resolution is tempting." },
          { tier: "Model", name: "Super-resolution", items: [], note: "Produces the sharper image, and the risk that comes with it." },
          { tier: "Trust", name: "Validate + certify", items: [], note: "Decides whether a decision made from the output can be relied on." },
        ],
      },
      stack: [
        { group: "Data", items: ["Sentinel-2", "Microsoft Planetary Computer", "STAC"] },
        { group: "Method", items: ["Super-resolution", "Validation", "Decision certification"] },
      ],
      challenges: [
        { title: "Sharp isn't the same as right", body: "Standard image-quality scores reward outputs that look convincing. Trust needs a different yardstick." },
        { title: "Certify the decision, not the picture", body: "The same image can be fine for one decision and dangerous for another, so trust has to be tied to what the output is used for." },
        { title: "Knowing when to say no", body: "A useful system has to be able to flag an output as untrustworthy instead of always producing an answer." },
      ],
      outcome: [],
      outcomeTodo: "ADD STATUS & FINDINGS — paper, preprint, results",
      keywords: ["Satellite imagery", "Sentinel-2", "Super-resolution", "Trust", "Validation", "Decision certification", "STAC", "Microsoft Planetary Computer"],
      screens: [
        { image: "images/work/certus-01", caption: "Fig. 1 — Input vs. super-resolved" },
        { image: "images/work/certus-02", caption: "Fig. 2 — Trust map" },
        { image: "images/work/certus-03", caption: "Fig. 3 — Pipeline" },
      ],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
