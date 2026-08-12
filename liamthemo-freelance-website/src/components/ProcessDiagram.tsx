/*
  The hero's visual: a schematic of the thing this business sells — a pile of
  repetitive manual rows on the left, one tidy report on the right, an arrow
  between them.

  WHAT THIS DELIBERATELY IS NOT.
  It is not a screenshot and must never be mistaken for one. There is no text,
  no axis label and no number anywhere in it — every element is a bar, a rule or
  a rounded rect. That is a content rule, not an aesthetic one: a drawn "dashboard"
  with plausible figures in it would be fabricated proof of work that has not been
  shown to exist, which §10 forbids and which is the fastest way to lose a real
  client. Abstract geometry makes a claim about the SHAPE of the work only.

  §9 still prefers a real screenshot over any illustration, and it is right. When
  the owner supplies a real Restaurant Sales Parser or dashboard screenshot, that
  belongs here and this becomes redundant. Treat it as a placeholder with taste,
  not as the finished answer.

  WHY INLINE SVG AND NOT next/image.
  §11 requires next/image for images, and this is not one — it is markup. Inline
  buys four things a raster asset cannot: it inherits the theme tokens below, so
  it recolours itself in dark mode with no second asset; it costs zero HTTP
  requests; it sidesteps the Cloudflare `images` binding entirely (§11 warns
  optimisation does not work by default on Workers); and it stays crisp at any
  size. It adds about 2 KB to an already-static HTML document.

  Colours come from the `fill-` and `stroke-` utilities, which Tailwind derives
  from the same --color-* tokens as everything else — so a palette change still
  never requires touching a component (§9.2).
*/

interface ProcessDiagramProps {
  className?: string;
}

// Uneven widths on the left: the visual point is "repetitive and slightly
// different every time", which is what makes manual work expensive.
const inputRows = [
  { y: 90, width: 140 },
  { y: 108, width: 112 },
  { y: 126, width: 140 },
  { y: 144, width: 96 },
  { y: 162, width: 128 },
  { y: 180, width: 118 },
];

// Even heights would look inert; these are arbitrary geometry, not data.
const outputBars = [
  { x: 254, height: 26 },
  { x: 282, height: 44 },
  { x: 310, height: 34 },
  { x: 338, height: 58 },
  { x: 366, height: 40 },
];

const BASELINE = 244;

export default function ProcessDiagram({
  className = "",
}: ProcessDiagramProps) {
  return (
    <svg
      viewBox="0 0 420 310"
      // Decorative. The h1 and the paragraph beside it already say this in
      // words, so labelling it would make a screen reader announce the same
      // claim twice. This is the correct treatment for a duplicate illustration
      // and is equivalent to alt="" (§11).
      aria-hidden="true"
      focusable="false"
      className={`h-auto w-full ${className}`}
    >
      {/* --- Input: the manual version ---------------------------------- */}
      <rect
        x="6"
        y="40"
        width="180"
        height="200"
        rx="14"
        className="fill-surface stroke-line"
        strokeWidth="2"
      />
      <rect x="26" y="64" width="70" height="8" rx="4" className="fill-line" />
      {inputRows.map((row) => (
        <rect
          key={row.y}
          x="26"
          y={row.y}
          width={row.width}
          height="7"
          rx="3.5"
          className="fill-line"
        />
      ))}

      {/* --- The arrow: ink-muted, not accent ---------------------------
          Coral here would put the single loudest colour on the one element
          nobody can click. Neutral keeps the action signal pointing at the
          buttons where it belongs. */}
      <path
        d="M196 170 H222"
        className="stroke-ink-muted"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M215 163 L223 170 L215 177"
        className="stroke-ink-muted"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* --- Output: the version that runs itself ------------------------
          Drawn after the input and filled with the surface colour, so the
          overlap occludes cleanly and gives depth without a shadow (§9). */}
      <rect
        x="234"
        y="70"
        width="180"
        height="200"
        rx="14"
        className="fill-surface stroke-line"
        strokeWidth="2"
      />
      <rect x="254" y="94" width="60" height="8" rx="4" className="fill-line" />
      <rect x="254" y="120" width="120" height="7" rx="3.5" className="fill-line" />
      <rect x="254" y="134" width="120" height="7" rx="3.5" className="fill-line" />

      {/* Pastel as a filled area with nothing written on it — the one pattern
          §9.2 explicitly permits for a pastel. */}
      {outputBars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={BASELINE - bar.height}
          width="18"
          height={bar.height}
          rx="3"
          className="fill-accent-fill"
        />
      ))}
      <path
        d={`M250 ${BASELINE + 6} H398`}
        className="stroke-line"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
