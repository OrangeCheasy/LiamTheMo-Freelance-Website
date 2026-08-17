import type { ReactNode } from "react";

/*
  Emphasises a single keyword inside a heading — a marker stroke sitting behind
  the bottom third of the word, heading text riding on top.

  NEUTRAL, NOT ACCENT. The old light/dark version of this component used the
  accent fill here — the site's only sanctioned exception to "orange marks
  actions and current state" (§9.2), justified by a light/dark contrast
  tradeoff that no longer exists now the site is dark-only. The redesign doc
  restates §9.2 and §9.6's "orange on non-interactive elements" anti-goal
  without carrying that exception forward, and a heading is not clickable, so
  this phase drops the accent rather than assume the carve-out survived. The
  stroke now uses --color-surface-2 — visible against --color-bg without
  competing with the accent for the reader's attention.

  The stroke is aria-hidden and purely visual: <mark> would imply relevance-to-a-
  search-query semantics that do not apply here, and a screen reader announcing
  "highlighted, time" adds nothing to a sentence that already reads correctly.
*/

interface MarkProps {
  children: ReactNode;
}

/*
  THE STROKE IS A BACKGROUND GRADIENT, NOT A POSITIONED ELEMENT — deliberately.

  The obvious build is an absolutely-positioned bar inside a relative wrapper.
  It was measurably wrong here. At the display size this heading uses, the font's
  glyph box is 72px tall while the line box is only 63px, because --text-display
  sets a tight 1.05 line-height: the letterforms overflow their own container by
  several pixels at both ends. Anchoring a bar to `bottom: 0` of that container
  therefore lands it somewhere unrelated to the baseline, and the error changes
  the moment the line-height or the fluid font size does.

  An inline element's background paints over its CONTENT box, which is the font
  box — ascent to descent. That box is anchored to the font metrics rather than
  the line box, so the two hard stops below stay locked to the letterforms at
  every size in the clamp() range, with no line-height coupling at all.

  IT IS AN UNDERLINE, NOT A HIGHLIGHT.

  A stroke crossing the lower third of the letterforms looks better than a
  full-height highlight and stays legible: --color-surface-2 sits close enough
  in value to --color-bg that it reads as a mark, not a block, so the
  overlapped part of the word never loses contrast against --color-text.

  The stops: fill from 0.08em to 0.25em above the bottom of the font box. The
  baseline sits ~0.27em above that edge, so the band clears the letterforms by a
  hair. A marked word containing a descender would cross it, exactly as a normal
  underline does.

  Written as one unbroken literal on purpose. Tailwind scans source TEXT for
  complete class names, so splitting this across concatenated strings to make it
  read nicely would mean the utility is never generated and the stroke silently
  disappears.
*/
// prettier-ignore
const stroke = "bg-[linear-gradient(to_top,transparent_0.08em,var(--color-surface-2)_0.08em,var(--color-surface-2)_0.25em,transparent_0.25em)]";

export default function Mark({ children }: MarkProps) {
  return (
    // whitespace-nowrap so the stroke can never be split across two lines, which
    // would leave a bar hanging under a fragment of the word.
    <span className={`whitespace-nowrap ${stroke}`}>{children}</span>
  );
}
