/**
 * The warm corner glow used by the "Let's work together" panel and the home
 * page's service cards.
 *
 * It lives here rather than inline in `CTASection` because two places now use
 * it, and the whole point of the owner's request was that they match. Copying
 * the stop list into a second component would have guaranteed drift the first
 * time either was touched.
 *
 * WHERE THE NUMBERS COME FROM — derived from the mockup's pixel data, not
 * eyeballed. Kept verbatim from `CTASection`, which is where this was fitted:
 *
 * Sampled excess-over-base brightness at fine radius steps from the panel's
 * true top-left fill corner (not the geometric corner — that point sits on the
 * anti-aliased edge and reads as background, which quietly broke an earlier
 * attempt at this), averaged across several rows/columns to cancel noise,
 * along pure horizontal and pure vertical rays.
 *
 * ln(excess) vs radius is a straight line in BOTH directions — confirming
 * exponential decay, not the linear interpolation a plain two-stop CSS
 * gradient produces. The two directions decay at clearly different,
 * independently-fitted rates:
 *   horizontal: excess = 77·exp(−0.0032·r)   (r in native mockup px)
 *   vertical:   excess = 92·exp(−0.0203·r)
 * Vertical decays ~6.35x faster than horizontal — a strongly elongated
 * ellipse, not the circle it looks like at a glance. E-fold distances (÷917
 * panel width, ÷90 panel height): horizontal ≈34% of panel width, vertical
 * ≈55% of panel height, sized down another 5% by owner taste to 32%/52%.
 *
 * `FALLOFF` places a stop every half e-fold (exp(−0.5) ≈ 0.607, exp(−1) ≈
 * 0.368, and so on) so the gradient traces that curve instead of
 * straight-lining between two points on it. A correctly fast, correctly
 * shaped falloff is what lets a modest peak opacity still read as a deep
 * corner glow — an earlier attempt raised the peak instead and just produced
 * a wide flat wash.
 */

/** Relative opacity at each stop, one per half e-fold of exponential decay. */
const FALLOFF = [1, 0.607, 0.368, 0.223, 0.135, 0.082, 0.05] as const;

/**
 * The glow colour is a literal #ff3a00 rather than `--color-accent` (#FF6A1A).
 * This is the one deliberate exception to §9.1's "never hardcode a hex value":
 * an explicit owner colour choice for this one effect, not a design-system
 * value, so it stays local to this file instead of growing a global token that
 * nothing else would ever use.
 */
const GLOW_COLOUR = "#ff3a00";

interface WarmGlowOptions {
  /**
   * Ellipse radii as a CSS `<size>` pair, relative to the element. Defaults to
   * the fitted panel figure; a smaller element wants a proportionally larger
   * pair to keep the falloff reading the same way across its own width.
   */
  size?: string;
  /** Opacity at the corner, as a percentage. The panel's fitted value is 32. */
  peak?: number;
  /**
   * Painted underneath the gradient. `--color-surface` for a panel that has to
   * be opaque; `transparent` for an overlay that only adds glow on top of
   * whatever is already there.
   */
  base?: string;
}

/** Builds the `background` shorthand for a top-left warm glow. */
export function warmGlow({
  size = "32% 52%",
  peak = 32,
  base = "var(--color-surface)",
}: WarmGlowOptions = {}): string {
  const stops = FALLOFF.map((factor, index) => {
    // Rounded to one decimal so the generated string stays readable in
    // devtools, and so it matches the values this replaced byte for byte.
    const opacity = Math.round(peak * factor * 10) / 10;
    return `color-mix(in srgb, ${GLOW_COLOUR} ${opacity}%, transparent) ${index * 50}%`;
  });

  return `radial-gradient(ellipse ${size} at 0% 0%, ${stops.join(", ")}, transparent 400%), ${base}`;
}
