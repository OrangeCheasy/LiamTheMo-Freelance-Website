import type { Metadata } from "next";
import Image from "next/image";
import CTASection from "@/components/CTASection";
import SectionLabel from "@/components/SectionLabel";

/*
  About (CLAUDE.md §15 step 6, Phase R6). Fully static — no data, no dynamic
  APIs — so it prerenders and is served from the assets binding without
  invoking the Worker (§4.1).

  R6 RESTYLE — presentation AND a content cut, not just a rhythm match.
  This page previously ran header band → "How this started" → "What I have
  done" → "How I work" → photo pair → CTA, closer to a biography than the
  "one screen plus a CTASection" a trust page needs (owner call, 2026-08-20).
  "How this started" and "What I have done" are cut entirely, not condensed
  — the owner picked three specific facts to carry the page (response time,
  location, full-time study) and did not select the track-record summary, so
  that content doesn't appear here in any form. Nothing below is new copy:
  every sentence is reused, sentence-for-sentence or lightly trimmed, from
  the version this replaced.

  HEADER BAND DROPPED, same move as R3/R4/R5 (Services, Portfolio, Contact):
  the old full-bleed `border-b bg-surface` band and the `Eyebrow` rule are
  gone, replaced by the plain max-w-6xl container with an accent micro-label
  above the heading that's now the site-wide convention.

  THE FACTS ROW is the home page's "About Me" layout — label, then rule
  dividers between icon-led columns — used as a STRUCTURE, not restocked
  with its content. The owner was explicit: that block is "a reasonable
  starting point" for the shape, but §11's "no generic virtue blocks" rule
  still holds for this page, so the three columns below are operating facts
  a client can hold the owner to (response time, where in-person work
  happens, why capacity is limited), not "Clean code / Thoughtful design /
  Problem solver." §9.6's trio-restoration override is scoped to the home
  page's About section specifically and doesn't extend here.

  PHOTOS. All three (owner call) — fish.webp stays beside the h1 as the
  identity shot; gym.webp and food.webp stay as the pair under the facts row,
  now carrying the one line of copy that used to close the old "How I work"
  section rather than a new caption invented for them.
*/

export const metadata: Metadata = {
  title: "About",
  description:
    "A computer science student in Calgary who builds automation, spreadsheets and websites, and fixes computers in person — how fast I reply and how I work.",
  openGraph: {
    type: "website",
    title: "About",
    description:
      "A computer science student in Calgary who builds automation, spreadsheets and websites, and fixes computers in person.",
  },
};

// Three operating facts, not values — each one is something a client can
// hold the owner to. See the file-level note on why this isn't the home
// page's virtue trio despite sharing its layout.
const facts: {
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    title: "I answer quickly.",
    description:
      "Usually the same day. If a day passes with no reply, send it again rather than assuming the answer is no.",
    // Clock.
    icon: (
      <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M12 7.5V12l3.2 1.9" />
      </>
    ),
  },
  {
    title: "I am in Calgary, Alberta.",
    description:
      "Anything needing hands on the hardware — repairs, printers, a setup in your office — happens in person around the city. Automation, spreadsheets, websites and Roblox work are remote, and for those it does not matter where you are.",
    // Map pin.
    icon: (
      <>
        <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.8" r="2.4" />
      </>
    ),
  },
  {
    title: "I am studying full time.",
    description:
      "So I take on work I can finish properly rather than as much of it as possible. If a deadline is not going to work, you will hear that from me before you commit to anything, not afterwards.",
    // Open book.
    icon: (
      <>
        <path d="M12 6.5c-1.6-1.1-3.6-1.6-5.5-1.4a1 1 0 0 0-.9 1v11.4a1 1 0 0 0 1.1 1c1.8-.2 3.7.3 5.3 1.4 1.6-1.1 3.5-1.6 5.3-1.4a1 1 0 0 0 1.1-1V6.1a1 1 0 0 0-.9-1c-1.9-.2-3.9.3-5.5 1.4Z" />
        <path d="M12 6.5v13" />
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative">
        <div className="relative mx-auto max-w-6xl px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
          <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <SectionLabel>About</SectionLabel>
              <h1 className="mt-2 max-w-[20ch] text-h1 text-text">
                Who you would be hiring
              </h1>
              <p className="mt-4 max-w-[56ch] text-body text-text-muted">
                My name is Liam. I have been building and fixing computers in
                person since I was a kid, and now I am also a computer science
                student in Calgary getting paid to do more of the same —
                scripts that kill repetitive work, spreadsheets that stop
                needing to be babysat, sites, and hands-on repairs for people
                who would rather not deal with it themselves.
              </p>
            </div>
            <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl border border-border sm:w-56">
              <Image
                src="/about/fish.webp"
                alt="Liam smiling and holding a small fish he caught, with grassy hills and a blue sky behind him."
                fill
                sizes="(min-width: 640px) 14rem, 10rem"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="border-t border-border pt-8">
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
            {facts.map((fact) => (
              <div key={fact.title} className="sm:px-6 sm:first:pl-0">
                <div className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0 text-accent"
                  >
                    {fact.icon}
                  </svg>
                  <h2 className="text-h3 text-text">{fact.title}</h2>
                </div>
                <p className="mt-3 text-small text-text-muted">
                  {fact.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="max-w-[36ch] text-small text-text-muted">
            When I am away from a computer I am powerlifting, out fishing,
            hiking or camping somewhere in Alberta, or out chasing good food.
          </p>
          <div className="grid shrink-0 grid-cols-2 gap-3 sm:w-64">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
              <Image
                src="/about/gym.webp"
                alt="Liam at the gym on a bench press with a training partner."
                fill
                sizes="8rem"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
              <Image
                src="/about/food.webp"
                alt="Liam adding fresh herbs to a bowl of pho at a restaurant."
                fill
                sizes="8rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <CTASection secondary={{ href: "/portfolio", label: "See the work" }} />
    </>
  );
}
