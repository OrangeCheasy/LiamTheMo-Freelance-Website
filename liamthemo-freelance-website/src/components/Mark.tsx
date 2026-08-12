import type { ReactNode } from "react";

/*
  Emphasises a single keyword inside a heading — a pastel marker stroke sitting
  behind the bottom third of the word, ink text riding on top.

  WHY A FILL AND NOT COLOURED TEXT.
  Setting the word in coral would be the obvious move and it is the one thing
  §9.2 forbids outright: the pastel is ~1.5:1 on a light surface, so as text it
  fails the 4.5:1 bar, and the dusty tone is reserved for links. A pastel FILL
  with ink on top measures 11.7:1 and is explicitly the sanctioned pattern.

  THE RULE THIS BENDS, STATED PLAINLY.
  §9 says the accent should not appear on a non-clickable element. A heading is
  not clickable. This follows the precedent Phase 1 set with Eyebrow's coral
  rule — accent as a small structural mark rather than as a competing action
  signal. Use it ONCE per page. The moment a second one appears, the mark stops
  reading as emphasis and starts reading as "this might be a link", which is the
  exact failure §9 is guarding against.

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

  IT IS AN UNDERLINE, NOT A HIGHLIGHT, AND THAT IS A CONTRAST REQUIREMENT.

  A marker stroke crossing the lower third of the letterforms looks better and is
  unshippable here. §9.2's rule is "pastels fill, ink labels": in the light theme
  the heading is ink on the pastel and measures 11.7:1, but in the dark theme the
  heading is #e8eaed and the pastel does not change, which measures 1.26:1. The
  overlapped part of the word simply disappears. A `dark:` variant is banned, and
  no single band colour clears 4.5:1 against near-white text while still being
  visible against #1a1d21 — the two requirements have no overlap.

  Dropping the band below the baseline dissolves the conflict instead of trading
  it off: no text ever sits on the pastel, so the pair never needs measuring, and
  one token works in both themes. It also stays legal as a pure decoration — the
  sentence reads identically without it, so it carries no information subject to
  the 3:1 non-text bar that a pastel would fail on white.

  The stops: pastel from 0.08em to 0.25em above the bottom of the font box. The
  baseline sits ~0.27em above that edge, so the band clears the letterforms by a
  hair. A marked word containing a descender would cross it, exactly as a normal
  underline does.

  Written as one unbroken literal on purpose. Tailwind scans source TEXT for
  complete class names, so splitting this across concatenated strings to make it
  read nicely would mean the utility is never generated and the stroke silently
  disappears.
*/
// prettier-ignore
const stroke = "bg-[linear-gradient(to_top,transparent_0.08em,var(--color-accent-fill)_0.08em,var(--color-accent-fill)_0.25em,transparent_0.25em)]";

export default function Mark({ children }: MarkProps) {
  return (
    // whitespace-nowrap so the stroke can never be split across two lines, which
    // would leave a bar hanging under a fragment of the word.
    <span className={`whitespace-nowrap ${stroke}`}>{children}</span>
  );
}
