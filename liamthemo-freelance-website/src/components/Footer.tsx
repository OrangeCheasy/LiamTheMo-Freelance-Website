import Link from "next/link";
import { SITE_NAME } from "@/lib/nav";

/*
  Server component — no interactivity, so no client bundle.

  The year is evaluated at build time, not per request. On a statically
  prerendered page that is the point: reading it at request time would make the
  page dynamic and start billing Worker invocations for a copyright line
  (CLAUDE.md §4.1). It stays correct as long as the site is redeployed at least
  once a year, which it will be.

  MINIMAL BY MOCKUP, NOT BY DEFAULT. The pre-restyle footer carried a
  "Services" column, a "Site" nav column, a description paragraph and a CTA
  button — real IA work, not decoration. Cutting all of that to match the
  mockup's logo + copyright + icon row is safe rather than a regression: every
  page already ends with its own CTASection immediately above this footer
  (§2's "every page ends with a path to the form" requirement is covered
  there), and the header's own "Services" entry (added this phase) now covers
  the "way in that isn't the triage widget" need that the footer's service
  links used to carry alone. Nothing this footer used to do is left
  uncovered.
*/

const iconLinkClasses =
  "flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-accent hover:text-accent";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <Link
            href="/"
            aria-label={SITE_NAME}
            className="font-display text-2xl font-bold tracking-tight text-accent"
          >
            lm
          </Link>
          <p className="mt-2 text-small text-text-muted">
            © {year} {SITE_NAME}. All rights reserved.
          </p>
        </div>

        {/*
          TODO(owner): every href below is a placeholder ("#") — confirm which
          of these should be real (GitHub profile? a specific tool/reel?) and
          what the third icon (mockup shows three dots in a circle — read as
          DaVinci Resolve's mark, not confirmed) should represent before this
          ships. Never invent a destination (CLAUDE.md §11).
        */}
        <div className="flex items-center gap-3">
          <a href="#" aria-label="GitHub" className={iconLinkClasses}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.21.66.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.73 18.27.5 12 .5Z" />
            </svg>
          </a>
          <a href="#" aria-label="Code" className={iconLinkClasses}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
            </svg>
          </a>
          <a href="#" aria-label="Reel" className={iconLinkClasses}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
              <circle
                cx="12"
                cy="12"
                r="10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="7.8" r="1.9" fill="currentColor" />
              <circle cx="8.3" cy="14.5" r="1.9" fill="currentColor" />
              <circle cx="15.7" cy="14.5" r="1.9" fill="currentColor" />
            </svg>
          </a>
          <a href="#" aria-label="VS Code" className={iconLinkClasses}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M17 3 6.5 12 17 21l3-1.5V4.5L17 3ZM6.5 12 2 9.5v5L6.5 12ZM17 3 9 9M17 21 9 15" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
