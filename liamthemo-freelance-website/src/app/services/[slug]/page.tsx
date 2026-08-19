import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import ProjectCard from "@/components/ProjectCard";
import { projectsForService } from "@/data/projects";
import { commonFaqs, getService, serviceSlugs } from "@/data/services";
import { warmGlow } from "@/lib/glow";
import { SERVICE_META } from "@/lib/types";

/*
  The detail template. Every one of the five pages is this file — there is no
  per-service JSX anywhere, and there must not be. Everything that differs
  between services is a field on the Service object.

  RENDERING COST (§4.1).
  generateStaticParams prerenders all five at build time, so they are served
  from the assets binding and cost nothing.

  `dynamicParams = false` is the other half of that, and it matters more than it
  looks. Left at its default of true, a request to /services/anything-at-all
  would be rendered on demand — meaning any crawler or scanner hitting made-up
  URLs could invoke the Worker and burn request quota against the daily cap.
  With it false, anything not in generateStaticParams is a static 404.

  PHASE R3 RESTYLE — presentation only.
  Data, routing, generateStaticParams and dynamicParams are untouched. What
  changed is the rhythm: these pages were built before the home page was
  rebuilt, so they still used full-bleed `border-t bg-surface` bands at
  py-16/py-20 and the Eyebrow rule, while the home page moved to plain
  max-w-6xl containers, an accent micro-label above each heading, and the card
  treatment the triage cards use. Two rhythms on one site reads as two sites,
  so this file now follows the home page.

  ACCENT ON SECTION LABELS.
  §9.2 says section labels are not accent. The home page ships them in accent
  anyway ("About Me", "Services"), because the mockup does and §9 makes the
  mockup authoritative where the two disagree. Matching the home page is the
  point of this phase, so the labels here are accent too — noted rather than
  done quietly, since it is §9.2 being overridden by §9's own precedence rule.

  ROBLOX.
  §11 allows technical language on that page only, and it is already there, in
  the data (DataStore, session locking, Luau, Rojo). This template renders it
  verbatim, and every heading below is register-neutral so the same framing
  works for a restaurant owner and for a studio. Roblox-specific framing copy
  would need a new field on Service, not a per-slug branch in this file.
*/

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return {};

  // The tagline doubles as the meta description. That is why the location for
  // local tech help lives in that field (§11 wants location terms on that page)
  // rather than in a special case here.
  return {
    title: service.title,
    description: service.tagline,
    openGraph: {
      type: "website",
      title: service.title,
      description: service.tagline,
    },
  };
}

// Numbered markers are correct here and only here: the process genuinely is a
// sequence, which §9 calls out as the exception to its "no 01 / 02 / 03" rule.
// Neutral, not accent (§9.2) — it's an informational marker, not a control.
function StepNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-small font-semibold text-text"
    >
      {n}
    </span>
  );
}

// The label above each section heading — the home page's "About Me" / "Services"
// pairing. See the accent note at the top of this file.
function SectionLabel({ children }: { children: string }) {
  return <p className="text-small font-medium text-accent">{children}</p>;
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);

  // Unreachable while dynamicParams is false, but it is what makes the type
  // narrow and it keeps the page correct if that config ever changes.
  if (!service) notFound();

  const faqs = [...service.faqs, ...commonFaqs];
  const related = projectsForService(service.slug);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
        {/*
          The service's identity hue on the same chip the home page's triage
          cards use, so arriving from that section lands on a visibly matching
          page. SERVICE_META rather than a third copy of the colour map — it
          already feeds the OG images and the project cards. The glyph still
          comes from the data, so `icon` stays the single source of truth for
          which emoji a service uses.
        */}
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${SERVICE_META[service.slug].chipClass}`}
        >
          {service.icon}
        </span>
        <h1 className="mt-5 max-w-[20ch] text-h1 text-text">{service.title}</h1>
        <p className="mt-4 max-w-[52ch] text-body text-text-muted">
          {service.tagline}
        </p>
      </section>

      {/*
        Problems, immediately under the heading and carrying the most visual
        weight on the page. §6 calls this the field that makes a non-technical
        visitor recognise themselves; deliverables and process only matter once
        they believe the page is about them, so those follow and share a row.

        The prominence is built from a glow panel, a step up the type scale and
        card contrast — deliberately not from accent, because none of this is
        clickable (§9.2). §9.4 names this exact treatment: a soft radial glow
        behind a focal element.

        The glow is `warmGlow()` at its panel defaults — the same call the
        closing CTA makes, so the two panels are the same treatment at two
        sizes rather than two gradients that merely resemble each other (owner
        request, 2026-08-18). It replaced a simpler two-stop accent-dim radial,
        which read as a flat wash next to the CTA's fitted falloff. No hover
        layer here: nothing in this panel is clickable.
      */}
      <section
        aria-labelledby="problems-heading"
        className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8"
      >
        <div
          className="overflow-hidden rounded-2xl p-6 sm:p-10"
          style={{ background: warmGlow() }}
        >
          <div>
            <SectionLabel>Sound familiar?</SectionLabel>
            <h2
              id="problems-heading"
              className="mt-2 max-w-[24ch] text-h2 text-text"
            >
              If any of these are you, this is the right page
            </h2>

            {/*
              text-h3 rather than text-body: one step up the scale is what makes
              this the focal block without reaching for colour. Quoted, because
              these are the visitor's own words rather than a feature list.
            */}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.problems.map((problem) => (
                <li
                  key={problem}
                  className="rounded-xl border border-border bg-surface-2 p-5 text-h3 text-text"
                >
                  &ldquo;{problem}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/*
        Deliverables and process share one row on desktop. Stacked, they read as
        two more full-weight sections competing with the problems block above;
        side by side they read as the supporting detail they are, and the page
        loses about a screen of scrolling.
      */}
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-2 lg:gap-14">
        <section aria-labelledby="deliverables-heading">
          <SectionLabel>What you get</SectionLabel>
          <h2
            id="deliverables-heading"
            className="mt-2 max-w-[24ch] text-h2 text-text"
          >
            What you actually receive
          </h2>
          <ul className="mt-6 flex flex-col gap-4">
            {service.deliverables.map((item) => (
              <li key={item} className="flex gap-3">
                {/* Decorative bullet, not clickable — neutral, not accent (§9.2). */}
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted"
                />
                <span className="text-body text-text">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="process-heading">
          <SectionLabel>How it works</SectionLabel>
          <h2
            id="process-heading"
            className="mt-2 max-w-[24ch] text-h2 text-text"
          >
            From first message to finished
          </h2>
          <ol className="mt-6 flex flex-col gap-5">
            {service.process.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <StepNumber n={index + 1} />
                <span className="pt-1 text-body text-text">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/*
        Service-specific questions first, then the policies shared by every
        service. Rendered as real <details> elements: no JavaScript, keyboard
        accessible and open-by-default for search engines and printing.
      */}
      <section
        aria-labelledby="faq-heading"
        className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8"
      >
        <SectionLabel>Questions</SectionLabel>
        <h2 id="faq-heading" className="mt-2 max-w-[24ch] text-h2 text-text">
          Before you get in touch
        </h2>
        <div className="mt-6 flex max-w-[70ch] flex-col">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group border-b border-border py-4 first:border-t"
            >
              <summary className="cursor-pointer list-none font-medium text-text marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-text-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-[60ch] text-body text-text-muted">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/*
        RELATED WORK — the reverse half of the cross-linking loop, added in R4.
        R3 deferred this as "new content rather than a restyle"; it lands now
        because the case study side of the loop was rebuilt in the same phase
        and shipping only one direction would leave a service page as a dead
        end for a visitor who wants proof before they fill in the form.

        Driven by `projectsForService()`, which filters on `Project.services`
        — the same field the case studies read to link back here. Deliberately
        NOT `service.relatedProjects`: see that function's note in
        src/data/projects.ts for why a derived list is the one that cannot
        drift.

        Renders nothing when a service has no projects yet, rather than an
        empty heading. Every service has at least one today, but that is a
        property of the current data, not a guarantee.

        The cards are the same ProjectCard the portfolio index uses, so a
        visitor arriving here recognises them. All lazy — this sits below the
        FAQ, a long way down the page.
      */}
      {related.length > 0 ? (
        <section
          aria-labelledby="related-work-heading"
          className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8"
        >
          <SectionLabel>Proof</SectionLabel>
          <h2
            id="related-work-heading"
            className="mt-2 max-w-[24ch] text-h2 text-text"
          >
            Work like this
          </h2>
          <p className="mt-4 max-w-[52ch] text-body text-text-muted">
            What this looks like when it is finished.
          </p>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </ul>
        </section>
      ) : null}

      <CTASection
        title={`Tell me about your ${service.title.toLowerCase()} problem`}
        // There is still no /services index (§7 — the home page's Services
        // section replaced it), but that section now owns the #services anchor,
        // so this lands on the list of services rather than at the top of the
        // home page the way it used to.
        secondary={{ href: "/#services", label: "See other services" }}
        topic={service.slug}
      />
    </>
  );
}
