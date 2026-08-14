import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import {
  budgetLabel,
  contactMethodLabel,
  serviceLabel,
  timelineLabel,
  validateQuotePayload,
  type QuoteFormPayload,
} from "@/lib/quote";

/*
  The quote form's delivery handler (CLAUDE.md §8, build order step 6). This is
  the site's only routine dynamic path — every other route is prerendered and
  served from the assets binding for free (§4.1). No `runtime = "edge"`: the
  OpenNext adapter targets the Node.js runtime, per §3.

  Two outbound calls, both to services chosen specifically because they are
  reachable with a single fetch() — no SMTP, no long-lived connection, which
  rules out most traditional email APIs on a Worker:

    1. Discord webhook — notifies the owner. This is the call that matters: if
       it fails, the lead is lost, so it is awaited and a failure surfaces to
       the visitor as an error.
    2. Resend — sends the visitor an auto-reply from contact@liamthemo.com.
       Best-effort: a visitor should never see an error because a courtesy
       email didn't send when their actual message got through fine. Handed to
       `ctx.waitUntil` rather than awaited, so it finishes after the response
       goes out instead of adding its latency to the visitor's wait. Workers
       CPU-time billing (§4.1) does not count time spent waiting on fetch, so
       this and the Discord call together stay well under the 10ms budget —
       the constraint that matters here is wall-clock latency for the visitor,
       not CPU quota, hence waitUntil rather than a second await.

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

  const serviceValue =
    data.service === "other" && data.otherTitle
      ? `Other — ${data.otherTitle}`
      : serviceLabel(data.service);

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
            { name: "Service", value: serviceValue, inline: true },
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

async function sendAutoReply(
  apiKey: string,
  data: QuoteFormPayload,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: "Liam <contact@liamthemo.com>",
      to: [data.email],
      subject: "Got your message",
      text: `Hi ${data.name},\n\nThanks for reaching out — this confirms I received your message about ${serviceLabel(data.service).toLowerCase()}. I'll reply within one business day with what it would take.\n\nIf anything above needs correcting in the meantime, just reply to this email.\n\nLiam`,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}`);
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

  const { env, ctx } = await getCloudflareContext({ async: true });

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

  ctx.waitUntil(
    sendAutoReply(env.RESEND_API_KEY, data).catch((err) => {
      console.error("Quote form: auto-reply failed", err);
    }),
  );

  return NextResponse.json({ ok: true });
}
