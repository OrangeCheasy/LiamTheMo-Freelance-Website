import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import Mark from "@/components/Mark";
import ProcessDiagram from "@/components/ProcessDiagram";
import ServiceTriage from "@/components/ServiceTriage";
import { CTA } from "@/lib/nav";

/*
  Home. Fully static — nothing on this page reads cookies(), headers(),
  searchParams or an uncached fetch, so it prerenders at build time and is served
  from the assets binding without invoking the Worker (CLAUDE.md §4.1).

  The `?topic=unsure` on the triage widget's last option does NOT change that.
  A query string in an href is inert markup; it only costs anything if the page
  receiving it reads searchParams on the server.

  It does cost something one hop over: /contact reads `?topic=` server-side to
  prefill the form (§7), which makes that one page dynamically rendered rather
  than static. That was a deliberate call, not an oversight — see the note at
  the top of src/app/contact/page.tsx for why.
*/

export const metadata: Metadata = {
  title: "I build tools that save you time",
  description:
    "Custom automation, spreadsheets, websites, and local tech help for individuals and small businesses. Tell me the problem and I'll quote the work.",
  openGraph: {
    type: "website",
    title: "I build tools that save you time",
    description:
      "Custom automation, spreadsheets, websites, and local tech help for individuals and small businesses.",
  },
  // Still noindex, but for a THIRD reason now — the previous two (placeholder
  // content, then 404ing triage destinations) are both resolved: services,
  // portfolio and about all have real content.
  //
  // What is not yet true: the quote form (§8) is built and validated, but not
  // operationally live — it needs a Discord webhook, a verified Resend sending
  // domain, two Wrangler secrets and a WAF rate-limiting rule before a real
  // submission actually reaches anyone (see TODO.md). Indexing a homepage
  // whose entire funnel dead-ends is worse than staying invisible a bit
  // longer. Remove this once the form is confirmed working in production —
  // that naturally lines up with step 8's custom domain attach, so search
  // engines index the real domain rather than the workers.dev one.
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        {/*
          Dot grid — graph paper, which is the "precision, technical, tidy" end
          of §9's brief and pointedly not the "gradient blob" anti-goal. Built
          from a token, so it recolours with the theme and weighs nothing: it is
          a CSS gradient, not an asset, so it costs no request at all.

          The mask fades it out before it reaches the copy, so text never sits on
          top of competing texture.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-line)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        />

        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <div>
              <h1 className="max-w-[16ch] text-display text-ink">
                I build tools that save you <Mark>time</Mark>
              </h1>
              <p className="mt-6 max-w-[52ch] text-body text-ink-muted">
                Custom automation, spreadsheets, websites, and technology
                solutions for individuals and small businesses.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={CTA.href}
                  className="inline-flex items-center justify-center rounded-lg border border-accent bg-accent-fill px-5 py-2.5 font-semibold text-accent-fill-ink transition-colors hover:bg-accent-fill-hover"
                >
                  {CTA.label}
                </Link>
                {/*
                  Secondary action is a link, not a second filled button. Two
                  equally weighted buttons make the visitor choose twice.
                */}
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
                >
                  See what I do
                </Link>
              </div>
            </div>

            {/*
              Hidden below lg, and that is a conversion decision rather than a
              layout shortcut. On a phone the diagram is decorative weight sitting
              between the headline and the triage widget, and §2's first success
              criterion is that a confused visitor finds the right service in
              under 15 seconds. Mobile still gets the dot grid and the marked
              keyword; it does not need to scroll past a picture to reach the
              thing that actually converts.
            */}
            <ProcessDiagram className="hidden lg:block" />
          </div>
        </div>
      </section>

      <ServiceTriage />

      {/*
        TODO (owner input required): the social proof strip from §14 step 2 sits
        here, between the triage widget and the closing CTA.

        Deliberately not built. Everything that would fill it — a result metric,
        a client name, a testimonial, a project count — is either an open
        decision in §15 or something §10 forbids inventing. A strip of plausible
        placeholder numbers is the single fastest way to lose a real client, and
        it would be indistinguishable from real copy by the time anyone came back
        to fix it.

        To unblock, the owner needs to supply any ONE of:
          - a real metric for the Restaurant Sales Parser (hours saved per week,
            and the manual step it removed)
          - permission to name Fuse Factory publicly
          - a screenshot of real work that can be shown (§9 prefers a real
            screenshot over any illustration)
      */}

      <CTASection secondary={{ href: "/services", label: "Browse services" }} />
    </>
  );
}
