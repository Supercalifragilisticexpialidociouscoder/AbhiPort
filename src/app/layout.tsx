import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";
import { Navigation } from "@/components/Navigation";
import { Cursor } from "@/components/Cursor";

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
  return (
    <html
      lang="en"
      data-theme="ink"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Flags JS before first paint so reveal states never flash.
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="garage-grid" aria-hidden />
        <PageTransition>
          <Navigation />
          {children}
        </PageTransition>
        <SmoothScroll />
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
