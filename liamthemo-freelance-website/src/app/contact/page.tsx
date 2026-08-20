import type { Metadata } from "next";
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
  (via a service page's CTA — the home page's former triage widget also fed
  this before it was removed, see page.tsx) is never asked to repeat it,
  which means the prefill has to happen before the form's first paint, not
  after a client-side hydration flash. Every other page in the app remains
  fully static — this is the only route that changed.

  `topic=unsure` (the triage widget's old "not sure what I need" option) has
  no link pointing at it anywhere on the site now, but the branch below still
  handles it correctly if reached directly — left in rather than stripped,
  since a future home-page "Services" section may reintroduce an equivalent
  option.

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
      {/*
        PHASE R5 RESTYLE — presentation only, build order step 5. This page
        was built before the home page was rebuilt, so it still opened with a
        full-bleed `border-b bg-surface` band, the home hero's dot-grid, and
        the Eyebrow rule. Services (R3) and Portfolio (R4) both dropped that
        band for a plain max-w-6xl container with an accent micro-label above
        the heading, and neither carries the dot-grid — that texture is the
        home hero's own thing, not a site-wide token. Two rhythms on one site
        reads as two sites, so this section now matches Services and
        Portfolio rather than the home page it originally copied.
      */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
          <p className="text-small font-medium text-accent">Contact</p>
          <h1 className="mt-2 max-w-[24ch] text-h1 text-text">{heading}</h1>
          <p className="mt-4 max-w-[56ch] text-body text-text-muted">
            {description}
          </p>

          {/*
            The direct-email escape hatch the owner asked for. Outlined
            accent pill, not a solid fill — Navbar.tsx made this exact call
            site-wide (see its `ctaClasses` note): "Contact Me" used to be a
            solid accent fill and was the one action-link that didn't match
            its own CTASection styling, so it moved to the outlined
            hover-glow pill every other action-link on the site uses. This
            button was the last one still on the old solid-fill treatment.
          */}
          <a
            href="mailto:contact@liamthemo.com"
            className="group mt-7 inline-flex items-center gap-2.5 rounded-full border border-accent px-5 py-2.5 font-medium text-text transition-all duration-200 hover:border-accent-hover hover:shadow-[0_0_24px_var(--color-accent-dim)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0 text-accent"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            contact@liamthemo.com
          </a>
          <p className="mt-2.5 text-small text-text-muted">
            Prefer email? Skip the form and write to me directly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        {/*
          Card treatment matching every other content block on the site
          (ServiceCard, ProjectCard: rounded-2xl border-border bg-surface) —
          the form used to render as bare fields floating directly on --bg,
          the one place left that didn't carry the site's surface language.
          The form itself no longer sets its own max-width; this wrapper is
          the single place that does, so the two can't drift apart.

          py-6/py-8, not the old py-16/py-20: that padding matched the
          removed full-bleed hero band's rhythm. Services and Portfolio both
          space their stacked container sections at py-6/py-8, so this
          section now closes that gap instead of leaving an oversized band
          between two pages that otherwise match.
        */}
        <div className="mx-auto max-w-[46rem] rounded-2xl border border-border bg-surface p-6 sm:p-10">
          <QuoteForm initialService={topic} />
        </div>
      </section>
    </>
  );
}
