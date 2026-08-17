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
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        {/*
          Warm gradient panel, anchored top-left, fading into the surface
          tone — §9.4's "soft radial glow beats a black box-shadow" applied to
          the panel itself rather than just a hover state. No border: depth
          comes from the gradient alone, matching the mockup exactly.

          MEASURED, NOT GUESSED — twice now. Peak colour: sampling the
          mockup's brightest pixel gives ~rgb(90,32,2) against a ~rgb(15,10,6)
          panel base, which is --color-accent at ~30% opacity composited over
          --color-surface (confirmed by re-deriving the same numbers from this
          exact CSS: 255×0.3+20×0.7≈90, 106×0.3+18×0.7≈44, 26×0.3+18×0.7≈20 —
          R matches almost exactly; the mockup's G/B run a little lower,
          which --color-accent's own defined hue can't fully replicate without
          inventing an off-token colour, so this stays as the closest
          faithful match rather than chasing an exact G/B match §9.1 doesn't
          license.

          Panel proportions: the mockup's panel measures 917×90px at its own
          scale — a ~10:1 bar, not a box. The gradient's reach is sized
          relative to that: at native scale it's ~90%+ decayed by ~65-70% of
          the panel's width, not the ~85% this used before, which is what
          read as "stretching too far right."
        */}
        <div
          className="flex flex-col gap-4 rounded-2xl px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5"
          style={{
            background:
              "radial-gradient(ellipse 90% 100% at 0% 0%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 65%), var(--color-surface)",
          }}
        >
          <div>
            <h2 id="cta-heading" className="max-w-[26ch] text-h3 text-text">
              {title}
            </h2>
            <p className="mt-1.5 max-w-[48ch] text-small text-text-muted">
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
