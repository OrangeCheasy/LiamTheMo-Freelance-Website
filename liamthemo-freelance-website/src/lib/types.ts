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
  relatedProjects: string[]; // Project.slug values
}

export interface Project {
  slug: string;
  title: string;
  client?: string; // omit or anonymize if not cleared
  services: ServiceSlug[]; // enables cross-linking from service pages
  summary: string; // one sentence, outcome-focused
  problem: string;
  solution: string;
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
    /** Same shot rendered for the dark theme, when the asset itself (not just page chrome) needs swapping — e.g. a graphic with a baked-in background. Omit when one image works in both themes. */
    srcDark?: string;
    alt: string;
    caption?: string;
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
 * TODO: this duplicates data that now exists elsewhere. `services.ts` holds the
 * same five titles and icons, and `ServiceCard.tsx` holds the same five chip
 * classes, so there are several places this display metadata can drift. They
 * agree today.
 * Reconciling means deriving this from `services.ts` — which cannot live in
 * this file, since `services.ts` imports from it and the cycle would be real.
 * The derived map belongs in `services.ts` itself, with the four consumers
 * here updated to import it from there.
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
    title: "Excel & data",
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
    title: "Local tech help",
    chipClass: "bg-service-local",
    chipHex: "#b8d7ff",
    icon: "🖥️",
  },
  roblox: {
    title: "Roblox development",
    chipClass: "bg-service-roblox",
    chipHex: "#ebc6ec",
    icon: "🎮",
  },
};
