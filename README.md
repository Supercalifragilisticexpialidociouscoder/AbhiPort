# ABHI / 26

The personal site of **Abhiram Reddy (Abhi)**, 18: a builder working across software, hardware, products, research and communities.

It's not a portfolio template. It's a body of work in progress, built so that two very different visitors both get what they need:

- **A recruiter who has 15 seconds.** Name, age and the strongest evidence, above the fold and in *The short version*.
- **An engineer who has 10 minutes.** Case studies, an "Under the hood" panel on every flagship, the build log and a filterable archive.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (every page is static)
npm run lint
```

Stack: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis.

---

## 1. Editing words

Everything written on the site lives in two files.

| File | What's in it |
| --- | --- |
| `src/content/site.ts` | Identity, links and CV, section numbering (`sections`), hero, *The short version*, *Who's Abhi*, Club Infin8 (`club`), community & certificates, hackathons (`races`), the hardware lab (`garage`, incl. the bench prototype), *How I build*, the build log, *Currently* / *Next*, *Off-track*, contact and the final screen |
| `src/content/projects.ts` | **Every project in one list.** `featured: true` puts it on the home-page track. Every entry appears in the archive. Entries with a `study` get a full case study at `/work/[slug]` |

**Adding a project** means adding one object to `projects`. Give it `categories` (the archive filters only show categories that have entries) and a `status`, which is one of `Shipped · Active · Prototype · Research · Experiment · Hackathon · Archived`. The archive, filters, counts, sitemap and OG images all update themselves.

**Adding real numbers:** each project takes an optional `metrics: [{ value, label }]`, which renders as a strip on its case study. Only use real numbers.

**Club Infin8 figures** (`club.stats` in `site.ts`) are editable. `prefix: "~"` marks approximate numbers.

**Software in real use — private by default.** Some of Abhi's applications are in daily use by real business owners. The site says exactly that and nothing more: no business names, industries, screenshots, data or internals. It appears in `hero`, `shortVersion.inUse` and `shortVersion.pillars` (the recruiter answer), `work.inUse` (the *From code to use* beat before the flagships, anchored at `/#in-use`), `archive.offList` (why the archive doesn't list them) and `finale.takeaway`. If a business ever agrees to be named, give it a normal entry in `projects.ts`.

### Placeholders: nothing unverified gets published

Anything unconfirmed is `null`, and renders as a visible dashed **[ADD …]** marker. When you launch with some facts still unknown, set `site.showPlaceholders = false` and unknown fields are quietly left out instead.

Things still waiting on real answers:

- `site.buildingSince`
- Per project: `year`, `role`, `links` (live / code / video), `study.next` (what you'd improve), plus each `resultTodo` and `qualityTodo`
- Secret Leak Detector, SIH1775 and AstroNexis: the actual stack and approach (`stackTodo`)
- `races.entries`: dates, TechFusion details and notes. Which problem statement won which round is optional, and stays off until you add it.
- `buildLog.sectors[*].year`
- `howIBuild.examples` → *This website* → Deployment (once it's live)
- *Off-track* caption for the *Creative* frame
- Optional rows that stay hidden until set: `site.links.instagram`, `now.testing` and `now.thinkingAbout`

## 2. Photos, video and the CV

Images are referenced by **base path without an extension**. Drop a file into `/public` with any of `.avif .webp .jpg .jpeg .png` (or `.mp4 .webm` for video) and it replaces the placeholder frame at the next build or dev refresh. There's no code to change.

| Drop this file | Where it shows | Shape |
| --- | --- | --- |
| `public/cv/abhiram-reddy-cv.pdf` | Switches on every "Download CV" link: nav, short version, contact, footer | PDF |
| `public/images/abhi-hero.webp` *(in place)* | Hero. A cut-out on transparency stands bottom-centre on the dark stage; the opening crop beside REDDY centres on the face (`hero.focus`). For a regular full-bleed photo or `.mp4`, set `hero.cutout = false` | Transparent PNG/WebP, about 9:10 |
| `public/images/abhi-portrait.jpg` | *Who's Abhi?* | 4:5 |
| `public/images/work/{infin8,sld,certus}-cover.jpg` | Featured spreads and case-study covers | Landscape |
| `public/images/work/{infin8,sld,certus}-0{1,2,3}.jpg` | Case-study screens and figures | `-01` is 16:9; the others 4:3 |
| `public/images/club/infin8-cover.jpg` | Club Infin8 page cover | Landscape |
| `public/images/club/infin8-0{1,2,3}.jpg` | Club Infin8 "In pictures" | 4:5 |
| `public/images/beyond/{video,3d,hardware,design,events,community,motorcycles,creative}.jpg` | *Off-track* film strip | 3:2 |

Until a cover exists, each flagship shows a **signature diagram** built from real facts about the project: the approval chain, the commit gate, and the trust figure. They're labelled as illustrations, never passed off as screenshots.

## 3. SEO & deploy

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

## 4. How it's built

```
src/
  app/                    layout (fonts, metadata, boot decision), home, /work/[slug], /club-infin8, 404, OG/icons/robots/sitemap
  content/                site.ts · projects.ts   ← edit these
  components/
    Preloader.tsx         the 000 → 100 boot sequence (see below)
    Navigation.tsx        wordmark · live chapter indicator · six chapters · CV · full-screen mobile menu
    Hero.tsx              name fitted to the viewport with Archivo's width axis; the cut-out portrait's frame opens on scroll
    ShortVersion.tsx      the recruiter layer: 18 · 2× SIH · Club Infin8 scale · software in daily use · six pillars · every link
    About.tsx             Who's Abhi?
    Statement.tsx         "This is a ~~portfolio~~ work in progress."
    Projects.tsx          From code to use, then the flagships — pinned horizontal track (desktop), swipeable cards (mobile)
    ProjectCard.tsx       one flagship spread
    Community.tsx         Club Infin8: scale, the 8-club ecosystem (the 8 turns into ∞), people × systems, learning
    Hackathons.tsx        Race weekends: the credential, the lap, SIH problem statements, timing sheet
    Lab.tsx               The Garage: IMU trace, parts bin, bench prototype with the lean-angle dial
    HowIBuild.tsx         the shared skeleton with real choices, principles, the grouped stack
    Timeline.tsx          Build log
    Archive.tsx           every project, filterable, with status chips and expandable rows
    CurrentlyBuilding.tsx the signal-red board + Next
    BeyondCode.tsx        Off-track film strip
    Contact.tsx · Footer.tsx (the STILL BUILDING final screen)
    ProjectCaseStudy.tsx  problem → idea → build → hard part → result → next → under the hood → screens
    ClubCaseStudy.tsx     the Club Infin8 story
    case/                 CaseHero, CaseSection, UnderTheHood (tabbed engine bay), diagrams
    visuals/              project signatures, Ecosystem, LeanDial, ImuScope, PartGlyph
    ui/                   Media, Ph ([ADD …]), StatusChip, CountUp, Reveal, Magnetic, SectionHead, Clock
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
- **How it counts.** 000 → 100 in about 0.9s once everything is ready, stretching along Archivo's width axis as it fills. Without the essentials it can lead but can't finish; on a slow connection it keeps creeping instead of freezing, and after 6s it stops waiting and goes. A timer guarantees the page arrives even if animation frames stall (a background tab), and a failsafe in the head script lets the page through if the preloader never starts at all.
- **The exit.** The number snaps back to condensed and folds into the red seam line, the screen splits open along it, and the hero's intro, the nav and then the custom cursor follow. Anything that animates on arrival waits for `boot:reveal` (`src/lib/boot.ts`); scrolling and the cursor wait for `boot:done`.
- **Who sees what.** The head script in `layout.tsx` decides before first paint. First visit: the full sequence. Returning visitor in a new session: a short one (about 0.55s of counting). Reduced motion: numbers only, then a fade. A reload in the same session: nothing. Click, tap, Enter, Space or Esc hurries it, but it still waits for the essentials.

**Accessibility.**

- Semantic landmarks and a skip link.
- Real buttons and links throughout, with visible focus.
- Keyboard focus drives the horizontal track.
- Proper tab patterns in the parts bin and Under the hood.
- A focus-trapped menu dialog.
- Screen-reader text for every animated headline.
- `prefers-reduced-motion` turns the boot sequence into a plain count and removes pinning, smoothing and scrubbing. Sections stack.
- The custom cursor only appears for fine pointers.
