import { SERVICE_META, type ServiceSlug } from "@/lib/types";

/**
 * Shared with both QuoteForm.tsx (client-side UX validation) and
 * /api/quote/route.ts (server-side, the copy that actually matters — CLAUDE.md
 * §8: "Validate client-side and on the server. Never trust the client."). One
 * definition of what a valid submission looks like, imported on both sides,
 * so the two validators cannot drift apart.
 */

export type ServiceFieldValue = ServiceSlug | "unsure" | "other";

export const SERVICE_FIELD_OPTIONS: { value: ServiceFieldValue; label: string }[] = [
  ...(Object.keys(SERVICE_META) as ServiceSlug[]).map((slug) => ({
    value: slug,
    label: SERVICE_META[slug].title,
  })),
  { value: "unsure", label: "Not sure yet" },
  { value: "other", label: "Other" },
];

const serviceValues = SERVICE_FIELD_OPTIONS.map((o) => o.value);

// Budget is a select of ranges, never free text (§8) — this is what the visitor
// is willing to spend, not a published price list, so it does not fall under
// §10's "only publish confirmed prices" rule.
export const BUDGET_OPTIONS = [
  { value: "", label: "None" },
  { value: "0-10", label: "$0 – $10" },
  { value: "10-25", label: "$10 – $25" },
  { value: "25-100", label: "$25 – $100" },
  { value: "100-250", label: "$100 – $250" },
  { value: "250-plus", label: "$250+" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "", label: "Select a timeline" },
  { value: "asap", label: "As soon as possible" },
  { value: "few-weeks", label: "Within a few weeks" },
  { value: "month-or-two", label: "Within a month or two" },
  { value: "flexible", label: "No rush, I'm flexible" },
] as const;

export const CONTACT_METHOD_OPTIONS = [
  { value: "", label: "Select a method" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "text", label: "Text message" },
] as const;

const budgetValues = BUDGET_OPTIONS.map((o) => o.value);
const timelineValues: string[] = TIMELINE_OPTIONS.map((o) => o.value).filter(
  Boolean,
);
const contactMethodValues: string[] = CONTACT_METHOD_OPTIONS.map(
  (o) => o.value,
).filter(Boolean);

export interface QuoteFormPayload {
  name: string;
  email: string;
  service: ServiceFieldValue | "";
  /**
   * Required only when service is "other" — there is no service-list label to
   * fall back on, so the visitor has to name it themselves.
   */
  otherTitle: string;
  description: string;
  budget: (typeof BUDGET_OPTIONS)[number]["value"];
  timeline: string;
  contactMethod: string;
  /**
   * Shown only when contactMethod is "phone" or "text" — asking for a
   * preferred method without a number to use it on would be pointless. Kept
   * optional even then, at the owner's request: a visitor who wants a call
   * back but would rather type it into the description than a dedicated
   * field is not blocked from sending.
   */
  phone: string;
  /** Honeypot (§8). Real visitors never see or fill this field. */
  company: string;
}

export interface QuoteValidationError {
  field: keyof QuoteFormPayload;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Runs on both sides. On the client it drives inline error messages before a
 * request is even sent; on the server it is the actual gate (§8's "never trust
 * the client") — the client copy exists only for UX, not enforcement.
 */
export function validateQuotePayload(
  input: Partial<Record<keyof QuoteFormPayload, unknown>>,
): { ok: true; value: QuoteFormPayload } | { ok: false; errors: QuoteValidationError[] } {
  const errors: QuoteValidationError[] = [];

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(input.name);
  const email = str(input.email);
  const service = str(input.service);
  const otherTitle = str(input.otherTitle);
  const description = str(input.description);
  const budget = str(input.budget);
  const timeline = str(input.timeline);
  const contactMethod = str(input.contactMethod);
  const phone = str(input.phone);
  const company = str(input.company);

  if (!name) errors.push({ field: "name", message: "Enter your name." });
  else if (name.length > 100)
    errors.push({ field: "name", message: "Name is too long." });

  if (!email) errors.push({ field: "email", message: "Enter your email." });
  else if (!EMAIL_RE.test(email) || email.length > 254)
    errors.push({ field: "email", message: "Enter a valid email address." });

  if (!service || !serviceValues.includes(service as ServiceFieldValue)) {
    errors.push({ field: "service", message: "Choose what this is about." });
  } else if (service === "other") {
    if (!otherTitle) {
      errors.push({ field: "otherTitle", message: "Give it a short title." });
    } else if (otherTitle.length > 100) {
      errors.push({
        field: "otherTitle",
        message: "Keep the title under 100 characters.",
      });
    }
  }

  if (!description) {
    errors.push({ field: "description", message: "Describe the problem." });
  } else if (description.length < 10) {
    errors.push({
      field: "description",
      message: "Give a few more details so there is something to work with.",
    });
  } else if (description.length > 2000) {
    errors.push({
      field: "description",
      message: "Keep the description under 2000 characters.",
    });
  }

  if (budget && !budgetValues.includes(budget as (typeof budgetValues)[number])) {
    errors.push({ field: "budget", message: "Choose a valid budget range." });
  }

  if (!timeline || !timelineValues.includes(timeline)) {
    errors.push({ field: "timeline", message: "Choose a timeline." });
  }

  if (!contactMethod || !contactMethodValues.includes(contactMethod)) {
    errors.push({ field: "contactMethod", message: "Choose how to reach you." });
  } else if (phone && phone.length > 30) {
    errors.push({ field: "phone", message: "That number looks too long." });
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name,
      email,
      service: service as ServiceFieldValue,
      otherTitle,
      description,
      budget: budget as (typeof BUDGET_OPTIONS)[number]["value"],
      timeline,
      contactMethod,
      phone,
      company,
    },
  };
}

export function serviceLabel(service: QuoteFormPayload["service"]): string {
  return (
    SERVICE_FIELD_OPTIONS.find((o) => o.value === service)?.label ?? service
  );
}

export function budgetLabel(budget: QuoteFormPayload["budget"]): string {
  return BUDGET_OPTIONS.find((o) => o.value === budget)?.label ?? "None";
}

export function timelineLabel(timeline: string): string {
  return TIMELINE_OPTIONS.find((o) => o.value === timeline)?.label ?? timeline;
}

export function contactMethodLabel(method: string): string {
  return (
    CONTACT_METHOD_OPTIONS.find((o) => o.value === method)?.label ?? method
  );
}
