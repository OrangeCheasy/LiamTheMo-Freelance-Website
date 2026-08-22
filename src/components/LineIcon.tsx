import type { LineIconKey } from "@/lib/types";

/*
  The line-art icon set the service pages are drawn from (the "What I build"
  cards, the process steps, the artwork's status rows, the panel bullets).

  WHY A REGISTRY RATHER THAN AN ICON LIBRARY. §3 rules out new dependencies
  without a stated tradeoff, and the trade here is bad: every icon package
  ships hundreds of glyphs to get the dozen this site draws, and none of them
  are drawn to the rules the rest of the site already follows. Sixteen paths in
  one file costs a fraction of a kilobyte and stays consistent by construction.

  SAME DRAWING RULES AS ServiceGlyph AND THE ABOUT SECTION'S THREE VIRTUES:
  stroke-only, 24-unit box, round caps and joins, one shared stroke weight
  unless a glyph genuinely needs its own. `code` is the one that does, for the
  reason written up beside the About section's copy of it — three open strokes
  cover far less area than a closed form, so at the shared weight it reads
  thin next to its neighbours.

  DOTS ARE ZERO-LENGTH PATHS ("M9 10.5h.01"). With round caps that renders as
  a filled circle of exactly the stroke width, which is how the speech
  bubble's dots stay on the same optical weight as the outline around them. A
  real <circle> would need its own radius and would drift the moment the
  stroke changed.

  WHY IT IS SEPARATE FROM ServiceGlyph. That one is keyed by ServiceSlug and
  answers "which service is this" — five glyphs, one per service line, used on
  the project cover tiles. This one is keyed by shape and answers "what does
  this card mean". Merging them would mean one registry where half the keys
  are only valid in half the call sites.
*/

/** Overrides the shared weight where a glyph needs it — see `code`. */
const STROKE_OVERRIDE: Partial<Record<LineIconKey, number>> = {
  code: 2.3,
};

const GLYPHS: Record<LineIconKey, React.ReactNode> = {
  // Document with a folded corner and two text rules.
  file: (
    <>
      <path d="M14 3.2H7.4a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h9.2a2 2 0 0 0 2-2V7.8z" />
      <path d="M14 3.2v4.6h4.6" />
      <path d="M9 13h6" />
      <path d="M9 16.6h4" />
    </>
  ),

  /*
    Cog: hub inside a lobed outline.

    THE FIRST ATTEMPT WAS A HUB PLUS EIGHT RADIAL SPOKES, on the theory that a
    many-toothed outline would turn to mud at the 28px these render at. It did
    not read as a cog at all — with no rim joining the spokes it renders as a
    sun, which is what shipped for one pass and had to be pulled. The rim is
    the part that carries the meaning, so it stays even though it is the
    longest path in this file.
  */
  gear: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.2 14.6a1.4 1.4 0 0 0 .28 1.55l.05.05a1.7 1.7 0 1 1-2.4 2.4l-.05-.05a1.4 1.4 0 0 0-1.55-.28 1.4 1.4 0 0 0-.85 1.29v.14a1.7 1.7 0 1 1-3.4 0v-.08a1.4 1.4 0 0 0-.92-1.29 1.4 1.4 0 0 0-1.55.28l-.05.05a1.7 1.7 0 1 1-2.4-2.4l.05-.05a1.4 1.4 0 0 0 .28-1.55 1.4 1.4 0 0 0-1.29-.85h-.14a1.7 1.7 0 1 1 0-3.4h.08a1.4 1.4 0 0 0 1.29-.92 1.4 1.4 0 0 0-.28-1.55l-.05-.05a1.7 1.7 0 1 1 2.4-2.4l.05.05a1.4 1.4 0 0 0 1.55.28h.07a1.4 1.4 0 0 0 .85-1.29v-.14a1.7 1.7 0 1 1 3.4 0v.08a1.4 1.4 0 0 0 .85 1.29 1.4 1.4 0 0 0 1.55-.28l.05-.05a1.7 1.7 0 1 1 2.4 2.4l-.05.05a1.4 1.4 0 0 0-.28 1.55v.07a1.4 1.4 0 0 0 1.29.85h.14a1.7 1.7 0 1 1 0 3.4h-.08a1.4 1.4 0 0 0-1.29.85z" />
    </>
  ),

  // < / > — the slash runs past both chevrons. Geometry copied from the About
  // section's "Clean Code" glyph, where the clearance between the slash and
  // the chevron arms was measured rather than eyeballed.
  code: (
    <>
      <path d="M7.4 6.8 3 12l4.4 5.2" />
      <path d="M16.6 6.8 21 12l-4.4 5.2" />
      <path d="M14.5 3.4 9.5 20.6" />
    </>
  ),

  cloud: (
    <path d="M17.4 19.4H7.1a4.6 4.6 0 0 1-.7-9.15 6.1 6.1 0 0 1 11.6 1.1 4.05 4.05 0 0 1-.6 8.05z" />
  ),

  // Axes with a rising trace and an arrowhead — growth, not just data.
  chart: (
    <>
      <path d="M3.8 3.8v16.4h16.4" />
      <path d="m7.4 16.2 3.6-4.6 3 2.4 4.6-5.8" />
      <path d="M15.6 8.2h3v3" />
    </>
  ),

  // Speech bubble with a tail and three dots.
  chat: (
    <>
      <path d="M20.4 14.4a2.6 2.6 0 0 1-2.6 2.6H9.2L4.8 20.6V6.6A2.6 2.6 0 0 1 7.4 4h10.4a2.6 2.6 0 0 1 2.6 2.6z" />
      <path d="M8.8 10.5h.01M12.6 10.5h.01M16.4 10.5h.01" />
    </>
  ),

  // Paper plane, tilted the way the mockup draws it.
  plane: (
    <>
      <path d="M20.8 3.2 3.4 9.6l7.3 3.7z" />
      <path d="M20.8 3.2 14.4 20.6l-3.7-7.3z" />
    </>
  ),

  bolt: <path d="M13.4 2.2 4.2 13.6h6.6l-1 8.2 9.2-11.4h-6.6z" />,

  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.4 2" />
    </>
  ),

  // Outlined tick in a ring — the process panel's bullet marker.
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.3 2.6 2.6 5.2-5.6" />
    </>
  ),

  // Bare tick, for the filled status pips where the ring is the fill itself.
  tick: <path d="m6.6 12.4 3.5 3.5 7.3-7.8" />,

  // Bars on a baseline — output, a chart being written.
  bars: (
    <>
      <path d="M3.6 20.4h16.8" />
      <path d="M7.6 20.4v-6.2" />
      <path d="M12 20.4v-11" />
      <path d="M16.4 20.4v-4.2" />
    </>
  ),

  // Application window: title bar with one control dot.
  window: (
    <>
      <rect x="3" y="4.6" width="18" height="14.8" rx="2.2" />
      <path d="M3 9.4h18" />
      <path d="M6.4 7h.01" />
    </>
  ),

  monitor: (
    <>
      <rect x="2.6" y="4" width="18.8" height="12.4" rx="2" />
      <path d="M12 16.4v3.6" />
      <path d="M8.4 20h7.2" />
    </>
  ),

  rocket: (
    <>
      <path d="M12 2.6c3 2.2 4.6 5.5 4.6 9.1L14.4 16H9.6l-2.2-4.3c0-3.6 1.6-6.9 4.6-9.1z" />
      <circle cx="12" cy="10" r="1.9" />
      <path d="M9.6 16 7 18.6l1.4 2.8M14.4 16l2.6 2.6-1.4 2.8" />
    </>
  ),

  cube: (
    <>
      <path d="M12 2.8 20.6 7v10L12 21.2 3.4 17V7z" />
      <path d="M3.4 7 12 11.4 20.6 7" />
      <path d="M12 11.4v9.8" />
    </>
  ),

  gamepad: (
    <>
      <path d="M8 8.4h8a5.6 5.6 0 0 1 5.5 6.7l-.4 2.2a2.6 2.6 0 0 1-4.6 1.1l-2-2.6H9.5l-2 2.6a2.6 2.6 0 0 1-4.6-1.1l-.4-2.2A5.6 5.6 0 0 1 8 8.4z" />
      <path d="M7.2 11.8v2.6" />
      <path d="M5.9 13.1h2.6" />
      <circle cx="16.3" cy="13.1" r="1" />
    </>
  ),

  users: (
    <>
      <circle cx="9.4" cy="8" r="3.4" />
      <path d="M3 20.2a6.4 6.4 0 0 1 12.8 0" />
      <path d="M16.4 5.1a3.4 3.4 0 0 1 0 5.8" />
      <path d="M17.8 14.6a6.4 6.4 0 0 1 3.2 5.6" />
    </>
  ),

  trophy: (
    <>
      <path d="M7.4 3.6h9.2v5a4.6 4.6 0 0 1-9.2 0z" />
      <path d="M7.4 5.4H4.8v1.4a3 3 0 0 0 2.6 3M16.6 5.4h2.6v1.4a3 3 0 0 1-2.6 3" />
      <path d="M12 13.2v3.6M8.6 20.4h6.8l-.8-3.6H9.4z" />
    </>
  ),
};

export default function LineIcon({
  name,
  className = "",
}: {
  name: LineIconKey;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_OVERRIDE[name] ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {GLYPHS[name]}
    </svg>
  );
}
