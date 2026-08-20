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
 * "Home" replaces the "Services" item, on the owner's instruction. Label and
 * destination move together: an item reading "Home" that scrolled partway
 * down the page would be a lie, so the href is a plain `/` rather than the
 * `/#services` this slot used to carry.
 *
 * The home page's Services section still exists and still owns the
 * `#services` anchor (see `ServicesSection.tsx`) — it is reached by scrolling
 * now rather than from the header. `/services/[slug]` pages are linked from
 * that section, from each portfolio case study's "Related services" links,
 * and from the sitemap; there is still no `/services` index page and none is
 * planned.
 *
 * The old `serviceNav` export (all five service links, for a footer column)
 * is gone along with that column — see the mockup-fidelity note atop
 * Footer.tsx for why removing it isn't a regression.
 */
export const mainNav: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Projects" },
  { href: "/about", label: "About" },
];

/** Where every call to action points. */
export const CTA = { href: "/contact", label: "Contact Me" } as const;

export const SITE_NAME = "LiamTheMo";
