import type { Project } from "@/lib/types";

/**
 * Portfolio case studies (CLAUDE.md §6, §14 step 4). Drives /portfolio and
 * /portfolio/[slug] — adding a project here is the only change either page
 * needs.
 *
 * Restaurant Sales Parser is the only entry so far, on purpose: it is the
 * flagship proof (§6) and the instruction is to get it right before adding
 * Excel Performance Dashboard or Fuse Factory.
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
    // images: intentionally omitted — no screenshots yet. §9 prefers a real
    // screenshot over any illustration; add here once available.
    featured: true,
  },
];
