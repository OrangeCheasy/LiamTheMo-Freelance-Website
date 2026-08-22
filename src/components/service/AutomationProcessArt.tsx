import LineIcon from "@/components/LineIcon";
import { warmGlowImage } from "@/lib/glow";

/*
  The artwork beside the Automation page's process steps (owner mockup,
  2026-08-21): a finished run of one of these tools, with its log on the left
  and its summary on the right.

  WHY IT EARNS ITS PLACE. The step row next to it says what the process is;
  this says what the end of it looks like. A visitor who has never commissioned
  software does not picture a "documented system" — they picture a thing that
  runs and says it worked, which is exactly what this draws.

  SAME RULES AS AutomationHeroArt: DOM rather than an image, aria-hidden
  because it is set dressing, no animation, and the numbers are the mockup's,
  drawn as in-application output rather than as a claim (see that file's note
  on §11).

  THE ACCENT FRAME IS THE ONE THING HERE THAT BENDS §9.2. The mockup rings this
  whole window in orange, and orange on something non-interactive is what that
  rule forbids. It ships because the frame is part of an illustration rather
  than a control — the same standing the hero's rim light already has — and
  because dropping it loses the only thing anchoring this block against a page
  where the real controls are also orange. Held at 45% so it reads as a lit
  edge on a drawn object rather than as a button-sized target.
*/

const LOG = [
  "Scanning folder...",
  "Processing 12 files...",
  "Generating report...",
  "Sending to email...",
  "Completed!",
];

const STATS: { value: string; label: string }[] = [
  { value: "12", label: "Files processed" },
  { value: "2.3s", label: "Total time" },
  { value: "100%", label: "Success rate" },
];

export default function AutomationProcessArt({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      /*
        @container, for the reason written up in AutomationHeroArt: whether the
        log and the summary tiles fit side by side depends on how wide THIS box
        is, not on how wide the window is. Keyed to `sm:` it laid them out in a
        row inside a 320px column at desktop widths and wrapped "File
        Processor" onto two lines. The 15rem threshold is deliberately well
        under the ~18rem this column gets on a desktop and well over the width
        it has on a phone, so neither end sits on the boundary — an earlier
        18rem sat exactly on it and the split silently stopped firing when the
        column was retuned to 18rem.
      */
      className={`@container relative overflow-hidden rounded-2xl border border-accent/45 ${className}`}
      style={{
        // The window's own fill: warm at the top-left corner it is lit from,
        // fading to the page dark. Same shared gradient as every other panel.
        background: `${warmGlowImage({ size: [55, 60], peak: 10 })}, var(--color-bg)`,
        boxShadow:
          "0 0 30px color-mix(in srgb, var(--color-accent) 10%, transparent), 0 18px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* Title bar. Three live control dots here, where the hero's editor has
          one — matching each mockup rather than sharing a component that would
          have to be right for both. */}
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-danger" />
        <span className="h-2 w-2 rounded-full bg-service-excel" />
        <span className="h-2 w-2 rounded-full bg-success" />
      </div>

      <div className="flex flex-col gap-2.5 px-3 pb-3 @[15rem]:flex-row">
        {/* The run log. */}
        <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface/70 p-3">
          <p className="flex items-center gap-2 text-small font-semibold text-text">
            <LineIcon
              name="bars"
              className="h-3.5 w-3.5 shrink-0 text-text-muted"
            />
            File Processor
          </p>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {LOG.map((line) => (
              <li key={line} className="flex items-center gap-2">
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-success text-bg">
                  <LineIcon name="tick" className="h-2 w-2" />
                </span>
                <span className="text-[0.7rem] leading-tight text-text-secondary">
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The summary tiles. */}
        <ul className="flex shrink-0 flex-row gap-2.5 @[15rem]:w-[32%] @[15rem]:flex-col">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="flex min-w-0 flex-1 flex-col justify-center rounded-xl border border-border bg-surface/70 px-2.5 py-2"
            >
              <p className="text-[1.05rem] font-semibold leading-none text-text">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.62rem] leading-tight text-text-muted">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
