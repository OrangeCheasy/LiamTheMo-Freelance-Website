import Link from "next/link";
import { CTA } from "@/lib/nav";
import type { ServiceSlug } from "@/lib/types";

/*
  The reusable bottom-of-page conversion block (CLAUDE.md §5, §15 Phase 2).

  It exists because of success criterion 2 in §2 — every page ends with a path to
  the quote form — and building it once here means the service, portfolio and
  about pages inherit it at steps 3, 4 and 6 rather than each growing its own.

  Server component. It is a heading, a paragraph and a link.

  The reply promise is not marketing copy invented here: §8 fixes the wording of
  the form's success state as "I'll reply within one business day", and saying
  something different before the click than after it would be a broken promise.

  MOCKUP PANEL: the warm radial gradient is Phase 2's home-page treatment —
  no border on the panel itself (owner correction after the first pass added
  one the mockup doesn't have); depth comes from the gradient alone, per
  §9.4's "glow over box-shadow." `title`/`description`/`ctaLabel` stay
  overridable because every other page using this component (services,
  portfolio, about) has its own, page-specific copy — the mockup only shows
  the home page, so only the home page's call passes mockup-exact copy. The
  panel styling itself (gradient, pill button) applies everywhere, since
  that's a visual system choice, not page content.
*/

interface CTASectionProps {
  title?: string;
  description?: string;
  /** Overrides the shared CTA.label ("Contact now") for this one instance —
      only the home page needs "Get In Touch" to match the mockup. */
  ctaLabel?: string;
  /** Optional second, lower-commitment destination. */
  secondary?: { href: string; label: string };
  /**
   * When set, the primary link carries `?topic=<slug>` so /contact prefills
   * the service field (§7: a visitor who already told us the category must
   * not be asked again). Only the service-detail page has a single topic to
   * pass — every other CTASection usage stays generic.
   */
  topic?: ServiceSlug;
}

export default function CTASection({
  title = "Tell me what you're trying to get done",
  description = "Describe the problem in plain words. I'll reply within one business day with what it would take.",
  ctaLabel,
  secondary,
  topic,
}: CTASectionProps) {
  const ctaHref = topic ? `${CTA.href}?topic=${topic}` : CTA.href;

  return (
    <section aria-labelledby="cta-heading" className="bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/*
          Warm gradient panel, anchored top-left, fading into the surface
          tone — §9.4's "soft radial glow beats a black box-shadow" applied to
          the panel itself rather than just a hover state. No border: depth
          comes from the gradient alone, matching the mockup exactly.
        */}
        <div
          className="flex flex-col gap-6 rounded-2xl px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-8"
          style={{
            background:
              "radial-gradient(ellipse 130% 160% at 0% 0%, var(--color-accent-dim), transparent 85%), var(--color-surface)",
          }}
        >
          <div>
            <h2 id="cta-heading" className="max-w-[26ch] text-h2 text-text">
              {title}
            </h2>
            <p className="mt-3 max-w-[48ch] text-body text-text-muted">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/*
              min-w on the primary button, not just content-fit padding: in
              the mockup this button measures ~1.5x wider than the hero's
              "View My Work" pill despite similar-length text — a deliberate
              long-pill shape, not accidental sizing.
            */}
            <Link
              href={ctaHref}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-accent px-6 py-2 font-medium text-text transition-all duration-200 hover:border-accent-hover hover:shadow-[0_0_24px_var(--color-accent-dim)] sm:min-w-[240px]"
            >
              {ctaLabel ?? CTA.label}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </Link>
            {secondary ? (
              <Link
                href={secondary.href}
                className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
