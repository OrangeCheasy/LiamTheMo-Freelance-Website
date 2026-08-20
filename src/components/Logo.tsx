/*
  The "lm" mark (CLAUDE.md §9 — the mockup sets the header and footer logo as
  this custom ligature, not the letters "lm" typed in the display face, which
  is what both used to render).

  WHERE THE PATH COMES FROM. It is a trace of the owner-supplied artwork at
  public/tab/lm-icon.png, not a hand-drawn approximation: the orange mark was
  masked out of that PNG, its outline walked as a single closed contour, and
  the result simplified until adding more points stopped changing the render.
  The trace differs from the source artwork by 0.34% of pixels — edge
  antialiasing — and is 1.2 KB of path data.

  WHY A PATH AND NOT THE PNG. Inline SVG costs no request, stays crisp at any
  size, and takes its colour from `currentColor`, so the header, the footer
  and the favicon are all one shape rather than three assets that can drift.
  The source PNG is 630 KB and has the background baked in.

  COLOUR. `--color-logo` (#F75701), not `--color-accent` (#FF6A1A). Those are
  two different oranges and the site was using the wrong one: accent is the UI
  action colour, while the mark has its own brand orange, sampled from the
  artwork. Owner call, and the reason the header/footer logo did not match the
  supplied logo file. §9.2 is unaffected — the mark is still only ever used
  inside a link to the home page.
*/

export default function Logo({ className = "" }: { className?: string }) {
  return (
    // aria-hidden: every place this renders sits inside a link that already
    // carries the site name as its accessible name, so the mark is decoration
    // to a screen reader rather than a second, unreadable label.
    <svg
      aria-hidden="true"
      viewBox="0 0 100 74.7"
      fill="currentColor"
      fillRule="evenodd"
      className={className}
    >
      <path d="M1.59 0L11.55 0L12.15 0.2L13.15 1.39L13.15 57.57L13.75 59.96L14.34 60.56L14.34 60.96L16.73 62.75L21.31 62.75L23.11 61.35L23.71 59.96L23.71 24.1L23.9 23.51L25.5 22.31L33.27 22.31L34.26 22.71L35.06 23.9L35.26 27.69L38.25 24.7L43.43 22.11L47.41 21.31L52.99 21.51L56.57 22.51L59.16 23.71L59.36 24.1L60.96 24.9L61.55 25.7L61.95 25.7L65.14 29.28L65.94 28.49L65.94 28.09L69.32 24.9L69.72 24.9L69.92 24.5L70.32 24.5L70.52 24.1L72.31 23.11L72.91 23.11L75.5 21.91L79.08 21.31L82.67 21.31L87.05 22.11L92.23 24.7L96.22 28.69L98.21 32.27L98.21 32.87L99 34.46L99.6 37.05L100 41.04L100 72.71L99.6 73.71L98.61 74.5L88.84 74.7L87.25 73.71L87.05 41.24L86.25 38.45L85.06 37.05L85.06 36.65L83.67 35.46L81.67 34.46L80.08 34.06L75.5 34.06L71.91 35.46L69.72 37.45L68.53 40.04L68.13 42.43L68.13 73.31L67.33 74.3L66.33 74.7L57.17 74.7L56.18 74.3L55.38 73.31L55.18 40.64L54.18 37.85L51.99 35.46L48.41 34.06L43.82 34.06L40.24 35.46L38.25 37.25L36.85 40.04L36.45 73.51L35.66 74.3L34.66 74.7L17.33 74.7L13.15 74.1L10.16 73.11L8.96 72.51L8.76 72.11L7.97 71.91L7.17 71.12L6.77 71.12L6.37 70.52L5.98 70.52L3.39 67.73L1.2 63.75L0 59.16L0 1.39L1 0.2L1.59 0.2Z" />
    </svg>
  );
}
