import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { SERVICE_META } from "@/lib/types";

/*
  One card per case study on /portfolio (CLAUDE.md §5, §14 step 4).

  Server component: a card is a link, a thumbnail, a heading and a sentence,
  nothing interactive beyond navigation.

  The service/skill badges are plain outlined chips (owner call: no colour on
  this card, unlike the coloured chips still used on the case study page
  itself) — just a border and muted ink text, same treatment for a real
  service and a freeform skill tag. They are real readable text, not
  decoration: no adjacent label repeats "this project demonstrates Automation
  & Python", so the badge is the only thing conveying that and must stay in
  the accessible name.

  Thumbnail: a real screenshot when `project.images[0]` exists (§9 — real
  screenshots beat any illustration). When a project has no screenshot yet
  (e.g. Fuse Factory, still in development), we do not invent one — §10
  forbids fabricated content, and that extends to images. Instead the
  thumbnail falls back to a pastel tile in the project's first service colour
  with that service's icon, reusing the same identity system as the chip
  below it rather than a stock illustration. A project with no service line
  at all (e.g. a portfolio-only piece tagged with `skills` instead) falls
  back further, to a neutral tile using `project.icon`.
*/

export default function ProjectCard({ project }: { project: Project }) {
  const thumb = project.images?.[0];
  const primaryService = project.services[0]
    ? SERVICE_META[project.services[0]]
    : undefined;
  const fitClass = thumb?.fit === "contain" ? "object-contain" : "object-cover";

  return (
    <li>
      <Link
        href={`/portfolio/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent"
      >
        {/*
          3:2 to match the 1440x960 thumbnail source size — full image, no
          crop — for the common case. bg-surface-2 is only visible when
          `thumb.fit === "contain"` letterboxes an image whose aspect ratio
          is too extreme to crop into 3:2 (e.g. a wide banner).
        */}
        <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-border bg-surface-2">
          {thumb ? (
            <Image
              src={thumb.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={`${fitClass} transition-transform duration-300 group-hover:scale-[1.03]`}
            />
          ) : primaryService ? (
            <div
              aria-hidden="true"
              className={`flex h-full w-full items-center justify-center text-5xl ${primaryService.chipClass}`}
            >
              {primaryService.icon}
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center bg-surface-2 text-5xl"
            >
              {project.icon ?? "📁"}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap gap-2">
            {(project.services.length > 0
              ? project.services.map((slug) => SERVICE_META[slug].title)
              : (project.skills ?? [])
            ).map((label) => (
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
