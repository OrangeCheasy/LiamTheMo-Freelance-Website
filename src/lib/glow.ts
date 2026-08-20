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
  /**
   * Draw a true circle of this radius instead of an ellipse, and ignore
   * `size`.
   *
   * WHY IT CANNOT JUST BE A `size` WITH TWO EQUAL NUMBERS: those percentages
   * are per-axis — 50% of the element's width and 50% of its height — so equal
   * values on a box that is not square still give an ellipse. A circle needs a
   * single length, which is what this takes.
   *
   * Owner call, for the service cards: their fill is a round pool of light
   * centred under the bright point of the lit top edge, not the wide elliptical
   * wash every panel on the site uses.
   */
  radius?: string;
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
  radius,
}: Omit<WarmGlowOptions, "base"> = {}): string {
  const scale = format === "rgba" ? SATORI_SCALE : 1;
  const [radiusX, radiusY] = size;

  const stops = FALLOFF.map((factor, index) => {
    // Rounded to one decimal so the generated string stays readable in
    // devtools, and so it matches the values this replaced byte for byte.
    const opacity = Math.round(peak * factor * 10) / 10;
    const stopColour =
      format === "rgba"
        ? `rgba(${GLOW_RGB}, ${opacity / 100})`
        : `color-mix(in srgb, ${GLOW_COLOUR} ${opacity}%, transparent)`;
    return `${stopColour} ${(index * 50) / scale}%`;
  });

  const transparent =
    format === "rgba" ? `rgba(${GLOW_RGB}, 0)` : "transparent";

  // `circle <length>` takes one radius; the satori scale trick is a per-axis
  // percentage rescale and has nothing to rescale here, so that path stays on
  // the ellipse (the OG images do not use `radius` — see the option's note).
  const shape = radius
    ? `circle ${radius}`
    : `ellipse ${radiusX * scale}% ${radiusY * scale}%`;

  return (
    `radial-gradient(${shape} at ${at}, ` +
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

/**
 * The deep-brown overlay laid over a warm panel, at the low opacity the
 * mockup's closing CTA implies. color-mix keeps the colour a token (§9.1)
 * rather than respelling it as an rgba() literal at each call site.
 */
const PANEL_TINT =
  "color-mix(in srgb, var(--color-panel-brown) 16%, transparent)";

/**
 * The full molten-panel treatment: deep-brown overlay, then the warm glow,
 * then a dark base.
 *
 * THE LAYER ORDER IS THE POINT. CSS paints the first background layer on top,
 * so the brown sits ABOVE the gradient and mutes it. That is what makes the
 * panel read as deep and warm rather than bright orange — sampling the
 * mockup's closing CTA gives a field of #100c09 and a brightest corner of only
 * #201008, far darker than the glow produces on its own. A darker base cannot
 * achieve it, because the glow is painted on top of the base.
 *
 * Shared by the closing CTA panel and the home page's service cards, which the
 * owner asked to match. They previously differed: the CTA had the brown and
 * the cards did not, so "the same glow" was two different treatments. One
 * function means they cannot drift again (§9.4).
 */
export function warmPanel({
  base = "var(--color-bg)",
  ...options
}: WarmGlowOptions = {}): string {
  return `linear-gradient(${PANEL_TINT}, ${PANEL_TINT}), ${warmGlowImage(options)}, ${base}`;
}

/**
 * The lit top edge on the home page's service cards.
 *
 * A DIFFERENT SHAPE FROM THE REST OF THIS FILE, hence its own function rather
 * than another option on `warmGlow`. Everything above models light arriving
 * from a corner and spreading as an ellipse; the services mockup lights the
 * cards along their top border instead, so the falloff runs left-to-right
 * along a line and there is no ellipse to size.
 *
 * OWNER CALL, and a departure from the mockup it was first fitted to. Sampling
 * that mockup gave a line lit right across its run — 0.66 at the left corner,
 * peaking at 0.15 across, and still 0.56 at the right — a highlight that
 * merely leaned left. What was asked for instead: dark at both ends, brightest
 * a fifth of the way in, and faded to nothing by the right corner.
 *
 * EDGE_PEAK IS EXPORTED because it is a shared position, not a private tuning
 * number — the service cards centre their fill glow on the same point, so that
 * the card reads as lit by its own edge rather than by a second source that
 * happens to sit nearby. Moving the peak moves both.
 *
 * The tail is a decay rather than a straight ramp: a linear fade to zero
 * leaves the midpoint visibly brighter than the eye expects, so the stops drop
 * off quickly past the peak and then flatten out into the run-off.
 */
export const EDGE_PEAK = 20;

/** Renders a [relative brightness, position%] list into the gradient. */
function edgeGradient(stops: [number, number][], peak: number): string {
  const parts = stops.map(([factor, position]) => {
    const opacity = Math.round(peak * factor * 10) / 10;
    return `color-mix(in srgb, ${GLOW_COLOUR} ${opacity}%, transparent) ${position}%`;
  });
  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

export function warmEdgeImage(peak = 100): string {
  return edgeGradient(
    [
      [0, 0],
      [0.35, 5],
      [0.68, 12],
      [0.92, 16],
      [1.0, EDGE_PEAK],
      [0.9, 30],
      [0.74, 42],
      [0.5, 57],
      [0.3, 72],
      [0.13, 86],
      [0, 100],
    ],
    peak,
  );
}

/**
 * The same lit edge, but peaking near the middle — what the PROJECTS mockup
 * puts on its cards, as against the services mockup's left-weighted one.
 *
 * WHY TWO PROFILES RATHER THAN ONE SHARED CURVE. They are genuinely different
 * shapes, not the same shape shifted: the services edge starts at full and
 * runs off to nothing in one direction, while this rises and falls. Sampling
 * the projects mockup's three cards along their top edges, as brightness over
 * background relative to each card's own peak:
 *
 *   card 1   0 .33 .48 .74 1.0 .89 .56 .36 .28 .26 .01   (peak 44% across)
 *   card 2   0 .46 .66 1.0 .57 .33 .23 .25 .24 .30 .02   (peak 29%)
 *   card 3   0 .62 .74 .77 1.0 .79 .69 .59 .57 .63 .01   (peak 40%)
 *
 * The three disagree in detail — it is a painted mockup, not a spec — but they
 * agree on the shape that matters: dark at both corners, brightest a little
 * left of centre. The curve below is fitted to that consensus at 42%, not
 * traced from any one of them.
 *
 * A NOTE ON COLOUR. Those peaks sample rgb(253,188,65) / (251,186,23) /
 * (251,130,33) — hotter and markedly yellower than the services mockup's
 * rgb(242,106,2), which would put the projects cards on a different orange
 * from everything else. Owner call to keep one glow colour across the site, so
 * this shares GLOW_COLOUR with the rest of the file; only the profile differs.
 */
export function warmEdgeCentreImage(peak = 100): string {
  return edgeGradient(
    [
      [0, 0],
      [0.42, 8],
      [0.66, 18],
      [0.88, 30],
      [1.0, 42],
      [0.88, 54],
      [0.68, 66],
      [0.46, 78],
      [0.24, 90],
      [0, 100],
    ],
    peak,
  );
}

/**
 * The bloom around that lit edge, as a `box-shadow`.
 *
 * Lives here rather than in the component so that the edge and its bloom
 * cannot end up different colours — which is exactly what the owner corrected
 * when both this and the cards' fill were still on --color-accent while the
 * closing CTA panel was on GLOW_COLOUR. Keeping the constant private and
 * handing out finished strings is what enforces that.
 *
 * TWO SHADOWS, NOT ONE. A single blur that reaches as far as the mockup's does
 * is too weak near the line, and one tight enough near the line stops short.
 * Measured against the mockup, excess brightness above the edge at 2/3/4/5px
 * out runs 21.8 / 10.9 / 6.9 / 4.9; the pair below tracks that to within about
 * a tenth at every step, where a single 6px shadow came in three times too
 * faint.
 */
export function warmEdgeBloom(): string {
  return (
    `0 0 4px color-mix(in srgb, ${GLOW_COLOUR} 90%, transparent), ` +
    `0 0 10px color-mix(in srgb, ${GLOW_COLOUR} 40%, transparent)`
  );
}
