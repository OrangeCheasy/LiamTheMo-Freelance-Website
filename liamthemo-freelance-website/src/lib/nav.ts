/**
 * Navigation link data, shared by Navbar and Footer.
 *
 * Kept here rather than inline in either component so adding a destination is a
 * one-line change in one file (CLAUDE.md §13, "build reusable pieces").
 */

export interface NavLink {
  href: string;
  label: string;
}

/** Primary navigation. `/contact` is deliberately absent — it is the CTA. */
export const mainNav: readonly NavLink[] = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
];

/**
 * The five service lines (CLAUDE.md §1), listed in the footer.
 *
 * TODO: replace with a map over `src/data/services.ts` at build order step 3.
 * Until that file exists this is the single source of truth for service links.
 */
export const serviceNav: readonly NavLink[] = [
  { href: "/services/automation", label: "Automation & Python" },
  { href: "/services/excel-data", label: "Excel & data" },
  { href: "/services/websites", label: "Websites" },
  { href: "/services/local-tech-help", label: "Local tech help" },
  { href: "/services/roblox", label: "Roblox development" },
];

/** Where every call to action points. */
export const CTA = { href: "/contact", label: "Contact now" } as const;

/** TODO: business/display name is still an open decision (CLAUDE.md §15). */
export const SITE_NAME = "LiamTheMo";
