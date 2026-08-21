/*
  The up-right arrow used on every external/forward link that hovers with a
  translate nudge (hero's "View My Work", the case study's "Live Site" and
  sidebar link, every CTASection button, Navbar's Contact link). Same path
  data, five places, with only the size/colour classes differing per call
  site — extracted 2026-08-21 rather than left as five hand-copied `<svg>`s.
*/

export default function ArrowUpRightIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
