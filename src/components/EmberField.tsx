/*
  The warm spark texture behind /portfolio, from the projects mockup.

  WHAT THE MOCKUP ACTUALLY HAS. Sampling across the top of the page:
  rgb(46,16,2) at (1200,200) and rgb(20,12,7) at (1100,150) against a flat
  rgb(5,7,9) at (700,150) and (300,150). So the warmth is real, it is confined
  to the top right, and it is speckled rather than a smooth wash — a haze with
  individual bright points in it.

  OWNER CALL: SPLOTCHES OF IT DOWN THE WHOLE PAGE, behind the cards included —
  patches, not an even wash, and not the single corner the mockup shows. Both
  halves of that were arrived at by getting it wrong first, and the two failed
  versions are worth recording because each looks like the obvious fix for the
  other:

    1. Four fixed 520x380 spark boxes placed down the page. Patchy, but every
       box ended in a straight cut and the bottom one read as clipped.
    2. One seamless pattern over the whole page. No edges anywhere, but a flat
       even texture — not splotches.

  What is here is the second one masked by the first one's intent: a page-wide
  pattern, cut down to soft-edged clusters by SPLOTCHES below. Clusters, and
  no edges, which neither version could manage alone.

  THE PATTERN IS TILED rather than a fixed-size graphic because the page's
  height is not known until the projects data renders, and a tile covers
  whatever that turns out to be without stretching.

  THREE TILES, NOT ONE, and at deliberately awkward sizes. A single repeating
  tile is legible as a repeat the moment the eye finds two copies of the same
  cluster. Overlaying three at 317 / 463 / 607 units — pairwise coprime, so the
  combined pattern only truly repeats every 89 million units — means no two
  screenfuls ever show the same arrangement.

  SEAMLESS AT THE TILE EDGES. Sparks are placed freely inside a tile and then
  re-emitted at the wrapped positions when they sit within their own radius of
  an edge, so a spark straddling a boundary appears whole on both sides.
  Without that, every tile would need a clear margin and the empty gutters
  would draw the grid for the viewer.

  §9.2, HONESTLY. This is non-interactive orange, which the rule reserves for
  actions. §9 makes the mockup authoritative where the two disagree, and the
  mockup is unambiguous about the corner it shows — but taking it across the
  whole page goes beyond what it evidences. This is the second standing
  exception after the accent section labels, and worth knowing rather than
  discovering.

  DETERMINISTIC, NOT Math.random(). The page is a server component that
  prerenders, so a random scatter would be baked at build time and differ from
  anything a later client render produced — a hydration mismatch, and a diff in
  the built output on every build for no reason.

  CHEAP (§12's budget). About 150 circles total, sitting in <defs> and painted
  by three <rect>s however tall the page is — a few KB of markup, no request,
  no script, and nothing that participates in layout.
*/

/** Small, fast, seeded PRNG — same sequence on every render, forever. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Spark {
  x: number;
  y: number;
  r: number;
  o: number;
}

interface TileSpec {
  /** Tile edge in user units. Coprime with the others — see the header. */
  size: number;
  count: number;
  minRadius: number;
  maxRadius: number;
  minOpacity: number;
  maxOpacity: number;
  seed: number;
}

const TILES: TileSpec[] = [
  // The body of the texture: small, frequent, faint.
  {
    size: 317,
    count: 26,
    minRadius: 0.7,
    maxRadius: 1.9,
    minOpacity: 0.1,
    maxOpacity: 0.42,
    seed: 0x5eed,
  },
  // A sparser mid layer, to break up the first one's rhythm.
  {
    size: 463,
    count: 18,
    minRadius: 0.6,
    maxRadius: 1.5,
    minOpacity: 0.08,
    maxOpacity: 0.3,
    seed: 0x1f3a,
  },
  // The occasional brighter, larger ember — what stops it reading as noise.
  {
    size: 607,
    count: 11,
    minRadius: 1.2,
    maxRadius: 2.7,
    minOpacity: 0.14,
    maxOpacity: 0.5,
    seed: 0x9c21,
  },
];

/**
 * A spark plus whichever wrapped copies are needed to make it whole across the
 * tile seam. Only emitted when the spark is actually near an edge, so the
 * common case costs one circle.
 */
function withWraps(spark: Spark, size: number): Spark[] {
  const out: Spark[] = [];
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      const x = spark.x + dx * size;
      const y = spark.y + dy * size;
      // Keep it only if some part of the disc lands inside the tile.
      if (x + spark.r < 0 || x - spark.r > size) continue;
      if (y + spark.r < 0 || y - spark.r > size) continue;
      out.push({ ...spark, x, y });
    }
  }
  return out;
}

function sparksFor(tile: TileSpec): Spark[] {
  const random = mulberry32(tile.seed);
  const out: Spark[] = [];
  for (let i = 0; i < tile.count; i++) {
    const spark: Spark = {
      x: Math.round(random() * tile.size * 10) / 10,
      y: Math.round(random() * tile.size * 10) / 10,
      r:
        Math.round(
          (tile.minRadius + random() * (tile.maxRadius - tile.minRadius)) * 10,
        ) / 10,
      o:
        Math.round(
          (tile.minOpacity + random() * (tile.maxOpacity - tile.minOpacity)) *
            100,
        ) / 100,
    };
    out.push(...withWraps(spark, tile.size));
  }
  return out;
}

/*
  THE SPLOTCHES — where the sparks actually appear.

  Owner call, and the correction to the previous version: not a continuous
  texture everywhere, but patches of it. The pattern above still covers the
  whole page; this list is what decides which parts of it you can see.

  MASKED, NOT PLACED. The obvious way to get patches is to position a handful
  of small spark fields — which is what this component did two revisions ago,
  and it failed on its edges: every box ended in a straight cut, and the bottom
  one read as clipped. Here the sparks are one seamless page-wide pattern and
  these gradients mask it down to clusters, so a splotch has no edge at all. It
  simply thins out until there is nothing, in every direction, wherever it
  happens to sit.

  POSITIONS IN PERCENTAGES, SIZES IN PIXELS, and the mix is deliberate.
  Percentage positions put the splotches at the same points down the page
  whatever height the projects data produces, so none can land half-off the
  end. Sizes cannot work the same way: a percentage there is a percentage of
  each axis, and on a page far taller than it is wide that makes every splotch
  a wide flat oval no matter what numbers you pick — which is exactly how the
  first version came out. Pixel radii give real shapes, so `circle` is round
  and a tall ellipse is actually tall.

  DOWN TO 99%, AND OUT TO THE PAGE EDGES AT THE BOTTOM. The closing CTA panel
  is opaque and occupies the last ~12% of this container, so anything masked
  behind it is simply not visible — which read as the texture stopping short as
  it approached the panel. The fix is not to push the field lower (it already
  spans the full wrapper, measured 64..1682 against the panel's 1480..1682) but
  to put the low splotches where there is still background to see: hard left
  and right, in the margins either side of the panel, and below it.

  Weighted toward the top right, which is the one placement the mockup actually
  evidences, then scattered down and across.
*/
const SPLOTCHES = [
  { at: "88% 4%", shape: "ellipse 430px 250px", peak: 11 },
  { at: "13% 13%", shape: "circle 150px", peak: 5 },
  { at: "57% 23%", shape: "ellipse 200px 300px", peak: 4 },
  { at: "96% 36%", shape: "circle 240px", peak: 7 },
  { at: "5% 47%", shape: "ellipse 320px 170px", peak: 5 },
  { at: "45% 58%", shape: "circle 120px", peak: 4 },
  { at: "92% 68%", shape: "ellipse 250px 330px", peak: 6 },
  { at: "18% 74%", shape: "circle 210px", peak: 5 },
  { at: "64% 84%", shape: "ellipse 360px 190px", peak: 4 },
  // The three that live alongside and under the CTA panel — see the note above.
  { at: "2% 90%", shape: "circle 190px", peak: 5 },
  { at: "99% 93%", shape: "ellipse 220px 280px", peak: 5 },
  { at: "38% 99%", shape: "ellipse 340px 150px", peak: 4 },
];

/**
 * The mask that cuts the page-wide pattern down to those clusters.
 *
 * Opaque through the middle of each splotch, gone by its edge. Multiple mask
 * layers composite additively by default, so the list unions rather than the
 * last one winning.
 */
const SPARK_MASK = SPLOTCHES.map(
  ({ at, shape }) =>
    `radial-gradient(${shape} at ${at}, #000 0%, #000 32%, transparent 100%)`,
).join(", ");

export default function EmberField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none ${className}`}
    >
      {/* The warm haze under each cluster, on the same centres as the mask so
          the glow and the sparks are one thing rather than two overlapping
          decorations. No mask needed here — a gradient already fades out on
          its own. */}
      <div
        className="absolute inset-0"
        style={{
          background: SPLOTCHES.map(
            ({ at, shape, peak }) =>
              `radial-gradient(${shape} at ${at}, ` +
              `color-mix(in srgb, var(--color-accent) ${peak}%, transparent), ` +
              `color-mix(in srgb, var(--color-accent) ${Math.round(peak / 3)}%, transparent) 45%, ` +
              `transparent 74%)`,
          ).join(", "),
        }}
      />
      {/* -webkit- alongside the standard property for Safari, which still
          wants the prefix on masks. */}
      <svg
        className="absolute inset-0 h-full w-full"
        fill="var(--color-accent)"
        style={{ WebkitMaskImage: SPARK_MASK, maskImage: SPARK_MASK }}
      >
        <defs>
          {TILES.map((tile, index) => (
            <pattern
              key={tile.seed}
              id={`ember-${index}`}
              // userSpaceOnUse so the tile is a fixed pixel size rather than a
              // fraction of however tall this page happens to be — otherwise
              // the texture would stretch on a longer page.
              patternUnits="userSpaceOnUse"
              width={tile.size}
              height={tile.size}
            >
              {sparksFor(tile).map((spark, i) => (
                <circle
                  key={i}
                  cx={spark.x}
                  cy={spark.y}
                  r={spark.r}
                  opacity={spark.o}
                />
              ))}
            </pattern>
          ))}
        </defs>
        {TILES.map((tile, index) => (
          <rect
            key={tile.seed}
            width="100%"
            height="100%"
            fill={`url(#ember-${index})`}
          />
        ))}
      </svg>
    </div>
  );
}
