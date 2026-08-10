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
| Hosting | Vercel |
| Domain | Custom `.ca` / `.com` (pending) |

**Rules:**
- No new dependencies without justification. State the tradeoff before adding one. A 40 KB animation library for one fade is a bad trade.
- No CSS-in-JS, no styled-components, no UI kit. Tailwind only.
- Server Components by default. Add `"use client"` only where interactivity actually requires it (forms, the triage widget, mobile nav).
- No database until there's a reason for one. Content lives in typed files under `src/data/`.

---

## 4. Commands

```bash
npm run dev      # local dev server
npm run build    # production build — must pass before any PR
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

`npm run build` and `npx tsc --noEmit` must both pass before opening a PR. No exceptions.

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
- Handle submission through a Next.js Route Handler or Server Action. **Never put an API key, form endpoint secret, or email credential in client-side code.** All secrets go in Vercel environment variables and are read server-side only.
- Add a honeypot field and basic rate limiting. This form will get spam.

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
- `next/image` for all images; no raw `<img>`
- Per-page `metadata` export: title, description, Open Graph tags

**SEO:** each service page targets a plain-language phrase a real person would search, not a job title. Include location terms on the Local Tech Help page since that service is geographically bound. Ship `sitemap.ts` and `robots.ts`. Add LocalBusiness structured data once the domain and business details are settled.

---

## 12. Git workflow

```
feature branch → build → test in Codespace → commit + push
              → GitHub PR → merge to main → Vercel auto-deploys
```

- Branch names: `feat/quote-form`, `fix/mobile-nav`, `content/restaurant-parser-case-study`
- Never commit directly to `main`. `main` is production.
- Commit messages: imperative and specific. `Add triage widget to home page`, not `updates`.
- One concern per PR. A PR that adds a feature and restyles the footer is two PRs.
- PR description states what changed and how to verify it.
- `.env.local` is gitignored and stays that way. If a secret is ever committed, rotate it — do not just delete the line.

---

## 13. Working agreement for Claude

**Do:**
- Explain *why* an approach was chosen, not just what the code does. The owner is leveling up toward professional practice, not collecting snippets.
- State tradeoffs plainly, including when the simpler option is better than the one requested.
- Push back on ideas that are overbuilt, hard to maintain solo, or unlikely to convert. Honest feedback is more useful than agreement.
- Build reusable pieces. This site is a template for future client sites — anything hardcoded here is work repeated later.
- Ask before making decisions the owner hasn't made: pricing, real client names, business address, phone number, legal/business-name details.

**Don't:**
- Add a CMS, auth, analytics dashboard, blog engine, or database unless explicitly asked.
- Refactor unrelated files while implementing a feature.
- Invent content, credentials, or results.
- Ship a component without a mobile layout.
- Leave `console.log` or commented-out code in a PR.

---

## 14. Build order

1. Layout shell — Navbar, Footer, typography scale, Tailwind theme tokens
2. Home — hero + triage widget + brief social proof strip
3. `services.ts` + the dynamic service page template
4. `projects.ts` + portfolio index and case study template — Restaurant Sales Parser first
5. Quote form with working delivery to the owner's inbox
6. About
7. SEO pass — metadata, sitemap, OG images
8. Domain + analytics

Ship 1–5 before polishing anything. A live site with a working form beats a beautiful unfinished one.

---

## 15. Open decisions

Flag these to the owner rather than deciding unilaterally:

- [ ] Business/display name and logo
- [ ] Domain (`.ca` vs `.com`)
- [ ] Contact email and whether a phone number is published
- [ ] Form delivery method (email service vs form backend)
- [ ] Service area for Local Tech Help — remote, local, or both
- [ ] Whether starting prices are published or quote-only
- [ ] Real metrics for the Restaurant Sales Parser case study
- [ ] Whether Fuse Factory can be named publicly
