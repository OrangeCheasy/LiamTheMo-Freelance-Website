import { warmGlowImage } from "@/lib/glow";

/*
  The Roblox service page's hero artwork (owner mockup, 2026-08-22): a
  character standing in front of a glowing archway, in a tree-lined scene lit
  warm from the portal.

  BUILT AS DOM, NOT SHIPPED AS A PICTURE — the same call AutomationHeroArt
  runs on, for the same reasons: the mockup's version is a photoreal 3D
  render, and reproducing one in CSS convincingly is not possible. What this
  draws instead is honest about being a drawing — a blocky figure built from
  the same rounded rectangles every panel on the site already uses, standing
  in a scene built from the same primitives (silhouette shapes, a warm glow,
  one border colour). It costs zero image bytes against §12's budget, where
  the mockup's own render would have been the heaviest asset on the site.

  WHY BLOCKY IS THE RIGHT SIMPLIFICATION, not just the easiest one: a low-poly,
  rectangular avatar is Roblox's own default aesthetic, not a compromise away
  from it. A character built from a head, a torso and one arm reads as "a
  Roblox character" precisely because that is what the classic Roblox avatar
  is built from.

  MOBILE PAYS NOTHING. Rendered `hidden lg:block` by the page template, same
  as AutomationHeroArt — decorative weight the smallest devices never pay for.

  DECORATIVE, SO aria-hidden THROUGHOUT. The heading and blurb beside it
  already say what the service is.

  NO ANIMATION (§9.5). A static scene, nothing here for
  prefers-reduced-motion to suppress.
*/

/** One background tree: a trunk and a canopy, both drawn from tokens already
    on the page rather than a new colour. Position and scale come from the
    caller so the whole tree line can be laid out as a flat list below. */
function TreeSilhouette({
  style,
}: {
  style: React.CSSProperties;
}) {
  return (
    <div className="absolute bottom-0" style={style}>
      <div className="relative h-full w-full">
        <div
          className="absolute bottom-0 left-1/2 h-[45%] w-[18%] -translate-x-1/2 rounded-[0.15em]"
          style={{ background: "var(--color-border)" }}
        />
        <div
          className="absolute bottom-[30%] left-0 h-[70%] w-full rounded-full border"
          style={{
            background: "var(--color-surface-2)",
            borderColor: "var(--color-border)",
          }}
        />
      </div>
    </div>
  );
}

/** The shared fill for head, hair, torso and arm: a dark surface with a warm
    edge on the left, as if lit by the archway standing to the character's
    left in this composition. A positive inset offset-x, per CSS's inset
    convention, lights the edge opposite the offset direction. */
const BODY_FILL: React.CSSProperties = {
  background: "var(--color-surface-2)",
  borderColor: "var(--color-border)",
  boxShadow:
    "inset 0.5em 0 0.9em -0.5em color-mix(in srgb, var(--color-accent) 55%, transparent)",
};

export default function RobloxHeroArt({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      /*
        820x460, the art region measured off the mockup (x 700..1536,
        y 60..520 at its native 1536px width) — the same measured-not-
        proportional call AutomationHeroArt's box makes, for the same reason.
      */
      className={`relative aspect-[820/460] w-full overflow-hidden rounded-[1.4em] border border-border ${className}`}
      style={{
        backgroundImage: [
          // The portal's light reaching out into the scene.
          warmGlowImage({ size: [60, 78], peak: 30, at: "63% 82%" }),
          // Dusk sky: a faint wash of the service's own identity hue at the
          // top, fading through the page background to the ground colour —
          // the one place this drawing spends the roblox-tint token, kept
          // decorative-only per §9.2.
          "linear-gradient(180deg, color-mix(in srgb, var(--color-service-roblox) 14%, var(--color-bg)) 0%, var(--color-bg) 60%, var(--color-surface-2) 100%)",
        ].join(", "),
      }}
    >
      {/* Ground line. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[16%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--color-surface-2))",
        }}
      />

      {/* Tree line, back to front — further trees smaller and dimmer. */}
      <TreeSilhouette
        style={{ left: "2%", width: "9%", height: "34%", opacity: 0.45 }}
      />
      <TreeSilhouette
        style={{ left: "11%", width: "12%", height: "44%", opacity: 0.7 }}
      />
      <TreeSilhouette
        style={{ left: "77%", width: "10%", height: "38%", opacity: 0.55 }}
      />
      <TreeSilhouette
        style={{ left: "88%", width: "13%", height: "48%", opacity: 0.85 }}
      />

      {/* The archway the mockup's portal glows inside. A rounded rectangle
          with an oversized top radius reads as an arch at this width. */}
      <div
        className="absolute bottom-[8%] left-[36%] w-[16%] rounded-t-[999px] border border-border"
        style={{
          height: "50%",
          background: `${warmGlowImage({ size: [75, 95], peak: 65, at: "50% 100%" })}, var(--color-surface-2)`,
          boxShadow:
            "0 0 3em color-mix(in srgb, var(--color-accent) 35%, transparent)",
        }}
      />

      {/* The character: head, one spike of hair, torso, one raised arm —
          standing right of the archway, the mockup's own placement. */}
      <div className="absolute bottom-0 right-[10%] flex w-[26%] flex-col items-center">
        {/* Arm, behind the torso in source order so it reads as the far
            side, angled up toward the archway's light. */}
        <div
          className="absolute bottom-[30%] left-[-18%] h-[16%] w-[46%] -rotate-[24deg] rounded-[0.6em] border"
          style={BODY_FILL}
        />

        {/* Head, with one simple spike standing in for hair. */}
        <div className="relative z-10 h-[24%] w-[58%] shrink-0">
          <div
            className="absolute inset-0 rounded-[0.9em] border"
            style={BODY_FILL}
          />
          <div
            className="absolute -top-[22%] left-[16%] h-[35%] w-[30%] -rotate-[18deg] rounded-t-[0.4em] border"
            style={BODY_FILL}
          />
        </div>

        {/* Torso. */}
        <div
          className="relative -mt-[3%] h-[48%] w-full rounded-[0.8em] border"
          style={BODY_FILL}
        />
      </div>
    </div>
  );
}
