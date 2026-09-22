# ABHI / 26

The personal site of **Abhiram Reddy (Abhi)**, a builder working across software, hardware, products and research.

It's not a portfolio template. It's a logbook: giant type, one signal colour, a page that changes surface as you move through it, and case studies generated from a single content file.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are static)
npm run lint
```

Stack: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis.

---

## 1. Editing words

Everything written on the site lives in two files:

| File | What's in it |
| --- | --- |
| `src/content/site.ts` | Name, links, hero, *Who's Abhi*, statement, garage parts & spec sheet, hackathons, timeline, *Currently*, *Off-track*, contact |
| `src/content/projects.ts` | The four projects. Each entry powers both the home-page spread **and** its full case study at `/work/[slug]` |

**Add a project** by adding an object to `projects`. The home track, the case-study page, the sitemap and the OG image all pick it up automatically.

### Placeholders: nothing unverified gets published

Any fact that isn't confirmed is `null`, and renders as a visible dashed **[ADD …]** marker: years, roles, hackathon results, email, links and so on. Fill the value in and the marker disappears.

When you're ready to launch with some facts still unknown, set `site.showPlaceholders = false` in `site.ts`. Unknown fields are then quietly left out instead of marked.

Things to fill in first:

- `site.buildingSince`
- `projects[*].year / role / status / links`, plus each `study.outcomeTodo`
- `races.entries[*].date / result / notes`
- `timeline.sectors[*].year`
- Captions for the *Motorcycles* and *Creative* frames in `beyond.frames` (or delete those frames)

## 2. Adding photos and video

Images are referenced by **base path without an extension**. Drop a file into `/public` with any of `.avif .webp .jpg .jpeg .png` (or `.mp4 .webm` for video) and it replaces the placeholder frame at the next build or dev refresh. There's no code to change.

| Drop this file | Where it shows | Shape |
| --- | --- | --- |
| `public/images/abhi-hero.jpg` *(or `.mp4`)* | Hero: starts as a tight crop beside REDDY, then opens to full screen on scroll | Any; keep the subject near the centre |
| `public/images/abhi-portrait.jpg` | *Who's Abhi?* | 4:5 portrait |
| `public/images/work/infin8-cover.jpg` | Infin8 spread + case-study cover | Landscape (shows at ~16:10 and 21:9) |
| `public/images/work/sre-cover.jpg` | Sri Ram Enterprises | ″ |
| `public/images/work/sld-cover.jpg` | Secret Leak Detector | ″ |
| `public/images/work/certus-cover.jpg` | CERTUS-S2 | ″ |
| `public/images/work/{infin8,sre,sld,certus}-0{1,2,3}.jpg` | Case-study screens / figures | `-01` is 16:9, `-02`/`-03` are 4:3 |
| `public/images/beyond/{video,3d,hardware,design,events,community,motorcycles,creative}.jpg` | *Off-track* film strip | 3:2 |

Until a cover exists, each project spread shows its **signature diagram**: the approval chain, the module map, the commit gate or the trust figure. Each one is built from real facts about the project and labelled as an illustration, never passed off as a screenshot.

Images go through `next/image` (AVIF/WebP, responsive sizes, lazy-loaded below the fold). Hero video autoplays muted and pauses for reduced-motion users.

## 3. SEO & deploy

Set the production URL so canonical links, the sitemap and OG tags are absolute:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

On Vercel this falls back to `VERCEL_PROJECT_PRODUCTION_URL` automatically. You get the following for free:

- metadata
- Open Graph and Twitter cards, generated per page with the site's own type (`opengraph-image.tsx`)
- `robots.txt`, `sitemap.xml`, the web manifest and the favicon/apple icon
- JSON-LD `Person` data on the home page

## 4. How it's built

```
src/
  app/                  layout (fonts, metadata), home, /work/[slug], 404 "DNF", OG/icons/robots/sitemap
  content/              site.ts · projects.ts   ← edit these
  components/
    Navigation.tsx      wordmark · live section "lap" indicator · local time · full-screen mobile menu
    Hero.tsx            name fitted to the viewport with Archivo's width axis; frame opens on scroll
    About.tsx           Who's Abhi? — lead text that brightens as you read
    Statement.tsx       "This is a ~~portfolio~~ logbook." (pinned, scrubbed)
    Projects.tsx        pinned horizontal track of editorial spreads (desktop), stacked (mobile)
    ProjectCard.tsx     one spread
    ProjectCaseStudy.tsx + case/   the generated case-study page
    Lab.tsx             The Garage — telemetry mode, live IMU trace, parts bin, spec sheet
    Hackathons.tsx      Race weekends — timing sheet + session clock
    Timeline.tsx        The line so far — horizontal racing line (desktop), vertical (mobile)
    CurrentlyBuilding.tsx  the signal-red pit board
    BeyondCode.tsx      Off-track — draggable contact sheet on a film strip
    Contact.tsx · Footer.tsx
    Cursor.tsx · PageTransition.tsx · SmoothScroll.tsx · ScrollDirector.tsx
    visuals/            project signatures, part glyphs, the IMU scope
    ui/                 Media (auto image/placeholder), Ph ([ADD …]), Reveal, Magnetic, SectionHead, Clock
```

**Design system.** Colours are CSS custom properties (`--bg --fg --muted --line --accent`) in `globals.css`, with four surfaces: `ink`, `paper`, `garage` and `ir`. Each section declares `data-theme`, and `ScrollDirector` hands it to `<html>`. The properties are registered with `@property`, so the whole page interpolates between surfaces instead of cutting. Type is Archivo (variable weight and width) for display, Geist for text and Geist Mono for metadata.

**Motion rules.**

- **Level 1:** hero, pinned sections, page wipes.
- **Level 2:** section reveals, counters, the split-flap board.
- **Level 3:** hover, magnetic buttons, the cursor.

Everything animates transforms, opacity or clip-path. Continuous effects (the IMU scope, the session clock) only run while they're on screen.

**Accessibility.**

- Semantic landmarks and a skip link.
- Real buttons and links throughout, with visible focus rings.
- Keyboard focus drives the horizontal work track.
- The menu dialog traps focus and closes on Esc.
- Every animated headline has a readable text alternative.
- `prefers-reduced-motion` removes pinning, smoothing, scrubbing and transitions. Sections stack, and all content stays reachable.
- The custom cursor only appears for fine pointers.
