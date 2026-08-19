import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import { projects } from "@/data/projects";
import { warmGlow } from "@/lib/glow";
import { SERVICE_META } from "@/lib/types";

/*
  Case study template (CLAUDE.md §5, §6, §15 step 4). One file drives every
  entry in `projects` — adding a project means adding data, not a page.

  STRUCTURE IS PROBLEM -> SOLUTION -> RESULT (§6), in that order, and the
  stack never leads. Those are the three things a small-business reader
  actually wants, and a restaurant owner cares that Monday went from two
  hours to five minutes, not that it uses pandas — so the stack sits in a
  sidebar for the technical reader who came looking for it.

  PHASE R4 RESTYLE.
  Same move R3 made on the service pages: this file used full-bleed
  `border-b bg-surface` bands at py-16/py-20 and the Eyebrow rule, while the
  home page and service pages use plain max-w-6xl containers with an accent
  micro-label above each heading. It now matches them. §9.2 says section
  labels are not accent; §9 makes the mockup authoritative where they
  disagree, and the mockup ships them in accent — same documented override as
  the other two templates.

  THE PROBLEM BLOCK carries the focal treatment, mirroring the service pages'
  `problems` panel: a warmGlow() panel at the shared defaults, one step up the
  type scale. It is the section that makes a reader recognise their own
  situation, and the solution only matters once they have. The prominence is
  built from glow and contrast, never from accent — nothing in that panel is
  clickable (§9.2, §9.4).

  IMAGES (§12).
  `cover` is the lead image and the LCP element, so it alone gets `priority`.
  Every gallery figure below it is explicitly lazy. The gallery filters out
  any figure whose src matches the cover, so a project whose only asset is
  its cover shows it once rather than twice.
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

// The label above each section heading — the home page's "About Me" pairing,
// and the same component shape the service template uses.
function SectionLabel({ children }: { children: string }) {
  return <p className="text-small font-medium text-accent">{children}</p>;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const { cover } = project;
  const gallery = (project.images ?? []).filter(
    (image) => !(cover.kind === "image" && image.src === cover.src),
  );

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
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

        {/*
          The lead image, and the LCP element on this page — the only image
          here that is eager. Rendered only for a real cover: a `tile` cover
          is a card-grid device, and blown up to full content width it would
          be a large empty wash of colour rather than a design.
        */}
        {cover.kind === "image" ? (
          <div className="relative mt-8 aspect-[3/2] w-full overflow-hidden rounded-2xl border border-border bg-surface-2">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              priority
              // The container is max-w-6xl (1152px) minus 2rem padding each
              // side, so it never renders wider than 1088px.
              sizes="(min-width: 1152px) 1088px, 100vw"
              className={
                cover.fit === "contain" ? "object-contain" : "object-cover"
              }
            />
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0 space-y-10">
            {/*
              The focal block. Glow panel at warmGlow()'s shared defaults —
              the same call the closing CTA and the service pages' problems
              panel make, so all three are one treatment at three sizes
              rather than three gradients that merely resemble each other.
            */}
            <div
              className="overflow-hidden rounded-2xl p-6 sm:p-8"
              style={{ background: warmGlow() }}
            >
              <SectionLabel>The problem</SectionLabel>
              <h2 className="mt-2 max-w-[24ch] text-h2 text-text">
                What needed fixing
              </h2>
              {/* text-h3 rather than text-body: one step up the scale is what
                  makes this the focal block without reaching for colour. */}
              <p className="mt-6 max-w-[62ch] text-h3 text-text">
                {project.problem}
              </p>
            </div>

            <div>
              <SectionLabel>The solution</SectionLabel>
              <h2 className="mt-2 max-w-[24ch] text-h2 text-text">
                What got built
              </h2>
              <p className="mt-4 max-w-[70ch] text-body text-text">
                {project.solution}
              </p>
            </div>

            {/*
              CONDITIONAL ON PURPOSE — §11 forbids inventing a result, so a
              project without an owner-confirmed number has no result section
              at all rather than a placeholder, an em dash, or a
              plausible-sounding estimate. The Restaurant Sales Parser is the
              one that matters here: it is the flagship, its numbers are
              §16's still-open decision, and it renders with no result
              section until they arrive. See the TODO(owner) block in
              src/data/projects.ts.
            */}
            {project.result ? (
              <div>
                <SectionLabel>The result</SectionLabel>
                <h2 className="mt-2 max-w-[24ch] text-h2 text-text">
                  What changed
                </h2>
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

            {/* Real screenshots beat any illustration (§9) — shown only once
                some exist beyond the cover. */}
            {gallery.length > 0 ? (
              <div>
                <SectionLabel>See it in action</SectionLabel>
                <h2 className="mt-2 max-w-[24ch] text-h2 text-text">
                  A closer look
                </h2>
                {/*
                  Single-column when there's just one image: a lone shot
                  inside a 2-up gallery grid renders at half width for no
                  reason. Multiple images still tile 2-up.
                */}
                <div
                  className={`mt-6 grid gap-4 ${gallery.length > 1 ? "sm:grid-cols-2" : ""}`}
                >
                  {gallery.map((image) => (
                    <figure
                      key={image.src}
                      className="self-start overflow-hidden rounded-xl border border-border"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width ?? 1536}
                        height={image.height ?? 1024}
                        // Below the fold, always (§12).
                        loading="lazy"
                        // The content column is 784px at lg; a 2-up figure in
                        // it is 384px. Both well under the source width, so
                        // this is what stops a 1600px asset being fetched to
                        // fill a 384px box.
                        sizes={
                          gallery.length > 1
                            ? "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                            : "(min-width: 1024px) 784px, 100vw"
                        }
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
            <SectionLabel>Built with</SectionLabel>
            <h2 className="mt-2 text-h3 text-text">The stack</h2>
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
              One half of the cross-linking loop: each case study links back
              to the services it demonstrates. The other half — a service page
              listing this project under related work — is driven by the same
              `project.services` field, resolved in reverse by
              `projectsForService()` in src/data/projects.ts. One field, both
              directions, so they cannot disagree.
            */}
            {project.services.length > 0 ? (
              // mt-10 separates this from the stack chips above it. The
              // Eyebrow this replaced carried the same gap as a className;
              // SectionLabel takes no props, so the spacing lives on the
              // wrapper instead of being quietly lost.
              <div className="mt-10">
                <SectionLabel>
                  {project.services.length > 1
                    ? "Related services"
                    : "Related service"}
                </SectionLabel>
                <h2 className="mt-2 text-h3 text-text">
                  What this demonstrates
                </h2>
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
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <CTASection secondary={{ href: "/portfolio", label: "See more work" }} />
    </>
  );
}
