/*
  The small accent label above a section heading (CLAUDE.md §9.2's documented
  exception — "About Me", "Services", and every other section opener use
  accent here even though §9.2 otherwise reserves it for actions and current
  state). Site-wide rhythm: this label, then a neutral `text-h1`/`text-h2`/
  `text-h3` heading directly below it.

  Extracted 2026-08-21 from six identical copies (this exact markup, hand
  duplicated, in page.tsx, portfolio/page.tsx, contact/page.tsx, about/page.tsx,
  ServicesSection.tsx, and as a locally-defined `SectionLabel` function in both
  portfolio/[slug]/page.tsx and services/[slug]/page.tsx) — one drifting into
  a seventh variant was a matter of time with that many copies to keep in sync.
*/

export default function SectionLabel({ children }: { children: string }) {
  return <p className="text-small font-medium text-accent">{children}</p>;
}
