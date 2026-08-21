import Image from "next/image";

/*
  "Before / After" comparison pairs (CLAUDE.md §6 `Project.beforeAfter`).

  Deliberately NOT the horizontal-scroll ScreenshotCarousel. That component
  lays every image out in one un-wrapped row, three visible at a time — fine
  for a flat set of screenshots, but it splits a before/after pair across
  scroll pages the moment there's more than one pair. A plain responsive grid
  keeps each pair adjacent and needs no scrolling at all: one column (before
  stacked above after, full width and legible) below `sm`, two side by side
  at `sm` and up. Reach for a scroll container only when content doesn't fit
  without one — this fits.

  No `fill`/`object-cover` crop, unlike ScreenshotCarousel's figures: these
  are full-page redesign screenshots, and cropping one would hide the exact
  thing the section is trying to show. Each image renders at its own
  `width`/`height` instead, so the box sizes itself to the real screenshot.
*/

interface ComparisonPair {
  label: string;
  before: { src: string; alt: string; width: number; height: number };
  after: { src: string; alt: string; width: number; height: number };
}

export default function BeforeAfterCompare({
  pairs,
  className,
}: {
  pairs: ComparisonPair[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-10 ${className ?? ""}`}>
      {pairs.map((pair) => (
        <div key={pair.label}>
          <h3 className="text-body font-semibold text-text">{pair.label}</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
            {(["before", "after"] as const).map((key) => {
              const image = pair[key];
              return (
                <figure
                  key={key}
                  className="overflow-hidden rounded-xl border border-border bg-surface-2"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                  <figcaption className="border-t border-border bg-surface px-3 py-1.5 text-center text-small font-medium text-text-muted">
                    {key === "before" ? "Before" : "After"}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
