import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { SERVICE_META } from "@/lib/types";

/*
  One card per case study on /portfolio (CLAUDE.md §5, §14 step 4).

  Server component: a card is a link, a thumbnail, a heading and a sentence,
  nothing interactive beyond navigation.

  The service badges are pastel fills with ink labels — legal under §9.2
  because the pastel is a filled area, never the text itself. They are real
  readable text, not decoration: unlike the emoji chips in ServiceTriage, no
  adjacent label repeats "this project demonstrates Automation & Python", so
  the badge is the only thing conveying that and must stay in the accessible
  name.

  Thumbnail: a real screenshot when `project.images[0]` exists (§9 — real
  screenshots beat any illustration). When a project has no screenshot yet
  (e.g. Fuse Factory, still in development), we do not invent one — §10
  forbids fabricated content, and that extends to images. Instead the
  thumbnail falls back to a pastel tile in the project's first service colour
  with that service's icon, reusing the same identity system as the chip
  below it rather than a stock illustration.
*/

export default function ProjectCard({ project }: { project: Project }) {
  const thumb = project.images?.[0];
  const primaryService = SERVICE_META[project.services[0]];

  return (
    <li>
      <Link
        href={`/portfolio/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-accent"
      >
        {/* 3:2 to match the 1440x960 thumbnail source size — full image, no crop. */}
        <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-line">
          {thumb ? (
            thumb.srcDark ? (
              <>
                {/*
                  theme-fill-light/dark, not theme-light-only/dark-only: the
                  display-based pair leaves the hidden image `display: none`,
                  which stops the browser from ever fetching it (verified
                  against the real theme-toggle button — the card stayed
                  blank after switching theme). See the comment in
                  globals.css next to `.theme-fill-dark`.
                */}
                <Image
                  src={thumb.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="theme-fill-light object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <Image
                  src={thumb.srcDark}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="theme-fill-dark object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </>
            ) : (
              <Image
                src={thumb.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            )
          ) : (
            <div
              aria-hidden="true"
              className={`flex h-full w-full items-center justify-center text-5xl ${primaryService.chipClass}`}
            >
              {primaryService.icon}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap gap-2">
            {project.services.map((slug) => (
              <span
                key={slug}
                className={`rounded-full px-2.5 py-1 text-small font-medium text-accent-fill-ink ${SERVICE_META[slug].chipClass}`}
              >
                {SERVICE_META[slug].title}
              </span>
            ))}
          </div>

          <h3 className="mt-4 text-h3 text-ink">{project.title}</h3>
          <p className="mt-2 flex-1 text-body text-ink-muted">
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
