import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import {
  budgetLabel,
  contactMethodLabel,
  describeService,
  timelineLabel,
  validateQuotePayload,
  type QuoteFormPayload,
} from "@/lib/quote";

/*
  The quote form's delivery handler (CLAUDE.md §8, build order step 6). This is
  the site's only routine dynamic path — every other route is prerendered and
  served from the assets binding for free (§4.1). No `runtime = "edge"`: the
  OpenNext adapter targets the Node.js runtime, per §3.

  One outbound call: a Discord webhook that notifies the owner. This is the
  call that matters — if it fails, the lead is lost, so it is awaited and a
  failure surfaces to the visitor as an error.

  (A Resend-based visitor auto-reply used to sit alongside this, sent
  best-effort via `ctx.waitUntil`. Cut per owner decision — not worth the
  extra dependency and domain verification for a "got your message"
  courtesy email.)

  Rate limiting is NOT implemented here on purpose. §8 is explicit: use
  Cloudflare's own WAF rate-limiting rules on this path rather than an
  in-Worker counter, so abusive traffic is stopped at the edge before it ever
  reaches this code or counts against the daily request cap.
*/

const DISCORD_EMBED_FIELD_LIMIT = 1000;

function truncate(value: string, limit: number): string {
  return value.length > limit ? `${value.slice(0, limit)}…` : value;
}

async function sendDiscordNotification(
  webhookUrl: string,
  data: QuoteFormPayload,
): Promise<void> {
  const contactLine = data.phone
    ? `${contactMethodLabel(data.contactMethod)} — ${data.phone}`
    : contactMethodLabel(data.contactMethod);

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "New quote request",
          color: 0xad3f3c,
          fields: [
            { name: "Name", value: data.name, inline: true },
            { name: "Email", value: data.email, inline: true },
            { name: "Service", value: describeService(data), inline: true },
            { name: "Budget", value: budgetLabel(data.budget), inline: true },
            {
              name: "Timeline",
              value: timelineLabel(data.timeline),
              inline: true,
            },
            { name: "Preferred contact", value: contactLine, inline: true },
            {
              name: "Description",
              value: truncate(data.description, DISCORD_EMBED_FIELD_LIMIT),
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Discord webhook responded ${res.status}`);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "That request wasn't readable. Try submitting the form again." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "That request wasn't readable. Try submitting the form again." },
      { status: 400 },
    );
  }

  const result = validateQuotePayload(
    body as Partial<Record<keyof QuoteFormPayload, unknown>>,
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.errors[0].message, errors: result.errors },
      { status: 400 },
    );
  }

  const data = result.value;

  // Honeypot tripped: pretend success so whatever filled it learns nothing,
  // but do none of the real work.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const { env } = await getCloudflareContext({ async: true });

  try {
    await sendDiscordNotification(env.DISCORD_WEBHOOK_URL, data);
  } catch (err) {
    console.error("Quote form: Discord notification failed", err);
    return NextResponse.json(
      {
        error:
          "Something went wrong sending your message. Try again, or email contact@liamthemo.com directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
