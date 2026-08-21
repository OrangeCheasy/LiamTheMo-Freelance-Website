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
  //
  // description: back to matching the hero paragraph word for word (owner
  // call, 2026-08-21), superseding the note this used to carry — that it
  // deliberately kept outcome wording ("Custom automation, spreadsheets,
  // websites...") while the title above followed the hero, because §12 wants
  // a plain-language phrase someone would search. That reasoning was for
  // search results; this field is what Discord/Slack/iMessage show under the
  // title when the link itself is pasted, so the owner's original "all three
  // read as one thing" intent applies here after all. The top-level
  // `description` above (search-result snippet) is untouched.
  openGraph: {
    type: "website",
    title: "Hi, I'm Liam. I design and build digital experiences.",
    description:
      "I'm a designer and developer who enjoys creating clean, functional, and user-focused solutions.",
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

/*
  The three About Me items, lifted out of the JSX so the section markup stays
  readable now that it carries the divider structure.

  ICONS ARE THE MOCKUP'S, redrawn from it rather than reused from the previous
  pass, where all three were subtly wrong: "Clean Code" was a bare pair of
  chevrons with no slash between them, "Thoughtful Design" was a plain pencil
  where the mockup draws a pen over a square, and "Problem Solver" had a solid
  centre dot where the mockup has a second ring. Stroke-only, 24-unit box, so
  they sit on the same optical weight as each other.
*/
const virtues: {
  title: string;
  description: string;
  /** Overrides the shared 1.75 where a glyph needs it — see "Clean Code". */
  strokeWidth?: number;
  icon: React.ReactNode;
}[] = [
  {
    title: "Clean Code",
    description: "I write maintainable, scalable, and efficient code.",
    // < / >  — the slash runs past both chevrons, top-right to bottom-left.
    //
    // THE SPACING IS MEASURED, NOT EYEBALLED. The first pass at restoring the
    // slash kept the chevrons where the slashless version had left them, and
    // the three strokes collided: the perpendicular distance from the slash to
    // the nearest chevron arm was 1.97 units against a 2.45 stroke, so the
    // glyph rendered as one fused blob rather than three marks. Chevrons
    // widened (apex 4.0 -> 3.0) and arms shortened to clear it; the slash and
    // the arms now sit 0.67 units apart at their closest, which survives the
    // 20px render.
    //
    // HEAVIER STROKE THAN THE OTHER TWO, and that is deliberate. Open strokes
    // cover far less area than a closed ring or a filled-corner square, so at
    // the shared 1.75 this glyph read as the small one however far its box was
    // pushed out. Sized by rasterising all three at 96x96 and counting inked
    // pixels: ring 2042, pen 2391, this 1860 at w=2.3 — deliberately a little
    // under, because a glyph this open reads larger than its ink count says.
    strokeWidth: 2.3,
    icon: (
      <>
        <path d="M7.4 6.8 3 12l4.4 5.2" />
        <path d="M16.6 6.8 21 12l-4.4 5.2" />
        <path d="M14.5 3.4 9.5 20.6" />
      </>
    ),
  },
  {
    title: "Thoughtful Design",
    description: "I design with clarity, purpose, and the user in mind.",
    // Pen over a square, the square left open at the corner the pen crosses.
    icon: (
      <>
        <path d="M12.5 3.5H5.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7" />
        <path d="M17.6 3a1.9 1.9 0 0 1 2.7 2.7l-7.7 7.7-3.3.9.9-3.3z" />
      </>
    ),
  },
  {
    title: "Problem Solver",
    description: "I love solving complex problems with simple, elegant solutions.",
    // Two concentric rings — the inner one is a ring, not a filled dot.
    icon: (
      <>
        <circle cx="12" cy="12" r="8.6" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
];

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
              {/*
                Three tiers of ink, matching the mockup (owner call): the
                greeting in --text, the name in accent, and the two lines that
                say what the work is in --text-secondary — dimmer than the
                greeting, clearly brighter than the paragraph under it. The
                whole heading used to be one flat --text, which flattened that
                hierarchy into a single block of white.

                The tier lives on the spans, not the h1, so the greeting keeps
                full-strength ink rather than everything stepping down together.
              */}
              <h1 className="max-w-[18ch] text-h1 text-text">
                <span className="block">
                  Hi, I&apos;m <span className="text-accent">Liam</span>.
                </span>
                <span className="block text-text-secondary">
                  I design and build
                </span>
                <span className="block text-text-secondary">
                  digital experiences.
                </span>
              </h1>
              {/*
                The mockup's literal words (owner call), same override the
                heading above already runs on.

                Worth knowing what it costs, flagged rather than swapped
                quietly: this paragraph was the only line in the hero that
                named what is sold and to whom, and §11 asks the hero to do
                outcome work — it calls out "I design and build digital
                experiences" by name as the phrasing that "tells a restaurant
                owner nothing". The hero is now identity-first throughout, so
                the first thing on the page that names a service is the
                Services section, which this same pass moved to the bottom.

                The top-level `description` below (the search-result snippet)
                deliberately did NOT follow — it still carries outcome wording,
                because §12 wants that field targeting a plain-language phrase
                someone would actually search. `openGraph.description` used to
                diverge the same way; that reversed 2026-08-21 (owner call, see
                the metadata block) and it's back to matching this paragraph
                word for word, same as the OG title already did.

                The break after "creating" is the owner's, so <br /> rather
                than letting it wrap — but only from sm up, since forcing it
                on a narrow phone would leave a ragged short line.
              */}
              <p className="mt-6 max-w-[52ch] text-body text-text-muted">
                I&apos;m a designer and developer who enjoys creating
                <br className="hidden sm:inline" /> clean, functional, and
                user-focused solutions.
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
            text-h3 — one size for every white section heading on this page,
            set by "Let's Work Together" in the closing CTA (owner call).

            Supersedes the measurement note that used to live here: this was
            text-body because "Featured Work"'s cap-height in the mockup
            matched the hero paragraph's exactly. That is still true of the
            mockup, but the owner has since levelled all of these to one size,
            and a page where every section opens at the same scale beats one
            that reproduces four different mockup measurements.
          */}
          <h2 id="featured-work-heading" className="text-h3 text-text">
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
        Owner override, 2026-08-17: the three-virtue trio (§9.6's named
        anti-goal, §11's "no generic virtue blocks", §16's "owner chose to
        cut it entirely") is back, because the owner supplied a new mockup
        and declared it authoritative over those calls — same override
        pattern as the hero copy above. CLAUDE.md §9.6/§11/§16 need a pass to
        stop contradicting this; flagging here rather than silently drifting.
      */}
      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        {/*
          RESTRUCTURED TO THE MOCKUP (owner call): the old version stacked a
          circled icon above each title in three free-floating columns, which
          read as three loose cards rather than one section. The mockup is
          built from rules instead — a hairline above the whole block, and a
          vertical rule between the intro and each virtue — so the four
          columns read as one row of related things. Nothing here is a card
          any more; the structure is doing the work.

          Dividers are --border, never accent (§9.2): a rule is not an action.
          The icons stay accent, which is the same documented override the
          section labels run on — the mockup sets them orange and §9 makes the
          mockup authoritative where it and §9.2 disagree.
        */}
        <div className="border-t border-border pt-8">
          {/*
            The label sits above the whole row rather than inside the intro
            column (owner call). That is what lets the four titles below —
            "Designer. Developer. Problem Solver." and the three virtue names
            — start on one line: with the label inside the column, the intro
            heading was always pushed one line lower than the virtues it was
            supposed to sit beside.
          */}
          <p className="text-small font-medium text-accent">About Me</p>

          {/*
            No `items-start`: grid children stretch by default, and that is
            what makes the rules run the full height of the block the way the
            mockup draws them. Pinned to the top instead, each rule stopped at
            the bottom of its own three lines of text and left the taller
            intro column hanging past it — which was most of why this section
            still read as unfinished after the icons were fixed.
          */}
          {/* mt-2 — the same label-to-content gap the Services section uses
              between "Services" and "What can I help you with?" (owner call),
              so the two sections open on an identical rhythm. */}
          {/*
            COLUMN WIDTHS ARE SOLVED, NOT GUESSED. At text-h3 two strings set
            the whole layout, and they pull against each other: "Designer.
            Developer. Problem Solver." measures 350px, and "Thoughtful
            Design" measures 177px and needs its icon and gap beside it. The
            row is 1088px, so with equal virtue columns the constraint is

                (1088 - 350 - p) / 3 - 2p  >=  177 + icon + gap

            which caps p at about 16px with a 22px icon — no headroom. Taking
            the icon to 20px and its gap to 8px makes the requirement 205px
            and lets p be 14px with 8px to spare, which is what is set here.

            p is the SAME 14px on all four columns, deliberately: that puts
            28px around every divider, the intro one included, so the rules
            sit evenly rather than one gap reading wider than the rest. The
            first virtue's old `first:pl-8` is gone for the same reason — it
            made the first gap 60px against 28px everywhere else.

            22.75rem is 364px: the 350px heading plus its own 14px.
          */}
          <div className="mt-2 grid gap-10 lg:grid-cols-[minmax(0,22.75rem)_1fr] lg:gap-0">
            <div className="lg:pr-3.5">
              {/*
                Matches the virtue titles exactly (owner call) — they are
                peers on one row, so they share one set of classes and moved
                together when everything levelled to text-h3. Still an <h2>:
                it is the section's heading and the three beside it are
                <h3>s, and that relationship is what a screen reader reads,
                independent of how large either is drawn.
              */}
              <h2 className="text-h3 text-text">
                Designer. Developer. Problem Solver.
              </h2>
              {/* text-small, matching the three virtue descriptions beside it
                  (owner call) — at text-body it was the one paragraph in the
                  row set larger than its neighbours. */}
              <p className="mt-3 max-w-[52ch] text-small text-text-muted">
                I&apos;m Liam, a designer and developer based in Canada. I
                enjoy turning ideas into clean, functional solutions with a
                focus on simplicity and impact. When I&apos;m not coding or
                designing, you can find me learning something new or working
                on a side project.
              </p>
            </div>

            {/*
              divide-x rather than a border on each child: it draws a rule
              between columns and none on the outside edges, which is exactly
              the mockup and is one class instead of a first:/last: pair that
              has to be re-reasoned every time the count changes.

              The rules only exist once the columns sit side by side. Stacked
              on a phone they would be horizontal lines pretending to be
              vertical ones, so below sm this is a plain gap.
            */}
            <div className="grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border lg:border-l lg:border-border">
              {virtues.map((virtue) => (
                // 14px a side, matching the intro column — see the note on
                // the grid above for why that exact number.
                <div key={virtue.title} className="sm:px-3.5">
                  {/*
                    Icon beside the title on one line, not stacked above it in
                    a ring. The ring was the single biggest reason this section
                    read as busy: it drew a hard accent circle around every
                    item and pushed the title down a row for no gain.
                  */}
                  <div className="flex items-center gap-2">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={virtue.strokeWidth ?? 1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 shrink-0 text-accent"
                    >
                      {virtue.icon}
                    </svg>
                    <h3 className="text-h3 text-text">
                      {virtue.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-[24ch] text-small text-text-muted">
                    {virtue.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*
        Mockup-exact copy and button label for this one instance — every
        other CTASection call keeps the shared defaults (see the component's
        own note on why). No secondary link here either, unlike other pages'
        CTASection — the header nav's Contact button already covers a second,
        lower-commitment path to the same destination.

        Sits directly under About (owner call), which is the mockup's own
        sequence — the mockup has no Services section, so About into "Let's
        Work Together" is how it closes.
      */}
      <CTASection
        title="Let's Work Together"
        description="Have a project in mind or just want to say hi? I'd love to hear from you."
        ctaLabel="Get In Touch"
        // Runs straight on from About, the way the mockup groups them.
        tight
      />

      {/*
        Services last (owner call). Two things worth knowing about this order,
        flagged rather than moved quietly:

        §2's FIRST success criterion is "does a non-technical visitor find
        their own problem within one screen of scrolling", and it names this
        section as the thing that satisfies it. It is now the last section on
        the page, behind the hero, the work grid, About and the CTA — several
        screens for the small-business visitor §1 says arrives not knowing
        what the work is called.

        §2's THIRD is "does every page end with a path to the form". The home
        page now ends on Services rather than the CTA. Not a dead end — the
        sixth card goes straight to /contact?topic=unsure and the other five
        reach service pages that each close with their own CTA — but the
        direct path is one hop further than it was.

        Both are reversible in one move if the page underperforms: this block
        and the CTASection above it swap back. CLAUDE.md §7 and §15 still
        describe the original order and need a pass either way.
      */}
      <ServicesSection />
    </>
  );
}
