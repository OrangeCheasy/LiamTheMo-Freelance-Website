# TODO

Outstanding actions, build order progress, and open decisions.

How-to lives in [`DEPLOYMENT.md`](./DEPLOYMENT.md) — this file tracks *what* is left, not *how*.

---

## Do now — step 1, the layout shell

See the build order below.

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
- [ ] **1. Layout shell** — Navbar, Footer, typography scale, Tailwind theme tokens
- [ ] **2. Home** — hero, triage widget, social proof strip
- [ ] **3. `services.ts`** + dynamic service page template
- [ ] **4. `projects.ts`** + portfolio index and case study template (Restaurant Sales Parser first)
- [ ] **5. Quote form** with working delivery to the owner's inbox
- [ ] **6. About**
- [ ] **7. SEO pass** — metadata, sitemap, OG images
- [ ] **8. Custom domain** + WAF rate-limiting rule on the form endpoint + analytics
  - See [`DEPLOYMENT.md` §6](./DEPLOYMENT.md#6-custom-domain--liamthemocom) — check for conflicting
    DNS records on the apex and `www` before attaching

---

## Open decisions

From CLAUDE.md §15. These are the owner's calls, not Claude's.

- [x] ~~Domain~~ — `liamthemo.com`, already on Cloudflare DNS
- [x] ~~Worker name~~ — `liamthemo`
- [ ] Business / display name and logo
- [ ] Contact email, and whether a phone number is published
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
- [ ] `src/app/page.tsx` is still the create-next-app default, including Vercel deploy links
