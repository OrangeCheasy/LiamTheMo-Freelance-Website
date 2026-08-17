# CLAUDE.md

Project instructions for Claude Code. Read this before touching anything in the repo.

**This version supersedes the pre-redesign CLAUDE.md.** Stack, hosting, and workflow sections are unchanged. §1, §2, §9, §10, §11, and §12 were rewritten for the dark/orange redesign.

---

## 1. What this project is

**liamthemo.com** — a personal portfolio that doubles as a lead-generation site for freelance client work.

Two jobs, weighted differently per visitor:

| Visitor | Arrives via | Wants to know | Converts by |
|---|---|---|---|
| **Roblox / dev client** | Discord, referral, project listing | Is this person good? | Seeing the work |
| **Small-business owner** | Search, word of mouth, local referral | Can this person fix my problem? | Finding their symptom, then the form |

The design serves the first. The information architecture serves the second. **Neither may be sacrificed for the other.** A change that makes the site more beautiful but harder for a restaurant owner to navigate is a bad change. A change that adds a conversion element looking like a template is also a bad change.

### Service lines

| Service line | What's sold |
|---|---|
| Automation & Python | Scripts, repetitive-task automation, data parsing, CSV/PDF processing, small-business tools, API/integration work |
| Excel & Data | Custom spreadsheets, automated reports, dashboards, sales/performance trackers, data cleanup |
| Websites | Small-business sites, landing pages, restaurant/menu sites, portfolio sites, maintenance |
| Local Tech Help | Computer setup, Windows/software troubleshooting, printers, Wi-Fi/networking, file transfers, backups |
| Roblox Development | Luau scripting, gameplay systems, UI systems, DataStore systems, bug fixes, optimization |

### Lead handling

Submissions route through email routing, Discord webhooks, and the on-site form, all landing directly with the owner. This is built and working. **Do not redesign, replace, or "improve" the delivery pipeline.** Restyling the form is in scope; changing where submissions go is not.

---

## 2. Success criteria

Judge every change against these, in order:

1. **Does a non-technical visitor find their own problem within one screen of scrolling?** The triage widget is how. Not optional, not decoration.
2. **Does the work look impressive?** Real screenshots and project art, shown large. This is the portfolio half earning its keep.
3. **Does every page end with a path to the form?**
4. **Does it load fast on a phone on mobile data?** A dark, image-heavy design makes this harder. See §12.
5. **Does it look like one person with taste, not a template?**

If a proposed feature serves none of these, say so and recommend cutting it. Flag scope creep out loud.

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
| Domain | liamthemo.com (Cloudflare DNS) |

### Why Cloudflare and not Vercel

Vercel's free Hobby tier prohibits commercial use, and defines "commercial" to include any site built or hosted for financial gain — a freelancer's own lead-generation site qualifies. Cloudflare Workers has no such restriction. The tradeoff is a worse developer experience: an adapter, a `wrangler.jsonc`, a deploy workflow, and more care around environment variables. That cost is already paid. **Do not reintroduce Vercel-specific APIs or assume Vercel behaviour anywhere in this codebase.**

**Rules:**
- No new dependencies without justification. State the tradeoff first. A 40 KB animation library for one fade is a bad trade — and in this redesign that temptation will come up repeatedly.
- Tailwind only. No CSS-in-JS, no UI kit, no component library.
- Server Components by default. `"use client"` only where interactivity genuinely requires it: mobile nav, quote form, scroll-triggered animation.
- **Node.js runtime only.** Never set `export const runtime = "edge"`.
- Content lives in typed files under `src/data/`. No CMS, no database.
- Prefer static rendering. Every page that can be prerendered must be. See §4.1.

---

## 4. Commands

```bash
npm run dev        # next dev — everyday work
npm run build      # next build — must pass before any PR
npm run lint       # eslint
npx tsc --noEmit   # typecheck

npm run preview    # runs the real Worker locally
npm run deploy     # production deploy
npm run cf-typegen # regenerate Cloudflare binding types
```

`npm run build` and `npx tsc --noEmit` must both pass before opening a PR.

Anything touching a route handler, server action, middleware, environment variable, **or `next/image`** must be verified with `npm run preview` before the PR opens. `next dev` runs in Node; production runs in workerd.

### 4.1 The free-tier budget

| Limit | Free plan |
|---|---|
| Worker requests | 100,000/day, resets 00:00 UTC |
| CPU time | 10ms per invocation |
| Static asset requests | Free and unlimited — never invoke the Worker |
| Worker bundle size | 3 MB |

A statically prerendered page is served from the assets binding and costs nothing. A dynamic page burns request quota and CPU. Everything except `/contact` should be static.

- Do not add `force-dynamic`, uncached `fetch`, `cookies()`, or `headers()` to a page with no reason to be dynamic. Each silently converts a free page into a metered one.
- Exceeding the daily cap returns Cloudflare error 1027 — the site goes down rather than billing you.
- Upgrading is $5/month and requires no code changes. Don't contort the architecture to stay free; just don't waste the tier carelessly.

### 4.2 Required config

`wrangler.jsonc` at the repo root must retain `nodejs_compat`, the `assets` binding, and the `images` binding. Do not hand-edit `.open-next/`.

### 4.3 Environment variables

Cloudflare separates build-time from runtime, and getting this wrong is the most common OpenNext failure.

- **Build-time** (`NEXT_PUBLIC_*`, anything read during `next build`) → GitHub Actions secrets/vars.
- **Runtime** (form delivery keys, Discord webhook URL) → `wrangler secret put`, read server-side only.
- `NEXT_PUBLIC_*` is compiled into the client bundle and is public. **The Discord webhook URL must never be a `NEXT_PUBLIC_` variable** — a public webhook URL is an open spam endpoint.

If a build fails on an undefined variable that "definitely exists in Cloudflare," it was set at runtime and needed to be build-time.

---

## 5. Structure

```
src/
├── app/
│   ├── layout.tsx                  # fonts, skip link
│   ├── page.tsx                    # home
│   ├── services/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── portfolio/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ServiceTriage.tsx           # the conversion mechanic — see §7
│   ├── ServiceCard.tsx
│   ├── ProjectCard.tsx
│   ├── FeaturedWork.tsx
│   ├── QuoteForm.tsx
│   └── CTASection.tsx
│
├── data/
│   ├── services.ts
│   └── projects.ts
│
└── lib/
    └── types.ts
```

Service and portfolio pages generate from data files. Adding a sixth service = one object in `services.ts`, nothing else.

---

## 6. Data model

Keep these in `src/lib/types.ts`. Do not change shapes without updating every consumer.

```ts
export type ServiceSlug =
  | "automation" | "excel-data" | "websites" | "local-tech-help" | "roblox";

export interface Service {
  slug: ServiceSlug;
  title: string;
  tagline: string;           // one line, benefit-first, no jargon
  icon: string;
  problems: string[];        // symptoms in the client's words
  deliverables: string[];
  process: string[];         // 3–4 steps, plain language
  startingPrice?: string;    // omit rather than guess
  turnaround?: string;
  faqs: { q: string; a: string }[];
  relatedProjects: string[];
}

export interface Project {
  slug: string;
  title: string;
  client?: string;
  services: ServiceSlug[];
  summary: string;
  problem: string;
  solution: string;
  result: string;            // quantified where possible
  stack: string[];
  cover: { src: string; alt: string };   // required — this design is card-led
  images?: { src: string; alt: string }[];
  featured: boolean;
}
```

`cover` is required in this redesign. The featured work grid is the visual centrepiece; a project without art breaks it.

### Portfolio entries

- **Restaurant Sales Parser** — flagship. Proof for Automation *and* Excel & Data. Lead with time saved per week.
- **Fuse Factory** — proof for Roblox.
- **Orange Cheasy** — proof for Roblox.
- **Excel Performance Dashboard** — proof for Excel & Data.

Case studies are **problem → solution → result**. Stack goes in a sidebar for technical readers, never the lead. A restaurant owner cares that Monday went from two hours to five minutes, not that it uses pandas.

---

## 7. The triage widget (`ServiceTriage.tsx`)

**This survived the redesign deliberately. It is the highest-converting element on the site and it is not up for removal.**

It sits directly below the hero, above featured work. In the new design it does double duty: for the portfolio visitor it reads as a capabilities overview, so it isn't wasted space for either audience.

**Prompt:** "What can I help you with?"

| Label | Destination |
|---|---|
| 🔄 I have a repetitive task | `/services/automation` |
| 📊 I need help with data or Excel | `/services/excel-data` |
| 🖥️ My computer or technology isn't working | `/services/local-tech-help` |
| 🌐 I need a website | `/services/websites` |
| 🎮 I need Roblox development | `/services/roblox` |
| ❓ I'm not sure what I need | `/contact?topic=unsure` |

**Requirements:**
- Real `<Link>` elements. Keyboard-navigable, crawlable, middle-clickable.
- Labels describe the **symptom**, not the service name. Never rename these to "Python Scripting" or "Data Engineering."
- "I'm not sure what I need" is a first-class option. A meaningful share of good leads land there.
- Topic passes through to the quote form so the visitor doesn't answer twice.

**Redesign treatment:** dark surface cards, hairline borders, accent glow on hover, emoji retained at larger size. Do not replace the emoji with abstract line icons — the emoji are legible at a glance and carry meaning a generic icon set does not.

---

## 8. Quote form (`QuoteForm.tsx`)

**Fields:** name, email, service (prefilled), description, budget range (select, not free text), timeline, preferred contact method. Seven maximum.

- Validate client-side *and* server-side.
- Submit says "Send request"; success says "Request sent." Same verb.
- Success state states what happens next and when. Not just a checkmark.
- Errors say what went wrong and how to fix it.
- Honeypot field. Rate limiting via Cloudflare WAF rules on the handler path — blocked requests never invoke the Worker, protecting both the inbox and the request budget. No in-Worker counter, no KV.
- Delivery secrets in Wrangler secrets, server-side only. **The existing email routing and Discord webhook pipeline works — restyle the form, do not rewire the delivery.**
- Keep the handler lean: one outbound call, no heavy parsing. Well under 10ms CPU.

---

## 9. Design system

**Direction: molten dark.** Warm near-black, a single high-energy orange, generous space, real work shown large. Confident and personal — a maker's site, not an agency's.

The redesign source of truth is the approved homepage mockup. Where this document and the mockup disagree, raise it rather than guessing.

### 9.1 Tokens

**The site is dark only.** There is no light theme and no theme toggle. Define tokens as CSS custom properties on `:root` and expose them to Tailwind via the theme config. **Never hardcode a hex value in a component.**

```
  --bg              #0B0A0A   warm near-black, not pure #000
  --surface         #141212   cards, raised panels
  --surface-2       #1C1919   hover, nested surfaces
  --border          #2A2626   hairline, low contrast
  --text            #F5F3F1   warm white
  --text-muted      #A8A19C
  --accent          #FF6A1A
  --accent-hover    #FF8340
  --accent-dim      rgba(255,106,26,0.12)   glow, tints, focus rings
```

**Neutrals are warm-tinted on purpose.** Pure grey next to orange reads dead and cheap. Do not "clean up" these values to neutral greys.

Set `color-scheme: dark` on `:root` so browser-rendered UI — form controls, scrollbars, autofill backgrounds — matches. Without it, autofilled inputs render with a white background that looks broken against the dark surface.

Because there is no light theme, tokens may be used directly and confidently. Do not add conditional theme logic, `dark:` variants, or a `data-theme` attribute "for later." If a light theme is ever wanted, it is a deliberate future project, not something to scaffold for now.

### 9.2 Accent discipline

Orange marks **actions and current state**. Nothing else.

- Links, buttons, active nav, focus rings, hover glow, the logo: accent.
- Section labels, dividers, body copy, card borders at rest, decorative flourishes: **not** accent.

If orange appears on something that cannot be clicked, it's wrong. This discipline is what makes the mockup look designed rather than decorated — orange everywhere looks like a Bootstrap theme.

### 9.3 Type

- One heading face with character, one highly legible body face. Self-host via `next/font` — no external font CDN, which adds a render-blocking third-party request.
- Headings: tight tracking, weight 600–700, large. The mockup's hero is roughly 56–64px desktop.
- Body: 16–17px, line height 1.6+. Muted colour for secondary copy.
- Sentence case everywhere, including buttons.
- Set a real type scale in the Tailwind config and use it. No arbitrary `text-[27px]`.

### 9.4 Surfaces and depth

- Cards: `--surface`, 1px `--border`, radius 12–16px.
- Depth comes from **contrast and warm glow**, not drop shadows. A soft radial `--accent-dim` behind a focal element beats a black box-shadow, which disappears on dark backgrounds anyway.
- Hover: border shifts toward accent, subtle lift, glow appears. Under 200ms.

### 9.5 Motion

- Subtle and purposeful. Hover transitions, at most one scroll-reveal per section.
- **Respect `prefers-reduced-motion` on every animation.** Not optional.
- No parallax, no scroll-jacking, no animated gradient meshes, no cursor followers. These read as dated template and cost CPU on mobile.

### 9.6 Anti-goals

Do not produce:
- Orange on non-interactive elements
- Pure `#000` background or pure grey neutrals
- Glassmorphism, frosted blur panels, animated gradient blobs
- A "Clean Code / Thoughtful Design / Problem Solver" trio of generic virtues — see §11
- Stock photography or generic 3D illustration where real project art could go
- Neon glow on text. Glow belongs on surfaces and focal images, not typography.

---

## 10. Dark-only commitments

There is no light theme. That removes a large amount of work, but it makes three things non-negotiable, because a dark site has no fallback when they're wrong.

**Contrast.** Dark backgrounds hide low-contrast text far more effectively than light ones do, and `--text-muted` on `--surface` is the pairing most likely to fail. Every text/background combination must pass WCAG AA. `--accent` on `--bg` passes for large text and UI elements; it does **not** pass for small body copy, so never set paragraph text in orange.

**Focus states.** A default browser focus ring is a thin dark outline and is effectively invisible here. Every interactive element needs an explicit, high-contrast focus ring built from `--accent`, tested by tabbing through the page rather than assumed from the code.

**Browser-rendered UI.** Form controls, autofill, scrollbars, and selection highlights default to light styling. `color-scheme: dark` handles most of it; autofill on inputs usually needs an explicit override. Check the contact form after any browser has saved credentials against it.

**The upside worth protecting:** dark-only means the hero artwork, the glow treatments, and the project cover art only ever need to work against one background. Do not spend that saved effort adding theme abstraction back in.

---

## 11. Copy rules

- Sentence case everywhere.
- **Lead with the outcome, follow with the method.** "Stop retyping your weekly numbers" beats "Python-based data automation."
- The hero must do outcome work, not just identity work. A personal introduction is fine as the opening line, but a visitor must learn *what problem you solve* without scrolling. "I design and build digital experiences" fails this test — it tells a restaurant owner nothing.
- **No generic virtue blocks.** "Clean code, thoughtful design, problem solver" appears on thousands of developer portfolios and signals nothing. If a three-column block earns its place, fill it with specifics: what you actually build, who for, what changed as a result.
- No superlatives, no "cutting-edge," no "passionate about."
- **Never invent** client names, testimonials, review counts, years of experience, or project results. If a number isn't known, leave it out and flag a TODO. Fabricated social proof is the fastest way to lose a real client.
- Publish only prices the owner has confirmed.
- Roblox pages may use technical language — there it builds credibility. Everywhere else, plain language wins.

---

## 12. Quality floor

Every page ships with:
- Keyboard navigation with **explicit, high-contrast focus states** — default browser rings are invisible on dark. Verify by tabbing, not by reading the code.
- Semantic HTML: headings in order, real buttons, real links, labels tied to inputs
- Alt text on every image, including project art
- Responsive from 320px
- WCAG AA contrast on every text/background pair, `--text-muted` on `--surface` especially
- Per-page `metadata`: title, description, Open Graph
- `next/image` for all images, verified under `npm run preview` — the Cloudflare images binding means optimization doesn't work by default the way it would on Vercel

### Performance budget

This design is image-heavy and dark, which makes performance harder. Non-negotiable:

- **Lighthouse performance ≥ 90 on mobile.** If a visual choice can't hold that, the visual choice loses.
- Hero image: WebP or AVIF, responsive `sizes`, `priority` set. It is the LCP element — treat it as one.
- Project cover art: lazy-loaded below the fold, correctly sized. Never ship a 2000px PNG scaled down in CSS.
- Total homepage image payload target: **under 600 KB**. Report the actual number after building the home page.
- No more than two web font weights per family. Subset where possible.

### SEO

- **Confirm `robots` is not set to `noindex`.** The pre-redesign site shipped `noindex, nofollow`, making it invisible to search. Verify in the built output, not just the source.
- Each service page targets a plain-language phrase a real person would search.
- Include location terms on Local Tech Help — that service is geographically bound.
- Ship `sitemap.ts` and `robots.ts`. Add LocalBusiness structured data.

---

## 13. Git workflow and deployment

```
feature branch → npm run dev → npm run preview
              → commit + push → PR (CI: lint, typecheck, build)
              → merge to main → GitHub Actions → wrangler deploy → live
```

- Branches: `feat/theme-tokens`, `fix/mobile-nav`, `content/parser-case-study`
- Never commit directly to `main`. `main` is production.
- Commit messages: imperative and specific.
- One concern per PR. A PR that adds a feature and restyles the footer is two PRs.
- `.env.local`, `.open-next/`, `.wrangler/` stay gitignored. If a secret is committed, rotate it — don't just delete the line.
- Deploy runs from GitHub Actions on merge to `main`. `CLOUDFLARE_API_TOKEN` scoped to Workers deploy only.
- Broken production: `wrangler rollback` first, diagnose after.

---

## 14. Working agreement for Claude

**Do:**
- Explain *why*, not just what. The owner is building professional practice, not collecting snippets.
- State tradeoffs plainly, including when the simpler option beats the requested one.
- Push back on ideas that are overbuilt, hard to maintain solo, or unlikely to convert.
- Build reusable pieces. This site is a template for future client work.
- Propose visual direction in a sentence or two and wait for sign-off before building a new section.
- Flag when a change would convert a static page into a dynamic one.
- Flag when a visual choice threatens the performance budget **before** building it.

**Don't:**
- Remove or weaken the triage widget, or drop Services from the nav.
- Rewire the form delivery pipeline.
- Assume Vercel. No `@vercel/*`, no Vercel env var names, no `runtime = "edge"`.
- Reach for KV, D1, R2, or Durable Objects. A portfolio with a contact form needs none of them.
- Add a CMS, auth, analytics dashboard, or blog engine unless asked.
- Hardcode colours instead of using tokens.
- Add theme-switching logic, `dark:` variants, or a `data-theme` attribute. The site is dark only by decision, not by default.
- Refactor unrelated files while implementing a feature.
- Invent content, credentials, or results.
- Leave `console.log` or commented-out code in a PR.

---

## 15. Redesign build order

The site is live and working. **This is a restyle of a functioning site, not a rebuild.** Do not delete working pages to start fresh.

0. Dark-only tokens and fonts; remove the existing theme toggle and any light-theme code — ship with existing layout intact
1. Navbar + Footer restyle (Services returns to nav, toggle gone)
2. Home: hero, then triage widget restyle, then featured work grid
3. Services index + detail template
4. Portfolio index + case study template
5. Contact page restyle — **form logic and delivery untouched**
6. About
7. Performance and accessibility pass; confirm indexing is on

Ship each phase as its own PR. The site stays live and coherent throughout — no phase leaves it half-styled in production.

---

## 16. Open decisions

Flag rather than deciding:

- [ ] Heading and body typefaces — final choice
- [ ] "Work" vs "Portfolio" as the nav label (mockup says Work, current site says Portfolio; pick one, use it everywhere)
- [ ] What replaces the generic three-virtue block on the home page
- [ ] Real before/after metrics for the Restaurant Sales Parser
- [ ] Whether starting prices are published or quote-only
- [ ] Service area wording for Local Tech Help — remote, local, or both
