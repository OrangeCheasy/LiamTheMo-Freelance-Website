import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import Eyebrow from "@/components/Eyebrow";
import { commonFaqs, getService, serviceSlugs } from "@/data/services";

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

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);

  // Unreachable while dynamicParams is false, but it is what makes the type
  // narrow and it keeps the page correct if that config ever changes.
  if (!service) notFound();

  const faqs = [...service.faqs, ...commonFaqs];

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16">
        <span aria-hidden="true" className="block text-4xl">
          {service.icon}
        </span>
        <h1 className="mt-4 max-w-[20ch] text-h1 text-text">{service.title}</h1>
        <p className="mt-4 max-w-[52ch] text-body text-text-muted">
          {service.tagline}
        </p>
      </section>

      {/*
        Problems first, immediately under the hero. §6 calls this the field that
        makes a non-technical visitor recognise themselves, so it gets the most
        valuable position on the page — ahead of what I deliver and how I work,
        both of which only matter once they think it is about them.
      */}
      <section
        aria-labelledby="problems-heading"
        className="border-t border-border bg-surface"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Sound familiar?</Eyebrow>
          <h2
            id="problems-heading"
            className="mt-3 max-w-[24ch] text-h2 text-text"
          >
            If any of these are you, this is the right page
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {service.problems.map((problem) => (
              <li
                key={problem}
                className="rounded-xl border border-border bg-surface-2 p-5 text-body text-text"
              >
                &ldquo;{problem}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="deliverables-heading"
        className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
      >
        <Eyebrow>What you get</Eyebrow>
        <h2
          id="deliverables-heading"
          className="mt-3 max-w-[24ch] text-h2 text-text"
        >
          What you actually receive
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {service.deliverables.map((item) => (
            <li key={item} className="flex gap-3">
              {/* Decorative bullet, not clickable — neutral, not accent (§9.2). */}
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted"
              />
              <span className="text-body text-text">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="process-heading"
        className="border-t border-border bg-surface"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>How it works</Eyebrow>
          <h2
            id="process-heading"
            className="mt-3 max-w-[24ch] text-h2 text-text"
          >
            From first message to finished
          </h2>
          <ol className="mt-8 flex flex-col gap-5">
            {service.process.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <StepNumber n={index + 1} />
                <span className="pt-1 text-body text-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/*
        Service-specific questions first, then the policies shared by every
        service. Rendered as real <details> elements: no JavaScript, keyboard
        accessible and open-by-default for search engines and printing.
      */}
      <section
        aria-labelledby="faq-heading"
        className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
      >
        <Eyebrow>Questions</Eyebrow>
        <h2 id="faq-heading" className="mt-3 max-w-[24ch] text-h2 text-text">
          Before you get in touch
        </h2>
        <div className="mt-8 flex max-w-[70ch] flex-col">
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
        `service.relatedProjects` is populated but nothing renders it yet, and
        that is correct rather than unfinished. The Project data does not exist
        until build order step 4, and stubbing placeholder entries to fill the
        space would put invented work on the site (§10). Step 4 adds projects.ts
        and the section that reads it; the slugs are already waiting.
      */}

      <CTASection
        title={`Tell me about your ${service.title.toLowerCase()} problem`}
        // No /services index to send this to anymore — the triage widget on
        // the home page is the de facto services index now.
        secondary={{ href: "/", label: "See other services" }}
        topic={service.slug}
      />
    </>
  );
}
