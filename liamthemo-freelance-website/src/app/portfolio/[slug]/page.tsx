import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import Eyebrow from "@/components/Eyebrow";
import { projects } from "@/data/projects";
import { SERVICE_META } from "@/lib/types";

/*
  Case study template (CLAUDE.md §5, §6, §14 step 4). One file drives every
  entry in `projects` — adding a project means adding data, not a page.

  Structured problem -> solution -> result, not a feature list (§6): those are
  the three things a small-business reader actually wants to know, in that
  order. The stack lives in a sidebar for technical readers and never leads.

  Fully static: generateStaticParams prerenders one page per project at build
  time, so this is served from the assets binding, not the Worker (§4.1).
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Link
            href="/portfolio"
            className="text-small font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
          >
            ← Projects
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

          {project.externalLink ? (
            <a
              href={project.externalLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center text-small font-semibold text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              {project.externalLink.label}
              <span aria-hidden="true" className="ml-1">
                ↗
              </span>
            </a>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0 space-y-10">
            <div>
              <Eyebrow as="h2">The problem</Eyebrow>
              <p className="mt-4 max-w-[70ch] text-body text-text">
                {project.problem}
              </p>
            </div>

            <div>
              <Eyebrow as="h2">The solution</Eyebrow>
              <p className="mt-4 max-w-[70ch] text-body text-text">
                {project.solution}
              </p>
            </div>

            {/*
              Conditional on purpose: §10 forbids inventing a result, so a
              project without an owner-confirmed number has no result section
              at all rather than a placeholder. See the TODO in
              src/data/projects.ts.
            */}
            {project.result ? (
              <div>
                <Eyebrow as="h2">The result</Eyebrow>
                <p className="mt-4 max-w-[70ch] text-body text-text">
                  {project.result}
                </p>

                {/* Neutral, not accent (§9.2) — an informational stat panel,
                    not a control. */}
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
                        <dd className="mt-1 text-h3 text-text">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            ) : null}

            {/* Real screenshots beat any illustration (§9) — shown only once some exist. */}
            {project.images && project.images.length > 0 ? (
              <div>
                <Eyebrow as="h2">See it in action</Eyebrow>
                {/*
                  Single-column when there's just one image: a lone shot
                  inside a 2-up gallery grid renders at half width for no
                  reason. Multiple images still tile 2-up.
                */}
                <div
                  className={`mt-4 grid gap-4 ${project.images.length > 1 ? "sm:grid-cols-2" : ""}`}
                >
                  {project.images.map((image) => (
                    <figure
                      key={image.src}
                      className="self-start overflow-hidden rounded-xl border border-border"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width ?? 1536}
                        height={image.height ?? 1024}
                        className="h-auto w-full"
                      />
                      {image.caption ? (
                        <figcaption className="border-t border-border bg-surface px-4 py-2 text-small text-text-muted">
                          {image.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Technical detail, kept out of the main reading path (§6). */}
          <aside className="lg:border-l lg:border-border lg:pl-8">
            <Eyebrow as="h2">Built with</Eyebrow>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border px-3 py-1 text-small text-text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {/*
              The other half of the cross-linking loop (CLAUDE.md instructions
              for this step): each case study links back to the services it
              demonstrates. The reverse direction — a service page listing this
              project under "related work" — lives on the service page itself
              once build order step 3 exists; Service.relatedProjects already
              anticipates it.
            */}
            {project.services.length > 0 ? (
              <>
                <Eyebrow as="h2" className="mt-10">
                  Related services
                </Eyebrow>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {project.services.map((serviceSlug) => (
                    <li key={serviceSlug}>
                      <Link
                        href={`/services/${serviceSlug}`}
                        className="text-small font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
                      >
                        {SERVICE_META[serviceSlug].title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </aside>
        </div>
      </section>

      <CTASection secondary={{ href: "/portfolio", label: "See more work" }} />
    </>
  );
}
