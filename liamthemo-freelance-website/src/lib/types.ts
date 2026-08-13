/**
 * Shared data shapes for services and portfolio (CLAUDE.md §6). Do not change
 * without updating every consumer.
 */

export type ServiceSlug =
  | "automation"
  | "excel-data"
  | "websites"
  | "local-tech-help"
  | "roblox";

/**
 * Display metadata for each service slug, keyed off the table in CLAUDE.md §1 —
 * title and the identity chip colour from globals.css (§9.2: identity only,
 * never a link, button or focus ring; legal here because it is a filled area
 * with an ink label on top).
 *
 * TODO: a separate Phase-3-Services branch already has its own services.ts.
 * When that merges, reconcile this into a single source of truth — services.ts
 * should win, and this map should either be removed or re-derived from it.
 */
export const SERVICE_META: Record<
  ServiceSlug,
  { title: string; chipClass: string }
> = {
  automation: {
    title: "Automation & Python",
    chipClass: "bg-service-automation",
  },
  "excel-data": { title: "Excel & data", chipClass: "bg-service-excel" },
  websites: { title: "Websites", chipClass: "bg-service-websites" },
  "local-tech-help": {
    title: "Local tech help",
    chipClass: "bg-service-local",
  },
  roblox: { title: "Roblox development", chipClass: "bg-service-roblox" },
};

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
  images?: { src: string; alt: string; caption?: string }[];
  featured: boolean;
}
