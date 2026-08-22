import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import CTASection from "@/components/CTASection";
import LineIcon from "@/components/LineIcon";
import SectionLabel from "@/components/SectionLabel";
import AutomationHeroArt from "@/components/service/AutomationHeroArt";
import AutomationProcessArt from "@/components/service/AutomationProcessArt";
import { getService, servicePage, serviceSlugs } from "@/data/services";
import { warmGlowImage } from "@/lib/glow";
import type { ServiceSlug } from "@/lib/types";

/*
  The detail template. Every one of the five pages is this file — there is no
  per-service JSX anywhere below, and there must not be. Everything that
  differs between services is a field on the Service object, or an entry in the
  two artwork maps directly under this comment.

  RENDERING COST (§4.1).
  generateStaticParams prerenders all five at build time, so they are served
  from the assets binding and cost nothing.

  `dynamicParams = false` is the other half of that, and it matters more than
  it looks. Left at its default of true, a request to /services/anything-at-all
  would be rendered on demand — meaning any crawler or scanner hitting made-up
  URLs could invoke the Worker and burn request quota against the daily cap.
  With it false, anything not in generateStaticParams is a static 404.

  ─────────────────────────────────────────────────────────────────────────
  2026-08-21 REBUILD, to the owner's Automation mockup.

  This replaced the R3 restyle wholesale rather than adjusting it. The shape is
  now the mockup's: a split-colour hero with artwork, a "What I build" card
  row, a process row, a closing bar. Four things about it are worth knowing
  before editing.

  1. THREE SECTIONS WERE DROPPED (owner call, mockup 1:1): the FAQ accordion,
     the "Work like this" related-projects grid, and the `problems` panel that
     R3 had made the page's focal block. The first two were an explicit
     decision; `problems` went with them because the mockup has nowhere to put
     it. That leaves `Service.problems` rendered nowhere on the site — it is
     still the field §6 calls the most important one, and putting it back as a
     band between the hero and "What I build" is a small change if the owner
     wants it. The data stays where it is either way.

     The hero's secondary button is what stops the page being a dead end now
     that the related grid is gone: it points at /portfolio.

  2. ONE LAYOUT, FIVE SERVICES. Only Automation has a mockup and owner-written
     copy. `servicePage()` in src/data/services.ts derives the same structure
     for the other four out of the content they already have, so nothing here
     branches on a slug except the artwork maps below. See that function for
     what the fallback is built from and why nothing in it is invented.

  3. ARTWORK IS OPTIONAL AND PER-SERVICE. A service with no entry in the maps
     renders the same page without it — the hero goes full width, the process
     row loses a column. That is the graceful half of (2).

  4. ACCENT ON HEADINGS. The hero's first line is orange and so is every
     section micro-label. §9.2 reserves orange for actions; §9 makes the
     mockup authoritative where the two disagree, and the home page hero
     already ships the same override on the word "Liam". Noted rather than
     done quietly.
*/

export const dynamicParams = false;

/*
  Per-service artwork. Two maps rather than one component with a slug prop:
  these are unrelated drawings that happen to be commissioned per service, and
  a single component switching on slug internally is the per-service JSX this
  file exists to avoid.

  Partial on purpose — see note 3 above.
*/
const HERO_ART: Partial<
  Record<ServiceSlug, React.ComponentType<{ className?: string }>>
> = {
  automation: AutomationHeroArt,
};

const PROCESS_ART: Partial<
  Record<ServiceSlug, React.ComponentType<{ className?: string }>>
> = {
  automation: AutomationProcessArt,
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return {};

  // The tagline doubles as the meta description. That is why the location for
  // local tech help lives in that field (§11 wants location terms on that page)
  // rather than in a special case here.
  return {
    title: service.title,
    description: service.tagline,
    openGraph: {
      type: "website",
      title: service.title,
      description: service.tagline,
    },
  };
}

/*
  The card surface shared by the "What I build" cards and the process panel.

  Measured off the mockup rather than reused from the home page's triage cards,
  which are a different treatment: those carry a lit top edge and a round pool
  of light under it, and these have neither. Sampling a card here gives a fill
  of rgb(11,11,12) against a section background of rgb(7,7,9) — barely lifted,
  with a faint warmth pooling at the bottom-left corner rather than the top.

  Hence a low-peak warmGlowImage() anchored at "0% 100%", over --color-surface
  at half strength. Same shared gradient as every other panel on the site; only
  the origin and the peak differ, which is what §9.4 asks for instead of a
  second hand-written radial.
*/
const CARD_FILL = `${warmGlowImage({ size: [45, 45], peak: 7, at: "0% 100%" })}, color-mix(in srgb, var(--color-surface) 55%, transparent)`;

/** The arrow between process steps. Drawn rather than the "→" glyph, for the
    reason ServicesSection's Arrow gives: the character renders at the body
    font's hairline weight and reads as a faint tick beside a lit icon. */
function StepArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute -left-[0.9375rem] top-2 hidden h-3.5 w-3.5 text-accent xl:block"
    >
      <path d="M4.5 12h14" />
      <path d="M12.5 6l6 6-6 6" />
    </svg>
  );
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);

  // Unreachable while dynamicParams is false, but it is what makes the type
  // narrow and it keeps the page correct if that config ever changes.
  if (!service) notFound();

  const page = servicePage(service);
  const HeroArtwork = HERO_ART[service.slug];
  const ProcessArtwork = PROCESS_ART[service.slug];

  /*
    Whether each row can run at full mockup density.

    A card or step written for the mockup is a two-word title over a short
    caption and packs five or four to a row. A DERIVED one (see `servicePage()`)
    puts a whole sentence in the title and has no caption, so the same grid
    would give it a 110px column to hold twelve words. Keying off the presence
    of descriptions rather than off `service.page` keeps this a property of the
    content — a future service that writes long titles by hand gets the roomy
    grid too, without anyone remembering to set a flag.
  */
  const denseCards = page.offer.cards.every((card) => card.description);
  const denseSteps = page.process.steps.every((step) => step.description);

  /*
    The process row is three columns only when it has three things to put in
    them. A service with no artwork and no panel (every service but Automation,
    today) would otherwise render its steps inside a 19rem column with two empty
    tracks beside it — which is exactly what the first pass did.
  */
  const processBlocks = 1 + (ProcessArtwork ? 1 : 0) + (page.panel ? 1 : 0);
  const processColumns =
    processBlocks === 3
      ? "lg:grid-cols-2 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_13rem]"
      : processBlocks === 2
        ? "lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]"
        : "";

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-6">
        {/*
          35rem, MEASURED RATHER THAN PROPORTIONAL. The mockup gives its copy
          column 38% of the content width, and setting 38% here put "that works
          for you." onto three lines: the mockup is drawn at 1536px wide, this
          site's container caps at max-w-6xl, and Bricolage Bold at the top of
          the display clamp needs ~537px for that line whatever share of the
          row it is given. The column is sized to the heading instead, and the
          artwork takes what is left — which is the right way round, since the
          heading is content and the artwork is decoration.
        */}
        <div
          className={`grid items-center gap-10 ${
            HeroArtwork
              ? "lg:grid-cols-[minmax(0,35rem)_minmax(0,1fr)] lg:gap-8"
              : ""
          }`}
        >
          <div>
            {/*
              No /services index to go back to (§7 — the home page's Services
              section replaced it), so "Back to Services" points at that
              section's anchor. The label is the mockup's; the destination is
              the only one that exists.
            */}
            <Link
              href="/#services"
              className="group inline-flex items-center gap-2 text-small font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              >
                <path d="M19.5 12h-14" />
                <path d="M11.5 6l-6 6 6 6" />
              </svg>
              Back to Services
            </Link>

            {/*
              text-display and font-bold, both measured: the mockup's heading
              runs about 62px at its native 1536px width, which is the top of
              text-display's clamp, and its strokes are visibly heavier than
              the weight-600 the base layer gives every h1. Bricolage ships a
              real Bold, so this is a true instance rather than a synthesised
              one.
            */}
            <h1 className="mt-5 max-w-[16ch] text-display font-bold text-text">
              {page.headline.map((line, i) => (
                <span key={i} className="block">
                  {line.map((segment, j) => (
                    <span
                      key={j}
                      className={segment.accent ? "text-accent" : ""}
                    >
                      {segment.text}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <p className="mt-5 max-w-[46ch] text-body text-text-secondary">
              {page.blurb}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/*
                PRIMARY: filled orange pill with DARK ink. The mockup sets this
                label in white, which measures 2.9:1 on --color-accent and
                fails the 4.5:1 §10 requires of a button label; --color-bg on
                the same fill measures 6.9:1. Fill, radius and proportions are
                the mockup's — only the ink changed, and only because the
                alternative was an inaccessible button. Same call as
                CTASection's `filled` variant, which this page also uses.
              */}
              <Link
                href={`/contact?topic=${service.slug}`}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-bg transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_0_28px_var(--color-accent-dim)]"
              >
                Get Started
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {page.secondaryCta ? (
                <Link
                  href={page.secondaryCta.href}
                  className="inline-flex items-center gap-2.5 rounded-full border border-text-muted/50 px-6 py-3 font-semibold text-text transition-colors duration-200 hover:border-text hover:bg-surface"
                >
                  {page.secondaryCta.label}
                  <LineIcon
                    name={page.secondaryCta.icon}
                    className="h-4 w-4 shrink-0"
                  />
                </Link>
              ) : null}
            </div>
          </div>

          {/*
            hidden lg:block, the same call the home page's hero art has: on a
            phone this is decorative weight between the headline and the
            content that converts, and the CSS 3D inside it never runs on the
            devices least able to afford it.
          */}
          {HeroArtwork ? <HeroArtwork className="hidden lg:block" /> : null}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* WHAT I BUILD                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="offer-heading"
        className="mx-auto max-w-6xl px-5 pt-4 pb-4 sm:px-8 sm:pt-5 sm:pb-4"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-8">
          <div>
            <SectionLabel>{page.offer.label}</SectionLabel>
            <h2
              id="offer-heading"
              className="mt-2 max-w-[18ch] text-h2 font-bold text-text"
            >
              {page.offer.heading}
            </h2>
            {page.offer.body ? (
              <p className="mt-4 max-w-[38ch] text-small leading-[1.5] text-text-muted">
                {page.offer.body}
              </p>
            ) : null}
          </div>

          <ul
            className={`grid gap-4 lg:self-start sm:grid-cols-2 ${
              denseCards ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-2"
            }`}
          >
            {page.offer.cards.map((card) => (
              <li
                key={card.title}
                className="rounded-2xl border border-border p-4"
                style={{ background: CARD_FILL }}
              >
                <LineIcon name={card.icon} className="h-6 w-6 text-accent" />
                <p className="mt-4 text-small font-semibold leading-snug text-text">
                  {card.title}
                </p>
                {card.description ? (
                  <p className="mt-2.5 text-[0.8rem] leading-[1.45] text-text-muted">
                    {card.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* MY PROCESS                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="process-heading"
        className="mx-auto max-w-6xl px-5 pt-4 pb-2 sm:px-8 sm:pt-4 sm:pb-2"
      >
        {/*
          Three columns at xl — artwork, steps, panel — collapsing to two at
          lg (the panel drops full width underneath) and to one stack below
          that. The mockup's own proportions are roughly 36/41/18; the fixed
          rem values here hold that while leaving the step row the widest
          share, since it is the column that runs out of room first.
        */}
        <div className={`grid gap-8 ${processColumns}`}>
          {ProcessArtwork ? <ProcessArtwork className="self-start" /> : null}

          <div>
            <SectionLabel>{page.process.label}</SectionLabel>
            <h2
              id="process-heading"
              className="mt-2 text-h2 font-bold text-text"
            >
              {page.process.heading}
            </h2>
            {page.process.body ? (
              <p className="mt-1.5 max-w-[52ch] text-small leading-[1.5] text-text-muted">
                {page.process.body}
              </p>
            ) : null}

            <ol
              className={`mt-5 grid gap-x-4 gap-y-6 sm:grid-cols-2 ${
                denseSteps ? "xl:grid-cols-4" : ""
              }`}
            >
              {page.process.steps.map((step, index) => (
                <li key={step.title} className="relative">
                  {/* Sits in the grid gap to the left, so it reads as the
                      join between two steps rather than as part of either.
                      Never before the first, and only where the row is
                      actually a row (xl). */}
                  {denseSteps && index > 0 ? <StepArrow /> : null}
                  <LineIcon name={step.icon} className="h-7 w-7 text-accent" />
                  <p className="mt-3 font-semibold text-text">
                    {index + 1}. {step.title}
                  </p>
                  {step.description ? (
                    <p className="mt-1 text-[0.69rem] leading-[1.55] text-text-muted">
                      {step.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          {/*
            The promise panel. Present only where the owner has written its
            three points — see `ServicePage.panel`; §11 forbids inventing them
            for the services that have not been art-directed yet.
          */}
          {page.panel ? (
            <div
              className="flex flex-col self-start rounded-2xl border border-border p-4 lg:col-span-2 xl:col-span-1"
              style={{ background: CARD_FILL }}
            >
              {/*
                Icon beside the heading, as the mockup draws it. It was stacked
                for one pass because at the 12rem this column then had, sharing
                the line left the heading 128px and broke it over four lines.
                The column is 14rem now and the heading is set at text-small,
                which is what buys the two lines the mockup gets — the mockup's
                own panel is ~250px against this 224px, so the type had to give
                somewhere for the arrangement to survive.
              */}
              <div className="flex items-start gap-2.5">
                <LineIcon
                  name={page.panel.icon}
                  className="h-6 w-6 shrink-0 text-accent"
                />
                <p className="text-small font-semibold leading-snug text-text">
                  {page.panel.heading}
                </p>
              </div>

              <Link
                href={`/contact?topic=${service.slug}`}
                className="group mt-3.5 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-small font-semibold text-bg transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_0_24px_var(--color-accent-dim)]"
              >
                Contact Me
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Every point on one line, which is what sets this column's
                  width: "Clear communication" is the longest at ~133px, so the
                  text needs 162px clear of the tick and its gap. */}
              <ul className="mt-4 flex flex-col gap-2">
                {page.panel.points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <LineIcon
                      name="check"
                      className="h-4 w-4 shrink-0 text-accent"
                    />
                    <span className="text-small leading-tight text-text">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CLOSING BAR                                                      */}
      {/* ---------------------------------------------------------------- */}
      <CTASection
        title={page.closing.title}
        description={page.closing.description}
        ctaLabel="Get Started"
        filled
        secondary={{ href: "/#services", label: "View Other Services" }}
        topic={service.slug}
      />
    </>
  );
}
