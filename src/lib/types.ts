/**
 * Shared content shapes (CLAUDE.md §6).
 *
 * These follow the spec closely. Do not alter a field without updating every
 * consumer — the service and portfolio pages are generated from these shapes,
 * so a change here is a change to every page. Where a field departs from §6,
 * the reason is in a comment on that field.
 */

export type ServiceSlug =
  | "automation"
  | "excel-data"
  | "websites"
  | "local-tech-help"
  | "roblox";

/**
 * Every glyph `LineIcon` can draw. A closed set rather than a free string, for
 * the same reason `ProjectFeature.icon` is one: it keeps SVG markup out of the
 * data files while making an unknown key a compile error rather than a blank
 * square in production. Add a key here and a path in `LineIcon` together.
 */
export type LineIconKey =
  | "file"
  | "gear"
  | "code"
  | "cloud"
  | "chart"
  | "chat"
  | "plane"
  | "bolt"
  | "clock"
  | "check"
  | "tick"
  | "bars"
  | "window"
  | "monitor"
  | "rocket"
  | "cube"
  | "gamepad"
  | "users"
  | "trophy";

/**
 * One run of hero-heading text. `accent: true` paints it `--color-accent`.
 *
 * A SEGMENT ARRAY RATHER THAN A STRING WITH MARKUP, because the two mockups
 * put the accent in different places: Automation colours its whole first line,
 * Roblox colours one word in the middle of its first ("Roblox **Development**
 * & Game Solutions"). Anything expressible as "the first line" or "the first
 * word" would have needed rewriting the moment the second mockup landed, and
 * parsing a marker out of a string puts a tiny template language in a data
 * file.
 *
 * Accent on a heading is non-interactive orange, which §9.2 otherwise forbids.
 * It is the same override the home page hero already ships ("Hi, I'm
 * <accent>Liam</accent>.") on §9's rule that the mockup wins where the two
 * disagree — noted rather than done quietly.
 */
export interface HeadlineSegment {
  text: string;
  accent?: boolean;
}

/** One "What I build" card. `description` is optional so the fallback content
    (see `servicePage()`) can build cards from `deliverables`, which are single
    sentences with nothing to put underneath them. */
export interface ServiceCard {
  icon: LineIconKey;
  title: string;
  description?: string;
}

/** One numbered process step. `description` is optional for the same reason
    `ServiceCard.description` is: the derived fallback puts each existing
    `process` sentence in `title`, where it reads as the step rather than as a
    caption under an empty one. */
export interface ServiceStep {
  icon: LineIconKey;
  title: string;
  description?: string;
}

/**
 * The art-directed half of a service page (CLAUDE.md §15 step 3, rebuilt
 * 2026-08-21 to the owner's mockups).
 *
 * OPTIONAL ON PURPOSE. Only Automation has an approved mockup and owner-
 * written copy today; the other four render the same layout from the content
 * they already have (`servicePage()` in src/data/services.ts derives it). That
 * is what lets one template serve all five without either inventing copy for
 * four services or leaving the site half-styled in production (§15).
 *
 * Everything here is presentation copy. The load-bearing content — `problems`,
 * `deliverables`, `process`, `faqs` — stays on `Service` itself, so a service
 * without this field is still complete.
 */
export interface ServicePage {
  /** The H1, one array per rendered line. */
  headline: HeadlineSegment[][];
  /** The paragraph under it. Longer than `tagline`, which still does meta. */
  blurb: string;
  /** The hero's second, lower-commitment pill. The first is always the form. */
  secondaryCta?: { href: string; label: string; icon: LineIconKey };
  /** "What I build" — left copy block, then the card row. */
  offer: {
    label: string;
    heading: string;
    body?: string;
    cards: ServiceCard[];
  };
  /** "My process" — the numbered step row and its heading. */
  process: {
    label: string;
    heading: string;
    body?: string;
    steps: ServiceStep[];
  };
  /** The small panel beside the steps. Omitted when there is no owner-written
      list of promises to put in it — §11 forbids inventing them. */
  panel?: {
    icon: LineIconKey;
    heading: string;
    points: string[];
  };
  /** Closing bar copy, passed straight to CTASection. */
  closing: { title: string; description: string };
}

export interface Service {
  slug: ServiceSlug;
  title: string; // "Automation & Python"
  tagline: string; // one line, benefit-first, no jargon
  icon: string; // emoji or icon key
  problems: string[]; // symptoms in the client's words — "I retype the same report every Monday"
  deliverables: string[]; // what they actually receive
  process: string[]; // 3–4 steps, plain language
  startingPrice?: string; // "from $X" — omit entirely rather than guess
  turnaround?: string; // "typically 3–7 days"
  faqs: { q: string; a: string }[];
  /** Art-directed page copy, where a mockup and owner copy exist. See `ServicePage`. */
  page?: ServicePage;
}

/**
 * The card thumbnail every project must have (CLAUDE.md §6: "`cover` is
 * required in this redesign... a project without art breaks it").
 *
 * A union rather than a bare `{ src, alt }`, because some real projects have
 * no art yet — Computer Builds & Repairs, Echo Realms, as of 2026-08-21 — and
 * the two other ways to satisfy a required image field are both worse:
 * inventing a screenshot violates §11, and dropping the projects costs Local
 * Tech Help its only proof.
 *
 * `tile` is not a placeholder for a missing image; it is a designed fallback
 * built from the project's own service identity (hue + icon), the same system
 * the chip below the card uses. It renders at full card size like any other
 * cover, so the grid keeps its rhythm either way. Promoting one to `image`
 * later is a one-line data change with no component edit.
 */
export type ProjectCover =
  | {
      kind: "image";
      src: string;
      alt: string;
      /**
       * Real pixel dimensions of the asset, same contract as `images` below.
       * Both default to 1536x1024 (3:2) — the studio-standard crop the
       * existing covers use — so this is only needed for a real, uncropped
       * asset with a different shape.
       */
      width?: number;
      height?: number;
      /**
       * How the image fits the 3:2 card box. Defaults to `"cover"` — fill it,
       * cropping evenly. `"contain"` letterboxes instead, for a source whose
       * aspect ratio is too extreme to crop into 3:2 without losing the point
       * of the image (e.g. a wide banner would lose its logo text).
       */
      fit?: "cover" | "contain";
    }
  | {
      /**
       * The designed fallback: the project's first service hue as a tint wash
       * behind that service's icon. A project with no service line at all
       * falls back further to a neutral tile and `Project.icon`.
       */
      kind: "tile";
    };

/**
 * One "Key Features" card on the case study page. `icon` is a closed set
 * rather than a free string so the page can map it to a hand-drawn SVG
 * (`FeatureIcon` in the case study template) instead of storing markup in a
 * data file — add a key here and a matching case there together.
 */
export interface ProjectFeature {
  icon: "bolt" | "layers" | "target";
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  client?: string; // omit or anonymize if not cleared
  /**
   * Enables cross-linking from service pages. Empty for portfolio-only work
   * that doesn't map to a sellable service line (e.g. video editing) — use
   * `skills` instead for what that work demonstrates.
   */
  services: ServiceSlug[];
  /**
   * Freeform tags shown in place of service chips when `services` is empty.
   * Plain (non-colour) chips on purpose — §9.2's identity colours are
   * reserved for the five real service lines, not skills that aren't for
   * sale.
   */
  skills?: string[];
  /** Emoji for a `kind: "tile"` cover when `services` is empty, so there is no service colour or icon to build the tile from. Ignored otherwise. */
  icon?: string;
  /** An off-site destination for the work itself (e.g. a YouTube channel) — rendered as a link on the case study page. */
  externalLink?: { href: string; label: string };
  /** A small identity image (e.g. a channel/profile picture) shown next to the title on the case study page — separate from the `images` gallery below the fold. */
  avatar?: { src: string; alt: string };
  /**
   * Required (§6). The card grid is the visual centrepiece of both /portfolio
   * and the home page, and a card with no thumbnail collapses the row — so
   * every project declares one, either a real image or the designed tile.
   * See `ProjectCover`.
   *
   * Separate from `images` below on purpose: `cover` is the card face,
   * `images` is the case study gallery. A project can have a cover and no
   * gallery (nothing to show in detail yet), or a cover that also appears in
   * the gallery — that duplication is intentional and cheap, since next/image
   * serves the same asset at two sizes from one source.
   */
  cover: ProjectCover;
  summary: string; // one sentence, outcome-focused
  problem: string;
  solution: string;
  /**
   * The case study page's "Overview" paragraph. Optional: falls back to
   * `problem` + `solution` (already-approved copy) rather than leaving the
   * section empty, so a project doesn't need bespoke overview copy on day
   * one to render the individual-project-page template correctly.
   */
  overview?: string;
  /** "What I Built" checklist. Omit rather than derive-and-reword `solution` — see §11 on inventing copy. */
  whatIBuilt?: string[];
  /** "Key Features" cards. Omit entirely (the section hides) until real, owner-written feature copy exists. */
  features?: ProjectFeature[];
  /** e.g. "Design, Development, Deployment". Omit rather than guess from `stack`/`skills`. */
  role?: string;
  /** e.g. "2025". Omit rather than guess. */
  year?: string;
  /** GitHub repo (or other source) link, rendered as the "View Source" button. Omit if the source isn't public. */
  sourceUrl?: string;
  /**
   * Quantified outcome — hours saved, errors removed, etc. Optional rather than
   * the `result: string` in CLAUDE.md §6: §10 forbids inventing a result, so a
   * project without an owner-confirmed number yet has none to show. The case
   * study page renders the result section only when this is present.
   */
  result?: string;
  /** Structured before/after stat callouts, once known. */
  metrics?: { label: string; value: string }[];
  stack: string[];
  images?: {
    src: string;
    alt: string;
    caption?: string;
    /**
     * Real pixel dimensions of the asset. Both default to 1536x1024 (3:2) —
     * the studio-standard crop used by the existing case study screenshots —
     * so this is only needed when a real, uncropped asset (e.g. a YouTube
     * banner) has a different shape. The case study gallery uses these to
     * size the image box, so a mismatched value here will visibly stretch
     * the image.
     */
    width?: number;
    height?: number;
    // `fit` used to live here, back when images[0] doubled as the card
    // thumbnail. It moved to `ProjectCover` with that job — a gallery figure
    // is never cropped to a fixed box, it sizes itself from width/height
    // above, so there was nothing left for the option to do.
  }[];
  /**
   * Paired redesign screenshots (e.g. old homepage vs new homepage), rendered
   * by `BeforeAfterCompare` as its own "Before / After" section — separate
   * from `images`/`ScreenshotCarousel` because a flat filmstrip has no way to
   * keep a before next to its matching after once there are more than a
   * handful of images (three-per-row wraps a pair across scroll pages). Full,
   * uncropped screenshots, so both carry their real pixel dimensions rather
   * than defaulting to the 3:2 `images` crop.
   */
  beforeAfter?: {
    label: string;
    before: { src: string; alt: string; width: number; height: number };
    after: { src: string; alt: string; width: number; height: number };
  }[];
  featured: boolean;
}

/**
 * Display metadata for each service slug — title and the identity chip colour
 * from globals.css (§9.2: identity only, never a link, button or focus ring;
 * legal here because it is a filled area with an ink label on top).
 *
 * `chipHex` is the same colour as `chipClass`, copied by hand as a literal hex
 * value. That duplication is required, not accidental: generated OG images
 * (`src/lib/og.tsx`) render through satori, which has no access to Tailwind's
 * CSS custom properties and needs a literal value. Keep it in sync with the
 * `--color-service-*` tokens in globals.css if either changes.
 *
 * TODO: this duplicates data that now exists elsewhere — `services.ts` holds
 * the same five titles and icons, so there are two places this display
 * metadata can drift. They agree today.
 * Reconciling means deriving this from `services.ts` — which cannot live in
 * this file, since `services.ts` imports from it and the cycle would be real.
 * The derived map belongs in `services.ts` itself, with the consumers here
 * updated to import it from there.
 */
export const SERVICE_META: Record<
  ServiceSlug,
  { title: string; chipClass: string; chipHex: string; icon: string }
> = {
  automation: {
    title: "Automation & Python",
    chipClass: "bg-service-automation",
    chipHex: "#fcc4bf",
    icon: "🔄",
  },
  "excel-data": {
    title: "Excel & Data",
    chipClass: "bg-service-excel",
    chipHex: "#e1d4a4",
    icon: "📊",
  },
  websites: {
    title: "Websites",
    chipClass: "bg-service-websites",
    chipHex: "#ade2ca",
    icon: "🌐",
  },
  "local-tech-help": {
    title: "Local Tech Help",
    chipClass: "bg-service-local",
    chipHex: "#b8d7ff",
    icon: "🖥️",
  },
  roblox: {
    title: "Roblox Development",
    chipClass: "bg-service-roblox",
    chipHex: "#ebc6ec",
    icon: "🎮",
  },
};
