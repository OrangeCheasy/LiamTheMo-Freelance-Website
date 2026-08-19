import Link from "next/link";
import { warmGlowImage } from "@/lib/glow";
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
  /** Overrides the shared CTA.label ("Contact Me") for this one instance —
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

/**
 * The deep-brown overlay, at the low opacity the mockup's panel implies.
 * Expressed with color-mix so the colour itself stays a token (§9.1) rather
 * than being respelled as an rgba() literal here.
 */
const PANEL_TINT =
  "color-mix(in srgb, var(--color-panel-brown) 16%, transparent)";

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

          The gradient itself now comes from `warmGlow()` in src/lib/glow.ts,
          where the full derivation from the mockup's pixel data is written up.
          It moved there when the owner asked for the home page's service cards
          to carry the same glow — two hand-copied stop lists would have drifted
          the first time either was touched. The default arguments reproduce
          what was inline here byte for byte, so this panel is unchanged.
        */}
        {/*
          THREE BACKGROUND LAYERS, and the order is the whole point. CSS
          paints the first layer on top, so this reads: deep-brown overlay,
          then the warm glow, then the page-dark base underneath.

          The brown has to be ABOVE the gradient. The owner's note was that
          this panel looked brighter and more orange than the mockup, and
          sampling the mockup bears it out — its field is #100c09 and its
          brightest corner only #201008, where the old build ran the glow at
          peak 32 over --color-surface and landed several times hotter. A
          darker base alone cannot fix that, because the glow is painted on
          top of the base; only a layer over the glow mutes the orange.

          Peak dropped 32 -> 14 for the same reason. That number was fitted
          from the PREVIOUS mockup (the derivation is still in glow.ts and
          still correct for the panels that use the default); this panel is
          simply darker in the new one. Every other warmGlow() caller is
          untouched — the change is an argument here, not a new default.
        */}
        <div
          className="relative flex flex-col gap-4 rounded-2xl px-6 pt-4 pb-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pt-5 sm:pb-4"
          style={{
            background: `linear-gradient(${PANEL_TINT}, ${PANEL_TINT}), ${warmGlowImage({ peak: 14 })}, var(--color-bg)`,
          }}
        >
          {/*
            THE GLOWING BORDER (owner call). The same fitted falloff as the
            panel fill behind it, run at a much higher peak so it reads as a
            lit edge rather than a wash — brightest at the top-left corner the
            glow originates from, gone by the opposite corner. That is the
            point: a flat 1px border would contradict §9.4's "depth comes from
            contrast and warm glow, not hard edges", whereas a border that
            fades with the same curve is the glow's own outline.

            Drawn as a masked ring rather than a `border`, because a border
            takes a single colour and this one is a gradient: the element is
            filled edge to edge with the gradient, then masked so only its
            1px padding survives. `mask-composite: exclude` (and the -webkit-
            spelling for Safari) is what subtracts the middle.

            Not accent-coloured by accident — the glow colour is the one
            documented exception in glow.ts, and this panel is a surface, not
            a control, so §9.2 is not in play.
          */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              padding: "1px",
              backgroundImage: warmGlowImage({ peak: 95 }),
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
            }}
          />

          <div>
            <h2 id="cta-heading" className="max-w-[26ch] text-h3 text-text">
              {title}
            </h2>
            {/*
              whitespace-pre-line stays so a caller can still force a break
              with a literal \n, though no caller does any more — the home
              page's version used to and now runs as one line (owner call).

              max-w raised 48ch -> 70ch for that: at 48ch the home page's
              sentence wrapped no matter what the string did. 70ch is still a
              real measure rather than "no limit", so a longer description on
              another page cannot run the full width of the panel.

              font-light is the "thinner" the owner asked for. Inter is loaded
              as a variable font (see layout.tsx), so weight 300 is a real
              instance here, not a browser-synthesised fake.
            */}
            <p className="mt-1.5 max-w-[70ch] whitespace-pre-line text-small font-light text-text-muted">
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
