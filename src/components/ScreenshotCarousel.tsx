"use client";

import { useRef } from "react";
import Image from "next/image";

/*
  The case study page's "Screenshots" carousel (individual-project-page
  mockup) — a horizontally scrollable filmstrip, not a one-slide-at-a-time
  swap.

  2026-08-20 REWRITE (owner call): the first version showed one image at a
  time, sized to the full content column, and swapped slides via a
  `transform: translateX`. Two owner asks it didn't meet: "a slide that lets
  people scroll left and right" — actual scrolling (touch swipe, trackpad,
  scrollbar drag), not a click-through index — and screenshots sized to match
  FeaturedWork.tsx's home-page cards, which show three at a time rather than
  one blown up to full width. Both point at the same fix: real horizontal
  overflow-scroll with each figure sized like a FeaturedWork card
  (`aspect-[3/2]`, one third of the row at `sm` and up, `gap-6` between —
  the exact numbers FeaturedWork uses, so `basis` here is the matching
  flex-percentage math for grid's `sm:grid-cols-3 gap-6`) rather than a
  transform-driven single frame.

  Scroll-snap (`snap-x snap-mandatory`, `snap-start` per figure) gives it
  clean stopping points without any JS scroll-position tracking. The
  prev/next buttons are a discoverable, keyboard-operable affordance on top
  of that — they scroll the same real scroll container by one viewport's
  width rather than driving separate state, so button clicks and a manual
  swipe never disagree about where the strip is.

  No dot indicators: with up to three images visible at once at `sm` and up,
  there is no single "current slide" for a dot to index.

  Single-image case renders with no chrome at all — no buttons, no scroll —
  same "nothing to navigate" reasoning the old gallery grid used.
*/

interface Screenshot {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export default function ScreenshotCarousel({
  images,
  className,
}: {
  images: Screenshot[];
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  }

  return (
    <div className={className}>
      {images.length > 1 ? (
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Scroll screenshots left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-text-muted hover:text-text"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Scroll screenshots right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-accent text-bg transition-colors hover:border-accent-hover hover:bg-accent-hover"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      ) : null}

      <div
        ref={trackRef}
        // tabIndex + role/aria-label: the native scroll container is
        // keyboard-focusable and screen-reader-announced as one unit, since
        // arrow-key scrolling only works on a focused scroller (§12).
        tabIndex={images.length > 1 ? 0 : -1}
        role={images.length > 1 ? "region" : undefined}
        aria-label={images.length > 1 ? "Screenshots" : undefined}
        className={`no-scrollbar flex overflow-x-auto ${
          images.length > 1 ? "snap-x snap-mandatory gap-6" : ""
        }`}
      >
        {images.map((image) => (
          <figure
            key={image.src}
            className={
              images.length > 1
                ? "shrink-0 snap-start basis-[calc(100%-1.5rem)] sm:basis-[calc((100%-3rem)/3)]"
                : "w-full shrink-0"
            }
          >
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="relative aspect-[3/2] w-full bg-surface-2">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  // Matches FeaturedWork's own hint: never wider than a
                  // third of the max-w-6xl (1152px) container at sm and up.
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              {image.caption ? (
                <figcaption className="border-t border-border bg-surface px-4 py-2 text-small text-text-muted">
                  {image.caption}
                </figcaption>
              ) : null}
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
