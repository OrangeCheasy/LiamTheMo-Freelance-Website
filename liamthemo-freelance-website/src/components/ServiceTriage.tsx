import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";

/*
  The "What can I help you with?" widget (CLAUDE.md §7) — the site's main
  conversion mechanic, sitting directly under the hero.

  SERVER COMPONENT, DELIBERATELY.
  §3 lists the triage widget as a place `"use client"` is expected, but §7 is the
  tighter constraint and it rules the interactivity out: the options must be real
  <Link> elements, not onClick router pushes, so they stay keyboard-navigable,
  crawlable and middle-clickable. Six links need no state, so there is nothing
  left for a client bundle to do. Zero JS shipped for the most important element
  on the page is the right outcome, not a compromise.

  COLOUR.
  The cards are neutral surfaces with a hairline border; coral stays the only
  action colour (§9.2). The service hues appear ONLY as the fill behind each
  emoji chip, which is identity marking on a non-interactive sub-element — never
  the affordance itself, never a border, never text. Emoji are aria-hidden: the
  written label carries the meaning, so the glyph is decoration and its contrast
  against the pastel chip is not an accessibility bar.
*/

interface TriageOption {
  /** Symptom-worded, from the visitor's side of the screen. Never renamed to a
      service name — see §7. "Python Scripting" is exactly what this must not say. */
  label: string;
  /** Concrete examples, drawn from the service table in §1. Not invented. */
  hint: string;
  href: string;
  emoji: string;
  /**
   * The value that eventually prefills the quote form's service field (§7:
   * "pass the topic through ... so the visitor doesn't re-answer").
   *
   * Only the `unsure` option reaches /contact directly, so only it carries the
   * topic in its own href. For the five service options the passthrough happens
   * one hop later: at build order step 3 each service page's CTA links to
   * `/contact?topic=<slug>`, using this same value. Keeping it on the option
   * here means the two ends of that chain share one source of truth.
   */
  topic: string;
  /** Static class string so Tailwind's source scanner sees it verbatim. */
  chipClass: string;
}

// Order matches the table in §7 exactly.
const options: readonly TriageOption[] = [
  {
    label: "I have a repetitive task",
    hint: "Reports, File processing, Data entry",
    href: "/services/automation",
    emoji: "🔄",
    topic: "automation",
    chipClass: "bg-service-automation",
  },
  {
    label: "I need help with data or Excel",
    hint: "Spreadsheets, Dashboards, Trackers",
    href: "/services/excel-data",
    emoji: "📊",
    topic: "excel-data",
    chipClass: "bg-service-excel",
  },
  {
    label: "My computer or technology isn't working",
    hint: "Setups, Repairs, Printers, Wi-Fi, Network, Backups, Hardware, Software",
    href: "/services/local-tech-help",
    emoji: "🖥️",
    topic: "local-tech-help",
    chipClass: "bg-service-local",
  },
  {
    label: "I need a website",
    hint: "Small-business sites, Landing pages, Menus",
    href: "/services/websites",
    emoji: "🌐",
    topic: "websites",
    chipClass: "bg-service-websites",
  },
  {
    label: "I need Roblox development",
    hint: "Luau scripting, Gameplay and UI systems",
    href: "/services/roblox",
    emoji: "🎮",
    topic: "roblox",
    chipClass: "bg-service-roblox",
  },
];

/*
  Not in the array above, and that is the point. §7 calls this a first-class
  option rather than a fallback, so it gets its own row at full width and the
  accent tint, which reads as more prominent than the five neutral cards — not
  as the leftover at the end of a list. It is also the only option that reaches
  the form directly, hence the topic in the href.
*/
const unsure = {
  label: "I'm not sure what I need",
  hint: "Describe the problem in your own words and I'll tell you what would fix it.",
  href: "/contact?topic=unsure",
  emoji: "❓",
} as const;

const cardBase =
  "group flex h-full items-center gap-4 rounded-xl border p-5 transition-colors";

const chipBase =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg";

// aria-hidden: it is a visual affordance cue, and a link already announces
// itself as a link. The translate is the one motion on this page; globals.css
// already neutralises it under prefers-reduced-motion.
function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="ml-auto self-center pl-2 text-ink-muted transition-transform group-hover:translate-x-0.5"
    >
      →
    </span>
  );
}

export default function ServiceTriage() {
  return (
    <section
      aria-labelledby="triage-heading"
      className="border-t border-line bg-surface-muted"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <Eyebrow>Start here</Eyebrow>
        <h2 id="triage-heading" className="mt-3 max-w-[20ch] text-h2 text-ink">
          What can I help you with?
        </h2>
        <p className="mt-3 max-w-[52ch] text-body text-ink-muted">
          Pick whichever sounds closest. You do not need to know what the work is
          called.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((option) => (
            <li key={option.href}>
              <Link
                href={option.href}
                className={`${cardBase} border-line bg-surface hover:border-accent`}
              >
                <span aria-hidden="true" className={`${chipBase} ${option.chipClass}`}>
                  {option.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-ink">{option.label}</span>
                  <span className="mt-1 block text-small text-ink-muted">
                    {option.hint}
                  </span>
                </span>
                <Arrow />
              </Link>
            </li>
          ))}

          <li className="sm:col-span-2 lg:col-span-3">
            <Link
              href={unsure.href}
              className={`${cardBase} border-accent bg-accent-tint hover:bg-surface`}
            >
              <span aria-hidden="true" className={`${chipBase} bg-accent-fill`}>
                {unsure.emoji}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-ink">{unsure.label}</span>
                <span className="mt-1 block text-small text-ink-muted">
                  {unsure.hint}
                </span>
              </span>
              <Arrow />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
