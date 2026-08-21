import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import BeforeAfterCompare from "@/components/BeforeAfterCompare";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import SectionLabel from "@/components/SectionLabel";
import { projects } from "@/data/projects";
import { SERVICE_META, type ProjectFeature } from "@/lib/types";

/*
  Case study template (CLAUDE.md §5, §6, §15 step 4). One file drives every
  entry in `projects` — adding a project means adding data, not a page.

  INDIVIDUAL-PROJECT-PAGE MOCKUP (2026-08-20, owner call).
  Rebuilt to follow `individual-project-page-mockup.png`: header (back link,
  category chip, title, description, Live Site / View Source buttons) ->
  divider -> a three-column Overview+What I Built / Key Features / Project
  Details row -> a sliding Screenshots carousel. Declared non-negotiable
  EXCEPT the mockup's composite hero image — the owner asked for that one
  piece to be dropped; everything else follows the mockup structure exactly.

  Result/metrics aren't in the mockup's frame either, but nothing asked for
  them to be removed and §10/§11 already forbid inventing a replacement for
  real, owner-confirmed content (the flagship Restaurant Sales Parser's
  numbers, OrangeCheasy's subscriber growth) — so it stays as its own section
  below the screenshots rather than being dropped. The related-services
  cross-link that used to sit in this sidebar (added in R4) WAS dropped
  (owner call, 2026-08-20) — the reverse half, a service page listing its
  proof projects via `projectsForService()`, is untouched; only this page's
  outbound half is gone.

  PROJECT DETAILS SITS IN A FIXED GRID TRACK (owner report, 2026-08-20): each
  of the three column children carries an explicit `lg:col-start-N` rather
  than relying on source order, because Key Features renders conditionally
  and CSS grid auto-placement does not leave a gap for a missing sibling —
  without the pin, Project Details would land in the middle column on every
  page that has no `features` yet (five of six today). Pinning keeps it in
  the right-hand column on every project page regardless of which of the
  other two columns are present.

  NEW OPTIONAL FIELDS (src/lib/types.ts): `overview`, `whatIBuilt`,
  `features`, `role`, `year`, `sourceUrl`. Only "This Website" has real
  values for these today — lifted verbatim from the mockup, which is
  owner-authored copy for that specific project, not template filler. Every
  other project renders with those sections hidden until the owner supplies
  real copy (§11: never invent). See the TODO(owner) notes in projects.ts.

  IMAGES (§12).
  No lead/hero image on this page any more (owner call above), so `cover` is
  card-grid-only now — nothing on this page reads it. `images` feeds the
  Screenshots carousel directly; every figure in it is lazy, there being no
  above-the-fold image left to prioritize.

  BEFORE / AFTER (2026-08-21, owner-supplied redesign screenshots for This
  Website). Separate optional section, separate field (`Project.beforeAfter`)
  — see the type's own comment for why this isn't just more `images` entries
  fed through ScreenshotCarousel. Renders below Screenshots, hidden entirely
  when a project has no pairs.
*/

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
    },
  };
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </svg>
  );
}

// Hand-drawn to match the site's existing inline-SVG icon convention (see
// Footer.tsx) rather than pulling in an icon library for three glyphs.
function FeatureIcon({ icon }: { icon: ProjectFeature["icon"] }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-accent"
    >
      {icon === "bolt" ? <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /> : null}
      {icon === "layers" ? (
        <>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 13 9 5 9-5" />
        </>
      ) : null}
      {icon === "target" ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.5" />
        </>
      ) : null}
    </svg>
  );
}

// Same GitHub mark as Footer.tsx's icon link, reused verbatim for the "View
// Source" button rather than a second copy of the path data.
function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.21.66.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  // Falls back to the already-approved problem/solution copy rather than
  // requiring bespoke overview text before a project can use this template.
  const overview = project.overview ?? `${project.problem} ${project.solution}`;

  const categoryLabel =
    project.services.length > 0
      ? project.services.map((s) => SERVICE_META[s].title).join(", ")
      : (project.skills ?? []).join(", ");

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
        <Link
          href="/portfolio"
          className="text-small font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          ← All Projects
        </Link>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.services.length > 0
            ? project.services.map((serviceSlug) => (
                <span
                  key={serviceSlug}
                  className={`rounded-full px-2.5 py-1 text-small font-medium text-bg ${SERVICE_META[serviceSlug].chipClass}`}
                >
                  {SERVICE_META[serviceSlug].title}
                </span>
              ))
            : project.skills?.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border px-2.5 py-1 text-small text-text-muted"
                >
                  {skill}
                </span>
              ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {project.avatar ? (
            <Image
              src={project.avatar.src}
              alt={project.avatar.alt}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
            />
          ) : null}
          <h1 className="max-w-[24ch] text-h1 text-text">{project.title}</h1>
        </div>
        <p className="mt-4 max-w-[56ch] text-body text-text-muted">
          {project.summary}
        </p>

        {/*
          Live Site / View Source — the mockup's header buttons.
          `externalLink` already carries a label per project (e.g. OrangeCheasy's
          "Watch the channel"), so it doubles as the Live Site button rather than
          adding a second, near-duplicate URL field. `sourceUrl` is new — see
          src/lib/types.ts — and stays unset (button hidden) until a project has
          a real, public repo link.
        */}
        {project.externalLink || project.sourceUrl ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.externalLink ? (
              <a
                href={project.externalLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-accent px-6 py-2 font-medium text-text transition-all duration-200 hover:border-accent-hover hover:shadow-[0_0_24px_var(--color-accent-dim)]"
              >
                {project.externalLink.label}
                <ArrowUpRightIcon className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
            {project.sourceUrl ? (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-2 font-medium text-text transition-colors hover:border-text-muted"
              >
                <GitHubIcon />
                View Source
              </a>
            ) : null}
          </div>
        ) : null}
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <hr className="border-border" />
      </div>

      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        {/*
          EXPLICIT lg:col-start ON ALL THREE CHILDREN — not just gap/grid-cols.
          Key Features renders conditionally (most projects don't have
          `features` yet — see projects.ts), and CSS grid auto-placement fills
          left to right regardless of which sibling is missing: with Key
          Features absent, an un-pinned aside would auto-place into the
          MIDDLE track instead of the right one, so Project Details would land
          in a different column on different project pages. Pinning every
          child to its track keeps it in the same visual column everywhere
          (owner report, 2026-08-20).
        */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_16rem]">
          <div className="min-w-0 space-y-8 lg:col-start-1">
            <div>
              <SectionLabel>Overview</SectionLabel>
              <p className="mt-4 text-body text-text-muted">{overview}</p>
            </div>

            {project.whatIBuilt && project.whatIBuilt.length > 0 ? (
              <div>
                <SectionLabel>What I Built</SectionLabel>
                <ul className="mt-4 flex flex-col gap-3">
                  {project.whatIBuilt.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-body text-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {project.features && project.features.length > 0 ? (
            <div className="lg:col-start-2">
              <SectionLabel>Key Features</SectionLabel>
              <ul className="mt-4 flex flex-col gap-4">
                {project.features.map((feature) => (
                  <li
                    key={feature.title}
                    className="rounded-xl border border-border bg-surface p-5"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-dim"
                    >
                      <FeatureIcon icon={feature.icon} />
                    </span>
                    <h3 className="mt-3 text-body font-semibold text-text">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-small text-text-muted">
                      {feature.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Technical detail, kept out of the main reading path (§6). */}
          <aside className="lg:col-start-3 lg:border-l lg:border-border lg:pl-8">
            <SectionLabel>Project Details</SectionLabel>
            <dl className="mt-4 flex flex-col gap-4">
              <div>
                <dt className="text-small text-text-muted">Category</dt>
                <dd className="mt-1 text-body text-text">{categoryLabel}</dd>
              </div>

              {project.role ? (
                <div>
                  <dt className="text-small text-text-muted">Role</dt>
                  <dd className="mt-1 text-body text-text">{project.role}</dd>
                </div>
              ) : null}

              <div>
                <dt className="text-small text-text-muted">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-3 py-1 text-small text-text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>

              {project.year ? (
                <div>
                  <dt className="text-small text-text-muted">Year</dt>
                  <dd className="mt-1 text-body text-text">{project.year}</dd>
                </div>
              ) : null}

              {project.externalLink ? (
                <div>
                  <dt className="text-small text-text-muted">Link</dt>
                  <dd className="mt-1">
                    <a
                      href={project.externalLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 break-all text-small font-medium text-accent hover:text-accent-hover"
                    >
                      {project.externalLink.href.replace(/^https?:\/\//, "")}
                      <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </section>

      {/*
        CONDITIONAL ON PURPOSE — §11 forbids inventing a result, so a project
        without an owner-confirmed number has no result section at all. The
        Restaurant Sales Parser is the one that matters here: it is the
        flagship, its numbers are §16's still-open decision, and it renders
        with no result section until they arrive.
      */}
      {project.result ? (
        <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <SectionLabel>Result</SectionLabel>
          <h2 className="mt-2 max-w-[24ch] text-h2 text-text">
            What changed
          </h2>
          <p className="mt-4 max-w-[70ch] text-body text-text">
            {project.result}
          </p>

          {project.metrics && project.metrics.length > 0 ? (
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-border bg-surface-2 px-4 py-4"
                >
                  <dt className="text-small text-text-muted">
                    {metric.label}
                  </dt>
                  <dd className="mt-1 text-h3 text-text">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      ) : null}

      {project.images && project.images.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <SectionLabel>Screenshots</SectionLabel>
          <ScreenshotCarousel images={project.images} className="mt-6" />
        </section>
      ) : null}

      {project.beforeAfter && project.beforeAfter.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <SectionLabel>Before / After</SectionLabel>
          <BeforeAfterCompare pairs={project.beforeAfter} className="mt-6" />
        </section>
      ) : null}
    </>
  );
}
