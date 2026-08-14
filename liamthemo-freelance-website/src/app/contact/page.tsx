import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import QuoteForm from "@/components/QuoteForm";
import { SERVICE_META, type ServiceSlug } from "@/lib/types";

/*
  The quote form page (CLAUDE.md §8, build order step 6) — every other page on
  the site funnels here (§2's second success criterion).

  DYNAMIC, DELIBERATELY, AND ONLY THIS FAR. Reading `searchParams` to prefill
  the service field opts this route out of static generation — Next renders it
  per request rather than serving prerendered HTML from the assets binding
  (§4.1). That is the one architectural cost this build introduces. It buys
  something real: §7 requires that a visitor who already stated their problem
  (via the triage widget or a service page's CTA) is never asked to repeat it,
  which means the prefill has to happen before the form's first paint, not
  after a client-side hydration flash. Every other page in the app remains
  fully static — this is the only route that changed.

  The actual form submission is a separate concern, handled by
  src/app/api/quote/route.ts. This page just renders a <form>; the Worker isn't
  invoked for anything heavier than that until someone clicks send.
*/

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell me what you're trying to get done. I'll reply within one business day with what it would take.",
  openGraph: {
    type: "website",
    title: "Contact",
    description:
      "Tell me what you're trying to get done. I'll reply within one business day with what it would take.",
  },
};

const serviceSlugs = Object.keys(SERVICE_META) as ServiceSlug[];

function resolveTopic(raw: string | undefined): ServiceSlug | "unsure" | "" {
  if (!raw) return "";
  if (raw === "unsure") return "unsure";
  return serviceSlugs.includes(raw as ServiceSlug) ? (raw as ServiceSlug) : "";
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic: rawTopic } = await searchParams;
  const topic = resolveTopic(rawTopic);

  const lowPressure = topic === "unsure";
  const heading = lowPressure
    ? "Not sure what you need? Start here."
    : "Tell me what you're trying to get done";
  const description = lowPressure
    ? "Describe the problem in your own words — I'll figure out what it actually is and reply with what it would take."
    : topic
      ? `You told me it's about ${SERVICE_META[topic].title.toLowerCase()} — fill in the rest and I'll take it from there.`
      : "Fill in what you can. The more specific, the faster I can tell you what it would take.";

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface-muted">
        {/*
          Same dot-grid token as the home hero (§9: "precision, technical,
          tidy", not a gradient blob) — this page had none of the home page's
          texture and read flatter for it. Reused rather than reinvented, so
          it costs nothing new and stays consistent with the one other place
          it appears.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-line)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        />

        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 max-w-[24ch] text-h1 text-ink">{heading}</h1>
          <p className="mt-4 max-w-[56ch] text-body text-ink-muted">
            {description}
          </p>

          {/*
            The direct-email escape hatch the owner asked for. Pastel fill
            with an ink label — same treatment as every other button on the
            site (§9.2), not a one-off style, so it reads as "another way to
            do the same thing" rather than a competing action.
          */}
          <a
            href="mailto:contact@liamthemo.com"
            className="mt-7 inline-flex items-center gap-2.5 rounded-xl border border-accent bg-accent-fill px-5 py-3 font-semibold text-accent-fill-ink transition-colors hover:bg-accent-fill-hover"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            contact@liamthemo.com
          </a>
          <p className="mt-2.5 text-small text-ink-muted">
            Prefer email? Skip the form and write to me directly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <QuoteForm initialService={topic} />
      </section>
    </>
  );
}
