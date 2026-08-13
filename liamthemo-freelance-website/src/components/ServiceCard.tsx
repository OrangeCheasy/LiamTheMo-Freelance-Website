import Link from "next/link";
import type { Service } from "@/lib/types";

/*
  One service, as a card on /services. Server component — it is a link and some
  text.

  THE HUE LOOKUP AND WHY IT HAS A FALLBACK.
  The service identity hues in globals.css are per-slug, but `Service` has no
  colour field and §6 says not to change that shape, so the mapping lives here.
  That creates a risk against this phase's whole premise — "adding a sixth
  service means adding one object to services.ts and nothing else" — because a
  new slug would have no entry.

  The fallback is what preserves the premise. An unmapped slug renders with the
  neutral chip and the page is completely fine; adding a hue later is an
  optional polish step, not a requirement to ship. Tailwind scans source text,
  so these have to stay whole literal strings rather than being built from the
  slug.
*/
const chipBySlug: Record<string, string> = {
  automation: "bg-service-automation",
  "excel-data": "bg-service-excel",
  websites: "bg-service-websites",
  "local-tech-help": "bg-service-local",
  roblox: "bg-service-roblox",
};

const NEUTRAL_CHIP = "bg-surface-muted";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const chip = chipBySlug[service.slug] ?? NEUTRAL_CHIP;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent"
    >
      <span
        aria-hidden="true"
        className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl ${chip}`}
      >
        {service.icon}
      </span>

      <h3 className="mt-4 text-h3 text-ink">{service.title}</h3>
      <p className="mt-2 text-body text-ink-muted">{service.tagline}</p>

      {/*
        Two symptoms as a preview. `problems` is the field that makes a visitor
        recognise themselves (§6), so the card leads with it rather than with a
        list of capabilities. Trimmed to two so cards stay scannable; the detail
        page carries the full list.
      */}
      <ul className="mt-4 flex flex-col gap-1.5">
        {service.problems.slice(0, 2).map((problem) => (
          <li key={problem} className="flex gap-2 text-small text-ink-muted">
            <span aria-hidden="true" className="text-accent">
              &ldquo;
            </span>
            <span>{problem}</span>
          </li>
        ))}
      </ul>

      {/* mt-auto pins this to the bottom so it lines up across cards of
          differing text length. */}
      <span
        aria-hidden="true"
        className="mt-auto pt-5 text-small font-medium text-accent"
      >
        See what this covers{" "}
        <span className="inline-block transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
