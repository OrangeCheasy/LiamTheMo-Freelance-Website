import type { Project } from "@/lib/types";

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
 */
export const projects: Project[] = [
  {
    slug: "this-website",
    title: "This website",
    // client: omitted — this is the owner's own business site.
    services: ["websites"],
    summary:
      "The website for my portfolio and business — a live example of the same kind of build offered to clients: a data-driven services and portfolio system on a fast, low-cost stack.",
    problem:
      "The business needed a site that gets a visitor to the right service quickly, ends every page with a path to the quote form, and doubles as a portfolio for both prospective clients and potential employers — without needing a new page written by hand every time a service or project is added.",
    solution:
      "Built with Next.js (App Router) and TypeScript, deployed to Cloudflare Workers rather than a paid platform to keep hosting costs at effectively zero for a low-traffic marketing site. Services and portfolio case studies are generated from typed data files, so adding one is a data change, not a new page. Includes a light/dark theme toggle, and a triage widget on the home page that routes a visitor straight to the right service based on the problem they describe.",
    // result: intentionally omitted (§10) — the site isn't launched with
    // real traffic yet, so there's no conversion number to report.
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare Workers"],
    // images: intentionally omitted — no screenshots needed; the visitor is
    // already looking at it.
    featured: true,
  },
  {
    slug: "fuse-factory",
    title: "Fuse Factory",
    // client: omitted — this is a personal project, not commissioned work.
    services: ["roblox"],
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
    // images: intentionally omitted — no screenshots yet since the game is
    // still in development. Add real screenshots here once there's something
    // worth showing (§9 prefers a real screenshot over no image).
    featured: false,
  },
  {
    slug: "orangecheasy-youtube",
    title: "OrangeCheasy (YouTube)",
    // client: omitted — the owner's own channel, not a client engagement.
    // services: intentionally empty — video editing and channel growth
    // aren't sellable service lines here, so this doesn't get a service chip
    // (§ notes in src/lib/types.ts on `services`/`skills`).
    services: [],
    skills: ["Video editing", "Social media growth"],
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
    // images[0] drives the portfolio card thumbnail (ProjectCard reads
    // images[0]) — the banner goes first on purpose. It's already a 1536x1024
    // (3:2) crop, matching the studio-standard size, so it needs no
    // width/height override or a non-default `fit`.
    images: [
      {
        src: "/portfolio/youtube/banner.webp",
        alt: "OrangeCheasy YouTube channel banner artwork: pixel-art logo text over a sunset city skyline with cartoon cheese wedges scattered across it.",
      },
      {
        src: "/portfolio/youtube/channel.webp",
        alt: "The OrangeCheasy YouTube channel page, showing 2.06k subscribers and the video grid.",
        width: 2244,
        height: 1984,
      },
    ],
    featured: false,
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
    // result: intentionally omitted. CLAUDE.md §10 forbids inventing a number,
    // and this is the flagship case study — it should lead with the real time
    // saved per week and the manual step it eliminated once known. Fill in
    // `result` (narrative) and `metrics` (before/after callouts) with the real
    // figures; the page shows the result section only when `result` is set.
    stack: ["Python"],
    // TODO(owner): confirm the rest of the stack (e.g. the library used to read
    // the export, the input file format — .csv vs .xlsx — and what generates
    // the final report).
    images: [
      {
        src: "/portfolio/restaurant-sales-parser/light.webp",
        srcDark: "/portfolio/restaurant-sales-parser/dark.webp",
        alt: "Diagram showing the parser turning 35 pages of unstructured raw server sales data into a clean weekly summary table with totals per server, broken out by special, food, and drink sales.",
      },
    ],
    featured: true,
  },
  {
    slug: "computer-builds-and-repairs",
    title: "Computer builds & repairs",
    // client: omitted — many different people over time, not one client.
    services: ["local-tech-help"],
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
