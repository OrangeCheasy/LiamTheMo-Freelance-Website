# TODO

Outstanding actions, build order progress, and open decisions.

How-to lives in [`DEPLOYMENT.md`](./DEPLOYMENT.md) — this file tracks *what* is left, not *how*.

---

## Do now — make the quote form actually deliver

The form at `/contact` is built, validated, and tested end-to-end against the real Worker
runtime (`npm run preview`) — but it cannot deliver a single real lead yet. Nothing sends until
these are done, in roughly this order:

- [x] ~~Create a Discord webhook~~ — done. Server Settings → Integrations → Webhooks → New Webhook.
- [x] ~~Set the secret~~ against the Cloudflare account (never in `wrangler.jsonc`, never
      committed):
      ```
      wrangler secret put DISCORD_WEBHOOK_URL
      ```
      The Resend-based visitor auto-reply that used to sit alongside this was cut per owner
      decision (not worth the extra dependency and sending-domain verification for a courtesy
      email) — `RESEND_API_KEY` no longer exists anywhere in the code, so there is only the one
      secret now.
- [ ] **Add the WAF rate-limiting rule** — Cloudflare dashboard → Security → WAF → Rate limiting
      rules:
      - Expression: `(http.request.uri.path eq "/api/quote" and http.request.method eq "POST")`
      - Rate: 5 requests / 1 minute, per IP
      - Action: Block, mitigation timeout your call (10–60 min)

      This is zone-level config, not something `wrangler.jsonc` can express — it has to be added
      in the dashboard (or via the Rulesets API) directly.
- [ ] **Run one real end-to-end test** once the above is in place: `npm run preview`, submit the
      form for real, confirm the Discord message actually arrives. Everything tested so far used a
      local mock listener standing in for Discord — that proved the request shape and the runtime
      plumbing are correct, not that a real message has ever actually landed anywhere.
- [ ] Once the above is confirmed working, `/` can come out of `noindex` (see "Known cleanup"
      below) — ideally alongside step 8's custom domain attach, so search engines index
      `liamthemo.com` rather than the `workers.dev` URL.

---

## Build order

From CLAUDE.md §14. The owner built 5 and 6 in the reverse of CLAUDE.md's listed order (About
before the quote form) — noted here so the order below matches what actually happened, not the
canonical list.

- [x] **0. Deploy pipeline** — placeholder page live on `workers.dev` via GitHub Actions
- [x] **1. Layout shell** — Navbar, Footer, typography scale, Tailwind theme tokens
- [x] **2. Home** — hero, triage widget, closing CTA
  - [ ] **Social proof strip — one blocker cleared, not built yet.** Not built rather than faked
        (§10). Needed any ONE of: a real Restaurant Sales Parser metric, permission to name Fuse
        Factory publicly, or a real screenshot to show. Permission to name Fuse Factory is now
        granted (§15) and it's live on the portfolio — this could unblock the strip, but it hasn't
        been built. Still no Restaurant Sales Parser metric and no Fuse Factory screenshot yet.
- [x] **3. `services.ts`** + dynamic service page template — all five services real, no
      placeholder content
- [~] **4. `projects.ts`** + portfolio index and case study template.
      Restaurant Sales Parser is live with real screenshots (light/dark) and a rewritten
      problem/solution narrative, but still no owner-confirmed `result`/metrics (§10, three TODOs
      in the data file). Fuse Factory is now live too — cleared to be named publicly (§15), added
      as a personal/passion project rather than a client case study (see CLAUDE.md §1, §6): no
      `result` (no client outcome to report) and no `images` yet (still in development, no
      screenshots exist — add them once there's something worth showing, §9). Excel Performance
      Dashboard is still absent, no owner input yet.
- [x] **5. About** — real photos (identity shot in the header band, a gym/food pair illustrating
      the closing line), copy rewritten twice at the owner's request to read less like a résumé
      summary and to lead with the in-person/childhood history before the remote work.
- [x] **6. Quote form** — built this session. `/contact` + `QuoteForm.tsx` + `/api/quote`.
      Delivery is a Discord webhook (lead notification, awaited — its failure is the one thing
      that actually loses a lead). A Resend-based visitor auto-reply used to sit alongside this;
      cut per owner decision, see "Do now" above.
      Validated client- and server-side from one shared definition (`src/lib/quote.ts`), honeypot
      field, 7 fields plus two small conditional additions (see below). Not yet operational — see
      "Do now" above.

      **Deviated from the plan this file recorded before this rewrite** (see git history): the old
      note said `/contact` should read `?topic=` client-side via `useSearchParams()` + `Suspense`
      to stay static. Built it server-side instead — `/contact` is dynamically rendered. Simpler code, no
      hydration-flash edge case, and it is the *only* extra dynamic route beyond `/api/quote`
      itself (confirmed in `next build` output: everything else is still `○`/`●`). Flagged to the
      owner; no objection raised.

      **Two fields go beyond the literal seven in §8**, both deliberate, both narrow:
        - `service` includes an "Other" option; picking it reveals a required `otherTitle` field,
          since "Other" with no way to say what it is is useless to read in Discord.
        - `contactMethod` of "phone"/"text" reveals a required `phone` input — picking one of
          those without a number to use it on would be pointless. (Briefly built as optional at
          the owner's request, then reverted to required in the same session.)

      Budget ranges are **not** the ones drafted mid-session — the owner corrected them to
      `$0–$10 / $10–$25 / $25–$100 / $100–$250 / $250+`, and the "prefer not to say" default is
      labelled **"None"**.

      The form went through several rounds of restructuring after the initial build: "What's this
      about?" became a two-tier question (Services / Other, with the five real lines and a
      "Not sure yet" behind "Services"), the whole form past that question is now progressively
      revealed rather than shown all at once, Timeline dropped for the "Other" path, "Preferred
      contact method" moved above Name/Email, and `contactMethod` now defaults to "Email" instead
      of forcing an explicit choice. `src/lib/quote.ts` is the one place all of this is defined —
      read it before touching the form again rather than re-deriving the current shape from the
      component.
- [x] **7. SEO pass** — metadata, sitemap, OG images. Per-page `metadata` exports already exist
      (every page has one). `sitemap.ts` and `robots.ts` are in (`/` deliberately excluded from
      the sitemap while it's still `noindex`). OG image generation is done: every route has an
      `opengraph-image.tsx` (`src/lib/og.tsx` is the shared renderer — one dark-surface template,
      Bricolage Grotesque + Inter, rendered through `next/og`/satori with the two font files
      vendored into `src/assets/fonts/`), all prerendered at build time (confirmed static output
      in `next build`, and confirmed serving correctly with `x-nextjs-cache: HIT` through the real
      Worker in `npm run preview` — none of them invoke the Worker per request). `layout.tsx` also
      picked up `metadataBase` so the generated `og:image` URLs resolve to `liamthemo.com` instead
      of defaulting to localhost.
- [ ] **8. Custom domain** + WAF rate-limiting rule + analytics
  - The WAF rule is now pulled forward into "Do now" above — it protects `/api/quote` and does
    not need to wait for the domain attach.
  - Domain attach itself: see [`DEPLOYMENT.md` §6](./DEPLOYMENT.md#6-custom-domain--liamthemocom).
    Deliberately still waiting — attaching `liamthemo.com` to a site whose main conversion path
    doesn't deliver yet would get the *placeholder-quality* funnel indexed instead of a working
    one. Check for conflicting DNS records on the apex and `www` before attaching, same as always.
  - Analytics: not started, not decided which (if any).

---

## Open decisions

From CLAUDE.md §15. These are the owner's calls, not Claude's.

- [x] ~~Domain~~ — `liamthemo.com`, already on Cloudflare DNS
- [x] ~~Worker name~~ — `liamthemo`
- [x] ~~Contact email~~ — `contact@liamthemo.com`, inbound via Cloudflare Email Routing.
- [x] ~~Form delivery method~~ — **Discord webhook** for lead notifications only. A Resend-based
      visitor auto-reply was considered and built, then cut per owner decision — not worth the
      extra dependency and sending-domain verification for a courtesy email.
- [x] ~~Business / display name~~ — `LiamTheMo`, confirmed. `layout.tsx`'s fallback title now
      uses it instead of "Under construction". Logo is still undecided.
- [ ] Whether a phone number is published anywhere on the site itself (separate from the quote
      form's phone field, which is visitor-supplied, not the owner's)
- [ ] Service area for Local Tech Help — remote, local, or both
- [ ] Whether starting prices are published or quote-only
- [ ] Real metrics for the Restaurant Sales Parser case study (blocks the home page's social proof
      strip too)
- [x] ~~Whether Fuse Factory can be named publicly~~ — yes, confirmed. Added to
      `src/data/projects.ts` as a personal/passion project, still in development. Screenshots to
      follow once there's something to show.
- [ ] Deposit figures — DEPLOYMENT.md and `services.ts`'s FAQ copy both say "$10–25 depending on
      service" as an approximation; §10 only allows publishing confirmed prices
- [ ] Who buys parts for local tech help hardware work, and who holds the manufacturer warranty —
      a money/liability question, not a wording one, deliberately left out of the FAQs until
      answered

---

## Known cleanup

Small, non-blocking items — nothing here blocks a build order step.

- [x] ~~`public/` still has the create-next-app default SVGs~~ — deleted (`next.svg`,
      `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`; confirmed unreferenced).
- [x] ~~`src/lib/nav.ts`'s `serviceNav` is a hand-written duplicate~~ — now derived from
      `src/data/services.ts` via `.map()`, can't drift anymore.
- [x] ~~`layout.tsx` metadata still defaults to "Under construction"~~ — fixed, now `"LiamTheMo"`.
- [ ] `/` is still `noindex`, now specifically because the quote form isn't operationally live —
      see "Do now" at the top of this file for exactly what unblocks it.
- [ ] `src/data/projects.ts` has three owner TODOs on the Restaurant Sales Parser entry: which
      system the raw export actually comes from, what report(s) the parser produces by name, and
      the rest of the confirmed stack (file format read, report format written). None invented
      per §10 — fill in once known.
- [ ] `src/data/projects.ts` has one owner TODO on the Fuse Factory entry: confirm the rest of the
      stack (Roblox's `PathfindingService` vs. something custom, whether coins/progress persist
      via DataStore) once settled. Add real screenshots once the game has something to show (§9).
