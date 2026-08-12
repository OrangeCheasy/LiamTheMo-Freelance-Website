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

// TODO: set a real title once the business/display name is decided (CLAUDE.md §15).
export const metadata: Metadata = {
  title: "Under construction",
  description: "This site is being built. Check back soon.",
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
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-5 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-small focus:font-semibold focus:text-accent-ink"
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
