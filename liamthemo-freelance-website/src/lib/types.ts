/**
 * Shared content shapes (CLAUDE.md §6).
 *
 * These are copied from the spec deliberately unchanged. Do not alter a field
 * without updating every consumer — the service and portfolio pages are
 * generated from these shapes, so a change here is a change to every page.
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
  result: string; // quantified where possible: hours saved, errors removed
  stack: string[];
  images?: { src: string; alt: string }[];
  featured: boolean;
}
