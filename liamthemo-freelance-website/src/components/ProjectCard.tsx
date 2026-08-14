import Link from "next/link";
import type { Project } from "@/lib/types";
import { SERVICE_META } from "@/lib/types";

/*
  One card per case study on /portfolio (CLAUDE.md §5, §14 step 4).

  Server component: a card is a link, a heading and a sentence, nothing
  interactive beyond navigation.

  The service badges are pastel fills with ink labels — legal under §9.2
  because the pastel is a filled area, never the text itself. They are real
  readable text, not decoration: unlike the emoji chips in ServiceTriage, no
  adjacent label repeats "this project demonstrates Automation & Python", so
  the badge is the only thing conveying that and must stay in the accessible
  name.
*/

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <li>
      <Link
        href={`/portfolio/${project.slug}`}
        className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent"
      >
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
      </Link>
    </li>
  );
}
