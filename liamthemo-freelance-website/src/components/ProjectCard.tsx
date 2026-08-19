import Link from "next/link";
import LitEdge from "@/components/LitEdge";
import CoverArt from "@/components/CoverArt";
import type { Project } from "@/lib/types";
import { SERVICE_META } from "@/lib/types";
import { warmEdgeCentreImage } from "@/lib/glow";

/*
  One card per case study on /portfolio (CLAUDE.md §5, §15 step 4).

  Server component: a card is a link, a cover, a heading and a sentence,
  nothing interactive beyond navigation.

  The service/skill badges are plain outlined chips (owner call: no colour on
  this card, unlike the coloured chips still used on the case study page
  itself) — just a border and muted ink text, same treatment for a real
  service and a freeform skill tag. They are real readable text, not
  decoration: no adjacent label repeats "this project demonstrates Automation
  & Python", so the badge is the only thing conveying that and must stay in
  the accessible name.

  The cover is `CoverArt`, shared with the home page's featured grid — see
  that file for why the tile fallback is a design rather than a placeholder.
*/

export default function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  /** Above the fold on the index. See the note in src/app/portfolio/page.tsx. */
  priority?: boolean;
}) {
  const labels =
    project.services.length > 0
      ? project.services.map((slug) => SERVICE_META[slug].title)
      : (project.skills ?? []);

  return (
    <li>
      <Link
        href={`/portfolio/${project.slug}`}
        // An explicit property list rather than `transition-all` (§10, §12).
        // `all` includes outline-width, outline-color and outline-offset, so
        // the global :focus-visible ring animated in over 200ms — a keyboard
        // user saw a 3px white ring (the initial values) fade into the 2px
        // accent one instead of the accent ring appearing at once. Caught by
        // tabbing the page, which is exactly why §12 asks for that rather
        // than reading the code. Down to transform alone now that the border
        // and shadow no longer move on hover — see the lit edge below.
        className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface transition-transform duration-200 hover:-translate-y-0.5"
      >
        {/*
          The lit top edge the projects mockup puts on every card, centred
          rather than left-weighted — see warmEdgeCentreImage for the three
          sampled profiles it was fitted to.

          THIS REPLACED hover:border-accent + an accent box-shadow. That was
          the pre-services hover idiom, and leaving it would have given the
          site two different ways for a card to respond to a pointer within one
          scroll of each other. The edge brightening is now the whole hover, as
          on the triage cards, plus the lift both already had.

          NOTE `overflow-hidden` IS GONE from the card. It cropped the bloom
          away above the line; the cover's own wrapper clips the image to the
          rounded corners instead, which is all it was doing here.
        */}
        <LitEdge image={warmEdgeCentreImage()} />
        <LitEdge
          image={warmEdgeCentreImage()}
          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
        {/*
          3:2, matching the 1536x1024 cover sources — full image, no crop, for
          the common case. bg-surface-2 shows only where a `contain` cover
          letterboxes.
        */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-2xl border-b border-border bg-surface-2">
          <CoverArt
            project={project}
            priority={priority}
            // The heading, summary and chips below already say all of this.
            decorative
            // Three up at lg, two at sm, one below. The index container is
            // max-w-6xl (1152px), so a third of it is ~360px — 33vw is the
            // right hint and never over-fetches on a phone.
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-border px-2.5 py-1 text-small text-text-muted"
              >
                {label}
              </span>
            ))}
          </div>

          <h3 className="mt-4 text-h3 text-text">{project.title}</h3>
          <p className="mt-2 flex-1 text-body text-text-muted">
            {project.summary}
          </p>

          <span className="mt-4 inline-flex items-center text-small font-semibold text-accent">
            View project
            <span
              aria-hidden="true"
              className="ml-1 transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
