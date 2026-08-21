# LiamTheMo-Website

Freelance services website for Liam Mo — a lead-generation site for a solo freelance practice.

> I build tools that save you time.
> Custom automation, spreadsheets, websites, and technology solutions for individuals and small
> businesses.

Every page exists to move a visitor toward one action: submitting the quote form.

## Services covered

| Service line | What's sold |
|---|---|
| Automation & Python | Scripts, repetitive-task automation, data parsing, CSV/PDF processing, API and integration work |
| Excel & Data | Custom spreadsheets, automated reports, dashboards, trackers, data cleanup |
| Websites | Small-business sites, landing pages, portfolio sites, ongoing maintenance |
| Local Tech Help | Computer setup, Windows and software troubleshooting, printers, Wi-Fi, backups |
| Roblox Development | Luau scripting, gameplay and UI systems, DataStore systems, bug fixes, optimization |

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS v4 |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` |
| Deploy | Wrangler + GitHub Actions, on merge to `main` |
| Domain | `liamthemo.com` (Cloudflare DNS, not yet attached) |

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Requires Node.js 22 or newer.

## Documentation

| File | What's in it |
|---|---|
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Cloudflare setup, commands, environment variables, custom domain, gotchas |
| [`TODO.md`](./TODO.md) | Outstanding setup steps, build order progress, open decisions |

## License

Copyright © 2026 Liam Mo. All rights reserved.

This repository and its contents are proprietary and confidential. Unauthorized copying,
modification, distribution, or use of this source code via any medium is strictly prohibited.
