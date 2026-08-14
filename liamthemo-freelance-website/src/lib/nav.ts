/**
 * Navigation link data, shared by Navbar and Footer.
 *
 * Kept here rather than inline in either component so adding a destination is a
 * one-line change in one file (CLAUDE.md §13, "build reusable pieces").
 */

import { services } from "@/data/services";

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

/** The five service lines (CLAUDE.md §1), listed in the footer. Derived from
 * `src/data/services.ts` so the two can't drift. */
export const serviceNav: readonly NavLink[] = services.map((service) => ({
  href: `/services/${service.slug}`,
  label: service.title,
}));

/** Where every call to action points. */
export const CTA = { href: "/contact", label: "Contact now" } as const;

export const SITE_NAME = "LiamTheMo";
