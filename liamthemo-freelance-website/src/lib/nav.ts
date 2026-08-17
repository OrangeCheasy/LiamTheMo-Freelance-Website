/**
 * Navigation link data, shared by Navbar and (for now, just mainNav) Footer.
 *
 * Kept here rather than inline in either component so adding a destination is a
 * one-line change in one file (CLAUDE.md §13, "build reusable pieces").
 */

export interface NavLink {
  href: string;
  label: string;
}

/**
 * Primary navigation (CLAUDE.md §15 Phase 1). `/contact` is deliberately
 * absent — it is the CTA, not a plain nav item.
 *
 * "Home" is gone: Services returning to the nav gives a second way back to
 * the home page besides the logo, so the redundant explicit link is no
 * longer needed.
 *
 * "Services" anchors to a section that doesn't exist yet — it's owner-planned
 * for Phase 2 (home page rebuild), landing after "featured projects". The
 * href is written for that section now (`/#services`) so nothing here needs
 * to change when it ships; until then this link just lands on the home page
 * with no scroll, which is a harmless no-op rather than a broken link.
 * `/services/[slug]` pages still exist and are still linked from the triage
 * widget — only the index page is gone, and stays gone; the plan is a home
 * page section, not a rebuilt index.
 *
 * The old `serviceNav` export (all five service links, for a footer column)
 * is gone along with that column — see the mockup-fidelity note atop
 * Footer.tsx for why removing it isn't a regression.
 */
export const mainNav: readonly NavLink[] = [
  { href: "/#services", label: "Services" },
  { href: "/portfolio", label: "Projects" },
  { href: "/about", label: "About" },
];

/** Where every call to action points. */
export const CTA = { href: "/contact", label: "Contact now" } as const;

export const SITE_NAME = "LiamTheMo";
