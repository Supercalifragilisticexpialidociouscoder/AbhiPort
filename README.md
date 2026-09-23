# ABHI / 26

The personal site of **Abhiram Reddy (Abhi)**, 18: a builder working across software, hardware, products, research and communities.

It's not a portfolio template. It's a body of work in progress, built so that two very different visitors both get what they need:

- **A recruiter who has 15 seconds.** Name, age and the strongest evidence, above the fold and in *The short version*.
- **An engineer who has 10 minutes.** Case studies, an "Under the hood" panel on every flagship, the build log and a filterable archive.

**The Work film** (section 04) is the spine of the home page: eight projects, eight scenes, one pinned viewport. Each scene carries a *world* — a diagram built from what that project actually does, in `src/components/work/worlds/`, keyed by slug and reused as the project page's own visual. Scrolling cuts between scenes (hold → wipe → hold), the strip along the bottom and the ← → keys jump between them, and a line mid-cut names what one project has to do with the next. Below 1024px, or under reduced motion, the same eight scenes simply stack and stay still.

Changing the eight, or their order, is two fields in `projects.ts` — `featured` and `featureRank`. A project without a world still works; it just shows its signature diagram instead.

The home page is the front door; behind it are the rooms — each one a page of its own:

| Room | What's there |
| --- | --- |
| `/archive` | Every project, filterable and searchable. Deep-linkable: `/archive?cat=security&q=python` |
| `/work/[slug]` | A full case study (`study`) or a lighter project file (`file`) for every project with a page |
| `/lab`, `/lab/[slug]` | The Garage's rooms: the motorcycle safety prototype and nine bench experiments, each with its own simulated instrument |
| `/club-infin8` | The Club Infin8 story |
| `/community` | Hackathons (and the 2× SIH story, told once), events, workshops, learning, photographs |
| `/credentials` | Certificates and awards — title, issuer, date, type, verify / original only where they exist |
| `/experience` | Roles, then a timeline of builds dated by their first commit |

The nav's top-right **race time** is real: how long you've been on the site this visit. The head script stamps the start before first paint (sessionStorage — it survives reloads, resets on a fresh visit), and one requestAnimationFrame loop writes it straight to the DOM.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (every page is static)
npm run lint
```

Stack: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis.

---

## 1. Editing words

Everything written on the site lives in four files.

| File | What's in it |
| --- | --- |
| `src/content/site.ts` | Identity, links and CV, section numbering (`sections`), the Index map (`indexLinks`), hero, Quick look, *The short version*, *Who's Abhi*, the Work intro, Club Infin8 (`club`), hackathons (`races`), the Garage (`garage`), *How I build* (the loop, and the stack told through projects), the build log, the archive door, *Currently* / *Next*, *Off-track*, contact and the final screen |
| `src/content/projects.ts` | **Every project in one list.** `featured: true` + `featureRank: 1–8` puts it in the home page's Work film, in that order. Every entry appears in `/archive`. A `study` gets a full case study at `/work/[slug]`; a `file` gets a lighter project page there |
| `src/content/lab.ts` | The lab: one prototype and the experiments. Explanations of how a part works are general; `known` is only what's confirmed about the actual build |
| `src/content/community.ts` | `/community` (the SIH story, hackathons, events, workshops, learning), `/credentials` and `/experience` (roles) |

Project data comes from Abhi's own words plus his **public** GitHub repositories — READMEs and code, never invented. Private repositories are never listed.

**Adding a project** means adding one object to `projects`. Give it `categories` (the archive filters only show categories that have entries) and a `status`, which is one of `Shipped · Active · Prototype · Research · Experiment · Hackathon · Learning · Archived`. The archive, filters, counts, sitemap and OG images all update themselves.

**Adding real numbers:** each project takes an optional `metrics: [{ value, label }]`, which renders as a strip on its case study. Only use real numbers.

**Club Infin8 figures** (`club.stats` in `site.ts`) are editable. `prefix: "~"` marks approximate numbers.

**Software in real use — private by default.** Some of Abhi's applications are in daily use by real business owners. The site says exactly that and nothing more: no business names, industries, screenshots, data or internals. It appears in `hero`, `shortVersion.inUse` and `shortVersion.pillars` (the recruiter answer), `work.inUse` (the one classified row in the build index), `quickLook.inUse`, `archive.offList` (why the archive doesn't list them) and `finale.takeaway`. If a business ever agrees to be named, give it a normal entry in `projects.ts`.

### Placeholders: nothing unverified gets published

Anything unconfirmed is `null`, and renders as a visible dashed **[ADD …]** marker. When you launch with some facts still unknown, set `site.showPlaceholders = false` and unknown fields are quietly left out instead.

Things still waiting on real answers:

- `site.buildingSince`
- Per project: `year`, `role`, `links` (live / code / video), `study.next` (what you'd improve), plus each `resultTodo` and `qualityTodo`
- PlasmaTherm Technologies: everything except the name and Abhi's role — the page is deliberately thin until the company publishes
- Sandgate: what it is, the stack, and whether there's a repo to link
- AstroSim: what it simulates and the stack (`stackTodo`)
- `/community`: dates, results and notes for each event (`hackathons`, `events`, `workshops` in `community.ts`), and which SIH statements won
- `/credentials`: dates, types, credential IDs and verification links — never invented
- `/experience`: dates for each role (`roles[*].when`)
- The lab (`lab.ts`): photos, wiring, code and test notes for each build (`todo`)
- `races.entries`: dates, TechFusion details and notes. Which problem statement won which round is optional, and stays off until you add it.
- `buildLog.sectors[*].year`
- `howIBuild.examples` → *This website* → Deployment (once it's live)
- *Off-track* caption for the *Creative* frame
- Optional rows that stay hidden until set: `site.links.instagram`, `now.testing` and `now.thinkingAbout`

## 2. Photos, video and the CV

Images are referenced by **base path without an extension**. Drop a file into `/public` with any of `.avif .webp .jpg .jpeg .png` (or `.mp4 .webm` for video) and it replaces the placeholder frame at the next build or dev refresh. There's no code to change.

| Drop this file | Where it shows | Shape |
| --- | --- | --- |
| `public/cv/abhiram-reddy-cv.pdf` | Switches on every "Download CV" link: Index, Quick look, short version, contact, footer | PDF |
| `public/images/abhi-hero.webp` *(in place)* | Hero. A cut-out on transparency stands bottom-centre on the dark stage, in front of the ABHI word; the Index preview reuses it. For a regular full-bleed photo or `.mp4`, set `hero.cutout = false` | Transparent PNG/WebP, about 9:10 |
| `public/images/abhi-portrait.jpg` | *Who's Abhi?* | 4:5 |
| `public/images/work/{infin8,sld,certus}-cover.jpg` | Case-study covers | Landscape |
| `public/images/work/{infin8,sld,certus,calendar}-0{1,2,3}.jpg` | Case-study screens and figures | `-01` is 16:9; the others 4:3 |
| `public/images/work/{socialguard,grit,terramatch,hakit,career,wellness,erp,expense,idpdf}-0{1,2}.jpg` | Project-file screens (the first one is also the page's cover) | 16:9, then 4:3 |
| `public/images/lab/*.jpg` | Lab evidence — each entry in `lab.ts` lists its `media` paths | 16:9 / 4:3 |
| `public/images/community/*.jpg` | Event and hackathon photographs — each entry lists its `photo` path | 4:3 |
| `public/images/credentials/*.jpg` | Certificate scans | 4:3 |
| `public/certificates/*.pdf` | "Original (PDF)" links on `/credentials` — only shown once the file exists | PDF |
| `public/images/club/infin8-cover.jpg` | Club Infin8 page cover | Landscape |
| `public/images/club/infin8-0{1,2,3}.jpg` | Club Infin8 "In pictures" | 4:5 |
| `public/images/beyond/{video,3d,hardware,design,events,community,motorcycles,creative}.jpg` | *Off-track* film strip | 3:2 |

Each project with a `visual` has a **signature diagram** built from real facts about it: the approval chain, the commit gate, the trust figure, a labelled post feed, a readiness calendar, a mentor panel, risk-queue corridors and a room scan. They're labelled as illustrations, never passed off as screenshots.

## 3. Space Mode

Press <kbd>S</kbd> on a desktop and a small craft drops into the page. Arrows or WASD fly it — thrust, brake, steer, with real inertia — `ENTER` at a waypoint goes there, and `ESC` puts it away exactly where you left off. The waypoints are the page's own sections (the HUD points at the nearest one when none is in range), and flying past the top or bottom scrolls the document, so the film keeps cutting underneath you.

It is an easter egg, so the site never advertises it: the only hint is an unlabelled `S ?` in the Index panel, and one line on `/work/abhiport`. It costs a single keydown listener until someone presses the key — the engine (`src/components/space/SpaceMode.tsx`) is imported on demand, and never at all on a phone or any coarse pointer. Under `prefers-reduced-motion` it still opens, but flies calmer: no trail, lower top speed, no coasting.

## 4. SEO & deploy

Set the production URL so canonical links, the sitemap and OG tags are absolute:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

On Vercel this falls back to `VERCEL_PROJECT_PRODUCTION_URL` automatically. Built in:

- metadata
- per-page OG and Twitter cards rendered in the site's own type
- `robots.txt` and `sitemap.xml`
- the web manifest and icons
- JSON-LD `Person` data: award, organisation and profiles

## 5. How it's built

```
src/
  app/                    layout (fonts, metadata, boot decision, race clock), home, /archive, /work/[slug], /lab, /lab/[slug], /club-infin8, /community, /credentials, /experience, 404, OG/icons/robots/sitemap
  content/                site.ts · projects.ts   ← edit these
  components/
    Preloader.tsx         the 000 → 100 boot sequence (see below)
    Navigation.tsx        wordmark · chapter, phase (Build / Break / Rebuild) and progress · Quick look · the Index (every chapter with a preview)
    QuickLook.tsx         the 30-second version in a drawer: role, facts, flagships, stack, CV and links (Q)
    Hero.tsx              the elastic ABHI word behind the cut-out portrait; the word parts like curtains on scroll
    ShortVersion.tsx      the recruiter layer: 18 · 2× SIH · Club Infin8 scale · software in daily use · six pillars · every link
    About.tsx             Who's Abhi?
    Statement.tsx         "This is a ~~portfolio~~ work in progress."
    work/WorkFilm.tsx     the film: eight scenes, one pinned viewport, cut by scroll (desktop); the same eight stacked (mobile, reduced motion)
    work/worlds/          one world per featured project — the diagram each scene runs, reused on its project page
    Community.tsx         Club Infin8: scale, the 8-club ecosystem (the 8 turns into ∞), people × systems — then the door to /community
    Hackathons.tsx        Race weekends: the race clock, the lap, SIH problem statements, timing sheet — then the door to /community
    Lab.tsx               The Garage: IMU trace, parts bin, and the lab index — a door to every build
    HowIBuild.tsx         the shared skeleton with real choices, the loop, principles, and the stack told through projects
    Timeline.tsx          Build log
    Archive.tsx           the door to /archive: a ticker of everything filed, counts, the way in
    space/                Space Mode — one listener, and an engine that only loads if S is pressed
    archive/              ArchiveIndex — filters, search, sort, expandable rows, record card
    lab/                  LabIndex, LabHero, LabPage (the prototype's long-form build, experiments), LabVisuals (ten instruments)
    room/                 RoomHero — the opening of every room
    ProjectFile.tsx       the lighter project page: what it is, how it works, what's inside, the honest bit
    CurrentlyBuilding.tsx the signal-red board + Next
    BeyondCode.tsx        Off-track film strip
    Contact.tsx · Footer.tsx (the STILL BUILDING final screen)
    ProjectCaseStudy.tsx  problem → idea → build → hard part → result → next → under the hood → screens
    ClubCaseStudy.tsx     the Club Infin8 story
    case/                 CaseHero, CaseSection, UnderTheHood (tabbed engine bay), diagrams
    visuals/              project signatures, Ecosystem, LeanDial, ImuScope, PartGlyph
    ui/                   Media, Ph ([ADD …]), StatusChip, CountUp, Reveal, Magnetic, SectionHead, Clock, ElasticWord (letters widen under the pointer)
    Cursor.tsx · PageTransition.tsx · SmoothScroll.tsx · ScrollDirector.tsx
```

**Design system.** Colours are CSS custom properties (`--bg --fg --muted --line --accent`) in `globals.css`. There are four surfaces: `ink`, `paper`, `garage` (telemetry grid, crosshair cursor, velocity readout) and `ir`. Each section declares `data-theme`, and `ScrollDirector` hands the active one to `<html>` based on scroll position. The properties are registered with `@property`, so the whole page interpolates between surfaces. Type is Archivo (variable weight and width) for display, Geist for text and Geist Mono for metadata.

**Motion.**

- **Level 1:** the boot sequence, hero, pinned tracks, page wipes.
- **Level 2:** reveals, counters, the split-flap board.
- **Level 3:** hover, magnetic buttons, the cursor.

Everything animates transforms, opacity or clip-path. Continuous effects (the IMU scope, the session clock) only run while visible. When content changes height (archive filters, accordions, tabs), triggers re-measure automatically.

**The boot sequence.** `Preloader.tsx` is the site's opening title, not a separate screen:

- **What it waits for.** Only what the first screen needs: the type (`document.fonts`), any media marked critical (every `Media` with `eager`, meaning the hero portrait) and the hero's fitted layout (`hero:ready`). Nothing below the fold. The live checklist (*Type · Media · Layout*) shows exactly that.
- **How it counts.** 000 → 100 in about a second once everything is ready, stretching along Archivo's width axis as it fills. The number leans into its own speed and kicks through three gear shifts (25, 50, 75) while tach ticks climb the seam; from about 86 it shakes against the limiter and the redline ticks blink. Without the essentials it can lead but can't finish; on a slow connection it keeps creeping instead of freezing, and after 6s it stops waiting and goes. A timer guarantees the page arrives even if animation frames stall (a background tab), and a failsafe in the head script lets the page through if the preloader never starts at all.
- **The exit.** Impact: at 100 the last zero turns signal red, heat blooms behind it, the redline flashes and the frame shakes. Then the dive: the camera plunges through that zero, its counter opens into a window onto the page, and the hero scene rushes up from the exact point you're diving into as the letters burst in. The nav and then the custom cursor follow. Anything that animates on arrival waits for `boot:reveal` (`src/lib/boot.ts`); scrolling and the cursor wait for `boot:done`.
- **Who sees what.** The head script in `layout.tsx` decides before first paint. First visit: the full sequence. Returning visitor in a new session: a short one (about 0.55s of counting). Reduced motion: numbers only, then a fade. A reload in the same session: nothing. Click, tap, Enter, Space or Esc hurries it, but it still waits for the essentials.

**Accessibility.**

- Semantic landmarks and a skip link.
- Real buttons and links throughout, with visible focus.
- Keyboard focus drives the horizontal track.
- Proper tab patterns in the parts bin and Under the hood.
- Focus-trapped Index and Quick look dialogs (Esc closes, focus returns), with single-key shortcuts: I and Q.
- Screen-reader text for every animated headline.
- `prefers-reduced-motion` turns the boot sequence into a plain count and removes pinning, smoothing and scrubbing. Sections stack.
- The custom cursor only appears for fine pointers.
