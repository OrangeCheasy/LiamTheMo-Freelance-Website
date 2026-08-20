import { warmGlowImage } from "@/lib/glow";

/*
  A 1px border drawn from the warm glow's own falloff instead of a flat colour
  (owner call, first built for the closing CTA panel and now shared with the
  home page's service cards so the two match).

  WHY IT IS NOT A `border`. A CSS border takes one colour, and this one is a
  gradient: brightest at the top-left corner the glow originates from, gone by
  the opposite corner. A flat hairline would contradict §9.4's "depth comes
  from contrast and warm glow, not hard edges"; a border that fades on the same
  curve is the glow's own outline rather than a box drawn around it.

  HOW THE RING IS MADE. The element is filled edge to edge with the gradient,
  then masked so only its 1px padding survives — `mask-composite: exclude`
  subtracts a content-box-sized rectangle from a full-size one, leaving the
  frame. The -webkit- spellings are there for Safari, which still needs the
  prefixed property and uses `xor` rather than `exclude`.

  Run at a much higher peak than the panel fill it sits on: the fill is muted
  on purpose, and the border is the part that should read as lit.

  Decorative — aria-hidden, and pointer-events-none so it never intercepts a
  click meant for the card it frames.
*/

export default function GlowBorder({
  /** Must match the radius of the element this frames, or the ring will cut corners. */
  radiusClass = "rounded-2xl",
  /** Ellipse radii as percentages of the element's own box, same as warmGlow. */
  size,
  /** Corner opacity. Higher than the fill's — that is what makes it read as a border. */
  peak = 95,
  className = "",
}: {
  radiusClass?: string;
  size?: [number, number];
  peak?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${radiusClass} ${className}`}
      style={{
        padding: "1px",
        backgroundImage: warmGlowImage(size ? { size, peak } : { peak }),
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        maskComposite: "exclude",
      }}
    />
  );
}
