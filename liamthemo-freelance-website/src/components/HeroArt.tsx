import Image from "next/image";

/*
  The hero's visual (CLAUDE.md §15 Phase 2, mockup composition: "large heading
  left, artwork right").

  SUPERSEDES THE INLINE-SVG "MOUND" VERSION. That earlier build deliberately
  avoided the mockup's own render because the only copy of it was a crop baked
  into the flattened full-page screenshot — below retina quality at hero size
  and an LCP candidate, so shipping an upscaled crop was a bad trade. The
  owner has since supplied the real source render at /public/homepage/hero.png
  (1536x1024, standalone), which resolves that objection, and made this
  mockup authoritative over the anti-goal that previously ruled a 3D render
  out (§9.6) — an explicit override, documented here the same way the hero
  copy's override is documented in page.tsx.

  hero.webp is a sharp-recompressed copy of the source PNG (quality 82) —
  1.7MB down to ~110KB — kept as the actual `src` so this one image doesn't
  blow the homepage's 600KB payload target on its own (§12). The source PNG
  stays in public/homepage/ for future re-exports at a different crop/quality.

  `sizes="(max-width: 1023px) 0px, 30rem"` pairs with `priority`: it's the
  LCP element at lg+ (so it preloads, no lazy-load delay), but the wrapper is
  `hidden lg:block` below that breakpoint (same mobile call as before — see
  page.tsx), and a `0px` sizes entry makes the browser pick the smallest
  generated srcset candidate there instead of the full desktop image, so the
  unconditional preload tag Next emits for `priority` doesn't cost mobile
  real bytes.

  Decorative, not informational — the heading already states the outcome in
  words — so `alt=""` and `aria-hidden` are correct here, not an omission.
*/

export default function HeroArt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-accent-dim), transparent)",
        }}
      />
      <Image
        src="/homepage/hero.webp"
        alt=""
        width={1536}
        height={1024}
        priority
        sizes="(max-width: 1023px) 0px, 30rem"
        className="h-auto w-full max-w-[30rem]"
      />
    </div>
  );
}
