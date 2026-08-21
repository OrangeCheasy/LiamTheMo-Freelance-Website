import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import EmberField from "@/components/EmberField";
import ProjectCard from "@/components/ProjectCard";
import SectionLabel from "@/components/SectionLabel";
import { projects } from "@/data/projects";

/*
  Portfolio index (CLAUDE.md §5, §15 step 4). Fully static: it only reads
  `projects`, a build-time constant, so it prerenders and is served from the
  assets binding without invoking the Worker (§4.1).

  PHASE R4 RESTYLE — presentation only, plus the `cover` migration.
  This page was built before the home page was rebuilt, so it still opened
  with a full-bleed `border-b bg-surface` band at py-16/py-20 and used the
  Eyebrow rule. The home page and (since R3) the service pages both use plain
  max-w-6xl containers with an accent micro-label above the heading. Two
  rhythms on one site reads as two sites, so this file now follows them.

  ACCENT ON THE SECTION LABEL: §9.2 says section labels are not accent; §9
  makes the mockup authoritative where the two disagree, and the mockup ships
  them in accent. Same override the home page and service pages already made,
  noted here rather than done quietly.

  ABOVE THE FOLD — the one thing on this page that is a real performance
  decision rather than a style one. §12 requires everything below the fold to
  be lazy and the LCP element to be eager, and this grid straddles that line:
  on a desktop viewport the first row of three cards is visible on load, on a
  phone only the first card is. Marking all three eager would make a phone
  fetch two covers it cannot see; marking none would leave the LCP image
  lazy, which is the slower mistake and the one Lighthouse penalises.

  So exactly one card is eager — but NOT simply the first one, which is the
  obvious version of this and is wrong here. The first card is This Website,
  a `tile` cover: it renders no <img> at all, costs no request, and can never
  be the LCP element. Handing it `priority` marks nothing and quietly leaves
  the real first image lazy, which is what this page shipped for one build
  before a check under `npm run preview` showed three lazy images and no
  eager one.

  The rule is therefore "the first card that actually renders an image".
  That is the browser's first image request on this page at every width — in
  the first row on desktop, and the first thing below the tile on a phone.
  It moves on its own if the project order changes or a tile is promoted to
  real art, which a hardcoded index would not.
*/

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Real automation, spreadsheet and Roblox work — the problem, what was built, and what changed.",
  openGraph: {
    type: "website",
    title: "Projects",
    description:
      "Real automation, spreadsheet and Roblox work — the problem, what was built, and what changed.",
  },
};

export default function PortfolioPage() {
  // See the "above the fold" note above — the first card with real art, not
  // the first card. -1 when every cover is a tile, which marks nothing eager
  // and is the correct answer in that case: there is no image to prioritise.
  const eagerIndex = projects.findIndex(
    (project) => project.cover.kind === "image",
  );

  return (
    <>
      {/*
        THE EMBER TEXTURE, AT PAGE LEVEL.

        Owner call: the mockup only decorates the top-right corner, and the ask
        was for that treatment across the whole page, behind the cards
        included. One field spanning the wrapper does that — it is a tiled
        pattern rather than a placed graphic, so it covers whatever height the
        projects data ends up producing without gaps or a cut edge. See
        EmberField for why the earlier version, four fixed boxes placed down
        the page, could not.

        `-z-10` with `relative` on each content section keeps all of it behind
        the cards; `pointer-events-none` inside the component keeps it from
        intercepting a click. `overflow-hidden` is belt and braces — the field
        is inset-0 and cannot overhang on its own, but it stops any future
        decoration added here from widening the document on a phone.
      */}
      <div className="relative overflow-hidden">
        <EmberField className="-z-10" />

        <section className="relative">
          {/*
            PADDING GOES ON THIS DIV, NOT THE SECTION — it is inside max-w-6xl,
            not outside it, which is what puts the content on the same left edge
            as the header logo and the card grid below. Hanging px-5/sm:px-8 off
            the full-width section instead centres a 1152px box inside the
            padded area and pulls everything 32px left of every other container
            on the site. Same shape as the home page's hero section.
          */}
          <div className="relative mx-auto max-w-6xl px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
            <SectionLabel>Real work</SectionLabel>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="max-w-[20ch] text-h1 text-text">Projects</h1>
              <span className="rounded-full border border-border px-2.5 py-1 text-small font-medium text-text-muted">
                WIP
              </span>
            </div>
            <p className="mt-4 max-w-[52ch] text-body text-text-muted">
              A look at finished work: what the problem was, what got built, and
              what changed because of it.
            </p>
          </div>
        </section>

        {/* `relative` on this and the CTA below: the drifts sit at -z-10, and
            a positioned sibling is what keeps the cards painting over them. */}
        <section
          aria-labelledby="projects-heading"
          className="relative mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8"
        >
          {/* The grid needs an accessible name, but the h1 above already says
              "Projects" — a visible second heading would be redundant. */}
          <h2 id="projects-heading" className="sr-only">
            All projects
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                priority={index === eagerIndex}
              />
            ))}
          </ul>
        </section>

        {/*
          §7: there is no /services index and none is planned — the home page's
          Services section replaced it, and owns the `#services` anchor, so the
          secondary link lands on the list of services rather than the top of
          the home page.
        */}
        <div className="relative">
          <CTASection
            secondary={{ href: "/#services", label: "Browse services" }}
          />
        </div>
      </div>
    </>
  );
}
