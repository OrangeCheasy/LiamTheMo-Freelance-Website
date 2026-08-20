"use client";

import { useId, useRef, useState } from "react";
import {
  BUDGET_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  SERVICE_CATEGORY_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
  validateQuotePayload,
  type QuoteFormPayload,
  type QuoteValidationError,
  type ServiceCategory,
  type ServiceType,
} from "@/lib/quote";

/*
  The site's main conversion mechanic (CLAUDE.md §8, build order step 6).

  CLIENT COMPONENT, per §3's own list of exceptions — a form is exactly the
  interactivity that justifies it: field state, a fetch to /api/quote, and
  success/error UI that native HTML alone cannot provide.

  PROGRESSIVE DISCLOSURE, at the owner's request. Nothing past "What's this
  about?" renders until that question is answered — not a visual nicety, an
  actual mount/unmount, so a visitor skimming never sees seven fields at once
  and a screen reader never announces controls that don't apply yet. The two
  fields that follow depend on which of the two answers was picked:
  "Services" reveals a service-type dropdown and (only then) the budget field;
  "Other" reveals a required title input and no budget at all, since a budget
  range framed around the five service lines doesn't mean anything for a
  request that isn't one of them.

  `noValidate` is on the <form> deliberately. Native browser validation bubbles
  are inconsistent across browsers and cannot be styled to match the rest of
  the site, so validateQuotePayload (shared with the server, @/lib/quote) drives
  every error message here instead. The `required`, `type="email"` and
  `maxLength` attributes stay on the inputs anyway — assistive tech still reads
  them, and they are a correct description of the field even though the
  browser's own popup UI never fires. Each invalid field carries `aria-invalid`
  and `aria-describedby` pointing at its own error text, so the error reaches a
  screen reader the same way it reaches a sighted visitor.

  "Send request" / "Request sent" — same verb throughout, per §8.
*/

type FieldErrors = Partial<Record<keyof QuoteFormPayload, string>>;

interface QuoteFormProps {
  /** From /contact's `?topic=` (a service page's CTA — see the note atop
      contact/page.tsx on the now-unlinked triage-widget-era `unsure` value)
      — the visitor already told us this once and must not be asked again (§7).
      A non-empty value implies "Services" and pre-answers the gate, so the
      rest of the form is visible immediately rather than behind one more
      click the visitor shouldn't need to make. */
  initialService?: ServiceType | "";
}

/*
  Focus rings (CLAUDE.md §10, and the explicit ask for this pass): the global
  :focus-visible outline in globals.css never reaches these fields, because
  `outline-none` below cancels it — every field was tabbing to nothing more
  than a 1px border tint change, verified by actually tabbing through the
  live form rather than assumed from the classes.

  Replaced with a three-layer box-shadow ring rather than restoring the
  outline: (1) a surface-coloured gap the width of the border, so the ring
  doesn't fuse with it, (2) a solid 2px accent ring — opaque colour, not the
  translucent --accent-dim used for hover glows, because a glow alone here
  measured too faint against --bg to read as "the thing you asked for": an
  unmistakable ring — and (3) a soft outer glow in --accent-dim on top,
  purely for the site's signature warmth. Layer 2 alone clears WCAG 1.4.11's
  3:1 non-text contrast; 1 and 3 are polish on top of an already-compliant
  ring, not load-bearing.

  A function rather than a class string + conditional modifier string: the
  two variants both carry `focus:` utilities, and concatenating
  "border-accent focus:..." with "border-danger focus:..." left which one
  wins down to Tailwind's generated stylesheet order rather than anything
  visible here. Returning one complete, unambiguous class list per state
  removes that.
*/
function fieldClass(hasError: boolean) {
  // bg-surface-2, not bg-surface: the form now renders inside the contact
  // page's surface card (§9.1: surface-2 is specifically "nested surfaces"),
  // so a field needs to read as a step up from its container rather than
  // disappearing into an identical background with only a border left to
  // show for it.
  const base =
    "mt-1.5 w-full rounded-lg border bg-surface-2 px-3 py-2 text-body text-text outline-none transition-[border-color,box-shadow] disabled:opacity-60";
  return hasError
    ? `${base} border-danger focus:shadow-[0_0_0_3px_var(--color-surface),0_0_0_5px_var(--color-danger),0_0_20px_var(--color-danger-dim)]`
    : `${base} border-border focus:border-accent focus:shadow-[0_0_0_3px_var(--color-surface),0_0_0_5px_var(--color-accent),0_0_20px_var(--color-accent-dim)]`;
}
const labelClasses = "block text-small font-medium text-text";

function WarningIcon({ className = "h-4 w-4 mt-0.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-danger ${className}`}
    >
      <path d="M12 9v4M12 16.5h.01" />
      <path d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-accent"
    >
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export default function QuoteForm({ initialService = "" }: QuoteFormProps) {
  const formId = useId();
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory | "">(
    initialService ? "services" : "",
  );
  const [serviceType, setServiceType] = useState<ServiceType | "">(
    initialService,
  );
  const [contactMethod, setContactMethod] = useState("email");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const summaryRef = useRef<HTMLDivElement>(null);

  if (status === "success") {
    // No border/background of its own: this renders inside the contact
    // page's card (contact/page.tsx), so a second nested card here would
    // frame the frame. Just the centred content.
    return (
      <div className="py-4 text-center sm:py-6">
        {/* Plain accent icon beside the heading, not circled — the About
            section's virtue icons settled this exact question already (see
            the note there): a ring around it read as busy for no gain. */}
        <div className="flex items-center justify-center gap-2.5">
          <CheckIcon />
          <h2 className="text-h3 text-text">Request sent</h2>
        </div>
        <p className="mx-auto mt-3 max-w-[48ch] text-body text-text-muted">
          I&apos;ll reply within one business day with what it would take. You
          should also see a confirmation land in your inbox shortly.
        </p>
      </div>
    );
  }

  function describedBy(id: string, field: keyof QuoteFormPayload) {
    return fieldErrors[field] ? `${id}-error` : undefined;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const form = new FormData(event.currentTarget);
    const payload: Partial<Record<keyof QuoteFormPayload, unknown>> = {
      name: form.get("name"),
      email: form.get("email"),
      serviceCategory: form.get("serviceCategory"),
      serviceType: form.get("serviceType"),
      otherTitle: form.get("otherTitle"),
      description: form.get("description"),
      budget: form.get("budget"),
      timeline: form.get("timeline"),
      contactMethod: form.get("contactMethod"),
      phone: form.get("phone"),
      company: form.get("company"),
    };

    const result = validateQuotePayload(payload);
    if (!result.ok) {
      applyErrors(result.errors);
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(result.value),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        errors?: QuoteValidationError[];
      } | null;

      if (data?.errors?.length) {
        applyErrors(data.errors);
      } else {
        setStatus("idle");
        setServerError(
          data?.error ??
            "Something went wrong sending your message. Try again, or email contact@liamthemo.com directly.",
        );
        focusSummary();
      }
    } catch {
      setStatus("idle");
      setServerError(
        "Couldn't reach the server — check your connection and try again, or email contact@liamthemo.com directly.",
      );
      focusSummary();
    }
  }

  function applyErrors(errors: QuoteValidationError[]) {
    const next: FieldErrors = {};
    for (const err of errors) next[err.field] = err.message;
    setFieldErrors(next);
    setStatus("idle");
    focusSummary();
  }

  function focusSummary() {
    requestAnimationFrame(() => {
      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const submitting = status === "submitting";
  const showPhone = contactMethod === "phone" || contactMethod === "text";
  const errorCount = Object.keys(fieldErrors).length;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError ? (
        <div
          ref={summaryRef}
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-lg border border-danger bg-danger-dim px-4 py-3 text-small text-text"
        >
          <WarningIcon />
          <span>{serverError}</span>
        </div>
      ) : errorCount > 0 ? (
        <div
          ref={summaryRef}
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-lg border border-danger bg-danger-dim px-4 py-3 text-small text-text"
        >
          <WarningIcon />
          <span>
            {errorCount === 1
              ? "One field needs a fix before this can send."
              : `${errorCount} fields need a fix before this can send.`}
          </span>
        </div>
      ) : null}

      {/* Honeypot. Visually and semantically hidden from real visitors — a
          human never sees this field, so a filled-in value means a bot.
          Rendered unconditionally, independent of the progressive reveal
          below, so it is in the submitted data no matter how far a bot gets. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor={`${formId}-company`}>Leave this field blank</label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5">
        <Field
          id={`${formId}-serviceCategory`}
          label="What's this about?"
          error={fieldErrors.serviceCategory}
        >
          <select
            id={`${formId}-serviceCategory`}
            name="serviceCategory"
            required
            value={serviceCategory}
            onChange={(e) =>
              setServiceCategory(e.target.value as ServiceCategory)
            }
            className={fieldClass(Boolean(fieldErrors.serviceCategory))}
            aria-invalid={Boolean(fieldErrors.serviceCategory)}
            aria-describedby={describedBy(
              `${formId}-serviceCategory`,
              "serviceCategory",
            )}
          >
            <option value="" disabled>
              Select one
            </option>
            {SERVICE_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        {serviceCategory === "services" ? (
          <Field
            id={`${formId}-serviceType`}
            label="Which service?"
            error={fieldErrors.serviceType}
          >
            <select
              id={`${formId}-serviceType`}
              name="serviceType"
              required
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as ServiceType)}
              className={fieldClass(Boolean(fieldErrors.serviceType))}
              aria-invalid={Boolean(fieldErrors.serviceType)}
              aria-describedby={describedBy(
                `${formId}-serviceType`,
                "serviceType",
              )}
            >
              <option value="" disabled>
                Select what fits best
              </option>
              {SERVICE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        {serviceCategory === "other" ? (
          <Field
            id={`${formId}-otherTitle`}
            label="Give it a title"
            error={fieldErrors.otherTitle}
          >
            <input
              id={`${formId}-otherTitle`}
              name="otherTitle"
              type="text"
              required
              maxLength={100}
              placeholder="A short title for what you need"
              className={fieldClass(Boolean(fieldErrors.otherTitle))}
              aria-invalid={Boolean(fieldErrors.otherTitle)}
              aria-describedby={describedBy(`${formId}-otherTitle`, "otherTitle")}
            />
          </Field>
        ) : null}

        {serviceCategory ? (
          <>
            <Field
              id={`${formId}-contactMethod`}
              label="Preferred contact method"
              error={fieldErrors.contactMethod}
            >
              <select
                id={`${formId}-contactMethod`}
                name="contactMethod"
                required
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                className={fieldClass(Boolean(fieldErrors.contactMethod))}
                aria-invalid={Boolean(fieldErrors.contactMethod)}
                aria-describedby={describedBy(
                  `${formId}-contactMethod`,
                  "contactMethod",
                )}
              >
                {CONTACT_METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            {showPhone ? (
              <Field
                id={`${formId}-phone`}
                label="Phone number"
                error={fieldErrors.phone}
              >
                <input
                  id={`${formId}-phone`}
                  name="phone"
                  type="tel"
                  required
                  maxLength={30}
                  autoComplete="tel"
                  className={fieldClass(Boolean(fieldErrors.phone))}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={describedBy(`${formId}-phone`, "phone")}
                />
              </Field>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${formId}-name`} label="Name" error={fieldErrors.name}>
                <input
                  id={`${formId}-name`}
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="name"
                  className={fieldClass(Boolean(fieldErrors.name))}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={describedBy(`${formId}-name`, "name")}
                />
              </Field>

              <Field id={`${formId}-email`} label="Email" error={fieldErrors.email}>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  className={fieldClass(Boolean(fieldErrors.email))}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={describedBy(`${formId}-email`, "email")}
                />
              </Field>
            </div>

            <Field
              id={`${formId}-description`}
              label="Describe your needs"
              error={fieldErrors.description}
            >
              <textarea
                id={`${formId}-description`}
                name="description"
                required
                rows={5}
                maxLength={2000}
                className={fieldClass(Boolean(fieldErrors.description))}
                aria-invalid={Boolean(fieldErrors.description)}
                aria-describedby={describedBy(
                  `${formId}-description`,
                  "description",
                )}
              />
            </Field>

            {serviceCategory === "services" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id={`${formId}-budget`}
                  label="Budget range"
                  hint="Optional"
                  error={fieldErrors.budget}
                >
                  <select
                    id={`${formId}-budget`}
                    name="budget"
                    defaultValue=""
                    className={fieldClass(Boolean(fieldErrors.budget))}
                    aria-invalid={Boolean(fieldErrors.budget)}
                    aria-describedby={describedBy(`${formId}-budget`, "budget")}
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  id={`${formId}-timeline`}
                  label="Timeline"
                  error={fieldErrors.timeline}
                >
                  <select
                    id={`${formId}-timeline`}
                    name="timeline"
                    required
                    defaultValue=""
                    className={fieldClass(Boolean(fieldErrors.timeline))}
                    aria-invalid={Boolean(fieldErrors.timeline)}
                    aria-describedby={describedBy(
                      `${formId}-timeline`,
                      "timeline",
                    )}
                  >
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={!opt.value}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-accent bg-accent px-6 py-2.5 font-semibold text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Sending…" : "Send request"}
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
        {hint ? (
          <span className="ml-1.5 font-normal text-text-muted">({hint})</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-start gap-1.5 text-small text-danger"
        >
          <WarningIcon />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
