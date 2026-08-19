import Link from "next/link";
import LitEdge from "@/components/LitEdge";
import { EDGE_PEAK, warmEdgeImage, warmGlowImage } from "@/lib/glow";

/*
  The home page "Services" section (CLAUDE.md §7) — symptom-worded triage
  cards that route a visitor to one of the five service pages.

  This restores the triage mechanic removed in Phase 2, on the owner's
  instruction, and is the section §7 said was planned: it is the only thing on
  the home page that gets a visitor to a specific service without already
  knowing its slug.

  SERVER COMPONENT, DELIBERATELY.
  The options must be real <Link> elements, not onClick router pushes, so they
  stay keyboard-navigable, crawlable and middle-clickable. Six links need no
  state, so there is nothing left for a client bundle to do.

  COLOUR.
  Orange stays the only action colour (§9.2). The service hues appear ONLY as
  the fill behind each emoji chip, which is identity marking on a
  non-interactive sub-element — never the affordance itself, never a border,
  never text. Emoji are aria-hidden: the written label carries the meaning, so
  the glyph is decoration and its contrast against the chip is not an
  accessibility bar.

  LABELS.
  Every label is a SYMPTOM in the visitor's words, never a service name
  ("Process Automation" is exactly what these must not say) — the same
  discipline as `problems` in src/data/services.ts. Hints are drawn from the
  service table in §1, not invented.

  2026-08-18 restyle, on owner instruction: the cards carry the same warm
  corner glow as the "Let's work together" panel at rest, the pastel chips are
  toned into the dark palette, and the copy was tightened. The wording brief
  was "more professional", which in most hands means renaming these to service
  names — that would invert §7 and fail §2's first success criterion, so the
  owner picked the register change instead: same first-person symptoms, harder
  edges. "I have a repetitive task" became "I repeat the same task every week";
  nothing became "Process Automation".
*/

interface TriageOption {
  label: string;
  hint: string;
  href: string;
  emoji: string;
  /** Static class string so Tailwind's source scanner sees it verbatim. */
  chipClass: string;
}

const options: readonly TriageOption[] = [
  {
    label: "I repeat the same task every week",
    hint: "Recurring reports, file processing, data entry",
    href: "/services/automation",
    emoji: "🔄",
    chipClass: "bg-service-automation-tint",
  },
  {
    label: "My spreadsheets have outgrown me",
    hint: "Spreadsheets, dashboards, and performance trackers",
    href: "/services/excel-data",
    emoji: "📊",
    chipClass: "bg-service-excel-tint",
  },
  {
    label: "My computer or network keeps failing",
    hint: "Setup, repairs, printers, Wi-Fi, and backups",
    href: "/services/local-tech-help",
    emoji: "🖥️",
    chipClass: "bg-service-local-tint",
  },
  {
    label: "My business needs a proper website",
    hint: "Small-business sites, landing pages, and menus",
    href: "/services/websites",
    emoji: "🌐",
    chipClass: "bg-service-websites-tint",
  },
  {
    // §11 allows technical language for this audience, and it is the register
    // they use themselves — "we" because a Roblox enquiry is almost always a
    // team rather than one person.
    label: "We need a developer on our Roblox game",
    hint: "Luau scripting, gameplay, UI, and DataStore systems",
    href: "/services/roblox",
    emoji: "🎮",
    chipClass: "bg-service-roblox-tint",
  },
];

/*
  Kept out of the array above because it is the one option that reaches the
  quote form directly — the five service options pass their topic through one
  hop later, from each service page's own CTA — and because it has no service
  hue to chip.

  OWNER CALL, 2026-08-18: it is now the same size as the other five, with no
  accent border, making an even grid of six. That drops the emphasis §7 asks
  for — it calls this "a first-class option rather than a fallback", because a
  real share of good leads arrive not knowing what they need. What still marks
  it: the accent-tinted chip, and last position, which is where someone who did
  not recognise themselves in the five above is looking by then.

  The label is deliberately the one that was NOT tightened in the 2026-08-18
  copy pass. Someone who does not know what they need is the visitor least
  likely to recognise a sharpened phrase.
*/
const unsure = {
  label: "I'm not sure what I need",
  hint: "Describe the problem in your own words and I'll tell you what would fix it.",
  href: "/contact?topic=unsure",
  emoji: "❓",
} as const;

/*
  THE CARD SURFACE, REFITTED TO THE SERVICES MOCKUP (owner call).

  What changed and why. These cards used to call warmPanel() at peak 14 with a
  GlowBorder ringing all four sides, so that they matched the closing CTA panel
  exactly — that was the previous owner call, and the note it replaced said the
  two "cannot diverge again". The services mockup diverges them deliberately,
  and the pixels are unambiguous about it:

    top edge      rgb(242,106,2)   — accent, near full strength
    left edge     rgb(49,38,37)    \
    right edge    rgb(41,43,43)     >  --color-border, flat and neutral
    bottom edge   rgb(36,36,38)    /

  So the lit ring is gone: three sides are an ordinary hairline and only the
  top is lit. The CTA panel is untouched and keeps warmPanel() — the cards are
  simply their own treatment again.

  NO BROWN TINT EITHER. warmPanel() lays --color-panel-brown over the gradient
  at 16%, which is what made the live cards read muddy next to the mockup. The
  mockup's card bottom samples (9,9,11) against a section background of (7,7,9)
  — neutral, barely lifted, no warmth left down there at all. That is a plain
  base with the glow above it, not warmPanel() — see the fill note below for
  the grey that replaced the brown.
*/

/*
  The fill wash, fitted rather than guessed — median warmth (R-B) down a clear
  strip of card 1, against its own base:

     3% down  20      31% down  10      59% down   2
    12% down  17      40% down   7      73% down   0
    22% down  13      49% down   4

  ln(warmth) against depth is a straight line, so the same exponential the rest
  of glow.ts assumes holds here too; the vertical e-fold works out at 24% of
  the card's height, about 38px.

  OWNER CALLS on the three things the fit alone would not have given:

  A CIRCLE, NOT AN ELLIPSE, CENTRED ON THE EDGE'S BRIGHT POINT. The fit gives
  an ellipse peaking 45% across — wide, shallow, and its own thing. What was
  asked for is a round pool of light hanging directly under the brightest part
  of the lit top edge, so the two read as one source. Hence `radius` rather
  than `size`, and `at: EDGE_PEAK% 0%` rather than a number of its own.

  THE 70px IS CHOSEN, NOT FITTED, and the distinction matters because the two
  numbers here look like they should agree and do not. FALLOFF places its
  e-fold at exactly one radius, so honouring the measured 38px would mean
  radius: 38px — a tight bright disc against the top edge, which is the
  opposite of the soft pool being asked for. 70px is the compromise: the card
  bottom still goes dark the way the mockup's does, while the pool stays wide
  enough across the card to read as a round glow rather than a hotspot. A
  circle cannot have both the mockup ellipse's tight vertical falloff and its
  much wider horizontal spread; this splits the difference. The fitted figure
  stays written down because it still describes that ellipse.

  SAME ORANGE AS THE LIT EDGE, AND THAT ORANGE IS GLOW_COLOUR — an owner call
  that overrides the mockup rather than following it, so it is worth being
  straight about. Solving the mockup's brightest fill pixel, rgb(32,17,12) over
  a card base of about rgb(9,9,11), for the alpha that reproduces its red:

    --color-accent at 9.3%   predicts G 18.1, B 12.4   against actual 17, 12
    #d63f00        at 11.2%  predicts G 15.1, B  9.8   against actual 17, 12

  The two channels not used to fit it come out closer on --color-accent, so the
  mockup's own fill is the brighter orange. Both this and the edge above it ran
  that way for a pass — and next to the "Let's work together" panel, which is
  #d63f00, the cards read as a second, lighter light source. The owner asked
  for one colour across all three. #d63f00 it is; nothing here passes `colour`
  any more, and the default is the point.

  PEAK 10 SURVIVES THE SWITCH. #d63f00 carries R-B = 214 against accent's 229,
  so the alpha needed to hit the mockup's warmth of 20 through a 15% grey moves
  only from 9.3% to 10.6% — inside the rounding this was already using.

  MUCH DIMMER THAN THE LINE IS NOT THE SAME AS FAINT. An earlier pass ran this
  at peak 6 under a 55% grey and the glow vanished: "much dimmer" describes the
  fill against the *line* it spills from, which is the same colour at full
  strength, not against whatever the fill happened to be before.

  THE GREY IS GENUINELY LOW-OPACITY, 15%. Its job is to knock the sharpness off
  the orange and lift the card a touch off the page, not to mute it — the
  mockup's card body sits only ~2 levels above its section background. Same
  layer-order trick as warmPanel()'s brown: CSS paints the first background
  layer on top, so the grey sits over the gradient rather than under it.
*/
const CARD_TINT = "color-mix(in srgb, var(--color-surface) 15%, transparent)";
const CARD_GLOW_OPTIONS = {
  radius: "70px",
  // EDGE_PEAK, not a number typed out here: the owner's ask was that this be
  // centred on the brightest point of the lit edge, so it reads as that edge
  // spilling downward rather than as a second light source beside it. Sharing
  // the constant is what keeps that true if the peak ever moves.
  at: `${EDGE_PEAK}% 0%`,
};
const CARD_GLOW =
  `linear-gradient(${CARD_TINT}, ${CARD_TINT}), ` +
  `${warmGlowImage({ ...CARD_GLOW_OPTIONS, peak: 10 })}, var(--color-bg)`;

/*
  The hover half, faded in over the resting one — a gradient's colour stops
  cannot be transitioned, so strength has to come from a second layer's
  opacity. warmGlowImage() rather than the full stack above: this overlay only
  adds light on top of what is already there, and re-applying the grey and the
  base would paint over the card underneath it.
*/
const CARD_GLOW_HOVER = warmGlowImage({ ...CARD_GLOW_OPTIONS, peak: 22 });

/*
  GRID, NOT A FLEX ROW. The mockup stacks the hint underneath the title and
  indents it to the title's left edge, past the chip — a flex row of
  [chip, text, arrow] cannot do that, because there the chip and the text block
  are siblings and the hint lives inside the second one.

  Three columns and two rows: the chip takes column 1 of the title's row, so it
  centres against the title rather than against the whole card (measured: the
  mockup's chip sits ~26px above each card's vertical centre, which is title
  centre, not card centre); the hint takes column 2 of the second row, which is
  what puts its left edge under the title's; and the arrow spans both rows in
  column 3, staying near the card's centre where the mockup keeps it.

  py-5 rather than the py-3.5 these carried: the mockup's cards come out ~157px
  tall at this width against the 129px these were rendering, and the vertical
  padding is where that whole difference sits.

  `border` is back, and flat — see the surface note above for the samples that
  put an ordinary hairline on three of the four sides.
*/
const cardBase =
  "group relative grid h-full grid-cols-[auto_1fr_auto] gap-x-3.5 " +
  "rounded-2xl border border-border px-5 py-5 " +
  "transition-all duration-200 hover:-translate-y-0.5";

const chipBase =
  "relative col-start-1 row-start-1 flex h-10 w-10 shrink-0 items-center " +
  "justify-center self-center rounded-lg text-base";

/*
  DRAWN, NOT THE "→" GLYPH, and accent at rest rather than muted.

  Both come off the mockup, where this is a solid orange arrow on all six cards
  — roughly 20px across with a ~2px stroke and an open chevron head. The glyph
  this replaces rendered at the body font's own hairline weight and only
  reached accent on hover, so it read as a faint grey tick beside a lit card
  rather than as the card's affordance. An SVG is what lets the weight be set
  at all; the character's is whatever Inter draws.

  §9.2 is satisfied rather than bent: this is the action cue inside a link,
  which is exactly what the rule reserves orange for.

  aria-hidden, because a link already announces itself as a link.
*/
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative col-start-3 row-span-2 row-start-1 ml-2 h-5 w-5 shrink-0 self-center text-accent transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path d="M4.5 12h14" />
      <path d="M12.5 6l6 6-6 6" />
    </svg>
  );
}

/** The hover half of the glow, faded in over the resting one. */
function GlowOverlay({ background }: { background: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      style={{ background }}
    />
  );
}

/*
  One card, so the six service options and the "not sure" one cannot drift
  apart. They were two near-identical copies of this markup before, already
  differing by a stray indent, which is the drift a shared component prevents.
*/
function TriageCard({
  href,
  label,
  hint,
  emoji,
  chipClass,
}: {
  href: string;
  label: string;
  hint: string;
  emoji: string;
  chipClass: string;
}) {
  return (
    <Link href={href} className={cardBase} style={{ background: CARD_GLOW }}>
      <GlowOverlay background={CARD_GLOW_HOVER} />
      <LitEdge image={warmEdgeImage()} />
      {/* The hover half of the edge, same trick as the fill overlay: a
          gradient cannot be transitioned, so a brighter copy fades in over
          the resting one. */}
      <LitEdge
        image={warmEdgeImage()}
        className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />

      <span aria-hidden="true" className={`${chipBase} ${chipClass}`}>
        {emoji}
      </span>
      <span className="relative col-start-2 row-start-1 min-w-0 font-medium text-text">
        {label}
      </span>
      <span className="relative col-start-2 row-start-2 mt-1 min-w-0 text-small text-text-muted">
        {hint}
      </span>
      <Arrow />
    </Link>
  );
}

export default function ServicesSection() {
  return (
    // scroll-mt-16 clears the sticky header when anything links to /#services.
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-6 sm:px-8 sm:py-8"
    >
      {/* Same label-then-heading rhythm as the About Me section below. */}
      <p className="text-small font-medium text-accent">Services</p>
      {/*
        Same type sizes as the About Me section (owner call): the heading at
        text-body/semibold rather than text-h2, and the standfirst below it at
        text-small. The two sections sit next to each other on the home page
        and were opening at different scales — About's heading is deliberately
        small so it sits in line with the three virtue titles beside it, and
        this one was still full section-heading size.

        Still an <h2> with the same id, so `aria-labelledby` and the document
        outline are unchanged; only the drawn size moved.
      */}
      <h2 id="services-heading" className="mt-2 max-w-[24ch] text-h3 text-text">
        What can I help you with?
      </h2>
      <p className="mt-3 max-w-[52ch] text-small text-text-muted">
        Pick whichever sounds closest. You do not need to know what the work is
        called.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <li key={option.href}>
            <TriageCard {...option} />
          </li>
        ))}

        <li>
          {/* Only the accent-tinted chip and last position mark this one now —
              see the note on `unsure` for the owner call that dropped the
              accent border and the full-width row it used to get. */}
          <TriageCard {...unsure} chipClass="bg-accent-dim" />
        </li>
      </ul>
    </section>
  );
}
