import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import type { Project } from "@/lib/types";

/*
  Home page featured grid (CLAUDE.md §15 Phase 2, §5). Distinct from
  ProjectCard on purpose: the mockup's three cards are pure cover art, no
  title/chip/summary caption underneath — the image carries the section on
  its own, which is what §2's second success criterion ("does the work look
  impressive... shown large") is asking for here specifically. ProjectCard's
  richer treatment (chips, title, summary) is still correct on /portfolio,
  where a visitor is comparing several projects and needs the text to tell
  them apart before clicking.

  COVER, NOT images[0]. This used to filter out any project without
  `images[0]` — a defensive check that had become a silent content bug: a
  project marked `featured` with no art simply vanished from the home page
  with nothing to indicate it. `cover` is required now (§6), so every
  featured project renders, and the filter is gone with it.

  Because the caption sits outside the card, the cover is the only thing
  naming the project here — so unlike ProjectCard, the accessible name has to
  come from somewhere. It comes from the link's aria-label; the image's own
  alt text stays as written for the image branch, and the tile branch is
  aria-hidden, so the label is what makes all three cards announce
  consistently.

  BELOW THE FOLD, LAZY, DELIBERATELY UNLIKE THE HERO. This section renders
  after the hero, so CoverArt's default (`loading="lazy"`, no `priority`)
  keeps these three out of the critical request path entirely — they don't
  compete with the LCP element for bandwidth.
*/

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured);

  return (
    <ul className="grid gap-6 sm:grid-cols-3">
      {featured.map((project) => (
        <li key={project.slug}>
          <Link
            href={`/portfolio/${project.slug}`}
            aria-label={`${project.title} — view project`}
            // Explicit property list, not `transition-all` — see the note on
            // the same line in ProjectCard: `all` animates the focus ring.
            className="group block overflow-hidden rounded-xl border border-border transition-[border-color,box-shadow] duration-200 hover:border-accent hover:shadow-[0_0_28px_var(--color-accent-dim)]"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <CoverArt
                project={project}
                // Three across from sm up, one below — the grid never goes
                // two-wide, so there is no middle breakpoint to describe.
                sizes="(min-width: 640px) 33vw, 100vw"
                imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
