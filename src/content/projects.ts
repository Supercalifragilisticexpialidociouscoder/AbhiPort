/**
 * ──────────────────────────────────────────────────────────────────────────
 *  ABHI — PROJECTS
 *
 *  One list powers everything: the build index on the home page
 *  (`featured: true`), the full archive at /archive (every entry), and the
 *  project pages at /work/[slug] — a full case study (`study`) or a lighter
 *  project file (`file`).
 *
 *  Add a project → add an object. The archive, filters, counts, sitemap and
 *  OG images pick it up automatically.
 *
 *  Source of truth: Abhi's own words, plus his public GitHub repositories
 *  (READMEs and code). Private work never appears here.
 *
 *  `null` = unknown → rendered as an [ADD …] marker. Never guess.
 *  Images: base paths under /public, no extension (see README.md).
 * ──────────────────────────────────────────────────────────────────────────
 */

import type { Maybe } from "./site";

export type ProjectKind = "product" | "tool" | "research" | "community" | "hardware" | "creative" | "hackathon" | "web";
export type SignatureVisual = "approval" | "terminal" | "pixels" | "feed" | "calendar" | "mentor" | "corridors" | "scan";

export type ProjectStatus = "Shipped" | "Active" | "Prototype" | "Research" | "Experiment" | "Hackathon" | "Learning" | "Archived";

export type Category =
  | "Software"
  | "Web"
  | "AI / ML"
  | "Security"
  | "Hardware"
  | "Research"
  | "Cloud"
  | "Experiments"
  | "Products"
  | "Community"
  | "Creative";

/** Filter order in the archive. Categories with no entries are hidden. */
export const CATEGORIES: Category[] = ["Software", "Web", "AI / ML", "Security", "Hardware", "Research", "Cloud", "Experiments", "Products", "Community", "Creative"];

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

/**
 * A project file: the lighter page for builds that don't need a full case
 * study. Everything in it comes from the code and README of the repo.
 */
export type ProjectFile = {
  /** One paragraph: what it is, plainly. */
  what: string;
  /** How it works, as a chain. */
  flow: { title: string; steps: Step[] };
  /** What's actually inside — read off the code, not the pitch. */
  inside: { title: string; body: string }[];
  /** The honest bit: sample data, mocked AI, prototype limits. */
  honest: string[];
  stack: { group: string; items: string[] }[];
  /** More repos behind the same project (e.g. two hackathon rounds). */
  repos?: { label: string; href: string }[];
  screens: { image: string; caption: string }[];
};

export type Project = {
  slug: string;
  /** "00" is reserved for this website. Stable — the archive shows it as 000. */
  number: string;
  title: string;
  /** How the title breaks across lines when it's set huge. */
  titleLines: string[];
  kind: ProjectKind;
  /** In the home page's Work film. */
  featured: boolean;
  /** Position in the film, 1–8. Set on featured entries only. */
  featureRank?: number;
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
  /** The build index row: a short category and one line. */
  reel?: { category: string; line: string };
  /** Where it was built, e.g. a hackathon. */
  origin?: string;
  /** First commit on GitHub, YYYY-MM — a receipt, not a guess. */
  created?: string;
  cover?: string;
  coverAlt?: string;
  visual?: SignatureVisual;
  /** A page elsewhere on the site (for entries without a /work page). */
  href?: string;
  links: { live: Maybe<string>; repo: Maybe<string>; video?: Maybe<string> };
  /** Real numbers only (users, records, tests …). Rendered when present. */
  metrics?: { value: string; label: string }[];
  /** Tiny archive microcopy. */
  note?: string;
  study?: CaseStudy;
  file?: ProjectFile;
};

const GH = "https://github.com/Supercalifragilisticexpialidociouscoder";

export const projects: Project[] = [
  /* ── The build index (home page) ──────────────────────────────────── */
  {
    slug: "infin8-access",
    number: "01",
    title: "Infin8 Access",
    titleLines: ["Infin8", "Access"],
    kind: "product",
    featured: true,
    featureRank: 1,
    categories: ["Software", "Web", "Cloud", "Products", "Security"],
    status: "Shipped",
    year: null,
    role: null,
    category: "Product · Access & permissions",
    tagline: "Permission slips, minus the paper.",
    summary: "A campus permission system built around QR identity verification and role-based workflows.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Cloudflare Workers", "Hono", "Cloudflare D1", "JWT", "WebCrypto", "QR"],
    reel: { category: "Systems · Campus infrastructure", line: "Used by HODs, heads of campus and 200+ active club members." },
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
        "The frontend is React and TypeScript on Vite, styled with Tailwind. The API is Hono running on Cloudflare Workers, backed by Cloudflare D1 — SQL at the edge, no server to babysit.",
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
            { tier: "Client", name: "React + Vite", items: ["React", "TypeScript", "Vite", "Tailwind"], note: "Role-specific views for students, HODs, coordinators and admins." },
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
        { group: "Frontend", items: ["React", "TypeScript", "Vite", "Tailwind CSS"] },
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
    featured: false,
    categories: ["Security", "Software"],
    status: "Prototype",
    year: "2026",
    role: null,
    category: "Developer tool · Security",
    tagline: "Catches the key before it's in your git history.",
    summary:
      "A secret firewall: it flags credentials as you type, blocks them at the commit, checks pull requests at the GitHub boundary — and never stores the secret it found. It started as a Smart India Hackathon concept; the current build ships as WhisperGuard.",
    stack: ["Node.js", "Git pre-commit hook", "VS Code extension", "GitHub App", "Checks API", "HMAC-SHA256", "node:test"],
    reel: { category: "Security", line: "Stops a leaked key before it reaches git history." },
    origin: "Smart India Hackathon concept",
    created: "2026-09",
    cover: "images/work/sld-cover",
    coverAlt: "Secret Leak Detector dashboard",
    visual: "terminal",
    links: { live: null, repo: `${GH}/NIAT_EIC`, video: null },
    study: {
      problem:
        "Once a secret is committed and pushed, deleting the file doesn't fix anything — it lives on in the history, in forks and in every clone. Most leaks aren't malicious. They're a config file added by accident, at the end of a long day, by someone who knows better.",
      idea:
        "Stop leaks at the earliest possible moment — while the key is still being typed — and again at every boundary after that: the commit, then the pull request. Keep the findings somewhere reviewable, and make sure the tool itself can never become the leak.",
      build: [
        "Detection goes beyond brittle regex: vendor patterns, Shannon-entropy thresholds and syntactic and file-context signals decide what counts as a credential. The same engine runs in the editor, in the hook and at the GitHub boundary.",
        "A VS Code extension debounces keystrokes (~400 ms) and underlines a secret before it's even saved. A zero-dependency pre-commit hook fails closed and blocks the commit. A GitHub App scans pull-request diffs in memory and posts a check run with redacted annotations — with a local simulator as a guaranteed fallback for demos on bad venue Wi-Fi.",
        "Every finding crosses a privacy boundary: the candidate is fingerprinted with keyed HMAC-SHA256 and the raw value is discarded. That same fingerprint spots one credential reused across several repositories without anyone ever holding the secret — and the dashboard explains each finding's blast radius: payments, cloud, source control, data.",
      ],
      flow: {
        title: "Three checkpoints, one engine",
        steps: [
          { label: "Type", note: "Red squiggle in the editor" },
          { label: "Commit", note: "Pre-commit hook blocks it" },
          { label: "Pull request", note: "GitHub check fails the merge" },
          { label: "Fingerprint", note: "HMAC — raw secret discarded" },
          { label: "Review", note: "Blast radius on the dashboard" },
        ],
      },
      hardPart: [
        { title: "Noise vs. misses", body: "Too strict and people learn to skip the hook. Too loose and it's decoration. Patterns alone miss things; entropy alone cries wolf. The engine combines them with context to find the balance." },
        { title: "Never become the leak", body: "A secret scanner handles exactly the data it's meant to protect. Raw values never touch disk, logs or the UI — the store refuses keys named like secrets, and the interface only ever shows truncated fingerprints." },
        { title: "It has to feel instant", body: "A check that runs on every keystroke and every commit gets bypassed the moment it's slow. Debounced in the editor, zero dependencies in the hook." },
        { title: "A demo that can't fail", body: "Hackathon networks are hostile. The simulator replays pull-request checks locally with the exact same engine and check-run builder as the real GitHub App." },
      ],
      result: [
        "A working secret firewall: live editor diagnostics, a commit hook that fails closed, pull-request checks through a real GitHub App (plus an offline simulator), cross-repo correlation by fingerprint, and a compliance dashboard — with a Node test suite behind it.",
      ],
      resultTodo: "ADD — what it has caught, and where it's used",
      next: null,
      underTheHood: {
        architecture: {
          caption: "One detection engine behind every checkpoint.",
          layers: [
            { tier: "Editor", name: "VS Code extension", items: ["Debounced ~400 ms"], note: "Diagnostics as you type, before anything is saved." },
            { tier: "Commit", name: "Pre-commit hook", items: ["Zero dependencies", "Fails closed"], note: "Blocks the commit when a block-tier secret is staged." },
            { tier: "Boundary", name: "GitHub App", items: ["Webhooks", "Checks API"], note: "Scans pull-request diffs in memory; redacted annotations." },
            { tier: "Engine", name: "Detection", items: ["Patterns", "Entropy", "Context"], note: "Decides what counts as a credential, and how serious it is." },
            { tier: "Privacy", name: "HMAC-SHA256", items: ["Keyed fingerprints"], note: "The raw value is discarded; only the fingerprint survives." },
            { tier: "Review", name: "Dashboard", items: ["Blast radius", "Risk score"], note: "Findings explained, correlated and measured over time." },
          ],
        },
        flow: {
          caption: "One pull request, start to finish.",
          steps: [
            { label: "Webhook", note: "pull_request opened or updated" },
            { label: "Diff", note: "Added lines scanned in memory" },
            { label: "Assess", note: "Severity, confidence, risk" },
            { label: "Fingerprint", note: "HMAC, raw value dropped" },
            { label: "Check run", note: "Fail on block-tier, else pass" },
          ],
        },
        quality: [
          "Node's built-in test runner covers the engine.",
          "Raw credentials are never persisted — the store rejects secret-named keys.",
          "The UI and terminal only show truncated fingerprints.",
        ],
        qualityTodo: "ADD — false-positive numbers from real use",
      },
      stack: [
        { group: "Runtime", items: ["Node.js"] },
        { group: "Checkpoints", items: ["VS Code extension", "Git pre-commit hook", "GitHub App", "Checks API"] },
        { group: "Detection", items: ["Vendor patterns", "Shannon entropy", "Context signals"] },
        { group: "Privacy & tests", items: ["HMAC-SHA256", "node:test"] },
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
    featureRank: 5,
    categories: ["Research", "AI / ML"],
    status: "Research",
    year: null,
    role: null,
    category: "Research · Remote sensing",
    tagline: "When can you trust a pixel a model made up?",
    summary: "Trust and decision certification for Sentinel-2 super-resolution.",
    stack: ["Python", "Sentinel-2", "Super-resolution", "STAC", "Microsoft Planetary Computer"],
    reel: { category: "Research", line: "When can you trust a pixel a model made up?" },
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
  {
    slug: "socialguard",
    number: "04",
    title: "SocialGuard",
    titleLines: ["SocialGuard"],
    kind: "hackathon",
    featured: false,
    categories: ["AI / ML", "Security", "Software"],
    status: "Prototype",
    year: "2025",
    role: null,
    category: "SIH1775 · AI / Security",
    tagline: "Spotting the accounts that aren't who they say they are.",
    summary:
      "A prototype for Smart India Hackathon problem statement SIH1775 — Fake Social Media Accounts Detection, set by ITBP. It labels posts Genuine, Bot or Suspicious with rules you can read, and can train a model on the spot.",
    stack: ["Python", "Streamlit", "scikit-learn", "pandas", "Plotly"],
    reel: { category: "AI / Security", line: "Flags fake and bot accounts — and says why." },
    origin: "Smart India Hackathon · SIH1775 · set by ITBP",
    created: "2025-09",
    visual: "feed",
    links: { live: null, repo: `${GH}/Socialguard.prototype` },
    file: {
      what: "SIH1775 asks for a way to detect fake social media accounts. SocialGuard is the prototype answer: paste a post and it tells you whether it reads Genuine, Bot or Suspicious — and, more usefully, why. An analyst's dashboard sits around it.",
      flow: {
        title: "One post, analysed",
        steps: [
          { label: "Post", note: "Paste the text" },
          { label: "Signals", note: "URLs, repetition, spam words, punctuation" },
          { label: "Score", note: "Weighted into one number" },
          { label: "Label", note: "Genuine · Bot · Suspicious — with reasons" },
          { label: "Model", note: "Optional ML second opinion" },
        ],
      },
      inside: [
        { title: "Explainable first", body: "The rule-based scorer counts links, repeated words, spammy keywords and excess punctuation, and returns its reasons with the label. A flag you can argue with beats a black box." },
        { title: "A model, trained on the spot", body: "A TF-IDF vectoriser and a logistic-regression classifier can be trained from the app's own data, then run side by side with the rules." },
        { title: "An analyst's dashboard", body: "Risk distribution, flagged accounts over time, recent alerts, per-account breakdowns and a downloadable report — built in Streamlit with Plotly charts." },
      ],
      honest: [
        "It runs on sample data — the dashboard describes a CSV, not the internet.",
        "A prototype for the problem statement, not a deployed detection system.",
      ],
      stack: [
        { group: "App", items: ["Python", "Streamlit"] },
        { group: "Data & charts", items: ["pandas", "Plotly"] },
        { group: "Model", items: ["scikit-learn", "TF-IDF", "Logistic regression"] },
      ],
      screens: [
        { image: "images/work/socialguard-01", caption: "Dashboard" },
        { image: "images/work/socialguard-02", caption: "Analysing a post" },
      ],
    },
  },
  {
    slug: "infin8-calendar",
    number: "05",
    title: "Infin8 Calendar",
    titleLines: ["Infin8", "Calendar"],
    kind: "product",
    featured: false,
    categories: ["Software", "Web", "Products", "Security", "Community"],
    status: "Active",
    year: "2026",
    role: null,
    category: "Club Infin8 · Campus calendar",
    tagline: "What's happening on campus — no sign-in required.",
    summary:
      "The central event, schedule and responsibility calendar for the campus. Anyone can see what's on without an account; three administrators run everything behind it.",
    stack: ["React", "TypeScript", "Vite", "Express", "SQLite", "zod", "Cloudflare Pages"],
    reel: { category: "Web / Systems", line: "Every campus event in one place. No login to look." },
    created: "2026-09",
    visual: "calendar",
    links: { live: null, repo: `${GH}/Cal.com` },
    study: {
      problem:
        "Students shouldn't need an account — or a group chat — to find out what's happening on campus today. And the people running it all need more than a list of dates: who's responsible for what, whether an event is actually ready, and what clashes with what.",
      idea:
        "Two experiences, one application. The public calendar is the product, not a stripped-down admin panel: month, week, day and agenda views, search, filters, deadlines. Signing in adds capability to the same surface — events, responsibilities, notes, attachments and history, for three authorised administrators.",
      build: [
        "A two-workspace monorepo: a React single-page app and an Express API on SQLite, with WAL mode and migrations. The client only ever talks to a same-origin /api, so there's no base URL to configure anywhere — not in development, not in production.",
        "The server decides what you can do; a hidden button is never the control. scrypt password hashing, server-side sessions stored as HMAC digests, CSRF protection, per-IP and per-email login throttling, parameterised SQL and a strict content-security policy.",
        "Speed is a feature: the public landing page is one request, administration is code-split so visitors never download it, identical requests are coalesced and cached, and the first public load is roughly 95 KB of gzipped JavaScript and CSS.",
      ],
      flow: {
        title: "Same surface, more capability",
        steps: [
          { label: "Anyone", note: "Month · week · day · agenda" },
          { label: "An event", note: "Details, public tasks, readiness" },
          { label: "Staff admin", note: "Create, edit, archive, notes, files" },
          { label: "Super admin", note: "Accounts, organisers, venues" },
        ],
      },
      roles: [
        { name: "Super Admin", note: "One. Full control, including admin accounts and settings." },
        { name: "Staff Admin", note: "Two. Day-to-day event operations." },
        { name: "Public viewer", note: "Everyone else. Read-only, no account." },
      ],
      hardPart: [
        { title: "Readiness has to be true", body: "Event readiness is computed over every responsibility, internal ones included. Counting only the public subset would show 'Ready' while preparation was still outstanding — so when a visitor sees fewer tasks than the total, the page says so." },
        { title: "Warn, don't block", body: "Double-booking a venue, or a team that's already busy at that hour, raises a warning that names the clash — and leaves the decision to an administrator." },
        { title: "Private means private", body: "Quick notes are scoped to their author in every query. One admin can't read another's — not even the Super Admin — and the API answers 'not found' rather than confirming they exist." },
        { title: "Nothing is destroyed", body: "Deadlines are events of their own type, so every query and filter works on them unchanged. Deleting an event sets a timestamp; the archive restores it." },
      ],
      result: [
        "A working calendar with public and admin experiences, a relational schema, a security model and a split deployment setup: the static client on Cloudflare Pages, the API on a Node host.",
      ],
      resultTodo: "ADD — is it live yet, and who uses it?",
      next: [
        "Sit behind the Club Infin8 backend with shared authentication.",
        "A dashboard calendar widget and Google / Outlook sync.",
        "Registration, QR attendance, notifications and analytics — only once they're actually needed.",
      ],
      underTheHood: {
        architecture: {
          caption: "A plain two-workspace monorepo.",
          layers: [
            { tier: "Client", name: "React SPA", items: ["React", "TypeScript", "Vite"], note: "Typed API client with a caching query hook; admin pages lazy-loaded." },
            { tier: "API", name: "Express", items: ["Express", "zod"], note: "Routes for events, responsibilities, notes, attachments, search and admin." },
            { tier: "Data", name: "SQLite", items: ["WAL", "Migrations"], note: "Users, sessions, events, venues, responsibilities, notes, activity log." },
            { tier: "Security", name: "Sessions & guards", items: ["scrypt", "HMAC sessions", "CSRF", "CSP"], note: "Authorisation on every mutating endpoint." },
            { tier: "Deploy", name: "Pages + Node", items: ["Cloudflare Pages", "Node host"], note: "Static client at the edge, API on a host with a persistent disk." },
          ],
        },
        data: {
          caption: "The schema, simplified.",
          entities: [
            { name: "Event", note: "Includes deadlines, as their own event type. Archived, never deleted." },
            { name: "Responsibility", note: "Who owns what — public or internal — feeding readiness." },
            { name: "Venue & organiser", note: "Where it happens, who runs it; conflicts warn." },
            { name: "Note & attachment", note: "Private by default, authorised on download." },
          ],
        },
        auth: [
          "scrypt hashing, constant-time comparison, and a dummy hash for unknown emails so login timing reveals nothing.",
          "Server-side sessions stored as HMAC digests — a database leak can't be replayed as a login.",
          "HttpOnly, SameSite cookies with a sliding 12-hour expiry; deactivating an account revokes its sessions immediately.",
        ],
        infra: ["Cloudflare Pages for the static client.", "The API on any Node host with a persistent disk."],
        quality: [
          "Every failure becomes a readable sentence, not a stack trace.",
          "Filter values are validated against allow-lists; all SQL is parameterised.",
          "Attachments download as attachments, with nosniff — an uploaded HTML file can't run on the origin.",
        ],
        qualityTodo: "ADD — tests and real usage",
      },
      stack: [
        { group: "Frontend", items: ["React", "TypeScript", "Vite"] },
        { group: "Backend", items: ["Express", "zod"] },
        { group: "Data", items: ["SQLite"] },
        { group: "Security", items: ["scrypt", "HMAC sessions", "CSRF guard", "CSP"] },
        { group: "Deploy", items: ["Cloudflare Pages", "Node host"] },
      ],
      screens: [
        { image: "images/work/calendar-01", caption: "The public calendar" },
        { image: "images/work/calendar-02", caption: "An event and its readiness" },
        { image: "images/work/calendar-03", caption: "Administration" },
      ],
    },
  },
  {
    slug: "project-grit",
    number: "06",
    title: "Project Grit",
    titleLines: ["Project", "Grit"],
    kind: "hackathon",
    featured: false,
    categories: ["AI / ML", "Software"],
    status: "Hackathon",
    year: "2026",
    role: null,
    category: "IDE extension · AI mentor",
    tagline: "A mentor in your editor that refuses to just hand you the answer.",
    summary:
      "A VS Code extension — also for Cursor, Windsurf and VSCodium — that explains your code, walks through debugging root-cause first, tightens weak prompts and scores your reasoning. Built at the OpenAI Codex Community Hackathon in Hyderabad.",
    stack: ["TypeScript", "VS Code Extension API", "Webviews", "OpenAI API"],
    reel: { category: "AI / Dev tools", line: "An IDE mentor that won't just write it for you." },
    origin: "OpenAI Codex Community Hackathon · Hyderabad",
    created: "2026-04",
    visual: "mentor",
    links: { live: null, repo: `${GH}/codex-community-hackathon-hyd-project_grit` },
    file: {
      what: "Project Grit turns an AI model into a strict technical mentor inside the IDE. Select some code and it explains the logic, guides debugging root-cause first, rewrites a weak prompt into a strict, testable one, or evaluates how deep your reasoning actually goes — all without writing the solution for you.",
      flow: {
        title: "Select, ask, learn",
        steps: [
          { label: "Select", note: "Code or a whole file" },
          { label: "Sync", note: "Into the Grit sidebar" },
          { label: "Mode", note: "Analyze · Debug · Improve · Evaluate" },
          { label: "Mentor", note: "Guidance, not the answer" },
        ],
      },
      inside: [
        { title: "Four modes", body: "Analyze explains the logic. Debug goes root-cause first. Improve Prompt turns vague asks into strict, testable ones. Evaluate Thinking scores reasoning depth from a mentor–learner transcript." },
        { title: "Works without a key", body: "With no OpenAI API key configured it falls back to deterministic local responses instead of breaking — useful when the venue Wi-Fi isn't." },
        { title: "Everywhere VS Code runs", body: "A sidebar webview plus command-palette commands, packaged as a .vsix for VS Code, Cursor, Windsurf and VSCodium." },
      ],
      honest: [
        "Built at a hackathon. It installs from a .vsix file, by hand.",
        "The mentoring quality depends on the model behind it; the offline fallback is deliberately simple.",
      ],
      stack: [
        { group: "Extension", items: ["TypeScript", "VS Code Extension API", "Webviews"] },
        { group: "Model", items: ["OpenAI API (optional)", "Local fallback"] },
      ],
      screens: [
        { image: "images/work/grit-01", caption: "The Grit sidebar" },
        { image: "images/work/grit-02", caption: "Debug mode" },
      ],
    },
  },
  {
    slug: "terramatch-nexus",
    number: "07",
    title: "TerraMatch Nexus",
    titleLines: ["TerraMatch", "Nexus"],
    kind: "web",
    featured: false,
    categories: ["Software", "Web", "Experiments"],
    status: "Prototype",
    year: "2026",
    role: null,
    category: "Simulation · Climate migration",
    tagline: "A command centre for a crisis nobody has solved yet.",
    summary:
      "A browser-based command centre for climate migration: it scores displaced people by risk, matches them to cities with a priority-queue engine, generates relocation corridors and simulates disasters — on sample data.",
    stack: ["JavaScript", "HTML", "CSS", "Canvas", "GitHub Actions", "GitHub Pages"],
    reel: { category: "Simulation", line: "A climate-migration command centre, on sample data." },
    created: "2026-05",
    visual: "corridors",
    links: { live: "https://supercalifragilisticexpialidociouscoder.github.io/TerraMatchNexus/", repo: `${GH}/TerraMatchNexus` },
    file: {
      what: "TerraMatch Nexus imagines the screen a relief coordinator would need: who is most at risk, which cities can take them, and what happens to both when a cyclone hits. Eight tabs, one engine, no framework.",
      flow: {
        title: "The matching engine",
        steps: [
          { label: "Register", note: "People and receiving cities" },
          { label: "Score risk", note: "Urgency, health, age, family" },
          { label: "Queue", note: "Highest risk first" },
          { label: "Match", note: "Best available city, greedily" },
          { label: "Corridors", note: "Allocations and routes" },
        ],
      },
      inside: [
        { title: "A priority-queue matcher", body: "Risk is a weighted score — urgency × 0.5, health × 0.2, age × 0.2, family size × 0.1. People are queued highest risk first, every city is scored for each person, and the best available city is assigned greedily; then corridor IDs and allocations are generated." },
        { title: "A simulation theatre", body: "Cyclone, extreme drought, coastal flooding and heatwave scenarios project the affected population, a displacement timeline, recommended corridors and the stress on water, energy and housing." },
        { title: "Plain JavaScript, deployed by CI", body: "Command, risk engine, simulation, matching, smart cities, alerts, analytics and field ops — vanilla JavaScript modules and canvas visualisations, published to GitHub Pages by a GitHub Actions workflow." },
      ],
      honest: [
        "Every person and city in it is sample data. It's a simulation of a system, not a system in use.",
        "The 'AI' is a scoring and matching engine — rules, not a trained model.",
      ],
      stack: [
        { group: "App", items: ["JavaScript", "HTML", "CSS"] },
        { group: "Visuals", items: ["Canvas", "SVG gauges"] },
        { group: "Deploy", items: ["GitHub Actions", "GitHub Pages"] },
      ],
      screens: [
        { image: "images/work/terramatch-01", caption: "Command view" },
        { image: "images/work/terramatch-02", caption: "Simulation theatre" },
      ],
    },
  },
  {
    slug: "hakit",
    number: "08",
    title: "HaKit",
    titleLines: ["HaKit"],
    kind: "product",
    featured: true,
    featureRank: 4,
    categories: ["AI / ML", "Software", "Experiments"],
    status: "Prototype",
    year: "2026",
    role: null,
    category: "Computer vision · Venue operations",
    tagline: "Point a camera at a room. It works out what breaks when the plan changes.",
    summary:
      "A venue-operations assistant: in-browser object detection feeds a model of the space — rooms, exits, doors, obstacles, capacity — and a consequence engine shows what a change does before anyone moves a chair.",
    stack: ["React", "TypeScript", "Vite", "MediaPipe Tasks Vision", "Express", "React Router"],
    reel: { category: "Computer vision", line: "A camera maps the venue; it shows what breaks when plans change." },
    created: "2026-08",
    visual: "scan",
    links: { live: null, repo: `${GH}/HAKITMRDU` },
    file: {
      what: "HaKit plans the physical side of an event. A camera feed runs through object detection in the browser, and what it sees becomes part of a world state — floors, rooms, exits, obstacles, registrations, check-ins. The app flags issues, proposes plans, and answers “what if?” before it happens.",
      flow: {
        title: "From camera to plan",
        steps: [
          { label: "Scan", note: "Camera → object detection" },
          { label: "World state", note: "Rooms, exits, obstacles, people" },
          { label: "Analyse", note: "Issues against requirements" },
          { label: "What if", note: "Consequence engine" },
          { label: "Plan", note: "Candidate arrangements" },
        ],
      },
      inside: [
        { title: "Vision in the browser", body: "MediaPipe's EfficientDet-Lite2 object detector runs on the GPU in video mode — no server round trip for every frame." },
        { title: "Every number knows where it came from", body: "Each value in the world state carries its provenance — entered by a person, observed, estimated, simulated, calibrated — and “unknown” is a real value, not a guess." },
        { title: "Consequences, deterministically", body: "Type “what if 50 more participants” and the consequence engine clones the state, applies the change, re-runs the analysis and shows which issues appear or disappear." },
      ],
      honest: [
        "A prototype: the what-if parser understands a handful of phrasings.",
        "The venue model is only as good as what the camera and the organiser tell it.",
      ],
      stack: [
        { group: "App", items: ["React", "TypeScript", "Vite", "React Router"] },
        { group: "Vision", items: ["MediaPipe Tasks Vision", "EfficientDet-Lite2"] },
        { group: "Server", items: ["Express"] },
      ],
      screens: [
        { image: "images/work/hakit-01", caption: "Scanning a room" },
        { image: "images/work/hakit-02", caption: "The space map" },
      ],
    },
  },

  /* ── More work, in the archive ────────────────────────────────────── */
  {
    slug: "career-intelligence-os",
    number: "09",
    title: "Career Intelligence OS",
    titleLines: ["Career", "Intelligence OS"],
    kind: "hackathon",
    featured: false,
    categories: ["Web", "Experiments"],
    status: "Hackathon",
    year: "2026",
    role: null,
    category: "Microsoft hackathon · Career guidance",
    tagline: "A careers counsellor that asks what you'll regret.",
    summary:
      "Two rounds of a Microsoft hackathon: a swipe-to-discover career app, then Career Intelligence OS — a regret simulator, blind-spot finder, skill gaps and a learning roadmap, with a navigator you can talk to and accessibility modes built in.",
    stack: ["Next.js", "TypeScript", "Framer Motion", "Zustand", "Web Speech API", "HTML", "CSS", "JavaScript"],
    origin: "Microsoft hackathon · two rounds",
    created: "2026-02",
    links: { live: null, repo: `${GH}/MICROSOFTFINALOUTPUT` },
    file: {
      what: "Round one turned a messy paragraph about yourself into a profile and a swipeable deck of careers, each with a roadmap and a skill-gap chart. The final round went further: Career Intelligence OS, a single-page mission control for choosing what to do with your life.",
      flow: {
        title: "Round one → the final",
        steps: [
          { label: "Describe", note: "Type your “chaotic thoughts”" },
          { label: "Profile", note: "Extracted and confirmed" },
          { label: "Swipe", note: "A deck of careers" },
          { label: "Simulate", note: "Regret at 1, 3 and 5 years" },
          { label: "Plan", note: "Skill gaps → roadmap" },
        ],
      },
      inside: [
        { title: "Regret, simulated", body: "Pick a career and see projected emotional and logical regret risk at one, three and five years — the question most career tools never ask." },
        { title: "A navigator you can talk to", body: "NOVA takes typed questions or voice (“Guide me”), alongside a blind-spot detector, interest–skill conflicts and an elimination engine." },
        { title: "Accessible from the first screen", body: "High contrast, reduced motion and a dyslexia-friendly font are switches on the start screen, not settings buried three menus deep." },
      ],
      honest: [
        "The “AI” in round one is a local mock — careers come from a built-in list and the analysis is simulated for the demo.",
        "The final round is a single self-contained HTML file.",
      ],
      stack: [
        { group: "Round one", items: ["Next.js", "TypeScript", "Framer Motion", "Zustand", "Web Speech API"] },
        { group: "Final round", items: ["HTML", "CSS", "JavaScript"] },
      ],
      repos: [
        { label: "Round one", href: `${GH}/Microsofthackathon` },
        { label: "Final round", href: `${GH}/MICROSOFTFINALOUTPUT` },
      ],
      screens: [
        { image: "images/work/career-01", caption: "Round one — the swipe deck" },
        { image: "images/work/career-02", caption: "Final — the regret simulator" },
      ],
    },
  },
  {
    slug: "student-wellness-monitor",
    number: "10",
    title: "Student Wellness Monitor",
    titleLines: ["Student", "Wellness Monitor"],
    kind: "hackathon",
    featured: false,
    categories: ["Web", "Experiments"],
    status: "Hackathon",
    year: "2025",
    role: null,
    category: "AI-THON2K25 · Wellbeing",
    tagline: "Checking in on yourself, as easy as checking your feed.",
    summary:
      "A student mood tracker built at AI-THON2K25: daily check-ins, sentiment on what you write, streaks and badges, and trend charts — kept in the browser.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Recharts"],
    origin: "AI-THON2K25",
    created: "2025-09",
    links: { live: null, repo: `${GH}/Student-welness-program` },
    file: {
      what: "A daily check-in for students: pick a mood, write a line, and the dashboard turns it into streaks, badges and trends over the week — with a suggestion for what might help.",
      flow: {
        title: "A daily check-in",
        steps: [
          { label: "Check in", note: "Mood and a note" },
          { label: "Analyse", note: "Sentiment on the note" },
          { label: "Streak", note: "Badges for showing up" },
          { label: "Trends", note: "Line, donut and bar charts" },
        ],
      },
      inside: [
        { title: "Showing up, gamified", body: "Daily streaks and achievement badges reward the habit rather than the mood." },
        { title: "The week, charted", body: "Mood trends, distribution and sentiment over time in Recharts, plus a JSON export of your own data." },
        { title: "Light, dark, calm", body: "Dark and light themes, a collapsible sidebar, and a palette chosen to lower the temperature rather than raise it." },
      ],
      honest: [
        "Data lives in the browser's local storage — no account, no backend.",
        "Scaffolded with an AI app builder during the hackathon, then shaped for the demo.",
      ],
      stack: [
        { group: "App", items: ["React", "TypeScript", "Vite"] },
        { group: "UI", items: ["Tailwind CSS", "shadcn/ui", "Recharts"] },
      ],
      screens: [{ image: "images/work/wellness-01", caption: "The dashboard" }],
    },
  },
  {
    slug: "student-dashboard",
    number: "11",
    title: "Student Dashboard",
    titleLines: ["Student", "Dashboard"],
    kind: "web",
    featured: false,
    categories: ["Web", "Software"],
    status: "Prototype",
    year: "2026",
    role: null,
    category: "Campus ERP · Dashboards",
    tagline: "Attendance, marks and tests — one login, three roles.",
    summary: "A campus ERP front end: students see attendance, marks, resources and tests; staff run attendance, resources and tests; admins handle uploads and users.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Recharts"],
    created: "2026-04",
    links: { live: null, repo: `${GH}/Studentdashboard-v2` },
    file: {
      what: "One app, three dashboards. A student logs in to attendance, marks, resources and tests; a staff member to attendance, resources and tests; an admin to uploads and user management.",
      flow: {
        title: "Who sees what",
        steps: [
          { label: "Log in", note: "Pick a role" },
          { label: "Student", note: "Attendance, marks, resources, tests" },
          { label: "Staff", note: "Attendance, resources, tests" },
          { label: "Admin", note: "Uploads and users" },
        ],
      },
      inside: [
        { title: "Role-shaped layouts", body: "A shared dashboard shell — sidebar, top bar — with a route tree per role under /student, /staff and /admin." },
        { title: "Widgets that matter", body: "An attendance widget, marks cards, an announcements feed, a resource browser and a test interface." },
      ],
      honest: ["Sign-in is a demo: one mock user per role, with the session kept in local storage. No real student data."],
      stack: [{ group: "App", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Recharts"] }],
      screens: [{ image: "images/work/erp-01", caption: "The student view" }],
    },
  },
  {
    slug: "expense-tracker",
    number: "12",
    title: "Expense Tracker",
    titleLines: ["Expense", "Tracker"],
    kind: "web",
    featured: false,
    categories: ["Web"],
    status: "Experiment",
    year: "2026",
    role: null,
    category: "Web app · Personal finance",
    tagline: "Built three times. Each one taught the next.",
    summary:
      "Track income and expenses in rupees, see spending by category, set a savings goal and get a “spending personality”. Once in plain HTML and JavaScript, then twice more in React.",
    stack: ["HTML", "CSS", "JavaScript", "React", "Vite", "Recharts", "Tailwind CSS"],
    created: "2026-03",
    note: "Rebuilt twice.",
    links: { live: "https://supercalifragilisticexpialidociouscoder.github.io/ExpenseTrackerV2React/", repo: `${GH}/ExpenseTrackerV2React` },
    file: {
      what: "A small app with a long history. Version one is plain HTML, CSS and JavaScript. Then it was rebuilt in React with Tailwind — in a repo optimistically named “projectsbuiltwithmylastbraincells” — and again as a React + Recharts app deployed to GitHub Pages.",
      flow: {
        title: "Where the money went",
        steps: [
          { label: "Add", note: "Income or expense, with a category" },
          { label: "Balance", note: "Income, expenses, what's left" },
          { label: "Chart", note: "Spending by category" },
          { label: "Goal", note: "A savings target" },
          { label: "Personality", note: "Saver? Big spender?" },
        ],
      },
      inside: [
        { title: "Same app, three builds", body: "Vanilla JavaScript first, then React twice — the fastest way to feel what a framework actually buys you." },
        { title: "A verdict on your habits", body: "Spending against income becomes a label: Saver, Minimalist, Balanced, Risk Taker or Big Spender." },
      ],
      honest: ["Everything lives in your browser's local storage — close the tab, keep the data, no account."],
      stack: [
        { group: "v1", items: ["HTML", "CSS", "JavaScript"] },
        { group: "React builds", items: ["React", "Vite", "Tailwind CSS", "Recharts"] },
        { group: "Deploy", items: ["GitHub Pages"] },
      ],
      repos: [
        { label: "v1 — vanilla", href: `${GH}/ExpenseTrackerv1` },
        { label: "React + Tailwind", href: `${GH}/projectsbuiltwithmylastbraincells` },
        { label: "React + Recharts", href: `${GH}/ExpenseTrackerV2React` },
      ],
      screens: [{ image: "images/work/expense-01", caption: "The React build" }],
    },
  },
  {
    slug: "id-to-pdf",
    number: "13",
    title: "ID → PDF",
    titleLines: ["ID → PDF"],
    kind: "tool",
    featured: false,
    categories: ["Software"],
    status: "Experiment",
    year: "2026",
    role: null,
    category: "API · Document generation",
    tagline: "Type an ID. Get a PDF, with a QR code to prove it.",
    summary: "A FastAPI service that looks an employee up by ID and renders the record into a PDF — HTML template in, QR verification code stamped on — over SQLAlchemy and SQLite.",
    stack: ["Python", "FastAPI", "SQLAlchemy", "SQLite", "Jinja2", "xhtml2pdf", "qrcode"],
    created: "2026-05",
    links: { live: null, repo: `${GH}/Proj-id-to-pdf` },
    file: {
      what: "The small, useful kind of tool: give it an employee ID, it finds the record and hands back a PDF — rendered from an HTML template, with a QR code carrying the verification data.",
      flow: {
        title: "One request",
        steps: [
          { label: "ID", note: "GET /api/employees/{id}/pdf" },
          { label: "Lookup", note: "SQLAlchemy over SQLite" },
          { label: "Render", note: "Jinja2 HTML template" },
          { label: "Stamp", note: "QR code, base64-embedded" },
          { label: "PDF", note: "xhtml2pdf → download" },
        ],
      },
      inside: [
        { title: "A clean pipeline", body: "Lookup, template, QR, PDF — each a small function, returned as a download with the right headers." },
        { title: "Seeded for demos", body: "A seed script fills the database with mock employees so it works the moment it starts." },
      ],
      honest: ["Mock data only, and not deployed — built to learn the pipeline end to end."],
      stack: [
        { group: "API", items: ["Python", "FastAPI"] },
        { group: "Data", items: ["SQLAlchemy", "SQLite"] },
        { group: "Documents", items: ["Jinja2", "xhtml2pdf", "qrcode"] },
      ],
      screens: [{ image: "images/work/idpdf-01", caption: "A generated PDF" }],
    },
  },
  {
    slug: "abhiport",
    number: "00",
    title: "AbhiPort",
    titleLines: ["AbhiPort"],
    kind: "web",
    featured: true,
    featureRank: 8,
    categories: ["Web", "Creative", "Software"],
    status: "Active",
    year: "2026",
    role: "Design & build",
    category: "Project 00 \u00b7 This website",
    tagline: "You are standing inside project 08.",
    summary:
      "The site you're reading is the eighth project: an interface, a motion system and a content system, built so the portfolio argues for the engineering by being the engineering.",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "GSAP", "Lenis"],
    reel: { category: "Interface \u00b7 Motion", line: "The website you are currently inside." },
    created: "2026-09",
    links: { live: null, repo: `${GH}/AbhiPort` },
    note: "You are here.",
    file: {
      what: "Project 00 in the archive, project 08 in the film \u2014 the same build either way. Everything you have scrolled through is it: the boot count, the width-morphing type, the film you just came out of, the lab instruments, the archive, and this page describing itself.",
      flow: {
        title: "How a page arrives",
        steps: [
          { label: "Boot", note: "A counter gated on real readiness \u2014 fonts, critical media" },
          { label: "Reveal", note: "The hero rushes out through the last zero" },
          { label: "Scroll", note: "Lenis smooths it, ScrollTrigger scores it" },
          { label: "Route", note: "Prerendered, then transitioned \u2014 never reloaded" },
        ],
      },
      inside: [
        { title: "Type as a moving part", body: "Archivo is a variable font, and its width axis is treated as an animation channel rather than a style choice: the boot counter widens as it accelerates, the live row of the film stretches, and headings settle into their width instead of fading in." },
        { title: "Motion with a brake", body: "Every sequence is registered through a GSAP matchMedia gate, so prefers-reduced-motion isn't a disclaimer \u2014 it changes what gets built. Reduced motion gets the same information with the movement removed." },
        { title: "A content system that refuses to lie", body: "Every fact the site can't verify renders as a visible [ADD \u2026] marker instead of plausible filler. The placeholders you find are the system working: unknown stays unknown until Abhi says otherwise." },
        { title: "Static, on purpose", body: "Every page is prerendered at build time \u2014 the archive, the project pages, the lab, the rooms \u2014 so the heaviest thing on the wire is the typeface, not a framework waiting to fetch its own content." },
      ],
      honest: [
        "Some slots on this site are still placeholders. That is the system working, not a gap in it.",
        "One subsystem of this website isn't documented on this page.",
      ],
      stack: [
        { group: "Framework", items: ["Next.js 16 (App Router)", "TypeScript", "React 19"] },
        { group: "Style", items: ["Tailwind CSS 4", "Archivo variable", "Geist / Geist Mono"] },
        { group: "Motion", items: ["GSAP", "ScrollTrigger", "Lenis", "Canvas 2D"] },
      ],
      screens: [],
    },
  },
  {
    slug: "club-infin8",
    number: "14",
    title: "Club Infin8 Digital Ecosystem",
    titleLines: ["Club Infin8", "Digital", "Ecosystem"],
    kind: "community",
    featured: true,
    featureRank: 3,
    categories: ["Community", "Products", "Software"],
    status: "Active",
    year: null,
    role: "Founding member & Head",
    category: "Organisation \u00b7 8-club ecosystem",
    tagline: "Eight clubs. One umbrella. And the systems underneath.",
    summary:
      "A student-led ecosystem of eight clubs on a ~3,500-student campus, and the digital plumbing that keeps it running: registration, club selection, onboarding, member data and the events calendar. Founding member, and head across all eight.",
    stack: [],
    reel: { category: "Organisation \u00b7 Systems", line: "Eight clubs, ~200 members, ~3,500 students \u2014 and the systems under them." },
    href: "/club-infin8",
    links: { live: null, repo: null },
    note: "The people half lives at /club-infin8.",
  },
  {
    slug: "club-member-systems",
    number: "15",
    title: "Member systems",
    titleLines: ["Member systems"],
    kind: "product",
    featured: false,
    categories: ["Software", "Products", "Community"],
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
    slug: "astrosim",
    number: "16",
    title: "AstroSim",
    titleLines: ["AstroSim"],
    kind: "hackathon",
    featured: true,
    featureRank: 6,
    categories: ["Software", "Research"],
    status: "Hackathon",
    year: null,
    role: null,
    category: "SIH25142 \u00b7 Space technology",
    tagline: "Simulate it before you fly it.",
    summary: "A simulation concept for Smart India Hackathon problem statement SIH25142 \u2014 student innovation in space technology.",
    stack: [],
    stackTodo: "ADD WHAT ASTROSIM SIMULATES & THE STACK",
    reel: { category: "Simulation", line: "A space-technology concept, entered at SIH25142." },
    origin: "Smart India Hackathon \u00b7 SIH25142",
    links: { live: null, repo: null },
    file: {
      what: "AstroSim is Abhi's simulation concept for SIH25142, the space-technology problem statement. The idea is the part that exists publicly: model the system on the ground instead of finding out in orbit. The build is not public, so this page does not pretend otherwise.",
      flow: {
        title: "The concept",
        steps: [
          { label: "Problem", note: "SIH25142 \u00b7 student innovation in space technology" },
          { label: "Approach", note: "Simulate the system instead of guessing at it" },
          { label: "Status", note: "Concept taken into the hackathon round" },
        ],
      },
      inside: [
        { title: "Why simulation", body: "Space hardware is the least forgiving place to discover a mistake. A simulator moves the expensive failures onto a laptop, where they cost an afternoon instead of a launch." },
      ],
      honest: [
        "The working build isn't public \u2014 this page describes the concept entered, not a shipped simulator.",
        "No results, accuracy figures or orbital claims, because none have been published.",
      ],
      stack: [],
      screens: [],
    },
  },
  {
    slug: "motorcycle-safety",
    number: "17",
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
    href: "/lab/motorcycle-safety",
    links: { live: null, repo: null, video: null },
  },
  {
    slug: "the-lab",
    number: "18",
    title: "The lab — bench experiments",
    titleLines: ["The lab"],
    kind: "hardware",
    featured: false,
    categories: ["Hardware", "Experiments"],
    status: "Experiment",
    year: null,
    role: null,
    category: "Hardware · The bench",
    tagline: "Motion, distance, detection — poked at until they made sense.",
    summary: "Nine filed experiments with the parts on the bench: MPU6050, MPU9250, HC-SR04, VL53L0X and IR sensors on ESP32, Arduino and Raspberry Pi Pico boards — each with its own page.",
    stack: ["ESP32", "Arduino", "Raspberry Pi Pico", "MPU6050", "MPU9250", "HC-SR04", "VL53L0X", "IR"],
    href: "/lab",
    links: { live: null, repo: null },
  },
  {
    slug: "visual-work",
    number: "19",
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
  {
    slug: "first-web-pages",
    number: "20",
    title: "First web pages",
    titleLines: ["First web pages"],
    kind: "web",
    featured: false,
    categories: ["Web"],
    status: "Learning",
    year: "2025",
    role: null,
    category: "HTML · CSS · JavaScript",
    tagline: "Where it started: a calculator, then everything else.",
    summary: "A calculator (and one made following a tutorial — honesty), a card game, a digital clock, a quiz, a quote generator, a to-do list, a weather app and a typing-speed test.",
    stack: ["HTML", "CSS", "JavaScript"],
    created: "2025-08",
    links: { live: null, repo: `${GH}/Html-css-js` },
  },
  {
    slug: "ai-frontend-experiments",
    number: "21",
    title: "AI-assisted frontends",
    titleLines: ["AI-assisted", "frontends"],
    kind: "web",
    featured: false,
    categories: ["Web", "Experiments"],
    status: "Experiment",
    year: "2025",
    role: null,
    category: "Frontend experiments",
    tagline: "Seven single-page experiments. Built with AI, labelled as such.",
    summary: "Seven single-file frontend experiments, generated with AI help and poked at to see how far it goes. The repo description says it plainly: done using AI.",
    stack: ["HTML", "CSS", "JavaScript"],
    created: "2025-08",
    links: { live: null, repo: `${GH}/cool-frontend-projects` },
  },
  {
    slug: "plasmatherm",
    number: "22",
    title: "PlasmaTherm Technologies",
    titleLines: ["PlasmaTherm", "Technologies"],
    kind: "research",
    featured: true,
    featureRank: 2,
    categories: ["Products", "Research", "AI / ML"],
    status: null,
    year: null,
    role: "Co-founder",
    category: "Company \u00b7 Plasma gasification",
    tagline: "Waste, taken apart by plasma.",
    summary:
      "Plasma gasification for waste disposal \u2014 reactor and system design, research and simulation, with AI/ML detection, automation and data analysis around the process. Co-founded; the company's specifics stay with the company.",
    stack: [],
    stackTodo: "ADD THE TOOLS PLASMATHERM RUNS ON",
    reel: { category: "Company \u00b7 Plasma gasification", line: "Waste-disposal engineering: research, simulation, automation." },
    links: { live: null, repo: null },
    file: {
      what: "PlasmaTherm Technologies is a company Abhi co-founded, working on plasma gasification \u2014 using a plasma arc to break waste down into its constituent parts instead of burying it or burning it. The work runs across waste-disposal engineering, research and simulation, system design, AI/ML detection, automation and data analysis. It is not a course project or a hackathon weekend, which is why this page describes the engineering and stops where the company's own disclosure stops.",
      flow: {
        title: "Waste, taken apart",
        steps: [
          { label: "Feedstock", note: "Waste goes in" },
          { label: "Plasma reactor", note: "An arc breaks the material into its parts" },
          { label: "Outputs", note: "Syngas up, vitrified slag down" },
          { label: "The loop", note: "Simulation, detection, automation and analysis around it" },
        ],
      },
      inside: [
        {
          title: "Engineering, not an app",
          body: "The centre of this is physical: reactor and system design, and the waste-disposal engineering around a process that has to run safely and repeatably. Software serves the plant here, not the other way round.",
        },
        {
          title: "Research and simulation",
          body: "Design decisions get made against models first. Simulation and analysis are how you reason about something far too hot and too expensive to iterate on by trial.",
        },
        {
          title: "Detection and automation",
          body: "AI/ML-based detection and automation sit over the process, with the data analysis that turns a running system into something you can actually reason about rather than watch.",
        },
      ],
      honest: [
        "No yields, throughput, temperatures, efficiencies, customers, deployments or dates \u2014 the company hasn't published any, so neither has this page.",
        "The diagram here shows process stages only. It is a concept drawing, not measured data from a running plant.",
        "Abhi's role is co-founder.",
      ],
      stack: [],
      screens: [],
    },
  },
  {
    slug: "sandgate",
    number: "23",
    title: "Sandgate",
    titleLines: ["Sandgate"],
    kind: "product",
    featured: true,
    featureRank: 7,
    categories: [],
    status: null,
    year: null,
    role: null,
    category: "Build \u00b7 Private",
    tagline: "Private. Sealed.",
    summary: "One of Abhi's builds, kept private for now. No description, no stack, no claims \u2014 a sealed slot rather than a paragraph of invention.",
    stack: [],
    stackTodo: "ADD WHAT SANDGATE IS & THE STACK",
    reel: { category: "Private", line: "Sealed. Nothing invented behind the name." },
    links: { live: null, repo: null },
    file: {
      what: "Sandgate is one of Abhi's current builds, and it is private. That is the whole entry. Every other page on this site is built from a repository, a README or something Abhi confirmed; Sandgate has none of that published, so it holds its place in the work as a sealed slot instead of borrowing someone else's story.",
      flow: {
        title: "What is confirmed",
        steps: [
          { label: "Name", note: "Sandgate" },
          { label: "State", note: "Private" },
          { label: "Detail", note: "Sealed" },
        ],
      },
      inside: [
        {
          title: "Why the blank is deliberate",
          body: "A portfolio that fills its gaps with plausible copy teaches you to distrust the parts that are true. This slot stays shut until there is something real behind it \u2014 then it opens like every other project page here.",
        },
      ],
      honest: ["Nothing is claimed about what Sandgate does, because nothing has been published about it."],
      stack: [],
      screens: [],
    },
  },
];

/** The eight, in film order. */
export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => (a.featureRank ?? 99) - (b.featureRank ?? 99));
/** Full case studies. */
export const caseStudies = projects.filter((p) => p.study);
/** Everything with its own page at /work/[slug], in project order. */
export const projectPages = projects.filter((p) => p.study || p.file).sort((a, b) => a.number.localeCompare(b.number));

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Next project page in number order (wraps around). */
export function getNextProject(slug: string) {
  const list = projectPages;
  const i = list.findIndex((p) => p.slug === slug);
  return list[(i + 1) % list.length];
}

/** Where an entry lives: its own page, another page on the site, its code — or nowhere. */
export function projectHref(p: Project) {
  if (p.study || p.file) return `/work/${p.slug}`;
  return p.href ?? p.links.repo ?? null;
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
