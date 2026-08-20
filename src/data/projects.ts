import type { Project, ServiceSlug } from "@/lib/types";

/**
 * Portfolio case studies (CLAUDE.md §6, §14 step 4). Drives /portfolio and
 * /portfolio/[slug] — adding a project here is the only change either page
 * needs. Display order is array order (§6/§14 — the index has no separate
 * sort), currently owner-chosen: This Website, Fuse Factory, OrangeCheasy,
 * Restaurant Sales Parser, then the rest.
 *
 * Restaurant Sales Parser is the flagship proof (§6). Fuse Factory was added
 * once the owner cleared it to be named publicly (§15) — it is a personal
 * project, not commissioned client work, so `problem`/`solution` describe the
 * design goal and what's been built rather than a client engagement, and
 * `result`/`images` are omitted rather than invented (§10). Excel Performance
 * Dashboard is still absent, same reason it always was: no owner input yet.
 *
 * Computer Builds & Repairs, Echo Realms, and This Website were added the
 * same way: real work, no invented numbers. Computer Builds & Repairs isn't a
 * single client engagement or a passion project — it's a running total
 * across many people (friends, family, and paying clients), so `client` is
 * omitted and `result` reports the one confirmed count (11 builds) rather
 * than a narrative outcome. Echo Realms is a personal project, technically
 * playable but light on content and currently on hold. This Website is the
 * site itself — no external client, but unlike the others it's `featured`
 * since it's a live example of the work sitting in front of the visitor.
 *
 * TODO(owner): the individual-project-page template (2026-08-20) added six
 * optional fields — `overview`, `whatIBuilt`, `features`, `role`, `year`,
 * `sourceUrl` — and only This Website has them filled in (lifted from
 * individual-project-page-mockup.png). Every project below renders fine
 * without them (each section hides itself when its field is unset), but the
 * Overview/What I Built/Key Features/Project Details columns stay thin on
 * the other five until real copy is written for them.
 */
export const projects: Project[] = [
  {
    slug: "this-website",
    title: "This Website",
    // client: omitted — this is the owner's own business site.
    services: ["websites"],
    // TODO(owner): a real cover would be a screenshot of the home page hero.
    // Left as a tile deliberately for now — a screenshot of the site the
    // visitor is currently looking at is the weakest image on the grid, and
    // it would date itself every time the home page is restyled.
    cover: { kind: "tile" },
    summary:
      "The website for my portfolio and business — a live example of the same kind of build offered to clients: a data-driven services and portfolio system on a fast, low-cost stack.",
    problem:
      "The business needed a site that gets a visitor to the right service quickly, ends every page with a path to the quote form, and doubles as a portfolio for both prospective clients and potential employers — without needing a new page written by hand every time a service or project is added.",
    solution:
      "Built with Next.js (App Router) and TypeScript, deployed to Cloudflare Workers rather than a paid platform to keep hosting costs at effectively zero for a low-traffic marketing site. Services and portfolio case studies are generated from typed data files, so adding one is a data change, not a new page.",
    // overview/whatIBuilt/features/role/year: verbatim from
    // individual-project-page-mockup.png, which is owner-authored copy for
    // this specific project — not template filler (see the page's file
    // comment). Every other project below leaves these unset until the owner
    // writes real copy for it.
    overview:
      "This site is my personal portfolio and business platform, built to showcase my work and the services I offer. It's fast, SEO-friendly, and designed to convert visitors into leads through a clear user journey and integrated quote form.",
    whatIBuilt: [
      "Fully custom Next.js site with App Router",
      "TypeScript for type safety and scalability",
      "Tailwind CSS for styling and responsive design",
      "Deployed on Cloudflare Workers for low-cost, high-performance hosting",
      "Data-driven project system from typed content files",
    ],
    features: [
      {
        icon: "bolt",
        title: "Fast & Lightweight",
        description:
          "Optimized for performance with minimal bundle size and edge deployment.",
      },
      {
        icon: "layers",
        title: "Scalable Content",
        description:
          "Projects and services are generated from typed data files for easy updates.",
      },
      {
        icon: "target",
        title: "Lead Focused",
        description:
          "Built-in quote form and clear CTAs guide visitors to take action.",
      },
    ],
    role: "Design, Development, Deployment",
    year: "2025",
    // sourceUrl: omitted — the repo is private (see the root README's
    // license notice), so there's no public link to send "View Source" to.
    //
    // externalLink (doubles as the "Live Site" button on this template, and
    // feeds the sidebar's Link row) — the real domain, owner-confirmed
    // 2026-08-20, superseding the earlier note here about the mockup's
    // ephemeral Codespaces preview URL.
    externalLink: { href: "https://liamthemo.com", label: "Live Site" },
    //
    // result: intentionally omitted (§10) — the site isn't launched with
    // real traffic yet, so there's no conversion number to report.
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare Workers"],
    // TODO(owner): before/after screenshots for the Screenshots carousel —
    // flagged in chat 2026-08-20, not yet supplied. Add real captures here
    // when ready; do not invent placeholder images (§11).
    //
    // featured: false — CLAUDE.md §15 Phase 2's approved mockup shows a
    // specific three: Fuse Factory, OrangeCheasy, Restaurant Sales Parser.
    // This site is real work, but it isn't image-led the way the mockup's
    // grid needs (no `images`, and a screenshot of the site the visitor is
    // already on doesn't demonstrate anything). Flipped in favour of the
    // mockup's picks rather than adding a fourth featured card.
    featured: false,
  },
  {
    slug: "fuse-factory",
    title: "Fuse Factory",
    // client: omitted — this is a personal project, not commissioned work.
    services: ["roblox"],
    // The game's official Roblox thumbnail, not a gameplay screenshot. Used
    // as the cover because §9 prefers a real image over the fallback tile;
    // real gameplay screenshots are planned but not taken yet, and when they
    // arrive they belong in `images` rather than replacing this.
    cover: {
      kind: "image",
      src: "/portfolio/fuse-factory/thumbnail.webp",
      alt: "Fuse Factory game thumbnail: the game logo above three cube-shaped Boomie characters with lit fuses, in a factory setting with colored crates.",
    },
    summary:
      "A Roblox game in active development, inspired by a Super Mario Bros. DS mini-game where players sort bob-ombs before they go off — reworked into its own standalone, round-based game.",
    problem:
      "The mini-game it's inspired by only exists as a few minutes inside a much bigger game. There's no standalone version of just that loop: things spawning faster and faster while you sort them correctly before time runs out.",
    solution:
      "The codebase is modular — spawning, movement, UI, and item drops are separate systems rather than one script — and runs on an event-driven architecture handled on both the server and the client. The UI is built in code rather than laid out in Studio's editor. Boomies spawn and currently move randomly rather than toward the player; pattern-based movement AI is planned but not built yet. Drops use a weighted system rather than flat odds, the spawn rate ramps up as each round progresses, and players earn coins for handling boomies correctly.",
    // result / metrics: intentionally omitted (§10) — this is a passion
    // project, not a client engagement, so there's no client outcome to
    // report. Still in development; most of the basic gameplay above is
    // built, but the game isn't finished. Pattern-based movement AI for
    // boomies is explicitly a planned feature, not a built one — do not
    // reword `solution` to imply it already exists.
    stack: ["Luau"],
    // TODO(owner): confirm whether coins/progress persist via DataStore once
    // settled, and name any other tools/services worth calling out here.
    //
    // images: intentionally omitted. The store thumbnail is the `cover` above
    // and nothing else exists yet — repeating it under "See it in action"
    // would promise gameplay and deliver the same marketing art. Add real
    // gameplay screenshots here when they're taken; the cover stays as it is.
    // featured: true — one of the mockup's three home-page picks (§15 Phase 2).
    featured: true,
  },
  {
    slug: "orangecheasy-youtube",
    title: "OrangeCheasy (YouTube)",
    // client: omitted — the owner's own channel, not a client engagement.
    // services: intentionally empty — video editing and channel growth
    // aren't sellable service lines here, so this doesn't get a service chip
    // (§ notes in src/lib/types.ts on `services`/`skills`).
    services: [],
    skills: ["Video Editing", "Social Media Growth"],
    summary:
      "Video editing and channel growth for the OrangeCheasy YouTube channel — grew from 300 to 2,000 subscribers in 3 months.",
    problem:
      "The channel had a small, stagnant subscriber base and needed a consistent stream of well-edited video content to grow.",
    solution:
      "Edited and published videos using DaVinci Resolve and CapCut on a consistent upload schedule.",
    result: "Grew from 300 to 2,000 subscribers in 3 months.",
    metrics: [
      { label: "Subscribers (start)", value: "300" },
      { label: "Subscribers (3 months)", value: "2,000" },
    ],
    stack: ["DaVinci Resolve", "CapCut"],
    externalLink: {
      href: "https://youtube.com/orangecheasy",
      label: "Watch the channel",
    },
    icon: "🎬",
    // avatar sits next to the title instead of in the gallery below.
    avatar: {
      src: "/portfolio/youtube/profile.webp",
      alt: "OrangeCheasy YouTube channel profile picture, a cartoon wedge of cheese.",
    },
    // The channel banner. Already a 1536x1024 (3:2) crop matching the
    // studio-standard size, so it needs no width/height override and no
    // non-default `fit`.
    cover: {
      kind: "image",
      src: "/portfolio/youtube/banner.webp",
      alt: "OrangeCheasy YouTube channel banner artwork: pixel-art logo text over a sunset city skyline with cartoon cheese wedges scattered across it.",
    },
    // The gallery no longer repeats the banner — that's the cover now. What's
    // left is the one image that shows something the cover doesn't: the real
    // channel page and its subscriber count, which is the proof behind
    // `result`.
    //
    // width/height are the asset's true dimensions. They previously read
    // 2244x1984 against a real 2732x1934 source, which stretched the image on
    // the page; the file has since been re-encoded to 1600x1133 (it was a
    // JPEG misnamed .webp) and these match it.
    images: [
      {
        src: "/portfolio/youtube/channel.webp",
        alt: "The OrangeCheasy YouTube channel page, showing 2.06k subscribers and the video grid.",
        width: 1600,
        height: 1133,
      },
    ],
    // featured: true — one of the mockup's three home-page picks (§15 Phase 2).
    featured: true,
  },
  {
    slug: "restaurant-sales-parser",
    title: "Restaurant Sales Parser",
    // client: omitted. No restaurant name has been cleared for public use.
    services: ["automation", "excel-data"],
    summary:
      "Turns a restaurant's raw weekly sales export into a finished report automatically, with nobody retyping a number.",
    problem:
      "Every week, someone had to take the restaurant's raw sales data and manually turn it into a usable report — a repetitive, error-prone task that ate into time better spent running the restaurant.",
    // TODO(owner): sharpen this once confirmed — what system the raw export
    // actually comes from (POS export? spreadsheet download?), and what the
    // manual process looked like before: which numbers got retyped where, into
    // what, and by whom.
    solution:
      "A script reads the raw export and produces the finished report automatically — no manual retyping, no copy-paste between spreadsheets, no formulas to remember to update by hand.",
    // TODO(owner): name the actual report(s) it produces once confirmed.
    //
    // TODO(owner): REAL BEFORE/AFTER METRICS — CLAUDE.md §16's open decision,
    // still open. This is the flagship case study (§6: "lead with time saved
    // per week"), and it is the one project on the site whose result section
    // is missing the number that would sell it.
    //
    // `result` and `metrics` are both omitted rather than estimated. §11
    // forbids inventing a result, and a plausible-sounding figure is the
    // failure mode that rule exists to prevent: "cuts a two-hour job to five
    // minutes" reads as fact, cannot be verified by the reader, and is the
    // fastest way to lose a client who asks about it. An absent section
    // costs less than a fabricated one.
    //
    // The page renders "The result" only when `result` is set, so filling
    // these two fields is the whole change — no component edit. What's needed:
    //   result:  one sentence, the outcome in the owner's words.
    //   metrics: the before/after pair, e.g.
    //            { label: "Time per week (before)", value: "..." }
    //            { label: "Time per week (after)",  value: "..." }
    stack: ["Python"],
    // TODO(owner): confirm the rest of the stack (e.g. the library used to read
    // the export, the input file format — .csv vs .xlsx — and what generates
    // the final report).
    // Dark-only site — dark.webp is the sole image, so it serves as both the
    // card cover and the case study's one gallery figure. The retired
    // light.webp variant has been deleted.
    cover: {
      kind: "image",
      src: "/portfolio/restaurant-sales-parser/dark.webp",
      alt: "Diagram showing the parser turning 35 pages of unstructured raw server sales data into a clean weekly summary table with totals per server, broken out by special, food, and drink sales.",
    },
    // images: intentionally omitted. The cover above is the only asset, and
    // the case study renders the cover as its lead image — repeating it in
    // the gallery below would show the same diagram twice on one page.
    featured: true,
  },
  {
    slug: "computer-builds-and-repairs",
    title: "Computer Builds & Repairs",
    // client: omitted — many different people over time, not one client.
    services: ["local-tech-help"],
    // TODO(owner): a photo of a finished build would be the single highest-value
    // image on the site — this is the only proof Local Tech Help has, and it's
    // the service most likely to be found by a local search. A phone photo of
    // one completed machine is enough; it does not need to be studio work.
    cover: { kind: "tile" },
    summary:
      "11 custom-built desktops and a running list of hardware and software repairs for friends, family, and paying clients.",
    problem:
      "People kept showing up with computers that had died, slowed down for no obvious reason, or needed a machine built for what they actually do — repairs not worth a shop's time, and off-the-shelf builds that didn't fit their budget or workload.",
    solution:
      "Built desktops from parts chosen for each person's budget and workload, and diagnosed and fixed a steady stream of hardware and software faults: failed components, boot failures, unexplained slowdowns, and the usual list of things that go wrong with a computer over a few years. Some of this was paid work, some was for friends and family.",
    // result: a real, owner-confirmed count rather than an invented outcome
    // (§10) — there's no single client story here, just a running total.
    result:
      "11 desktops built to date, plus an ongoing stream of repairs and upgrades.",
    metrics: [{ label: "Computers built", value: "11" }],
    stack: ["PC hardware", "BIOS configuration", "Software", "Windows troubleshooting"],
    // images: intentionally omitted — no photos on hand yet (§9 prefers a
    // real screenshot over no image; same applies to build photos).
    featured: false,
  },
  {
    slug: "echo-realms",
    title: "Echo Realms",
    // client: omitted — this is a personal project, not commissioned work.
    services: ["roblox"],
    // TODO(owner): one screenshot of a dungeon room or a boss encounter would
    // promote this to an image cover. The project is on hold, so this is low
    // priority — the tile is not blocking anything.
    cover: { kind: "tile" },
    summary:
      "A Roblox dungeon crawler built around modular, reusable systems — enemy AI with telegraphed attacks, zone-based spawning, phased bosses, and weighted loot.",
    problem:
      "Wanted a dungeon crawler where the systems underneath — enemy AI, spawning, bosses, loot — are built to be reused and extended rather than one-off scripts per encounter, and where combat is readable: a player should be able to see an attack coming and react to it, not just get hit.",
    solution:
      "The codebase is modular so enemy behaviors, spawning, and loot logic can be reused across different enemies and areas rather than rewritten each time. Enemy AI telegraphs its attacks so players can read and react before they land. Enemies spawn based on the zone the player is in rather than flat random spawning, bosses are built as distinct phases rather than one flat health bar, and loot uses a weighted table instead of flat drop odds.",
    // result / metrics: intentionally omitted (§10) — personal project, no
    // client outcome. Technically playable, but light on content and
    // currently on hold — a game at this scope is hard to build solo. Do not
    // reword `solution` to imply it's a finished, content-complete game.
    stack: ["Luau"],
    // images: intentionally omitted — no screenshots yet.
    featured: false,
  },
];

/**
 * Every project that demonstrates a given service, in `projects` order.
 *
 * This is the reverse half of the cross-linking loop. `Project.services` is
 * the single source of truth in both directions: a case study reads it
 * directly to link out to the services it demonstrates, and a service page
 * reads it through this function to list its related work. One field, so the
 * two lists cannot disagree — add "roblox" to a project and it appears on the
 * Roblox page with no second edit.
 *
 * NOT `Service.relatedProjects`, which is the field that would otherwise do
 * this job. That field is a hand-maintained list of slugs written before
 * projects.ts existed, and it has already drifted: `excel-data` still points
 * at "excel-performance-dashboard", a project that has never existed, and
 * neither "orangecheasy-youtube" nor a second automation project would appear
 * on any service page without someone remembering to add it in two places.
 * A derived list cannot drift.
 *
 * TODO(owner): `Service.relatedProjects` is now dead data — nothing reads it.
 * Removing it is a §6 shape change touching all five service entries, so it
 * is left for its own PR (§13: one concern per PR) rather than folded into
 * the R4 restyle. Flagging rather than deciding (§16).
 */
export function projectsForService(slug: ServiceSlug): Project[] {
  return projects.filter((project) => project.services.includes(slug));
}
