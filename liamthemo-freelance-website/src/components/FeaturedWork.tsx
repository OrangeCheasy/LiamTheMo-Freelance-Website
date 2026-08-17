import Image from "next/image";
import Link from "next/link";
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

  Every `featured` project is required to carry `images[0]` — see the filter
  below — so a project flagged featured without cover art fails silently
  rather than breaking the grid; CLAUDE.md §6 already requires cover art for
  a featured entry, so this is a defensive check, not the primary guard.

  BELOW THE FOLD, LAZY, DELIBERATELY UNLIKE THE HERO. This section renders
  after the hero and triage widget, so `loading="lazy"` (next/image's default
  once `priority` is absent, made explicit here so a future edit can't
  silently drop it) keeps these three images out of the critical request path
  entirely — they don't compete with the LCP element for bandwidth.
*/

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  const featured = projects.filter(
    (project) => project.featured && project.images?.[0],
  );

  return (
    <ul className="grid gap-6 sm:grid-cols-3">
      {featured.map((project) => {
        const cover = project.images![0];
        return (
          <li key={project.slug}>
            <Link
              href={`/portfolio/${project.slug}`}
              className="group block overflow-hidden rounded-xl border border-border transition-all duration-200 hover:border-accent hover:shadow-[0_0_28px_var(--color-accent-dim)]"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
