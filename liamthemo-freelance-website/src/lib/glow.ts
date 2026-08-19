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
 * The glow colour is a literal hex rather than `--color-accent` (#FF6A1A).
 * This is the one deliberate exception to §9.1's "never hardcode a hex value":
 * an explicit owner colour choice for this one effect, not a design-system
 * value, so it stays local to this file instead of growing a global token that
 * nothing else would ever use.
 *
 * Deepened from #ff3a00 to #d63f00 (owner call). #ff3a00 is a near-neon
 * orange-red at full channel; the new value is the same hue family carrying
 * more pigment and less light, which is what "deeper" asks for.
 *
 * ONE COLOUR, EVERY GLOW. Changing it here moves the closing CTA panel and its
 * border, the home page's service cards, the service pages' problems panel,
 * the hero's rim light and the generated OG images together — that is the
 * point of this file existing (§9.4), not a side effect. If a single surface
 * ever needs its own glow colour, pass it rather than forking the constant.
 */
const GLOW_COLOUR = "#d63f00";

/** The same colour as channel values, for renderers that cannot parse hex in
    color-mix() — see `format` below. */
const GLOW_RGB = "214, 63, 0";

interface WarmGlowOptions {
  /**
   * Ellipse radii, as percentages of the element's own width and height.
   * Defaults to the fitted panel figure; a smaller element wants a
   * proportionally larger pair to keep the falloff reading the same way across
   * its own width.
   */
  size?: [number, number];
  /** Opacity at the corner, as a percentage. The panel's fitted value is 32. */
  peak?: number;
  /**
   * Painted underneath the gradient. `--color-surface` for a panel that has to
   * be opaque; `transparent` for an overlay that only adds glow on top of
   * whatever is already there.
   */
  base?: string;
  /**
   * How the gradient is spelled, for the renderer that will read it.
   *
   * `color-mix` (default) is what the browser gets: one colour constant, and
   * Lightning CSS emits an 8-digit-hex fallback for browsers without
   * color-mix support.
   *
   * `rgba` is for the Open Graph images, which render through satori rather
   * than a browser. Satori implements neither color-mix() nor CSS custom
   * properties, and — the part that actually bit — it clamps colour stops to
   * 100%, so the stops this curve places from 0% to 400% all collapsed onto
   * the ellipse boundary and rendered as a hard-edged disc rather than a glow.
   *
   * The fix is geometric rather than a different curve: multiply the radii by
   * SATORI_SCALE and divide every stop position by it. A stop at position p of
   * radius r sits at the same absolute distance as one at p/4 of radius 4r, so
   * the rendered result is identical while every stop lands inside the range
   * satori honours. The browser path is left alone, since browsers extrapolate
   * past 100% correctly.
   */
  format?: "color-mix" | "rgba";
  /**
   * Where the ellipse is centred, as a CSS background-position pair.
   *
   * Defaults to the top-left corner, which is what every panel using this
   * wants: the fit in the comment above was measured from a panel's own top-
   * left fill corner, and moving the centre does not change the falloff curve,
   * only where it starts from.
   *
   * Added for the hero composition (HeroArt.tsx), which needs the same warm
   * light coming from under the panels rather than from a corner. §9.4 says
   * not to hand-write a second radial gradient for a new element, so this is
   * an option on the shared one instead of a copy with different numbers.
   */
  at?: string;
}

/** See `format` — the factor that pulls every stop under satori's 100% ceiling. */
const SATORI_SCALE = 4;

/**
 * Just the gradient, with no colour painted behind it. Use this where the
 * background colour is set separately — `backgroundImage` in the OG images,
 * for one.
 */
export function warmGlowImage({
  size = [32, 52],
  peak = 32,
  format = "color-mix",
  at = "0% 0%",
}: Omit<WarmGlowOptions, "base"> = {}): string {
  const scale = format === "rgba" ? SATORI_SCALE : 1;
  const [radiusX, radiusY] = size;

  const stops = FALLOFF.map((factor, index) => {
    // Rounded to one decimal so the generated string stays readable in
    // devtools, and so it matches the values this replaced byte for byte.
    const opacity = Math.round(peak * factor * 10) / 10;
    const colour =
      format === "rgba"
        ? `rgba(${GLOW_RGB}, ${opacity / 100})`
        : `color-mix(in srgb, ${GLOW_COLOUR} ${opacity}%, transparent)`;
    return `${colour} ${(index * 50) / scale}%`;
  });

  const transparent = format === "rgba" ? `rgba(${GLOW_RGB}, 0)` : "transparent";

  return (
    `radial-gradient(ellipse ${radiusX * scale}% ${radiusY * scale}% at ${at}, ` +
    `${stops.join(", ")}, ${transparent} ${400 / scale}%)`
  );
}

/** Builds the `background` shorthand for a top-left warm glow. */
export function warmGlow({
  base = "var(--color-surface)",
  ...options
}: WarmGlowOptions = {}): string {
  return `${warmGlowImage(options)}, ${base}`;
}
