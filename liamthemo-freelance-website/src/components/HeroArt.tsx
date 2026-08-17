/*
  The hero's visual (CLAUDE.md §15 Phase 2, mockup composition: "large heading
  left, artwork right"). Rebuilds the mockup's glowing-badge concept as inline
  SVG + CSS rather than reusing the mockup's own render.

  WHY NOT THE MOCKUP'S ASSET. That render only exists baked into the flattened
  homepage screenshot — extracted, it's a ~650x320px crop, below retina
  quality at real hero size, unlicensed for production use, and it's an LCP
  candidate, so shipping a soft upscaled crop as the first paint is a bad
  trade. It's also the kind of generic 3D render §9.6 lists as an anti-goal.

  WHAT THIS IS INSTEAD: the real "lm" mark (same glyph as Navbar/Footer) on a
  card, with a soft --accent-dim glow behind it standing in for the rim light,
  and a low-contrast "mound" shape anchoring it to something solid — same
  spirit as the mockup, zero image weight, infinitely crisp, no licensing
  question, and it reinforces the actual logo instead of a stock-feeling prop.

  EDGES BLEND, NOT A VISIBLE BOX. The glow is a blurred radial-gradient div
  behind the SVG, feathering to transparent well before the container edge —
  required per this phase's brief ("edges blend into the background rather
  than showing a visible box"). The mound uses --surface-2, one step off
  --bg, so its silhouette reads as form without a hard outline.
*/

export default function HeroArt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-accent-dim), transparent)",
        }}
      />
      <svg
        viewBox="0 0 480 480"
        aria-hidden="true"
        focusable="false"
        className="relative h-auto w-full max-w-[26rem]"
      >
        {/* Mound — low-contrast against --bg on purpose, so it reads as a
            surface the card sits on rather than a distinct shape. */}
        <path
          d="M40 400 Q100 320 190 340 Q260 300 330 350 Q410 330 450 400 L450 460 L30 460 Z"
          className="fill-surface-2"
        />

        {/* Card */}
        <rect
          x="140"
          y="90"
          width="200"
          height="200"
          rx="32"
          className="fill-surface stroke-border"
          strokeWidth="2"
        />
        {/* Rim light — one edge only, echoing the mockup's directional glow
            without a literal 3D render. */}
        <path
          d="M172 92 Q142 92 142 122 L142 288"
          fill="none"
          className="stroke-accent"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        <text
          x="240"
          y="215"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-accent font-display font-bold"
          fontSize="88"
        >
          lm
        </text>
      </svg>
    </div>
  );
}
