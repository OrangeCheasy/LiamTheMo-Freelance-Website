import Link from "next/link";

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
  The cards are neutral surfaces with a hairline border; orange stays the only
  action colour (§9.2). The service hues appear ONLY as the fill behind each
  emoji chip, which is identity marking on a non-interactive sub-element —
  never the affordance itself, never a border, never text. Emoji are
  aria-hidden: the written label carries the meaning, so the glyph is
  decoration and its contrast against the pastel chip is not an accessibility
  bar.

  LABELS.
  Every label is a SYMPTOM in the visitor's words, never a service name
  ("Python Scripting" is exactly what these must not say) — the same
  discipline as `problems` in src/data/services.ts. Hints are drawn from the
  service table in §1, not invented.
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
    label: "I have a repetitive task",
    hint: "Reports, File processing, Data entry",
    href: "/services/automation",
    emoji: "🔄",
    chipClass: "bg-service-automation",
  },
  {
    label: "I need help with data or Excel",
    hint: "Spreadsheets, Dashboards, Trackers",
    href: "/services/excel-data",
    emoji: "📊",
    chipClass: "bg-service-excel",
  },
  {
    label: "My computer or technology isn't working",
    hint: "Setups, Repairs, Printers, Wi-Fi, Backups, Hardware, Software",
    href: "/services/local-tech-help",
    emoji: "🖥️",
    chipClass: "bg-service-local",
  },
  {
    label: "I need a website",
    hint: "Small-business sites, Landing pages, Menus",
    href: "/services/websites",
    emoji: "🌐",
    chipClass: "bg-service-websites",
  },
  {
    label: "I need Roblox development",
    hint: "Luau scripting, Gameplay and UI systems",
    href: "/services/roblox",
    emoji: "🎮",
    chipClass: "bg-service-roblox",
  },
];

/*
  Not in the array above, and that is the point. §7 calls this a first-class
  option rather than a fallback, so it gets its own row at full width and the
  accent tint, which reads as more prominent than the five neutral cards — not
  as the leftover at the end of a list. It is also the only option that reaches
  the quote form directly, hence the topic in the href; the five service
  options pass their topic through one hop later, from each service page's own
  CTA.
*/
const unsure = {
  label: "I'm not sure what I need",
  hint: "Describe the problem in your own words and I'll tell you what would fix it.",
  href: "/contact?topic=unsure",
  emoji: "❓",
} as const;

// §9.4: hover is a border shift, a subtle lift, and a glow — not just a
// colour change. accent-dim (not a hard black shadow, which disappears on a
// dark background) is what §9.4 names for exactly this.
const cardBase =
  "group flex h-full items-center gap-4 rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5";

const chipBase =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg";

// aria-hidden: it is a visual affordance cue, and a link already announces
// itself as a link. globals.css already neutralises the motion under
// prefers-reduced-motion.
function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="ml-auto self-center pl-2 text-text-muted transition-transform group-hover:translate-x-0.5"
    >
      →
    </span>
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
      <h2 id="services-heading" className="mt-2 max-w-[20ch] text-h2 text-text">
        What can I help you with?
      </h2>
      <p className="mt-4 max-w-[52ch] text-body text-text-muted">
        Pick whichever sounds closest. You do not need to know what the work is
        called.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <li key={option.href}>
            <Link
              href={option.href}
              className={`${cardBase} border-border bg-surface-2 hover:border-accent hover:shadow-[0_0_28px_var(--color-accent-dim)]`}
            >
              <span aria-hidden="true" className={`${chipBase} ${option.chipClass}`}>
                {option.emoji}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-text">{option.label}</span>
                <span className="mt-1 block text-small text-text-muted">
                  {option.hint}
                </span>
              </span>
              <Arrow />
            </Link>
          </li>
        ))}

        <li className="sm:col-span-2 lg:col-span-3">
          {/*
            Accent survives here — unlike the neutral cards above, this entire
            block is the clickable target, so the tint marks it as the
            highlighted option rather than decorating something inert (§9.2).
          */}
          <Link
            href={unsure.href}
            className={`${cardBase} border-accent bg-accent-dim hover:bg-surface-2 hover:shadow-[0_0_32px_var(--color-accent-dim)]`}
          >
            <span aria-hidden="true" className={`${chipBase} bg-accent-dim`}>
              {unsure.emoji}
            </span>
            <span className="min-w-0">
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
