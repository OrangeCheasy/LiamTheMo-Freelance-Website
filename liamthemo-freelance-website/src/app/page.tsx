import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import FeaturedWork from "@/components/FeaturedWork";
import HeroArt from "@/components/HeroArt";
import ServiceTriage from "@/components/ServiceTriage";
import { projects } from "@/data/projects";

/*
  Home. Fully static — nothing on this page reads cookies(), headers(),
  searchParams or an uncached fetch, so it prerenders at build time and is served
  from the assets binding without invoking the Worker (CLAUDE.md §4.1).

  The `?topic=unsure` on the triage widget's last option does NOT change that.
  A query string in an href is inert markup; it only costs anything if the page
  receiving it reads searchParams on the server.

  It does cost something one hop over: /contact reads `?topic=` server-side to
  prefill the form (§7), which makes that one page dynamically rendered rather
  than static. That was a deliberate call, not an oversight — see the note at
  the top of src/app/contact/page.tsx for why.
*/

export const metadata: Metadata = {
  title: "I build tools that save you time",
  description:
    "Custom automation, spreadsheets, websites, and local tech help for individuals and small businesses. Tell me the problem and I'll quote the work.",
  openGraph: {
    type: "website",
    title: "I build tools that save you time",
    description:
      "Custom automation, spreadsheets, websites, and local tech help for individuals and small businesses.",
  },
  // Still noindex, but for a THIRD reason now — the previous two (placeholder
  // content, then 404ing triage destinations) are both resolved: services,
  // portfolio and about all have real content.
  //
  // What is not yet true: the quote form (§8) is built, validated, and now
  // has the Discord webhook secret set, but still needs a WAF rate-limiting
  // rule and a real end-to-end test before it's operationally live (see
  // TODO.md). Indexing a homepage
  // whose entire funnel dead-ends is worse than staying invisible a bit
  // longer. Remove this once the form is confirmed working in production —
  // that naturally lines up with step 8's custom domain attach, so search
  // engines index the real domain rather than the workers.dev one.
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        {/*
          Dot grid — graph paper, which is the "precision, technical, tidy" end
          of §9's brief and pointedly not the "gradient blob" anti-goal. Built
          from a token, so it recolours with the theme and weighs nothing: it is
          a CSS gradient, not an asset, so it costs no request at all.

          The mask fades it out before it reaches the copy, so text never sits on
          top of competing texture.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        />

        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <div>
              {/*
                Owner call, overriding §11's "outcome work" reading of this
                exact line: ships as the mockup's literal words. The triage
                widget directly below is what actually does the outcome work
                for a confused visitor — see its own note in ServiceTriage.tsx.
              */}
              <h1 className="max-w-[18ch] text-display text-text">
                <span className="block">
                  Hi, I&apos;m <span className="text-accent">Liam</span>.
                </span>
                <span className="block">
                  I design and build digital experiences.
                </span>
              </h1>
              <p className="mt-6 max-w-[52ch] text-body text-text-muted">
                Custom automation, spreadsheets, websites, and technology
                solutions for individuals and small businesses.
              </p>

              {/*
                Single action, matching the mockup — "Contact now" isn't
                dropped from the page, it's one section down as the triage
                widget's whole reason for existing, and again at the closing
                CTA. This link doesn't need to also carry that weight.
              */}
              <div className="mt-9">
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 font-medium text-text transition-all duration-200 hover:border-accent-hover hover:shadow-[0_0_24px_var(--color-accent-dim)]"
                >
                  View my work
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </Link>
              </div>
            </div>

            {/*
              Hidden below lg, and that is a conversion decision rather than a
              layout shortcut. On a phone the artwork is decorative weight
              sitting between the headline and the triage widget, and §2's
              first success criterion is that a confused visitor finds the
              right service in under 15 seconds. Mobile still gets the dot
              grid and the full headline; it does not need to scroll past a
              picture to reach the thing that actually converts.
            */}
            <HeroArt className="hidden lg:block" />
          </div>
        </div>
      </section>

      <ServiceTriage />

      <section
        aria-labelledby="featured-work-heading"
        className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="featured-work-heading" className="text-h2 text-text">
            Featured work
          </h2>
          <Link
            href="/portfolio"
            className="inline-flex shrink-0 items-center gap-1 text-small font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
          >
            View all
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-8">
          <FeaturedWork projects={projects} />
        </div>
      </section>

      {/*
        No secondary link here (unlike the other pages' CTASection) — the
        triage widget right above this section already is the "browse
        services" action for this page; repeating it as a link would be
        redundant rather than a second, lower-commitment option.
      */}
      <CTASection />
    </>
  );
}
