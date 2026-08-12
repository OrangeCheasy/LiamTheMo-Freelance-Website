# Deployment and Cloudflare setup

Everything needed to build, preview, and deploy this site. For outstanding actions and decisions,
see [`TODO.md`](./TODO.md). For project scope and conventions, see [`CLAUDE.md`](./CLAUDE.md).

> **Status:** build order step 0 — deploy pipeline. The Cloudflare config files
> (`wrangler.jsonc`, `open-next.config.ts`) and the GitHub Actions workflow are **not written
> yet**. The manual account setup in section 2 can be done now and is a prerequisite for the first
> deploy.

---

## 1. Prerequisites

| Requirement | Why |
|---|---|
| **Node.js 22 or newer** | `wrangler@4` declares `"engines": { "node": ">=22" }`. Node 20 fails at install or at first run. |
| **npm** | The repo commits `package-lock.json`. Do not mix in pnpm or yarn — it breaks OpenNext builds in confusing ways (CLAUDE.md §4). |
| **A Cloudflare account** | Free plan is sufficient. |

Check your version before anything else:

```bash
node --version   # must be >= 22
```

Codespaces does not always default to Node 22. If it is older, `nvm install 22 && nvm use 22`.

---

## 2. One-time Cloudflare setup

Four steps, roughly ten minutes. Nothing deploys until all four are done. Tracked as a checklist in
[`TODO.md`](./TODO.md).

### 2.1 Pick your `workers.dev` subdomain

Cloudflare dashboard: **Workers & Pages → Subdomain**.

This is set **once per account** and is not easily changed afterward. It is the account's namespace,
not this site's name — every Worker in the account is served at
`<worker-name>.<account-subdomain>.workers.dev`.

This account's subdomain is **`orangecheasy`**, and the Worker is named `liamthemo`
(`wrangler.jsonc`), so the site's temporary URL is:

```
https://liamthemo.orangecheasy.workers.dev
```

This has nothing to do with `liamthemo.com`, which is attached separately in §6. Renaming the
subdomain is not worth doing — §6 turns the `workers.dev` URL off entirely once the custom domain
is live.

Only needed if you have never used Workers on this account.

### 2.2 Copy your Account ID

**Workers & Pages → Overview**, right-hand sidebar. A 32-character hex string.

This is an identifier, not a credential — but it still belongs in GitHub secrets rather than in the
repo, because there is no reason to publish your account identifier.

### 2.3 Create a scoped API token

**My Profile → API Tokens → Create Token**.

- Use the **Edit Cloudflare Workers** permission policy.
- Scope **Account Resources** to your account only.
- Scope **Zone Resources** to `liamthemo.com` only — needed later for the custom domain, harmless
  now, and setting it now avoids reissuing the token at step 8.

**Do not use a Global API Key.** It authenticates as your entire account with no scope limit and
cannot be revoked without breaking everything else that uses it. A scoped token can be deleted and
reissued in isolation. CLAUDE.md §12 requires the scoped token.

**Copy the token immediately.** Cloudflare shows it exactly once. If you lose it, delete the token
and create a new one — there is no way to view it again.

### 2.4 Add both values as GitHub repository secrets

GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**.

| Secret name | Value | From |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | the token string | step 2.3 |
| `CLOUDFLARE_ACCOUNT_ID` | the 32-char hex ID | step 2.2 |

Names must match exactly — the workflow reads them by these names.

Use **Secrets**, not **Variables**. Variables are readable in plain text by anyone with repo access
and are printed in logs. Secrets are masked.

---

## 3. Commands

```bash
npm install        # once, and after any dependency change

npm run dev        # everyday work — Next.js dev server on localhost:3000
npm run build      # next build — must pass before any PR
npm run lint       # eslint
npx tsc --noEmit   # typecheck — must pass before any PR

npm run preview    # builds and runs the REAL Worker locally in workerd
npm run deploy     # builds and deploys to production (CI does this; rarely run by hand)
npm run cf-typegen # regenerate cloudflare-env.d.ts from wrangler.jsonc
```

### Which one to run, when

- **Changing a page, a component, styling, copy?** `npm run dev` is enough. Then `npm run build`
  and `npx tsc --noEmit` before opening the PR.
- **Touching a route handler, server action, middleware, or an environment variable?**
  `npm run preview` is **required** before the PR (CLAUDE.md §4).

  This is the single most important habit in this stack. `next dev` runs on Node.js. Production
  runs on `workerd`, Cloudflare's runtime. They are not the same. Code that reads an environment
  variable, uses a Node built-in, or depends on request handling behaviour can pass in `dev` and
  fail in production. `npm run preview` runs the actual Worker bundle locally, so it catches this
  before deploy rather than after.
- **Changed `wrangler.jsonc`?** Run `npm run cf-typegen` and commit the regenerated
  `cloudflare-env.d.ts`, otherwise the typecheck sees stale binding types.

Never hand-edit anything in `.open-next/`. It is generated. Fix the source or the config.

---

## 4. Environment variables

Cloudflare splits build-time and runtime variables. Getting this wrong is the most common OpenNext
deployment failure (CLAUDE.md §4.3).

| | Build-time | Runtime |
|---|---|---|
| **What** | Anything `NEXT_PUBLIC_*`, anything read during `next build` | Secrets used by server code at request time — form delivery keys, API tokens |
| **Where it lives** | GitHub Actions secrets/variables, declared in the workflow's `env:` | Wrangler secrets: `wrangler secret put NAME` |
| **Local equivalent** | `.env.local` | `.dev.vars` |
| **Visible to the browser?** | `NEXT_PUBLIC_*` — **yes, always** | No |

**The rule:** if the value is needed to *produce* the bundle, it is build-time. If it is needed to
*serve a request*, it is runtime.

**`NEXT_PUBLIC_*` is compiled into the client bundle and is public.** Anyone can read it with view
source. Never put a key there — not an API key, not a webhook URL, not a form endpoint secret.

**The failure this causes:** a build fails with an undefined variable that "definitely exists in
Cloudflare." It was set as a Worker runtime variable, and the build needed it as a GitHub Actions
one. The build machine and the Worker are different environments and do not share values. Check
that before anything else.

A runtime secret set with `wrangler secret put` is stored on the Worker and is **not** in the repo,
so a fresh clone will not have it. It survives deploys; you set it once per environment.

If a secret is ever committed, **rotate it** — deleting the line does not remove it from git
history (CLAUDE.md §12).

---

## 5. How deploys work

```
feature branch → npm run dev → npm run preview (real Worker runtime)
              → push → PR (CI: lint, typecheck, build)
              → merge to main → Actions: opennextjs-cloudflare build → wrangler deploy → live
```

`main` is production. Never commit to it directly.

There is **no automatic preview URL per PR** the way Vercel provides. That is a real ergonomic loss
and the main thing given up by not paying Vercel. `npm run preview` locally covers most of the gap.
Do not build a staging Worker until one is actually needed (CLAUDE.md §12).

**If a deploy breaks production:** `wrangler rollback` first, diagnose afterward. Rolling back is
seconds; debugging under pressure is not.

---

## 6. Custom domain — `liamthemo.com`

**Not yet.** This is build order step 8. Documented here so it is ready.

### Why wait

The site currently serves an "under construction" placeholder. Attaching `liamthemo.com` to it
means search engines can crawl and index that placeholder as the homepage. Deindexing is slower and
less reliable than never being indexed. Attach the domain once the site has real content —
realistically after step 5, when the quote form works.

Nothing is lost by waiting. The domain sits in the Cloudflare account doing no harm.

### The setup, when you get there

The domain is already on Cloudflare, which removes the hardest part — no nameserver change, no
propagation wait, and the zone is already active.

1. **Check for conflicting DNS records first.** In **DNS → Records** for `liamthemo.com`, look for
   existing records on `liamthemo.com` and `www.liamthemo.com`.

   **You cannot create a Custom Domain on a hostname that already has a CNAME record.** If the
   domain is parked, or was pointed anywhere previously, there is very likely a record on the apex
   or on `www`. Delete it first or the custom domain will fail to attach.

   Leave `MX` and `TXT` records alone. Adding a Worker custom domain does not affect email delivery
   or domain verification records.

2. **Attach the domain.** Workers & Pages → the Worker → **Settings → Domains & Routes → Add →
   Custom Domain**. Cloudflare creates the DNS record and issues the certificate automatically.

3. **Add `www` as a second custom domain.** Apex and `www` are separate hostnames requiring
   separate custom domains — there is no wildcard matching. Pick one as canonical.

4. **Redirect the non-canonical one with a Redirect Rule**, not with a Worker route.
   **Rules → Redirect Rules**, 301 from `www.liamthemo.com` to `liamthemo.com` (or the reverse).

   This matters for cost, not just tidiness. A Redirect Rule runs at Cloudflare's edge and never
   invokes the Worker, so it costs nothing against the 100,000 requests/day cap. Handling the
   redirect inside the Worker would burn a request on every `www` hit (CLAUDE.md §4.1).

5. **Turn off the `workers.dev` URL.** Set `"workers_dev": false` in `wrangler.jsonc` and redeploy.

   Otherwise the identical site is live at both `liamthemo.com` and
   `liamthemo.orangecheasy.workers.dev`. That is duplicate content, and search engines may pick
   the `workers.dev` URL as canonical — the real domain then loses the ranking to a URL you do not
   control. Note that `preview_urls` defaults to whatever `workers_dev` is set to.

### Two things worth knowing

- **Deleting a custom domain does not delete its certificate.** Cloudflare auto-issues an Advanced
  Certificate when the domain is attached but leaves it behind on removal. If the domain is ever
  detached, delete the certificate manually.
- **Declaring the domain in `wrangler.jsonc`** is possible and keeps it version-controlled:

  ```jsonc
  "routes": [{ "pattern": "liamthemo.com", "custom_domain": true }]
  ```

  The tradeoff: the CI token then needs zone-level permissions to create DNS records and
  certificates, which widens what a leaked token can do. Attaching once in the dashboard keeps the
  deploy token narrower. The dashboard is the better call for a one-time change on a single domain.

---

## 7. Cloudflare gotchas

Things that behave differently here than on Vercel, worth understanding rather than working around.

**`next dev` and production are different runtimes.** Node.js versus `workerd`. Covered in
section 3 — it is the source of most surprises. `npm run preview` is the answer.

**Static pages are free; dynamic pages are metered.** A prerendered page is served from the assets
binding and never invokes the Worker. Adding `force-dynamic`, an uncached `fetch`, `cookies()`, or
`headers()` to a page silently converts it from free to metered. The quote form handler should be
the only routine dynamic path on this site (CLAUDE.md §4.1).

**Exceeding the free tier takes the site down, it does not bill you.** 100,000 requests/day,
resetting at 00:00 UTC. Over that, Cloudflare returns error 1027. Predictable rather than
expensive, but a real failure mode. Upgrading is $5/month with no code changes.

**Image optimization needs the `IMAGES` binding.** `next/image` does not optimize on Workers the
way it does on Vercel — it requires the `images` binding declared in `wrangler.jsonc`. Verify
images in `npm run preview`, not just `next dev` (CLAUDE.md §11).

**Never set `export const runtime = "edge"`.** OpenNext targets the Node.js runtime. The Edge
runtime belongs to the older `next-on-pages` adapter, which this project does not use. Most
Cloudflare + Next.js tutorials online are about `next-on-pages` and will actively mislead you here
— check which adapter a tutorial uses before following it.

**Do not add Workers KV, D1, R2, or Durable Objects.** A brochure site with a contact form needs
none of them, and each adds its own free-tier limits to track. The standard OpenNext quickstart
tells you to add an R2 bucket for the incremental cache — that backs ISR and on-demand
revalidation, which a fully prerendered site does not use. Skip it (CLAUDE.md §13).

**Rate limiting belongs in Cloudflare's WAF, not in the Worker.** WAF rules block at the edge
before the Worker is invoked, protecting both the inbox and the daily request cap (CLAUDE.md §8).
