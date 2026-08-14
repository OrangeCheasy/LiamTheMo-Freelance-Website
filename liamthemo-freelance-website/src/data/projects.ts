import type { Project } from "@/lib/types";

/**
 * Portfolio case studies (CLAUDE.md §6, §14 step 4). Drives /portfolio and
 * /portfolio/[slug] — adding a project here is the only change either page
 * needs.
 *
 * Restaurant Sales Parser is the flagship proof (§6). Fuse Factory was added
 * once the owner cleared it to be named publicly (§15) — it is a personal
 * project, not commissioned client work, so `problem`/`solution` describe the
 * design goal and what's been built rather than a client engagement, and
 * `result`/`images` are omitted rather than invented (§10). Excel Performance
 * Dashboard is still absent, same reason it always was: no owner input yet.
 */
export const projects: Project[] = [
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
];
