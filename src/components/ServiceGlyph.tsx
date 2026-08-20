import type { ServiceSlug } from "@/lib/types";

/*
  Line-art glyphs for the cover tile a project falls back to when it has no
  art of its own (CoverArt).

  WHY THESE REPLACED THE EMOJI. The projects mockup draws that tile as a
  neutral dark panel with a single stroked orange globe on it. The tile used to
  render SERVICE_META's emoji — 🌐 for Websites — which the OS paints in its
  own colours, so the mockup's orange line-art came out as a small blue-and-
  green picture at whatever weight the emoji font chose. An emoji cannot be
  recoloured, resized by stroke, or made to sit at the same optical weight as
  its neighbours; a path can be all three.

  SAME DRAWING RULES AS THE ABOUT SECTION'S THREE ICONS (src/app/page.tsx):
  stroke-only, 24-unit box, round caps and joins, and one shared stroke weight
  unless a glyph genuinely needs its own. Nothing here does — these are all
  closed or near-closed forms, so unlike that section's "</>" none of them
  reads thin against the others at a shared weight.

  SERVICE_META keeps its `icon` emoji: it is still used by the coloured chips
  on the case study pages, which are a different treatment at a much smaller
  size. This is the tile's glyph, not a replacement for that field.
*/

/** The paths only — the wrapping <svg> and its stroke setup live in Tile. */
const GLYPHS: Record<ServiceSlug, React.ReactNode> = {
  // Circular arrows: a task coming back round again.
  automation: (
    <>
      <path d="M20.2 11.2A8.2 8.2 0 0 0 6.3 6.3L3.4 9" />
      <path d="M3.4 4.3V9h4.7" />
      <path d="M3.8 12.8a8.2 8.2 0 0 0 13.9 4.9l2.9-2.7" />
      <path d="M20.6 19.7V15h-4.7" />
    </>
  ),
  // Bars on a baseline — the chart, not the spreadsheet grid, because a grid
  // at 48px reads as noise.
  "excel-data": (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M7.4 20.5v-6.2" />
      <path d="M12 20.5v-11" />
      <path d="M16.6 20.5v-4.2" />
    </>
  ),
  // Globe: the mockup's own glyph, and the one it shows on This Website.
  websites: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <ellipse cx="12" cy="12" rx="3.9" ry="8.8" />
      <path d="M3.7 9.2h16.6" />
      <path d="M3.7 14.8h16.6" />
    </>
  ),
  // Monitor on a stand.
  "local-tech-help": (
    <>
      <rect x="2.6" y="4" width="18.8" height="12.4" rx="2" />
      <path d="M12 16.4v3.6" />
      <path d="M8.4 20h7.2" />
    </>
  ),
  // Game controller — the grips are the shape that makes it read at 48px, so
  // the body is drawn as one swept outline rather than a rounded rectangle.
  roblox: (
    <>
      <path d="M8 8.4h8a5.6 5.6 0 0 1 5.5 6.7l-.4 2.2a2.6 2.6 0 0 1-4.6 1.1l-2-2.6H9.5l-2 2.6a2.6 2.6 0 0 1-4.6-1.1l-.4-2.2A5.6 5.6 0 0 1 8 8.4z" />
      <path d="M7.2 11.8v2.6" />
      <path d="M5.9 13.1h2.6" />
      <circle cx="16.3" cy="13.1" r="1" />
    </>
  ),
};

/** Projects with no service line at all (portfolio-only work tagged `skills`). */
const FALLBACK = (
  <path d="M3 7.6a2 2 0 0 1 2-2h3.4l2.1 2.5H19a2 2 0 0 1 2 2v8.3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
);

export default function ServiceGlyph({
  service,
  className = "",
}: {
  /** Undefined for a project with no service line — draws the folder. */
  service?: ServiceSlug;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {service ? GLYPHS[service] : FALLBACK}
    </svg>
  );
}
