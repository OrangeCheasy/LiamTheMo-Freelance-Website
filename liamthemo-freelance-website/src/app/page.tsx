import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import FeaturedWork from "@/components/FeaturedWork";
import HeroArt from "@/components/HeroArt";
import ServicesSection from "@/components/ServicesSection";
import { projects } from "@/data/projects";

/*
  Home. Fully static — nothing on this page reads cookies(), headers(),
  searchParams or an uncached fetch, so it prerenders at build time and is served
  from the assets binding without invoking the Worker (CLAUDE.md §4.1).

  Flow: Hero → Featured Work → Services → About → CTA. The Services section
  (`ServicesSection.tsx`) restores the symptom-worded triage cards that were
  cut in Phase 2, on the owner's instruction — it is the section §7 said was
  planned, and it closes the IA gap that removal opened: the home page can
  once again route a visitor to a specific service without them knowing its
  slug. The header nav no longer links to it (that item is now "Home"), so
  the section is reached by scrolling, or by any `/#services` link.
*/

export const metadata: Metadata = {
  // The browser tab (owner call, 2026-08-18). There is no title template in
  // layout.tsx, so this string is exactly what the tab shows — no site-name
  // suffix is appended.
  title: "Hi, I'm Liam",
  description:
    "Custom automation, spreadsheets, websites, and local tech help for individuals and small businesses. Tell me the problem and I'll quote the work.",
  // The link embed (owner call, 2026-08-18): hero copy, matching both the page
  // itself and the generated OG image in src/app/opengraph-image.tsx. The three
  // are meant to read as one thing, so a change to the hero is a change to all
  // three.
  openGraph: {
    type: "website",
    title: "Hi, I'm Liam. I design and build digital experiences.",
    description:
      "Custom automation, spreadsheets, websites, and technology solutions for individuals and small businesses.",
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

        <div className="relative mx-auto max-w-6xl px-5 pt-4 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
            {/*
              ml-5: measured in the mockup — the hero text block sits ~25px
              (native scale) further right than the logo/nav's left edge,
              not flush with it like the rest of the page's containers.
            */}
            <div className="ml-5">
              {/*
                Owner call, overriding §11's "outcome work" reading of this
                exact line: ships as the mockup's literal words.

                text-h1, not text-display: measured cap-height in the mockup
                — the heading is exactly 2x the description paragraph's
                cap-height (26px vs 13px, native scale). text-display (40-60px)
                overshoots that; text-h1 (32-44px) is the closest existing
                scale step to the ~34px that ratio implies against text-body.
              */}
              <h1 className="max-w-[18ch] text-h1 text-text">
                <span className="block">
                  Hi, I&apos;m <span className="text-accent">Liam</span>.
                </span>
                <span className="block">I design and build</span>
                <span className="block">digital experiences.</span>
              </h1>
              <p className="mt-6 max-w-[52ch] text-body text-text-muted">
                Custom automation, spreadsheets, websites, and technology
                solutions for individuals and small businesses.
              </p>

              {/*
                Single action, matching the mockup — "Contact now" isn't
                dropped from the page, it's still one nav item away and again
                at the closing CTA. This link doesn't need to also carry
                that weight.
              */}
              <div className="mt-9">
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 rounded-full border border-accent px-6 py-2 font-medium text-text transition-all duration-200 hover:border-accent-hover hover:shadow-[0_0_24px_var(--color-accent-dim)]"
                >
                  View My Work
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
              sitting between the headline and the rest of the page. Mobile
              still gets the dot grid and the full headline; it does not need
              to scroll past a picture to reach the content below.
            */}
            <HeroArt className="hidden lg:block" />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="featured-work-heading"
        className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8"
      >
        <div className="flex items-baseline justify-between gap-4">
          {/*
            text-body, not text-h2: measured the mockup directly — "Featured
            Work"'s cap-height matches the hero description paragraph's
            cap-height exactly (13px each, native mockup scale). It's still
            an <h2> semantically, and still bold in the display face via the
            global h1-h4 rule in globals.css — just not big.
          */}
          <h2 id="featured-work-heading" className="text-body text-text">
            Featured Work
          </h2>
          <Link
            href="/portfolio"
            className="inline-flex shrink-0 items-center gap-1 text-small font-medium text-accent hover:text-accent-hover"
          >
            View All
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* mt-2, matching the About Me label-to-heading gap directly below —
            same "small label to next content" rhythm, not the mt-8 this used
            before. */}
        <div className="mt-2">
          <FeaturedWork projects={projects} />
        </div>
      </section>

      {/*
        Owner call, 2026-08-17: the Services section §7 said was planned.
        Lands after Featured Work and anchors `#services`, which is where the
        header nav's old `/#services` item pointed before it was relabelled
        "Home".
      */}
      <ServicesSection />

      {/*
        Owner override, 2026-08-17: the three-virtue trio (§9.6's named
        anti-goal, §11's "no generic virtue blocks", §16's "owner chose to
        cut it entirely") is back, because the owner supplied a new mockup
        and declared it authoritative over those calls — same override
        pattern as the hero copy above. CLAUDE.md §9.6/§11/§16 need a pass to
        stop contradicting this; flagging here rather than silently drifting.
      */}
      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start">
          <div>
            <p className="text-small font-medium text-accent">About Me</p>
            <h2 className="mt-2 max-w-[24ch] text-h2 text-text">
              Designer. Developer. Problem Solver.
            </h2>
            <p className="mt-4 max-w-[60ch] text-body text-text-muted">
              I&apos;m Liam, a designer and developer based in Canada. I enjoy
              turning ideas into clean, functional solutions with a focus on
              simplicity and impact. When I&apos;m not coding or designing,
              you can find me learning something new or working on a side
              project.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Clean Code",
                description:
                  "I write maintainable, scalable, and efficient code.",
                icon: <path d="m8 6-4 6 4 6M16 6l4 6-4 6" />,
              },
              {
                title: "Thoughtful Design",
                description:
                  "I design with clarity, purpose, and the user in mind.",
                icon: (
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                ),
              },
              {
                title: "Problem Solver",
                description:
                  "I love solving complex problems with simple, elegant solutions.",
                icon: (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                  </>
                ),
              },
            ].map((virtue) => (
              <div key={virtue.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent text-accent">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {virtue.icon}
                  </svg>
                </div>
                <h3 className="mt-4 text-body font-semibold text-text">
                  {virtue.title}
                </h3>
                <p className="mt-2 text-small text-text-muted">
                  {virtue.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Mockup-exact copy and button label for this one instance — every
        other CTASection call keeps the shared defaults (see the component's
        own note on why). No secondary link here either, unlike other pages'
        CTASection — the header nav's Contact button already covers a second,
        lower-commitment path to the same destination.
      */}
      <CTASection
        title="Let's Work Together"
        description={"Have a project in mind or just want to say hi?\nI'd love to hear from you."}
        ctaLabel="Get In Touch"
      />
    </>
  );
}
