"use client";

import { useState } from "react";
import Image from "next/image";

/*
  The case study page's "Screenshots" carousel (individual-project-page
  mockup) — a horizontal slider replacing the old static gallery grid.

  Client component, deliberately small: one index of state, driven entirely
  by real <button> elements so it stays keyboard- and screen-reader-operable
  without extra wiring (§12). The slide transition is a plain CSS
  `transition-transform`; the global `prefers-reduced-motion` override in
  globals.css already zeroes every transition duration site-wide, so there is
  nothing extra to do here for §9.5.

  Renders nothing chrome-wise for a single image — no arrows, no dots, just
  the image in the same bordered box a multi-image gallery uses for its
  active slide. Matches the old gallery's "single-column when there's just
  one image" note; a lone screenshot doesn't need navigation controls.
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
  const [index, setIndex] = useState(0);
  const atStart = index === 0;
  const atEnd = index === images.length - 1;

  return (
    <div className={className}>
      {images.length > 1 ? (
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={atStart}
            aria-label="Previous screenshot"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-text-muted hover:text-text disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(images.length - 1, i + 1))}
            disabled={atEnd}
            aria-label="Next screenshot"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-accent text-bg transition-colors hover:border-accent-hover hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((image) => (
            <figure key={image.src} className="w-full shrink-0">
              <div className="relative aspect-[3/2] w-full bg-surface-2">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width ?? 1536}
                  height={image.height ?? 1024}
                  loading="lazy"
                  sizes="(min-width: 1152px) 1088px, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              {image.caption ? (
                <figcaption className="border-t border-border bg-surface px-4 py-2 text-small text-text-muted">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to screenshot ${i + 1}`}
              aria-current={i === index}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-accent" : "bg-border hover:bg-text-muted"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
