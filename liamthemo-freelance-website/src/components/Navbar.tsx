"use client";

/*
  The only client component in the layout shell.

  A zero-JS version is possible — <details>/<summary> gives the disclosure
  behaviour, keyboard support and aria-expanded for free — but it cannot close
  on route change. Next's client-side navigation would leave the panel hanging
  over the newly rendered page, which is a real bug rather than a rough edge.
  Fixing it requires usePathname, and that already forces a client component, so
  Escape handling, the focus trap and the scroll lock come along at no extra
  architectural cost.
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CTA, mainNav, SITE_NAME } from "@/lib/nav";

const FOCUSABLE = "a[href], button:not([disabled])";

// Solid accent, dark text on top — accent is bright enough on --bg to carry
// UI-sized text/fills directly (§10), so this needs no separate "-ink" token.
const ctaClasses =
  "inline-flex items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 " +
  "text-small font-semibold text-bg transition-colors hover:bg-accent-hover";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on navigation. This is the requirement that rules out a CSS-only menu.
  //
  // Done as a render-phase adjustment rather than an effect: React's documented
  // pattern for resetting state when a prop changes, and it avoids the extra
  // commit-then-rerender an effect would cost. Closing inside each link's
  // onClick would miss browser back/forward, which changes the pathname without
  // any click at all.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Escape closes and returns focus to the button that opened the panel.
  // Tab is trapped inside the header: the panel visually covers the page, so
  // letting focus reach the content behind it would move focus somewhere the
  // user cannot see.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      // Filtered by rendered size: the desktop links match the selector even
      // while hidden at this breakpoint, and focusing them would break the trap.
      const focusable = Array.from(
        headerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((element) => element.getClientRects().length > 0);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Stop the page behind the panel from scrolling.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Widening past the mobile breakpoint hides the panel by CSS but would leave
  // `open` true and the scroll locked. Close it instead.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 48rem)");
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        {/*
          Mockup mark: "lm" set in the display face, no icon graphic — replaces
          the old spelled-out wordmark + icon.svg placeholder. aria-label keeps
          the accessible name as the full site name; a screen reader shouldn't
          announce two meaningless letters.
        */}
        <Link
          href="/"
          aria-label={SITE_NAME}
          className="font-display text-2xl font-bold tracking-tight text-accent"
        >
          lm
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-6">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  // isActive() never matches "/#services" — usePathname()
                  // never carries a hash fragment, so that link intentionally
                  // never shows as current. It isn't a distinct page.
                  className={`relative text-small transition-colors hover:text-text ${
                    isActive(link.href)
                      ? "font-medium text-text after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-accent after:content-['']"
                      : "text-text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Link href={CTA.href} className={ctaClasses}>
              {CTA.label}
            </Link>
          </div>
        </nav>

        {/* Mobile controls, grouped so justify-between still splits the bar into
            two ends. */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-text"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-surface shadow-sm md:hidden"
        >
          <nav aria-label="Main" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <ul className="flex flex-col">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    // Same marker rotated: an orange bar down the left edge.
                    // Inactive items keep a transparent one so nothing shifts.
                    className={`block border-b border-l-2 border-border py-3 pl-3 ${
                      isActive(link.href)
                        ? "border-l-accent font-medium text-text"
                        : "border-l-transparent text-text-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={CTA.href} className={`${ctaClasses} mt-4 w-full`}>
              {CTA.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
