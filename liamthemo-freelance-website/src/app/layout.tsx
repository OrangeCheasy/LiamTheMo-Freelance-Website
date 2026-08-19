import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Both are variable fonts, so no `weight` is given — one file covers the whole
// range. next/font self-hosts them, so the browser makes no request to Google.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

// Fallback for any page without its own metadata export — every real page in
// the site sets one (CLAUDE.md §11), so this rarely surfaces in practice.
export const metadata: Metadata = {
  // Required for Next.js to resolve the auto-generated opengraph-image.tsx
  // routes (and any other relative metadata URL) into absolute ones. Without
  // it, Next falls back to localhost, which is what every og:image URL would
  // read at build time. Same domain used in sitemap.ts and robots.ts.
  metadataBase: new URL("https://liamthemo.com"),
  title: "LiamTheMo",
  description:
    "Custom automation, spreadsheets, websites, and local tech help for individuals and small businesses.",
  // No `icons` entry on purpose. The real mark now lives at src/app/icon.svg
  // and src/app/favicon.ico, both generated from the owner's artwork (see
  // Logo.tsx), and Next's file convention picks those up and emits the right
  // <link> tags on its own. Declaring `icons` here would only re-point at the
  // deleted public/icon.svg placeholder — a pink rounded square with a serif
  // "L", which is what the browser tab was showing.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/*
          First focusable element on the page. Invisible until focused, then it
          appears above the sticky header (CLAUDE.md §11).
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-5 focus:z-[60] focus:rounded-lg focus:border focus:border-accent focus:bg-accent focus:px-4 focus:py-2 focus:text-small focus:font-semibold focus:text-bg"
        >
          Skip to content
        </a>
        <Navbar />
        {/* scroll-mt clears the sticky header when the skip link jumps here. */}
        <main id="main-content" className="flex-1 scroll-mt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
