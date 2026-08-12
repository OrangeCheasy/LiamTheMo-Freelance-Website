import Link from "next/link";
import { CTA } from "@/lib/nav";

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
}

export default function CTASection({
  title = "Tell me what you're trying to get done",
  description = "Describe the problem in plain words. I'll reply within one business day with what it would take.",
  secondary,
}: CTASectionProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="border-t border-line bg-surface"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {/*
          Pastel fill with an ink heading on top — legal under §9.2 because the
          pastel is a filled area, never the text. The border is required: on a
          light surface the fill is only ~1.5:1 against the page, so without it
          the block's own edge disappears.
        */}
        <div className="rounded-2xl border border-accent bg-accent-fill px-6 py-10 sm:px-10 sm:py-12">
          <h2
            id="cta-heading"
            className="max-w-[22ch] text-h2 text-accent-fill-ink"
          >
            {title}
          </h2>
          <p className="mt-3 max-w-[56ch] text-body text-accent-fill-ink">
            {description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/*
              Inverted against the pastel band: the surface-coloured button is
              what carries the contrast here, since a pastel button on a pastel
              band would have no edge at all.
            */}
            <Link
              href={CTA.href}
              className="inline-flex items-center justify-center rounded-lg border border-accent bg-surface px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-surface-muted"
            >
              {CTA.label}
            </Link>
            {secondary ? (
              <Link
                href={secondary.href}
                className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium text-accent-fill-ink underline underline-offset-4 transition-colors hover:bg-accent-fill-hover"
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
