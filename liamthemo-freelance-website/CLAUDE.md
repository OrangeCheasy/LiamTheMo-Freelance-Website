@AGENTS.md
# CLAUDE.md

Project instructions for Claude Code. Read this before touching anything in the repo.

---

## 1. What this project is

A **freelance services website** — a lead-generation site, not a résumé and not a portfolio gallery.

Every page exists to move a visitor toward one action: **submitting the quote form.**

The owner is a solo freelancer offering five service lines:

| Service line | What's sold |
|---|---|
| Automation & Python | Scripts, repetitive-task automation, data parsing, CSV/PDF processing, small-business tools, API/integration work |
| Excel & Data | Custom spreadsheets, automated reports, dashboards, sales/performance trackers, data cleanup, spreadsheet automation |
| Websites | Small-business sites, landing pages, restaurant/menu sites, portfolio sites, ongoing maintenance |
| Local Tech Help | Computer setup, Windows/software troubleshooting, printers, Wi-Fi/networking, file transfers, backups |
| Roblox Development | Luau scripting, gameplay systems, UI systems, DataStore systems, bug fixes, optimization |

**Audience:** small-business owners and individuals who are not technical, plus a smaller stream of Roblox project owners who are. Copy defaults to the non-technical reader. The Roblox page is the one place where jargon is allowed, because there it builds credibility.

### The one-sentence positioning

> I build tools that save you time.
> Custom automation, spreadsheets, websites, and technology solutions for individuals and small businesses.

---

## 2. Success criteria

When evaluating any change, judge it against these in order:

1. Does a confused visitor find the right service in under 15 seconds?
2. Does every page end with a path to the quote form?
3. Does the site load fast on a phone on mobile data?
4. Does it look like a small business, not a student portfolio?

If a proposed feature does not serve one of those, say so plainly and recommend cutting it. **Do not build features just because they're technically interesting.** Flag scope creep out loud.

---

## 3. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS |
| Source control | GitHub |
| Dev environment | GitHub Codespaces |
| Hosting | **Cloudflare Workers** via `@opennextjs/cloudflare` |
| Deploy tooling | Wrangler + GitHub Actions |
| DNS + domain | Cloudflare (custom `.ca` / `.com`, pending) |

### Why Cloudflare and not Vercel

Vercel's free Hobby tier prohibits commercial use, and Vercel defines "commercial" to include any site built or hosted for financial gain — a freelancer's own lead-generation site qualifies. Staying on Vercel legitimately would mean $20/month from day one. Cloudflare Workers has no such restriction and the free tier comfortably covers a marketing site.

**The tradeoff, stated plainly:** Vercel's developer experience for Next.js is better. Cloudflare requires an adapter, a `wrangler.jsonc`, a deploy workflow, and more care around environment variables. That setup cost is paid once. Do not reintroduce Vercel-specific APIs or assume Vercel behaviour anywhere in this codebase.

**Rules:**
- No new dependencies without justification. State the tradeoff before adding one. A 40 KB animation library for one fade is a bad trade.
- No CSS-in-JS, no styled-components, no UI kit. Tailwind only.
- Server Components by default. Add `"use client"` only where interactivity actually requires it (forms, the triage widget, mobile nav).
- **Node.js runtime only.** Never set `export const runtime = "edge"`. The OpenNext adapter targets the Node.js runtime; the Edge runtime is the older `next-on-pages` path and is not what this project uses.
- No database until there's a reason for one. Content lives in typed files under `src/data/`.
- Prefer static rendering. Every page that can be prerendered should be. See §4.1 for why this is a cost and reliability decision, not just a performance one.

---

## 4. Commands

```bash
npm run dev       # next dev — normal Next.js dev loop, use this for everyday work
npm run build     # next build — must pass before any PR
npm run lint      # eslint
npx tsc --noEmit  # typecheck

npm run preview   # opennextjs-cloudflare build && ... preview — runs the real Worker locally
npm run deploy    # opennextjs-cloudflare build && ... deploy — production deploy
npm run cf-typegen # regenerate types for Cloudflare bindings
```

`npm run build` and `npx tsc --noEmit` must both pass before opening a PR. No exceptions.

**Additionally:** anything touching a route handler, server action, middleware, or environment variable must be verified with `npm run preview` before the PR opens. `next dev` runs in Node; production runs in workerd. They are not the same runtime, and this is where surprises appear.

Use one package manager for the whole project and commit only that lockfile. Mixing npm and pnpm breaks OpenNext builds in confusing ways.

### 4.1 The free-tier budget

| Limit | Free plan |
|---|---|
| Worker requests | 100,000/day, resets 00:00 UTC |
| CPU time | 10ms per invocation |
| Static asset requests | Free and unlimited — they never invoke the Worker |
| Worker bundle size | 3 MB |
| Subrequests per invocation | 50 |

**What this means for architecture:** a statically prerendered page is served from the assets binding and costs nothing. A dynamically rendered page invokes the Worker and burns request quota and CPU. For a five-service marketing site, essentially everything should be static, with the quote-form handler as the only routine dynamic path.

Practical consequences:
- Do not add `force-dynamic`, uncached `fetch`, `cookies()`, or `headers()` to a page that has no reason to be dynamic. Each one silently converts a free static page into a metered one.
- 10ms CPU is generous for a form handler and tight for heavy SSR. If a route needs real computation, that is a signal the work belongs at build time.
- Exceeding the daily request cap returns Cloudflare error 1027 — the site goes down rather than generating a surprise bill. Predictable, but a real failure mode worth knowing.
- Upgrading later is $5/month and requires no code changes. Do not contort the architecture to stay free; just do not waste the free tier carelessly.

### 4.2 Required config

`wrangler.jsonc` at the repo root:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "<site-name>",
  "compatibility_date": "2026-08-07",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "images": {
    "binding": "IMAGES"
  }
}
```

Also required:
- `open-next.config.ts` at the repo root
- `.open-next/` and `.wrangler/` added to `.gitignore`
- `initOpenNextCloudflareForDev()` called in `next.config.ts` so bindings work in `next dev`

Do not hand-edit generated output in `.open-next/`. If something is wrong there, fix the source or the config.

### 4.3 Environment variables — read this before adding one

Cloudflare separates build-time and runtime variables, and getting this wrong is the single most common OpenNext deployment failure.

- **Build-time** (anything `NEXT_PUBLIC_*`, or anything read during `next build`) must be available to the build step — in CI, that means GitHub Actions secrets/vars, not the Worker's runtime settings.
- **Runtime** (form delivery keys, API tokens) belongs in Wrangler secrets via `wrangler secret put NAME`, read server-side only.
- `NEXT_PUBLIC_*` values are compiled into the client bundle and are public. Never put a key there.

If a build fails with an undefined variable that "definitely exists in Cloudflare," it was set as a runtime variable and needed to be a build-time one. Check that first.

---

## 5. Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # home
│   ├── services/
│   │   ├── page.tsx                # overview of all five
│   │   └── [slug]/page.tsx         # one page per service line
│   ├── portfolio/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx         # case study detail
│   ├── about/page.tsx
│   └── contact/page.tsx            # quote form lives here
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ServiceCard.tsx
│   ├── ProjectCard.tsx
│   ├── QuoteForm.tsx
│   ├── ServiceTriage.tsx           # the "What can I help you with?" widget
│   └── CTASection.tsx              # reusable bottom-of-page conversion block
│
├── data/
│   ├── services.ts
│   └── projects.ts
│
└── lib/
    └── types.ts
```

Service and portfolio pages are **generated from data files**, not hand-written per page. Adding a sixth service should mean adding one object to `services.ts` — nothing else.

---

## 6. Data model

Keep these shapes in `src/lib/types.ts`. Do not change them without updating every consumer.

```ts
export type ServiceSlug =
  | "automation"
  | "excel-data"
  | "websites"
  | "local-tech-help"
  | "roblox";

export interface Service {
  slug: ServiceSlug;
  title: string;            // "Automation & Python"
  tagline: string;          // one line, benefit-first, no jargon
  icon: string;             // emoji or icon key
  problems: string[];       // symptoms in the client's words — "I retype the same report every Monday"
  deliverables: string[];   // what they actually receive
  process: string[];        // 3–4 steps, plain language
  startingPrice?: string;   // "from $X" — omit entirely rather than guess
  turnaround?: string;      // "typically 3–7 days"
  faqs: { q: string; a: string }[];
  relatedProjects: string[]; // Project.slug values
}

export interface Project {
  slug: string;
  title: string;
  client?: string;           // omit or anonymize if not cleared
  services: ServiceSlug[];   // enables cross-linking from service pages
  summary: string;           // one sentence, outcome-focused
  problem: string;
  solution: string;
  result: string;            // quantified where possible: hours saved, errors removed
  stack: string[];
  images?: { src: string; alt: string }[];
  featured: boolean;
}
```

### Known portfolio entries

- **Restaurant Sales Parser** — flagship. Parses raw sales exports into reports automatically. Lead with the time saved per week and the manual step it eliminated. This is the single best proof for both Automation and Excel & Data.
- **Excel Performance Dashboard** — proof for Excel & Data.
- **Fuse Factory** — proof for Roblox Development.

Write case studies as **problem → solution → result**, not as feature lists. A small-business owner does not care that it uses `pandas`; they care that Monday morning went from two hours to five minutes. Put the stack in a sidebar for the technical readers.

---

## 7. The triage widget (`ServiceTriage.tsx`)

This is the signature element of the home page and the main conversion mechanic. It sits directly under the hero.

**Prompt:** "What can I help you with?"

**Options:**
| Label | Destination |
|---|---|
| 🔄 I have a repetitive task | `/services/automation` |
| 📊 I need help with data or Excel | `/services/excel-data` |
| 🖥️ My computer or technology isn't working | `/services/local-tech-help` |
| 🌐 I need a website | `/services/websites` |
| 🎮 I need Roblox development | `/services/roblox` |
| ❓ I'm not sure what I need | `/contact?topic=unsure` |

**Requirements:**
- Real `<Link>` elements, not `onClick` router pushes. Must be keyboard-navigable, crawlable, and middle-clickable.
- Labels are written from the visitor's side of the screen — they describe the *symptom*, not the service name. Never rename these to "Python Scripting" or "Data Engineering."
- "I'm not sure what I need" is a first-class option, not a fallback. A meaningful share of good leads land there. It should reach a friendly, low-pressure version of the form.
- Selecting an option should pass the topic through to the quote form so the visitor doesn't re-answer the same question.

---

## 8. Quote form (`QuoteForm.tsx`)

**Fields:** name, email, service (prefilled from triage/service page), description of the problem, budget range (optional, use ranges not a free text box), timeline, preferred contact method.

**Rules:**
- Keep it under seven fields. Every added field costs conversions.
- Validate client-side *and* on the server. Never trust the client.
- The submit button says "Send request" and the success state says "Request sent." Same verb throughout.
- On success, show what happens next and when: "I'll reply within one business day." Do not just show a checkmark.
- Errors state what went wrong and how to fix it. No apologies, no vagueness.
- Handle submission through a Next.js Route Handler or Server Action. **Never put an API key, form endpoint secret, or email credential in client-side code.** Secrets go in Wrangler secrets (`wrangler secret put`) and are read server-side only. See §4.3.
- Add a honeypot field and basic rate limiting. This form will get spam.
- This handler is the site's main dynamic path and the only routine consumer of the Worker request budget. Keep it lean: one outbound call to the delivery provider, no heavy parsing, no image work. Stay well under 10ms CPU.
- Rate limiting: use Cloudflare's own WAF rate-limiting rules on the `/api/quote` path rather than building an in-Worker counter. Blocked requests are stopped at the edge and never invoke the Worker, which protects both the inbox and the daily request cap. Workers KV free tier allows only 1,000 writes/day, so KV-backed counters are a poor fit here.

---

## 9. Design direction

**The brief is a small technical services business built on trust and time saved.** Reliable, plainspoken, tidy. Not a flashy agency, not a startup landing page, not a dark-mode developer portfolio.

**Anti-goals — do not produce these:**
- Cream background + high-contrast serif + terracotta accent
- Near-black background with one acid-green accent
- Generic hero with a gradient blob and three floating cards
- `01 / 02 / 03` numbered markers on things that are not actually a sequence (the process steps *are* a sequence — those are fine; the service list is not)
- Stock photos of people in offices pointing at laptops

**Direction to work within, unless the owner overrides it:**
- Light, high-legibility base. One confident accent color used for actions and nothing else. If a color appears on a non-clickable element, it should not be the accent.
- Type: one characterful display face for headings used with restraint, one highly legible body face. Set a real type scale. Avoid the default Next.js font stack.
- Generous whitespace, restrained borders, no heavy shadows. Precision over decoration.
- Motion: subtle and purposeful only — hover states, one scroll reveal at most per page. Respect `prefers-reduced-motion`.
- Real screenshots of actual work beat any illustration. Show the dashboard. Show the parser output. Show the game.

Before building a new page section, propose the layout in one or two sentences and get a yes. Do not silently redesign existing pages.

---

## 10. Copy rules

- Sentence case everywhere, including buttons and headings.
- Lead with the outcome, follow with the method. "Stop retyping your weekly numbers" beats "Python-based data automation."
- No superlatives, no "cutting-edge," no "passionate about." No em-dash-heavy marketing voice.
- Specific beats clever, always. Name the actual task, the actual file type, the actual hour saved.
- Never invent client names, testimonials, review counts, years of experience, or project results. If a number isn't known, leave it out and flag it as a TODO for the owner to fill in. Fabricated social proof is the fastest way to lose a real client.
- Prices: only publish what the owner has confirmed. `startingPrice` is optional in the type for exactly this reason.

---

## 11. Quality floor

Every page ships with:
- Working keyboard navigation and visible focus states
- Semantic HTML — real headings in order, real buttons, real links, real labels tied to inputs
- Alt text on every image
- Responsive from 320px up
- Lighthouse performance ≥ 90 on mobile
- `next/image` for all images; no raw `<img>`. Image optimization on Workers requires the `images` binding in `wrangler.jsonc` (§4.2) — it does not work by default the way it does on Vercel. Verify optimized images render correctly in `npm run preview`, not just `next dev`.
- Per-page `metadata` export: title, description, Open Graph tags

**SEO:** each service page targets a plain-language phrase a real person would search, not a job title. Include location terms on the Local Tech Help page since that service is geographically bound. Ship `sitemap.ts` and `robots.ts`. Add LocalBusiness structured data once the domain and business details are settled.

---

## 12. Git workflow and deployment

```
feature branch → npm run dev → npm run preview (real Worker runtime)
              → commit + push → GitHub PR (CI: lint, typecheck, build)
              → merge to main → GitHub Actions runs opennextjs-cloudflare build
              → wrangler deploy → live
```

- Branch names: `feat/quote-form`, `fix/mobile-nav`, `content/restaurant-parser-case-study`
- Never commit directly to `main`. `main` is production.
- Commit messages: imperative and specific. `Add triage widget to home page`, not `updates`.
- One concern per PR. A PR that adds a feature and restyles the footer is two PRs.
- PR description states what changed and how to verify it.
- `.env.local`, `.open-next/`, and `.wrangler/` are gitignored and stay that way. If a secret is ever committed, rotate it — do not just delete the line.

**Deploy workflow requirements:**
- Deployment runs from GitHub Actions on merge to `main`, on Linux. `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` live in repository secrets.
- The API token should be scoped to Workers deploy permissions only, not an account-wide key.
- Build-time environment variables must be declared in the Actions workflow (§4.3). A deploy that succeeds locally and fails in CI is almost always this.
- There is no automatic preview-URL-per-PR the way Vercel provides. If preview deploys become worth it, use a separate named Worker for staging and gate it behind Cloudflare Access rather than leaving a staging URL public. Do not build this until it is actually needed.
- If a deploy breaks production, roll back with `wrangler rollback` first and diagnose afterward.

---

## 13. Working agreement for Claude

**Do:**
- Explain *why* an approach was chosen, not just what the code does. The owner is leveling up toward professional practice, not collecting snippets.
- State tradeoffs plainly, including when the simpler option is better than the one requested.
- Push back on ideas that are overbuilt, hard to maintain solo, or unlikely to convert. Honest feedback is more useful than agreement.
- Build reusable pieces. This site is a template for future client sites — anything hardcoded here is work repeated later.
- Ask before making decisions the owner hasn't made: pricing, real client names, business address, phone number, legal/business-name details.
- Call out when a change would convert a static page into a dynamically rendered one, and say why it is or isn't worth it.

**Don't:**
- Add a CMS, auth, analytics dashboard, blog engine, or database unless explicitly asked.
- Assume Vercel. No `@vercel/*` packages, no Vercel-specific env var names, no `runtime = "edge"`, no assuming image optimization or ISR "just works" without the corresponding Cloudflare binding.
- Reach for Workers KV, D1, R2, or Durable Objects for this site. A brochure site with a contact form needs none of them, and each one adds free-tier limits to track.
- Refactor unrelated files while implementing a feature.
- Invent content, credentials, or results.
- Ship a component without a mobile layout.
- Leave `console.log` or commented-out code in a PR.

---

## 14. Build order

0. **Deploy pipeline first** — scaffold, add the OpenNext adapter, get a placeholder page live on a `workers.dev` URL via GitHub Actions. Prove the whole chain works while there is nothing to debug.
1. Layout shell — Navbar, Footer, typography scale, Tailwind theme tokens
2. Home — hero + triage widget + brief social proof strip
3. `services.ts` + the dynamic service page template
4. `projects.ts` + portfolio index and case study template — Restaurant Sales Parser first
5. Quote form with working delivery to the owner's inbox
6. About
7. SEO pass — metadata, sitemap, OG images
8. Custom domain + WAF rate-limiting rule on the form endpoint + analytics

Step 0 is not optional and is not busywork. Debugging a runtime mismatch or an environment-variable split against a finished site is far worse than doing it against a page that says "hello."

Ship 0–5 before polishing anything. A live site with a working form beats a beautiful unfinished one.

---

## 15. Open decisions

Flag these to the owner rather than deciding unilaterally:

- [ ] Business/display name and logo
- [ ] Domain (`.ca` vs `.com`) — register through Cloudflare or transfer DNS to Cloudflare so the Worker route attaches cleanly
- [ ] Worker name (becomes the `workers.dev` subdomain before the custom domain is live)
- [ ] Contact email and whether a phone number is published
- [ ] Form delivery method (email service vs form backend) — must be callable via a single `fetch` from a Worker; anything requiring a long-lived Node process or an SMTP socket will not work
- [ ] Service area for Local Tech Help — remote, local, or both
- [ ] Whether starting prices are published or quote-only
- [ ] Real metrics for the Restaurant Sales Parser case study
- [ ] Whether Fuse Factory can be named publicly