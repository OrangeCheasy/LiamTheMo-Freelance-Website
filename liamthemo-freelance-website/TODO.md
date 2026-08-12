# TODO

Outstanding actions, build order progress, and open decisions.

How-to lives in [`DEPLOYMENT.md`](./DEPLOYMENT.md) — this file tracks *what* is left, not *how*.

---

## Do now — step 3, `services.ts` and the service page template

See the build order below. Step 3 is now the blocker for everything: the five triage
destinations 404 until it lands, which is also why `/` is still `noindex`.

### Palette gotcha found in step 2 — applies to every future component

**A pastel fill can never sit behind text that is not ink.** The keyword mark on the home
page was first built as a highlighter crossing the lower third of the letterforms. That is
11.7:1 in the light theme (ink on pastel) and **1.26:1 in the dark theme**, because the
heading colour flips to `#e8eaed` while `--color-accent-fill` stays `#fcc4bf`. The word
vanished where the band crossed it. No `dark:` variant is allowed and no single band colour
clears 4.5:1 against near-white text while staying visible on `#1a1d21`, so the geometry had
to change: the band now sits below the baseline and touches no glyph.

The general rule: a pastel fill is only safe under text whose colour is theme-independent.
`accent-fill-ink` is fixed across both themes, which is exactly why buttons and the CTA band
work. `text-ink` is not. Check which one is in play before putting anything on a pastel.

### Carry-forward from step 2 — read before building step 5

- **`/contact` must read `?topic=` on the client, not the server.** Reading `searchParams`
  in `contact/page.tsx` makes that page dynamically rendered, so every visit invokes the
  Worker (CLAUDE.md §4.1). Reading it with `useSearchParams()` inside `QuoteForm` keeps the
  page static; Next 16 requires the calling client component to sit inside a `<Suspense>`
  boundary or the build fails outright.
- **The topic values are already fixed** by `ServiceTriage.tsx` — `automation`, `excel-data`,
  `local-tech-help`, `websites`, `roblox`, `unsure`. The form's service field must accept
  exactly these, and `unsure` must resolve to a real, friendly option rather than an
  unmatched value that silently falls back to blank.
- **Each service page's CTA carries `?topic=<slug>`** — that is the second half of the §7
  passthrough. The triage widget only carries it directly for `unsure`.

## Done — first deploy

The lockfile is regenerated and committed, and the placeholder is live. The Windows dev machine does
have Node (v24) — an earlier note here claiming otherwise was wrong.

Two gotchas fixed along the way, both worth remembering:

- **CI must build before it typechecks.** Next 16 generates `LayoutProps` / `PageProps` into
  `.next/types/` during `next build`, and `tsconfig.json` includes that directory. Typechecking a
  fresh checkout first fails with `Cannot find name 'LayoutProps'`.
- **PowerShell blocks `npm.ps1`** under the default execution policy. Use `npm.cmd`, or set
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Done — Cloudflare account setup

Instructions kept in [`DEPLOYMENT.md` §2](./DEPLOYMENT.md#2-one-time-cloudflare-setup).

- [x] `workers.dev` subdomain
- [x] Account ID
- [x] Scoped API token
- [x] `CLOUDFLARE_API_TOKEN` in GitHub repository secrets
- [x] `CLOUDFLARE_ACCOUNT_ID` in GitHub repository secrets

---

## Decisions blocking step 0

- [x] ~~**Worker name**~~ — **`liamthemo`**. Serves at `https://liamthemo.orangecheasy.workers.dev`
      until the custom domain is attached (`orangecheasy` is the *account* subdomain and is unrelated
      to `liamthemo.com`). Staging, if ever needed, would be `liamthemo-staging`.

- [x] ~~**What ships on the placeholder deploy**~~ — only `/`. The `about/`, `services/`, and
      `portfolio/` pages turned out to be byte-identical copies of the create-next-app default page,
      and `ServiceCard.tsx` was a 0-byte file. All four deleted; they are in git history. They get
      built properly at steps 3, 4, and 6.

- [ ] **`global_fetch_strictly_public` compatibility flag** — recommended by the OpenNext docs,
      omitted by CLAUDE.md §4.2. Prevents a server-side `fetch()` to your own hostname from
      re-entering the Worker and burning a second request. Currently following CLAUDE.md and leaving
      it out. Nothing depends on it today.

---

## Build order

From CLAUDE.md §14. Ship 0–5 before polishing anything.

- [x] **0. Deploy pipeline** — placeholder page live on `workers.dev` via GitHub Actions
  - [x] Next.js 16 + TypeScript strict + Tailwind v4 + App Router scaffolded
  - [x] `@opennextjs/cloudflare` and `wrangler` added to `package.json`
  - [x] `wrangler.jsonc`, `open-next.config.ts`, `initOpenNextCloudflareForDev()` in `next.config.ts`
  - [x] `.gitignore` entries — `.open-next/`, `.wrangler/`, `.dev.vars`
  - [x] npm scripts — `preview`, `deploy`, `cf-typegen`
  - [x] `public/_headers` for immutable static asset caching
  - [x] GitHub Actions workflow — lint/typecheck/build on PR, build + deploy on merge to `main`
  - [x] Under-construction page at `/`, `noindex` while it is a placeholder
  - [x] **`npm install` to regenerate the lockfile**
  - [x] Verified locally: `npm run build`, `npx tsc --noEmit`, `opennextjs-cloudflare build`
  - [x] First green deploy verified at `https://liamthemo.orangecheasy.workers.dev`
        (`200`, `x-opennext: 1`, `x-nextjs-prerender: 1`, `noindex` intact)
- [x] **1. Layout shell** — Navbar, Footer, typography scale, Tailwind theme tokens
- [ ] **2. Home** — hero, triage widget, social proof strip
  - [x] Hero — positioning line, quote CTA, secondary link to `/services`
  - [x] `ServiceTriage.tsx` — six real `<Link>`s per §7, server component, zero client JS
  - [x] `CTASection.tsx` — reusable closing conversion block, used by steps 3/4/6 too
  - [x] Verified `/` still prerenders as `○ (Static)` in the build output
  - [x] `Mark.tsx` — keyword emphasis on "time"; `ProcessDiagram.tsx` — hero schematic;
        dot-grid hero texture. All static, all from tokens, no new dependencies.
  - [ ] **Mobile not visually verified.** Chrome refused to resize below the maximized
        window and blocked the popup fallback, so the 320px layout was checked by class
        inspection only, not by eye. Worth one manual pass in devtools before merging.
  - [ ] **Social proof strip — blocked on the owner.** Not built rather than faked (§10).
        Needs any one of: a real Restaurant Sales Parser metric (hours saved per week and
        the manual step removed), permission to name Fuse Factory publicly, or a screenshot
        of real work that can be shown.
- [ ] **3. `services.ts`** + dynamic service page template
- [ ] **4. `projects.ts`** + portfolio index and case study template (Restaurant Sales Parser first)
- [ ] **5. Quote form** with working delivery to the owner's inbox
- [ ] **6. About**
- [ ] **7. SEO pass** — metadata, sitemap, OG images
- [ ] **8. Custom domain** + WAF rate-limiting rule on the form endpoint + analytics
  - See [`DEPLOYMENT.md` §6](./DEPLOYMENT.md#6-custom-domain--liamthemocom) — check for conflicting
    DNS records on the apex and `www` before attaching

---

## Settled business policy (step 3)

These are published on the service pages. Four of them are in `commonFaqs` in
`src/data/services.ts` rather than copied into each service, so changing one is a single edit.

- **Ownership** — the client receives the source files and owns them outright, including the
  right to take the work to another developer. The only reservation is being credited as the
  author of the original work. An earlier draft added "and no one else may modify it"; that
  was dropped because it contradicts giving ownership, and because it confirms the exact
  lock-in fear the websites service names as a client problem.
- **Revisions** — unlimited until the client is happy. If the scope grows well past what was
  agreed, that is raised before the work continues, never as a surprise on the invoice.
- **Support window** — one week from delivery for the client to report anything broken, fixed
  free. The week is a deadline for *getting in touch*, not for the fix to be finished.
  Anything after that is quoted as new work.
- **Deposit** — a reservation fee of $10–25 depending on service, to hold the time.
  **Confirm the exact figures.** These were given as an approximation, and §10 allows
  publishing only confirmed prices.
- **Service area (local tech help)** — Calgary and nearby towns such as Airdrie in person,
  further afield with travel added to the quote, plus remote where the problem allows. This
  also supplies the location terms §11 requires on that page; the location lives in that
  service's `tagline`, which the detail template uses as its meta description.
- **Roblox tooling** — Rojo or directly in Studio, whichever the client's team already uses.

Still not set, and correctly absent from the data: per-service pricing (`startingPrice`) and
delivery times (`turnaround`). Both fields are optional in the type for this reason. Do not add
"contact for pricing" as a placeholder value.

## Open decisions

From CLAUDE.md §15. These are the owner's calls, not Claude's.

- [x] ~~Domain~~ — `liamthemo.com`, already on Cloudflare DNS
- [x] ~~Worker name~~ — `liamthemo`
- [ ] Business / display name and logo
- [x] ~~Contact email~~ — **`contact@liamthemo.com`**, already working via Cloudflare Email
      Routing. All form submissions and inquiries go here. Note that Email Routing *receives*
      only; step 5 still needs a delivery provider that can be called with a single `fetch`
      from the Worker, because Cloudflare does not provide outbound SMTP.
- [ ] Whether a phone number is published
- [ ] Form delivery method — must be callable via a single `fetch` from a Worker; anything needing a
      long-lived Node process or an SMTP socket will not work
- [ ] Service area for Local Tech Help — remote, local, or both
- [ ] Whether starting prices are published or quote-only
- [ ] Real metrics for the Restaurant Sales Parser case study
- [ ] Whether Fuse Factory can be named publicly

---

## Known cleanup

- [ ] `public/` still contains the create-next-app default SVGs (`next.svg`, `vercel.svg`,
      `file.svg`, `globe.svg`, `window.svg`) — remove once real assets exist
- [x] ~~`src/app/page.tsx` is still the create-next-app default~~ — real home page as of step 2
- [ ] **`/` is still `noindex`**, now for a different reason than the placeholder was: the five
      triage links 404 until step 3. Indexing a homepage whose main links are dead is worse
      than waiting. Remove the `robots` key in `src/app/page.tsx` at step 7.
- [ ] `layout.tsx` metadata still defaults to "Under construction" — it is the fallback title
      for every page that does not set its own. Fix alongside the business/display name.
