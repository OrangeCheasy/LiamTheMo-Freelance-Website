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

const fieldClasses =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-body text-text outline-none transition-colors focus:border-accent disabled:opacity-60";
const invalidFieldClasses = "border-danger focus:border-danger";
const labelClasses = "block text-small font-medium text-text";

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
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-10">
        <h2 className="text-h3 text-text">Request sent</h2>
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
    <form onSubmit={handleSubmit} noValidate className="max-w-[42rem]">
      {serverError ? (
        <div
          ref={summaryRef}
          role="alert"
          className="mb-6 rounded-lg border border-danger bg-danger-dim px-4 py-3 text-small text-text"
        >
          {serverError}
        </div>
      ) : errorCount > 0 ? (
        <div
          ref={summaryRef}
          role="alert"
          className="mb-6 rounded-lg border border-danger bg-danger-dim px-4 py-3 text-small text-text"
        >
          {errorCount === 1
            ? "One field needs a fix before this can send."
            : `${errorCount} fields need a fix before this can send.`}
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
            className={`${fieldClasses} ${fieldErrors.serviceCategory ? invalidFieldClasses : ""}`}
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
              className={`${fieldClasses} ${fieldErrors.serviceType ? invalidFieldClasses : ""}`}
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
              className={`${fieldClasses} ${fieldErrors.otherTitle ? invalidFieldClasses : ""}`}
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
                className={`${fieldClasses} ${fieldErrors.contactMethod ? invalidFieldClasses : ""}`}
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
                  className={`${fieldClasses} ${fieldErrors.phone ? invalidFieldClasses : ""}`}
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
                  className={`${fieldClasses} ${fieldErrors.name ? invalidFieldClasses : ""}`}
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
                  className={`${fieldClasses} ${fieldErrors.email ? invalidFieldClasses : ""}`}
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
                className={`${fieldClasses} ${fieldErrors.description ? invalidFieldClasses : ""}`}
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
                    className={`${fieldClasses} ${fieldErrors.budget ? invalidFieldClasses : ""}`}
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
                    className={`${fieldClasses} ${fieldErrors.timeline ? invalidFieldClasses : ""}`}
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
        <p id={`${id}-error`} className="mt-1.5 text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
