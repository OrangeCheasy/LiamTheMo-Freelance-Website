import LineIcon from "@/components/LineIcon";
import { warmGlowImage } from "@/lib/glow";
import type { LineIconKey } from "@/lib/types";

/*
  The Automation service page's hero artwork (owner mockup, 2026-08-21).

  BUILT AS DOM, NOT SHIPPED AS A PICTURE — the same call the home page's
  HeroArt runs on, for the same reasons and with the same payoff. The mockup
  renders a photographed laptop with a code editor on it and four UI cards
  floating around it; everything here that carries meaning is real text, so it
  stays sharp at any zoom or DPR, recolours with the tokens, and costs zero
  bytes of image payload against §12's budget. A 1500px render of this
  composition would have been the single heaviest asset on the site.

  WHAT IS NOT REPRODUCED: the photographic laptop body. CSS cannot do a
  photoreal machine convincingly, and a bad one costs more than no one. What
  it gets instead is a tilted screen on a trapezoid deck — enough to read as a
  laptop, honest about being a drawing.

  MOBILE PAYS NOTHING. The page renders this `hidden lg:block`, the same as
  HeroArt: on a phone the artwork is decorative weight between the headline
  and the content that converts.

  DECORATIVE, SO aria-hidden THROUGHOUT. The heading and blurb beside it
  already say what the service is; a screen reader announcing "Read files,
  completed in 0.3 seconds" would be reading set dressing as if it were
  content. That is also what settles the numbers question — see below.

  THE NUMBERS ARE ILLUSTRATION (owner call). "12.4 hours per week", "0.3s",
  "1.2s", "0.8s" are drawn exactly as the mockup has them. They are not claims
  about real jobs: they sit inside a fake application UI, the whole block is
  aria-hidden, and §11's ban on inventing results is about copy that a visitor
  would read as a promise. Flagged rather than done quietly, because "Time
  Saved 12.4 hours" is the one item here that could be mistaken for one. Same
  precedent as HeroArt's fake timecode and file tree.

  NO ANIMATION (§9.5). A hero that animates its own fake terminal on load is
  the dated-template look the anti-goals rule out, and there is nothing here
  for prefers-reduced-motion to suppress.

  SIZED BY @container, NOT BY BREAKPOINTS, and the first pass got this wrong in
  a way worth recording. Every type size in here was originally keyed to `xl:`
  — a VIEWPORT width — while the thing that actually decides whether "Generate
  output" fits on one line is how wide this box is. Those two came apart
  immediately: at a 1536px viewport the page is well past xl, so every label
  jumped to its large size, but the box itself is only whatever is left after
  the hero's copy column takes its 33rem, and the labels truncated to
  "Generate...". Keying off the container measures the right thing, and it
  keeps working if the hero's column split is ever retuned.
*/

/* ---- The code sample -------------------------------------------------- */

/* Real, runnable Python — the mockup's own sample, with its `inport os` typo
   corrected. §11's "never invent" covers set dressing: someone who reads code
   will read this, and a hero that ships a syntax error is a bad first
   impression on exactly the visitor most likely to notice. */
type Token = [kind: string, text: string];

const CODE: Token[][] = [
  [
    ["kw", "import"],
    ["", " pandas "],
    ["kw", "as"],
    ["var", " pd"],
  ],
  [
    ["kw", "import"],
    ["var", " os"],
  ],
  [],
  [
    ["kw", "def"],
    ["fn", " automate"],
    ["punct", "():"],
  ],
  [["comment", "    # process files"]],
  [
    ["", "    "],
    ["kw", "for"],
    ["var", " file "],
    ["kw", "in"],
    ["fn", " os.listdir"],
    ["punct", "("],
    ["str", '"./data"'],
    ["punct", "):"],
  ],
  [
    ["", "        "],
    ["fn", "process_file"],
    ["punct", "("],
    ["var", "file"],
    ["punct", ")"],
  ],
  [],
  [
    ["", "    "],
    ["fn", "print"],
    ["punct", "("],
    ["str", '"Automation complete."'],
    ["punct", ")"],
  ],
  [],
  [
    ["kw", "if"],
    ["var", " __name__ "],
    ["punct", "=="],
    ["str", ' "__main__"'],
    ["punct", ":"],
  ],
  [
    ["", "    "],
    ["fn", "automate"],
    ["punct", "()"],
  ],
];

/* The five syntax tokens from globals.css, mapped onto Python's parts of
   speech. `var` reuses --color-code-attr and `fn` reuses --color-code-tag
   rather than either growing a token of its own: the palette was fitted for
   the home page's TSX sample, and a Python sample needs the same five roles
   under different names, not ten colours. */
const TOKEN_CLASS: Record<string, string> = {
  kw: "text-code-keyword",
  str: "text-code-string",
  fn: "text-code-tag",
  var: "text-code-attr",
  punct: "text-code-punct",
  comment: "text-code-punct italic",
  "": "text-text-secondary",
};

/* ---- Floating cards --------------------------------------------------- */

const STAGES: { icon: LineIconKey; label: string; time: string }[] = [
  { icon: "file", label: "Read files", time: "Completed in 0.3s" },
  { icon: "gear", label: "Process data", time: "Completed in 1.2s" },
  { icon: "bars", label: "Generate output", time: "Completed in 0.8s" },
];

const TASKS = [
  "Parse data",
  "Clean & format",
  "Generate report",
  "Send notification",
  "All done!",
];

/** The filled green tick the mockup marks every finished row with. Sized by
    the caller, because the stage cards draw it noticeably larger than the
    checklist rows do. */
function DoneTick({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-success text-bg ${className}`}
    >
      <LineIcon name="tick" className="h-1/2 w-1/2" />
    </span>
  );
}

/*
  Card fill, shared by all four floating panels.

  A warm pool at the bottom-left rather than the top-left every other panel on
  the site uses: in the mockup these cards are lit from below by the laptop's
  own backlight, so their bottom edges carry the warmth and their tops stay
  near-black. Same warmGlowImage() as everything else — only the origin moves
  (§9.4 forbids hand-writing a second radial gradient, not moving this one).
*/
const CARD_FILL = `${warmGlowImage({ size: [40, 40], peak: 9, at: "0% 100%" })}, var(--color-surface)`;

const cardBase =
  "rounded-[1.4em] border border-border shadow-[0_10px_30px_rgba(0,0,0,0.55)]";

/* ---- The composition -------------------------------------------------- */

export default function AutomationHeroArt({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      /*
        830x380 is the art region measured off the mockup (x 650..1480,
        y 80..460 at its native 1536px width). Holding that ratio is what keeps
        the four cards clear of each other as the column narrows, since every
        position below is a percentage of this box.

        EVERY SIZE INSIDE IS RELATIVE TO THIS BOX'S OWN WIDTH. The root sets
        1.2cqw — 1.2% of the container's width, which is the mockup's ~10px
        code size against its 830px art region — and every child sizes itself
        in `em` off that. So the whole drawing is one scalable object: give it
        a wider column and the code, the cards, the ticks and the padding all
        grow together in the mockup's exact proportions.

        THE SIZE LIVES ON AN INNER WRAPPER, NOT ON THIS ELEMENT. Container
        query units resolve against the nearest ANCESTOR container — an element
        cannot query itself, or the font size it sets would feed back into the
        size being queried. Written on this div, 1.2cqw silently fell back to
        1.2% of the VIEWPORT and rendered the whole drawing at roughly triple
        size. One wrapper inside the container fixes it.

        THIS REPLACED BREAKPOINT SIZING, and the failure is worth recording.
        The sizes were first written as fixed rem values with `xl:` steps, then
        as `@xl:` container steps. Both are jumps between two hand-picked
        sizes, and neither can hold a ratio: at the width this column actually
        gets, the code block came out proportionally 25% larger than the
        mockup's and overflowed the laptop screen, clipping halfway through the
        snippet. A ratio problem needs a ratio unit.
      */
      className={`@container relative aspect-[830/380] w-full ${className}`}
    >
      {/* The sizing wrapper — see the note above: cqw has to be set on a
          child of the container, never on the container itself. */}
      <div className="absolute inset-0 text-[1.2cqw]">
        {/*
        THE BACKLIGHT. The mockup's whole scene is lit from behind the laptop
        at deck level — that glow is what makes the black cards read as objects
        in a room rather than rectangles on a page. Same treatment as HeroArt's,
        placed lower and wider because this composition is wider than it is
        tall.
      */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
          style={{
            backgroundImage: warmGlowImage({
              size: [26, 16],
              peak: 60,
              at: "50% 88%",
            }),
          }}
        />

        {/* ---- The screen, centre ---- */}
        <div className="absolute inset-y-[4%] left-[29%] right-[26%]">
          <div className="relative h-full w-full">
            {/*
            SCREEN. A floating window, square-on — no laptop (owner call).

            It was one: a tilted panel on a CSS trapezoid deck with a lit
            hinge, following the mockup's photographed machine. Reproducing
            hardware in CSS was always the weakest part of this drawing, and
            the owner's call was that the screen alone does the job. The
            perspective wrapper, the 3D transforms, the deck and the hinge all
            went with it — a flat panel needs none of them, and dropping the
            rotation also puts the code back on the pixel grid, so it renders
            noticeably crisper than it did at rotateY(-5deg).
          */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[1.2em] border border-border bg-bg"
              style={{
                boxShadow: [
                  "inset 0 1px 0 0 rgba(255,255,255,0.06)",
                  "inset 0 -1px 0 0 color-mix(in srgb, var(--color-accent) 34%, transparent)",
                  "0 2px 8px rgba(0,0,0,0.8)",
                  "0 24px 50px rgba(0,0,0,0.6)",
                ].join(", "),
              }}
            >
              {/* Title bar. One red control dot and two dark ones, as drawn. */}
              <div className="flex items-center gap-[0.6em] border-b border-border bg-surface px-[1.2em] py-[0.8em]">
                <span className="h-[0.6em] w-[0.6em] rounded-full bg-danger" />
                <span className="h-[0.6em] w-[0.6em] rounded-full bg-code-punct" />
                <span className="h-[0.6em] w-[0.6em] rounded-full bg-code-punct" />
              </div>

              <div className="flex h-full">
                {/* Activity rail — bars rather than glyphs, the same call
                  HeroArt's editor makes: a 6px icon is mud. */}
                <ul className="flex w-[6%] shrink-0 flex-col items-center gap-[0.6em] border-r border-border bg-surface py-[0.8em]">
                  {[0, 1].map((i) => (
                    <li
                      key={i}
                      className={`h-[0.4em] w-[0.4em] rounded-full ${i === 0 ? "bg-accent" : "bg-code-punct"}`}
                    />
                  ))}
                </ul>

                <div className="min-w-0 flex-1">
                  {/* The open file's tab. */}
                  <div className="flex items-center gap-[0.6em] border-b border-border bg-surface-2 px-[1em] py-[0.6em]">
                    <LineIcon
                      name="file"
                      className="h-[1.1em] w-[1.1em] shrink-0 text-accent"
                    />
                    <span className="truncate font-mono text-[1em] leading-none text-text">
                      automation.py
                    </span>
                  </div>

                  <pre className="overflow-hidden px-[1.2em] py-[1em] font-mono text-[0.95em] leading-[1.8]">
                    {CODE.map((line, i) => (
                      <div key={i} className="whitespace-pre">
                        {/* A blank line still needs to occupy one, hence the
                          zero-width space rather than an empty div. */}
                        {line.length === 0
                          ? "​"
                          : line.map(([kind, text], j) => (
                              <span key={j} className={TOKEN_CLASS[kind]}>
                                {text}
                              </span>
                            ))}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Stage cards, left ---- */}
        <ul className="absolute inset-y-[10%] left-0 flex w-[29%] flex-col justify-between">
          {STAGES.map((stage) => (
            <li
              key={stage.label}
              className={`flex items-center gap-[1em] px-[1.2em] py-[1em] ${cardBase}`}
              style={{ background: CARD_FILL }}
            >
              <span className="flex h-[3.4em] w-[3.4em] shrink-0 items-center justify-center rounded-[1em] border border-border bg-surface-2 text-text">
                <LineIcon name={stage.icon} className="h-[2em] w-[2em]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[1.3em] font-semibold leading-tight text-text">
                  {stage.label}
                </span>
                <span className="block truncate text-[1.1em] leading-tight text-text-muted">
                  {stage.time}
                </span>
              </span>
              <DoneTick className="h-[2em] w-[2em]" />
            </li>
          ))}
        </ul>

        {/*
        THE CONNECTOR. Three stubs from the stage cards merging into one line
        that runs into the machine — the mockup's clearest statement that the
        steps and the script are the same thing.

        DRAWN AS ONE OPEN-SIDED ROUNDED BOX, not as five lines. The bracket's
        top edge IS the first card's stub, its bottom edge is the third card's,
        and its right edge is the spine they merge into; `border-l-0` opens the
        side facing the cards. Five absolutely-positioned hairlines would have
        needed square corners, and the mockup's are visibly radiused.

        Inset to the first and last card's vertical centres: the cards are
        distributed between 10% and 90% of the box and are ~17% tall, so their
        centres sit at 18.5% and 81.5%.
      */}
        <span className="pointer-events-none absolute top-[18.5%] bottom-[18.5%] left-[29%] w-[5%] rounded-r-[1em] border border-l-0 border-accent/70" />
        {/* The middle card's stub and the run into the laptop are one line, since
          the second card's centre and the exit point are both mid-height. */}
        <span className="pointer-events-none absolute top-1/2 left-[29%] h-px w-[7.5%] bg-accent/70" />

        {/* ---- Tasks + Time Saved, right ---- */}
        <div className="absolute inset-y-[2%] right-0 flex w-[27%] flex-col gap-[4%]">
          <div
            className={`flex-1 px-[1.4em] py-[1.2em] ${cardBase}`}
            style={{ background: CARD_FILL }}
          >
            <p className="text-[1.4em] font-semibold leading-tight text-text">
              Tasks Automated
            </p>
            <ul className="mt-[1em] flex flex-col gap-[0.85em]">
              {TASKS.map((task) => (
                <li key={task} className="flex items-center gap-[0.8em]">
                  <DoneTick className="h-[1.5em] w-[1.5em]" />
                  <span className="truncate text-[1.25em] leading-tight text-text">
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`flex items-center gap-[1em] px-[1.4em] py-[1.2em] ${cardBase}`}
            style={{ background: CARD_FILL }}
          >
            <LineIcon
              name="clock"
              className="h-[2.6em] w-[2.6em] shrink-0 text-accent"
            />
            <span className="min-w-0">
              <span className="block truncate text-[1.1em] leading-tight text-text-muted">
                Time Saved
              </span>
              <span className="block truncate text-[2em] font-semibold leading-tight text-text">
                12.4 hours
              </span>
              <span className="block truncate text-[1em] leading-tight text-text-muted">
                per week
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
