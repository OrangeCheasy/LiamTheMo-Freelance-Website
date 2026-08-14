import { SERVICE_META, type ServiceSlug } from "@/lib/types";

/**
 * Shared with both QuoteForm.tsx (client-side UX validation) and
 * /api/quote/route.ts (server-side, the copy that actually matters — CLAUDE.md
 * §8: "Validate client-side and on the server. Never trust the client."). One
 * definition of what a valid submission looks like, imported on both sides,
 * so the two validators cannot drift apart.
 *
 * "What's this about?" is a two-tier question, at the owner's request:
 *   1. serviceCategory — "Services" or "Other". Nothing else on the form is
 *      shown until this is answered.
 *   2. Only if "Services": serviceType — which of the five lines (or "not
 *      sure yet"). Only if "Other": otherTitle, a free-text title, since
 *      "Other" alone gives nothing to read in a Discord notification.
 * Budget only makes sense against a real service line, so it is gated on
 * serviceCategory === "services" too — see QuoteForm.tsx's render logic.
 */

export type ServiceCategory = "services" | "other";
export type ServiceType = ServiceSlug | "unsure";

export const SERVICE_CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: "services", label: "Services" },
  { value: "other", label: "Other" },
];

export const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  ...(Object.keys(SERVICE_META) as ServiceSlug[]).map((slug) => ({
    value: slug,
    label: SERVICE_META[slug].title,
  })),
  { value: "unsure", label: "Not sure yet" },
];

const serviceCategoryValues = SERVICE_CATEGORY_OPTIONS.map((o) => o.value);
const serviceTypeValues = SERVICE_TYPE_OPTIONS.map((o) => o.value);

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

// No blank placeholder here on purpose — contactMethod defaults to "email" in
// the form (owner's request: skip the "select a method" step) rather than
// forcing an explicit choice the way serviceCategory does.
export const CONTACT_METHOD_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "text", label: "Text message" },
] as const;

const budgetValues = BUDGET_OPTIONS.map((o) => o.value);
const timelineValues: string[] = TIMELINE_OPTIONS.map((o) => o.value).filter(
  Boolean,
);
const contactMethodValues = CONTACT_METHOD_OPTIONS.map((o) => o.value);

export interface QuoteFormPayload {
  name: string;
  email: string;
  serviceCategory: ServiceCategory | "";
  /** Required, and only meaningful, when serviceCategory is "services". */
  serviceType: ServiceType | "";
  /** Required, and only meaningful, when serviceCategory is "other". */
  otherTitle: string;
  description: string;
  /** Only meaningful when serviceCategory is "services" — see the module doc. */
  budget: (typeof BUDGET_OPTIONS)[number]["value"];
  timeline: string;
  contactMethod: string;
  /**
   * Shown, and required, only when contactMethod is "phone" or "text" —
   * picking one of those without a number to use it on would be pointless.
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
  const serviceCategory = str(input.serviceCategory);
  const serviceType = str(input.serviceType);
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

  if (
    !serviceCategory ||
    !serviceCategoryValues.includes(serviceCategory as ServiceCategory)
  ) {
    errors.push({
      field: "serviceCategory",
      message: "Choose what this is about.",
    });
  } else if (serviceCategory === "services") {
    if (!serviceType || !serviceTypeValues.includes(serviceType as ServiceType)) {
      errors.push({ field: "serviceType", message: "Choose a service." });
    }
  } else if (serviceCategory === "other") {
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

  if (
    serviceCategory === "services" &&
    budget &&
    !budgetValues.includes(budget as (typeof budgetValues)[number])
  ) {
    errors.push({ field: "budget", message: "Choose a valid budget range." });
  }

  // Timeline only applies to a real service line — "Other" doesn't ask for it.
  if (serviceCategory === "services") {
    if (!timeline || !timelineValues.includes(timeline)) {
      errors.push({ field: "timeline", message: "Choose a timeline." });
    }
  } else if (timeline && !timelineValues.includes(timeline)) {
    errors.push({ field: "timeline", message: "Choose a valid timeline." });
  }

  if (
    !contactMethod ||
    !contactMethodValues.includes(contactMethod as (typeof contactMethodValues)[number])
  ) {
    errors.push({ field: "contactMethod", message: "Choose how to reach you." });
  } else if ((contactMethod === "phone" || contactMethod === "text") && !phone) {
    errors.push({
      field: "phone",
      message: "Enter a number so I can reach you.",
    });
  } else if (phone && phone.length > 30) {
    errors.push({ field: "phone", message: "That number looks too long." });
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name,
      email,
      serviceCategory: serviceCategory as ServiceCategory,
      serviceType: serviceType as ServiceType | "",
      otherTitle,
      description,
      budget:
        serviceCategory === "services"
          ? (budget as (typeof BUDGET_OPTIONS)[number]["value"])
          : "",
      timeline,
      contactMethod,
      phone,
      company,
    },
  };
}

/** Human-readable "what this is about", for Discord and nowhere else. */
export function describeService(payload: QuoteFormPayload): string {
  if (payload.serviceCategory === "other") {
    return payload.otherTitle ? `Other — ${payload.otherTitle}` : "Other";
  }
  return (
    SERVICE_TYPE_OPTIONS.find((o) => o.value === payload.serviceType)?.label ??
    "Not given"
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
