import Link from "next/link";
import GlowBorder from "@/components/GlowBorder";
import { warmGlowImage, warmPanel } from "@/lib/glow";

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
  The glow, at rest, on every card — the owner's request was that these match
  the "Let's work together" panel, so both call the same warmGlow() (see
  src/lib/glow.ts for where the curve comes from).

  Two numbers differ from the panel's defaults, and both follow from the
  cards being a different shape. The ellipse is sized up (the panel is one wide
  short band; a card is roughly a third of that width, so the same visual
  falloff needs a larger percentage of its own box), and the peak is dialled
  back to 14% — the panel's 32% is a single focal element on the page, whereas
  six cards at that strength would read as an orange grid and drown the section
  heading. Hover adds the rest as a separate overlay, which is what makes the
  transition possible at all: color-mix percentages inside a gradient cannot be
  animated, but the opacity of a layer sitting on top of one can.
*/
const CARD_SIZE: [number, number] = [70, 95];

/*
  Owner call: match the closing CTA panel exactly. These used to call
  warmGlow() over --color-surface while the CTA had gained the deep-brown
  overlay and a dark base, so "the same glow" had quietly become two different
  treatments — the cards read brighter and more orange than the panel they
  were supposed to match. Both now call warmPanel(), which is that treatment,
  so they cannot diverge again.
*/
const CARD_GLOW = warmPanel({ size: CARD_SIZE, peak: 14 });

/*
  The hover half, faded in over the resting one — a gradient's colour stops
  cannot be transitioned, so strength has to come from a second layer's
  opacity. Still warmGlowImage() rather than warmPanel() on purpose: this
  overlay only adds light on top of what is already there, and re-applying the
  brown tint and the base would paint over the card underneath it.
*/
const CARD_GLOW_HOVER = warmGlowImage({ size: CARD_SIZE, peak: 26 });

// §9.4: hover is a border shift, a subtle lift and a glow — not just a colour
// change, and under 200ms. globals.css already neutralises the movement under
// prefers-reduced-motion.
// px-5 py-3.5 rather than a square p-5: owner call, 2026-08-18 — six cards of
// two text lines each was a tall block, and the horizontal padding is what
// keeps the label off the chip, so only the vertical half needed to give.
// `border` is gone: the lit edge is a GlowBorder now, matching the CTA panel
// (owner call). A flat hairline underneath it would show through wherever the
// glow border has faded out, which is most of the card.
const cardBase =
  "group relative flex h-full items-center gap-3.5 overflow-hidden rounded-2xl px-5 py-3.5 " +
  "transition-all duration-200 hover:-translate-y-0.5";

// Shrunk with the padding — a 44px chip inside a shorter card would set the
// card's height on its own and undo the change.
const chipBase =
  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base";

// aria-hidden: it is a visual affordance cue, and a link already announces
// itself as a link.
function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="relative ml-auto self-center pl-2 text-text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent"
    >
      →
    </span>
  );
}

/** The hover half of the glow, faded in over the resting one. */
function GlowOverlay({ background }: { background: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      style={{ background }}
    />
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
      <h2
        id="services-heading"
        className="mt-2 max-w-[24ch] text-h3 text-text"
      >
        What can I help you with?
      </h2>
      <p className="mt-3 max-w-[52ch] text-small text-text-muted">
        Pick whichever sounds closest. You do not need to know what the work is
        called.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <li key={option.href}>
            <Link
              href={option.href}
              className={cardBase}
              style={{ background: CARD_GLOW }}
            >
              <GlowBorder size={CARD_SIZE} peak={70} />
              {/* The hover half of the edge, same trick as the fill overlay:
                  a gradient border cannot be transitioned, so a brighter one
                  fades in over the resting one. This is what keeps §9.4s
                  "border shifts toward accent on hover" — the flat
                  hover:border-accent it replaced could not survive the move
                  to a gradient edge. */}
              <GlowBorder
                size={CARD_SIZE}
                peak={100}
                className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
              <GlowOverlay background={CARD_GLOW_HOVER} />

              <span aria-hidden="true" className={`${chipBase} ${option.chipClass}`}>
                {option.emoji}
              </span>
              <span className="relative min-w-0">
                <span className="block font-medium text-text">{option.label}</span>
                <span className="mt-1 block text-small text-text-muted">
                  {option.hint}
                </span>
              </span>
              <Arrow />
            </Link>
          </li>
        ))}

        <li>
          {/* Same card as the five above it, down to the glow — the accent
              border and the full-width row it used to get were dropped by owner
              call (see the note on `unsure`). Only the chip still marks it. */}
          <Link
            href={unsure.href}
            className={cardBase}
            style={{ background: CARD_GLOW }}
          >
            <GlowBorder size={CARD_SIZE} peak={70} />
              {/* The hover half of the edge, same trick as the fill overlay:
                  a gradient border cannot be transitioned, so a brighter one
                  fades in over the resting one. This is what keeps §9.4s
                  "border shifts toward accent on hover" — the flat
                  hover:border-accent it replaced could not survive the move
                  to a gradient edge. */}
              <GlowBorder
                size={CARD_SIZE}
                peak={100}
                className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
              <GlowOverlay background={CARD_GLOW_HOVER} />

            <span aria-hidden="true" className={`${chipBase} bg-accent-dim`}>
              {unsure.emoji}
            </span>
            <span className="relative min-w-0">
              <span className="block font-medium text-text">{unsure.label}</span>
              <span className="mt-1 block text-small text-text-muted">
                {unsure.hint}
              </span>
            </span>
            <Arrow />
          </Link>
        </li>
      </ul>
    </section>
  );
}
