import type { Metadata } from "next";
import Image from "next/image";
import CTASection from "@/components/CTASection";
import Eyebrow from "@/components/Eyebrow";

/*
  About (CLAUDE.md §14 step 6). Fully static — no data, no dynamic APIs — so it
  prerenders and is served from the assets binding without invoking the Worker
  (§4.1).

  This is a trust page, not a biography. A visitor arrives with one question —
  can I rely on this person — and the page answers it with what is verifiably
  true: the work already done, where it happens, and how fast a message gets
  answered. Every sentence here came from the owner. Nothing is inferred.

  Deliberately absent, per §10 and the owner's own material:
  - No years-of-experience figure. "Since I was 12" is a true start date, not a
    claim of professional tenure, and is phrased so it cannot be read as one.
  - No credentials beyond "studying computer science", which is current fact.
  - No origin story about a love of technology.

  PHOTOS. Three real, owner-supplied photos (public/about) replace what used to
  be a TODO here. fish.webp is the identity shot — a real face is what "who you
  would be hiring" (the h1) is actually asking for, so it sits in the header
  band beside the h1, same placement the original TODO called for. gym.webp and
  food.webp illustrate the closing line about life away from the computer and
  sit beside it as a pair. Same three files in both themes (§9.2 covers colour
  tokens, not photographs — there is no "dark version" of a photo to swap to),
  so no theme-swap wiring like the portfolio screenshots.
*/

export const metadata: Metadata = {
  title: "About",
  description:
    "A computer science student in Calgary who builds automation, spreadsheets and websites, and fixes computers — what I have actually done, and how I work.",
  openGraph: {
    type: "website",
    title: "About",
    description:
      "A computer science student in Calgary who builds automation, spreadsheets and websites, and fixes computers.",
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-surface-muted">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Eyebrow>About</Eyebrow>
              <h1 className="mt-3 max-w-[20ch] text-h1 text-ink">
                Who you would be hiring
              </h1>
              <p className="mt-4 max-w-[56ch] text-body text-ink-muted">
                My name is Liam. I have been building and fixing computers in
                person since I was a kid, and now I am also a computer science
                student in Calgary getting paid to do more of the same —
                scripts that kill repetitive work, spreadsheets that stop
                needing to be babysat, sites, and hands-on repairs for people
                who would rather not deal with it themselves. Here is what that
                has actually looked like.
              </p>
            </div>
            <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl border border-line sm:w-56">
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

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-[62ch]">
          <h2 className="text-h2 text-ink">How this started</h2>
          <p className="mt-4 text-body text-ink-muted">
            The first thing I ever automated was my own job. Part of the work
            was copying raw sales reports and pulling out the few numbers that
            mattered — the same figures, the same way, every time. It took long
            enough that I wrote a parser to read the raw export and pull out
            only what was needed.
          </p>
          <p className="mt-4 text-body text-ink-muted">
            That is still the shape of most of what I do. Someone is spending an
            hour a week on something a computer should be doing, usually without
            having stopped to consider that it is optional.
          </p>

          <h2 className="mt-12 text-h2 text-ink">What I have done</h2>
          <p className="mt-4 text-body text-ink-muted">
            I have been doing technical work since I was 12. Since then: 11
            desktop computers built from scratch, Minecraft plugins and mods,
            3D modelling, video editing and graphic design, spreadsheets and
            calculators built in Excel, printer setups, DNS and domain
            configuration, and a long run of repairs and software problems
            solved for people who did not want to solve them themselves.
          </p>
          <p className="mt-4 text-body text-ink-muted">
            My first paid job was building a computer for someone else. I was
            paid $150 for it. Everything since has been a version of the same
            arrangement.
          </p>

          <h2 className="mt-12 text-h2 text-ink">How I work</h2>
          {/*
            Three operating facts, not values. Each one is something a client
            can hold me to, which is the only kind of statement that does any
            work on a page like this.
          */}
          <ul className="mt-4 space-y-4">
            <li className="text-body text-ink-muted">
              <span className="font-semibold text-ink">I answer quickly.</span>{" "}
              Usually the same day. If a day passes with no reply from me, I am
              either genuinely tied up or your message never arrived — send it
              again rather than assuming the answer is no.
            </li>
            <li className="text-body text-ink-muted">
              <span className="font-semibold text-ink">
                I am in Calgary, Alberta.
              </span>{" "}
              Anything needing hands on the hardware — repairs, printers, a
              setup in your office — happens in person around the city.
              Automation, spreadsheets, websites and Roblox work are remote, and
              for those it does not matter where you are.
            </li>
            <li className="text-body text-ink-muted">
              <span className="font-semibold text-ink">
                I am studying full time.
              </span>{" "}
              So I take on work I can finish properly rather than as much of it
              as possible. If a deadline is not going to work, you will hear
              that from me before you commit to anything, not afterwards.
            </li>
          </ul>

          <p className="mt-12 text-body text-ink-muted">
            When I am away from a computer I am powerlifting, out fishing,
            hiking or camping somewhere in Alberta, or out chasing good food.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line">
              <Image
                src="/about/gym.webp"
                alt="Liam at the gym on a bench press with a training partner."
                fill
                sizes="(min-width: 640px) 29ch, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line">
              <Image
                src="/about/food.webp"
                alt="Liam adding fresh herbs to a bowl of pho at a restaurant."
                fill
                sizes="(min-width: 640px) 29ch, 45vw"
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
