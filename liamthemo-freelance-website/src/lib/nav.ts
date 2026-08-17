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

/**
 * Primary navigation. `/contact` is deliberately absent — it is the CTA.
 *
 * "Home" is a deliberate duplicate of the logo's own link (owner call, once
 * the `/services` overview page was removed — the triage widget on the home
 * page is now the de facto services index, so there needed to be a way back
 * to it from `mainNav` besides the logo). `/services/[slug]` pages still
 * exist and are still linked from the footer's `serviceNav` and the triage
 * widget; only the index page is gone.
 */
export const mainNav: readonly NavLink[] = [
  { href: "/", label: "Home" },
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
