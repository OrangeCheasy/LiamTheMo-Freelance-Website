import Link from "next/link";
import { CTA } from "@/lib/nav";
import type { ServiceSlug } from "@/lib/types";

/*
  The reusable bottom-of-page conversion block (CLAUDE.md §5).

  It exists because of success criterion 2 in §2 — every page ends with a path to
  the quote form — and building it once here means the service, portfolio and
  about pages inherit it at steps 3, 4 and 6 rather than each growing its own.

  Server component. It is a heading, a paragraph and two links.

  The reply promise is not marketing copy invented here: §8 fixes the wording of
  the form's success state as "I'll reply within one business day", and saying
  something different before the click than after it would be a broken promise.
*/

interface CTASectionProps {
  title?: string;
  description?: string;
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
  secondary,
  topic,
}: CTASectionProps) {
  const ctaHref = topic ? `${CTA.href}?topic=${topic}` : CTA.href;

  return (
    <section
      aria-labelledby="cta-heading"
      className="border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {/*
          Neutral panel, not accent (§9.2) — the band itself isn't clickable,
          only the button inside it is, so the band stays a surface and the
          accent goes on the one element that earns it.
        */}
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 sm:px-10 sm:py-12">
          <h2 id="cta-heading" className="max-w-[22ch] text-h2 text-text">
            {title}
          </h2>
          <p className="mt-3 max-w-[56ch] text-body text-text-muted">
            {description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-lg border border-accent bg-accent px-5 py-2.5 font-semibold text-bg transition-colors hover:bg-accent-hover"
            >
              {CTA.label}
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
