import Image from "next/image";
import type { Project } from "@/lib/types";
import { SERVICE_META } from "@/lib/types";

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
  It reuses the service identity tint from globals.css — the same hue the
  chip under the card uses, and the same one the home page's triage cards use
  — behind that service's icon. That makes a coverless project read as
  "Roblox work" at a glance rather than as a broken image, and it ties the
  card to the rest of the identity system instead of introducing a new
  visual. Projects with no service line at all (portfolio-only work tagged
  with `skills`) fall back once more, to a neutral surface and `project.icon`.

  Tint, not the full-strength pastel: §9.1 — the pastels were drawn for a
  light UI and read as stickers on this background.

  LOADING (§12's performance budget).
  `priority` is opt-in and defaults off, so every cover is lazy unless a
  caller explicitly says otherwise. Only the portfolio index passes it, and
  only for the cards that are actually above the fold — see the note there.
*/

/** Static class strings so Tailwind's source scanner sees them verbatim. */
const TILE_TINT: Record<string, string> = {
  automation: "bg-service-automation-tint",
  "excel-data": "bg-service-excel-tint",
  websites: "bg-service-websites-tint",
  "local-tech-help": "bg-service-local-tint",
  roblox: "bg-service-roblox-tint",
};

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
   * The tile branch is always aria-hidden regardless — it is a colour and an
   * emoji, and it conveys nothing the chips do not.
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
    const fitClass = cover.fit === "contain" ? "object-contain" : "object-cover";
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
  const tint = service ? TILE_TINT[service] : undefined;

  return (
    // aria-hidden: the card's heading and summary already name the project,
    // and the chips already name the service. An alt text here would be the
    // third repetition of the same fact to a screen reader.
    <div
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center ${tint ?? "bg-surface-2"}`}
    >
      <span className="text-5xl opacity-90">
        {service ? SERVICE_META[service].icon : (project.icon ?? "📁")}
      </span>
    </div>
  );
}
