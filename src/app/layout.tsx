import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { hero, site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";
import { Navigation } from "@/components/Navigation";
import { SpaceKey } from "@/components/space/SpaceKey";
import { Cursor } from "@/components/Cursor";
import { Preloader } from "@/components/Preloader";
import { QuickLook } from "@/components/QuickLook";
import { publicFile, resolveAsset } from "@/lib/assets";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.seo.title,
    template: `%s — ${site.name}`,
  },
  description: site.seo.description,
  applicationName: `${site.short} / ${site.edition}`,
  authors: [{ name: site.fullName }],
  creator: site.fullName,
  keywords: [
    "Abhiram Reddy",
    "Abhiram Reddy Palle",
    "Abhi",
    "software engineer",
    "full-stack developer",
    "creative technologist",
    "hardware prototyping",
    "ESP32",
    "Next.js",
    "Cloudflare Workers",
    "India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const cvHref = publicFile(site.cv);
  const heroSrc = hero.cutout ? (resolveAsset(hero.image)?.url ?? null) : null;
  return (
    <html
      lang="en"
      data-theme="ink"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Before first paint: flag JS (so reveal states never flash) and decide
          // whether the boot sequence runs, and how: the full count on a first
          // visit, a short one for returning visitors, numbers only for reduced
          // motion, nothing on a reload in the same session. While it runs,
          // scroll input is swallowed here (wheel before Lenis sees it, touch,
          // scroll keys) instead of toggling overflow, which would drop the
          // scrollbar and shift the page when it comes back. If the preloader
          // never takes over (a script failed), the failsafe lets the page through.
          // It also starts the race clock: your time on the site, from this moment.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');try{sessionStorage.getItem('abhi-race-start')||sessionStorage.setItem('abhi-race-start',String(Date.now()));if(!sessionStorage.getItem('abhi-booted')){d.dataset.boot=matchMedia('(prefers-reduced-motion: reduce)').matches?'still':localStorage.getItem('abhi-visited')?'short':'full';d.dataset.loading='1';var k={' ':1,PageUp:1,PageDown:1,Home:1,End:1,ArrowUp:1,ArrowDown:1},o={passive:false,capture:true},l=function(e){if(!d.dataset.loading||(e.type==='keydown'&&!k[e.key]))return;e.preventDefault();e.type==='wheel'&&e.stopImmediatePropagation()};['wheel','touchmove','keydown'].forEach(function(t){addEventListener(t,l,o)});window.__bootUnlock=function(){['wheel','touchmove','keydown'].forEach(function(t){removeEventListener(t,l,o)})};setTimeout(function(){if(d.dataset.loading&&!window.__bootLive){delete d.dataset.loading;delete d.dataset.boot;window.__bootUnlock()}},8000)}}catch(e){}})()",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="garage-grid" aria-hidden />
        <Preloader />
        <PageTransition>
          <Navigation cvHref={cvHref} heroSrc={heroSrc} />
          {children}
          {/* One listener. The rest arrives only if someone presses S. */}
          <SpaceKey />
        </PageTransition>
        <SmoothScroll />
        <Cursor />
        <QuickLook cvHref={cvHref} />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
