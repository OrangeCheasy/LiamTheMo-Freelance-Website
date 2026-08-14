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
      <section className="border-b border-line bg-surface-muted">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Link
            href="/portfolio"
            className="text-small font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
          >
            ← Portfolio
          </Link>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.services.map((serviceSlug) => (
              <span
                key={serviceSlug}
                className={`rounded-full px-2.5 py-1 text-small font-medium text-ink ${SERVICE_META[serviceSlug].chipClass}`}
              >
                {SERVICE_META[serviceSlug].title}
              </span>
            ))}
          </div>

          <h1 className="mt-4 max-w-[24ch] text-h1 text-ink">
            {project.title}
          </h1>
          <p className="mt-4 max-w-[56ch] text-body text-ink-muted">
            {project.summary}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0 space-y-10">
            <div>
              <Eyebrow as="h2">The problem</Eyebrow>
              <p className="mt-4 max-w-[70ch] text-body text-ink">
                {project.problem}
              </p>
            </div>

            <div>
              <Eyebrow as="h2">The solution</Eyebrow>
              <p className="mt-4 max-w-[70ch] text-body text-ink">
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
                <p className="mt-4 max-w-[70ch] text-body text-ink">
                  {project.result}
                </p>

                {project.metrics && project.metrics.length > 0 ? (
                  <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {project.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-xl border border-accent bg-accent-fill px-4 py-4"
                      >
                        <dt className="text-small text-accent-fill-ink">
                          {metric.label}
                        </dt>
                        <dd className="mt-1 text-h3 text-accent-fill-ink">
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
                      className="overflow-hidden rounded-xl border border-line"
                    >
                      {image.srcDark ? (
                        <>
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={1536}
                            height={1024}
                            className="theme-light-only h-auto w-full"
                          />
                          <Image
                            src={image.srcDark}
                            alt={image.alt}
                            width={1536}
                            height={1024}
                            className="theme-dark-only h-auto w-full"
                          />
                        </>
                      ) : (
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={1536}
                          height={1024}
                          className="h-auto w-full"
                        />
                      )}
                      {image.caption ? (
                        <figcaption className="border-t border-line bg-surface-muted px-4 py-2 text-small text-ink-muted">
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
          <aside className="lg:border-l lg:border-line lg:pl-8">
            <Eyebrow as="h2">Built with</Eyebrow>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line px-3 py-1 text-small text-ink-muted"
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
          </aside>
        </div>
      </section>

      <CTASection secondary={{ href: "/portfolio", label: "See more work" }} />
    </>
  );
}
