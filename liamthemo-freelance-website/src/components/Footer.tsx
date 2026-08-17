import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import { CTA, mainNav, serviceNav, SITE_NAME } from "@/lib/nav";

/*
  Server component — no interactivity, so no client bundle.

  The year is evaluated at build time, not per request. On a statically
  prerendered page that is the point: reading it at request time would make the
  page dynamic and start billing Worker invocations for a copyright line
  (CLAUDE.md §4.1). It stays correct as long as the site is redeployed at least
  once a year, which it will be.
*/

const linkClasses = "text-small text-text-muted transition-colors hover:text-text";
// The hairline between columns is part of the grid this direction is built on.
// Only at lg, where the columns actually sit side by side.
const columnClasses = "lg:border-l lg:border-border lg:pl-8";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-display text-lg font-semibold tracking-tight text-accent"
            >
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-[38ch] text-small text-text-muted">
              I build tools that save you time. Custom automation, spreadsheets,
              websites, and technology solutions for individuals and small
              businesses.
            </p>
            <Link
              href={CTA.href}
              className="mt-6 inline-flex items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 text-small font-semibold text-bg transition-colors hover:bg-accent-hover"
            >
              {CTA.label}
            </Link>
          </div>

          <nav aria-labelledby="footer-services" className={columnClasses}>
            <Eyebrow as="h2" id="footer-services">
              Services
            </Eyebrow>
            <ul className="mt-4 flex flex-col gap-2.5">
              {serviceNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-site" className={columnClasses}>
            <Eyebrow as="h2" id="footer-site">
              Site
            </Eyebrow>
            <ul className="mt-4 flex flex-col gap-2.5">
              {/*
                mainNav's own "Services" entry is dropped here on purpose —
                it's a same-page anchor that exists so header visitors have a
                way in besides the triage widget; the "Services" column right
                next to this one already lists all five real service pages,
                so repeating a second, differently-behaved "Services" link
                would read as a bug, not a shortcut.
              */}
              {mainNav
                .filter((link) => link.href !== "/#services")
                .map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClasses}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              <li>
                {/* TODO: add a direct contact email once decided (CLAUDE.md §15). */}
                <Link href={CTA.href} className={linkClasses}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-small text-text-muted">
          © {year} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
