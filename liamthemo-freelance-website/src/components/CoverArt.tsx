import Image from "next/image";
import type { Project } from "@/lib/types";
import ServiceGlyph from "@/components/ServiceGlyph";

/*
  The 3:2 card face shared by /portfolio's ProjectCard and the home page's
  FeaturedWork grid (CLAUDE.md §6 — `cover` is required, and the grid is the
  visual centrepiece both pages are built around).

  One component rather than two, because the two grids previously each had
  their own copy of "read images[0], fall back to a tile" and had already
  drifted: FeaturedWork silently dropped any project without art, while
  ProjectCard rendered a tile for it. With `cover` required, there is exactly
  one rule and it lives here.

  THE TILE IS A DESIGN, NOT A PLACEHOLDER.

  REDRAWN TO THE PROJECTS MOCKUP (owner call). It used to carry the service
  identity tint behind that service's emoji, tying the card to the hue system
  the chips use. The mockup draws it as a neutral dark panel with a single
  stroked orange glyph, and sampling it settles both halves: the panel is
  rgb(27,29,27), which is --color-surface-2 (28,25,25) to within a level, and
  the globe on This Website is rgb(250,125,63) — accent line-art, not the
  multicoloured 🌐 the emoji font paints.

  So the identity hue is gone from this tile. What it bought — "this is Roblox
  work" at a glance — is still carried by the chips directly under the cover,
  and the glyph now says the same thing in a form that holds the mockup's
  weight. See ServiceGlyph for why an emoji could not.

  LOADING (§12's performance budget).
  `priority` is opt-in and defaults off, so every cover is lazy unless a
  caller explicitly says otherwise. Only the portfolio index passes it, and
  only for the cards that are actually above the fold — see the note there.
*/

interface CoverArtProps {
  project: Project;
  /**
   * The `sizes` hint for the image branch. Required rather than defaulted:
   * the two grids lay out differently, and a wrong `sizes` is the quiet way
   * an "optimized" image still downloads at three times the needed width.
   */
  sizes: string;
  /** Above the fold. Off by default — see the loading note above. */
  priority?: boolean;
  /** Applied to the image itself, for the grids' hover scale. */
  imageClassName?: string;
  /**
   * Render the image with an empty alt, i.e. as decoration.
   *
   * Correct wherever the card already carries the same information in text.
   * ProjectCard does — it has a heading, a summary and service chips — so a
   * screen reader there would otherwise hear the cover's alt text, the title
   * and the summary in a row, all saying the same thing. FeaturedWork does
   * not: its cards are pure art with no caption, so the image must keep its
   * real alt (the link's aria-label carries the title alongside it).
   *
   * The tile branch is always aria-hidden regardless — it is a panel and a
   * glyph, and it conveys nothing the chips do not.
   */
  decorative?: boolean;
}

export default function CoverArt({
  project,
  sizes,
  priority = false,
  imageClassName = "",
  decorative = false,
}: CoverArtProps) {
  const { cover } = project;

  if (cover.kind === "image") {
    const fitClass =
      cover.fit === "contain" ? "object-contain" : "object-cover";
    return (
      <Image
        src={cover.src}
        alt={decorative ? "" : cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        // Explicit rather than relying on next/image's default, so a future
        // edit cannot silently drop it (§12: everything below the fold is
        // lazy). `priority` and `loading` are mutually exclusive.
        {...(priority ? {} : { loading: "lazy" as const })}
        className={`${fitClass} ${imageClassName}`}
      />
    );
  }

  const service = project.services[0];

  return (
    // aria-hidden: the card's heading and summary already name the project,
    // and the chips already name the service. An alt text here would be the
    // third repetition of the same fact to a screen reader.
    <div
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-surface-2"
    >
      {/* h-14 against the emoji's text-5xl: the mockup's globe measures ~57px
          in a 389px-wide card, and the tile is the one place on the site where
          a glyph is the whole composition rather than a label's companion. */}
      <ServiceGlyph service={service} className="h-14 w-14 text-accent" />
    </div>
  );
}
