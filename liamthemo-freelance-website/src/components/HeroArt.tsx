import Image from "next/image";
import Logo from "@/components/Logo";
import { warmGlowImage } from "@/lib/glow";

/*
  The hero's visual (CLAUDE.md §15 Phase 2, mockup composition: "large heading
  left, artwork right").

  BUILT AS DOM, NOT SHIPPED AS A PICTURE (owner call). This replaced
  /homepage/hero.webp, a 111 KB photoreal render of a desk. The owner's brief
  was to follow the mockup's composition but have it "integrated straight into
  the site instead of putting an image", so the three screens in that render
  are now three real panels: a code editor showing this file's own sibling
  (src/app/page.tsx), a video editor showing a real project's cover art, and a
  design tool showing this site's own hero. The desk, keyboard, mouse and mug
  are gone — CSS cannot do photoreal props convincingly, and faking them badly
  would cost more than dropping them.

  WHAT THIS BUYS, beyond matching the brief: the panels are real text, so they
  stay sharp at any zoom or DPR instead of resolving to an upscaled bitmap;
  they recolour with the tokens; and the only bytes left are one 52 KB project
  image that already exists in the bundle, down from 111 KB. §12's homepage
  payload target gets easier, not harder.

  MOBILE PAYS NOTHING. page.tsx renders this `hidden lg:block` — the same call
  it has always had, for the same reason: on a phone the artwork is decorative
  weight between the headline and the content. So the CSS 3D work here, which
  is the part that could plausibly cost paint time on a weak device, never
  runs on one.

  DECORATIVE. The heading already states the outcome in words, so the whole
  block is aria-hidden and the one <Image> inside carries alt="". A screen
  reader that announced "code editor showing page.tsx" would be describing
  set dressing.

  NO ANIMATION, deliberately. §9.5 allows at most one scroll-reveal per
  section and rules out anything that reads as a dated template; a hero that
  animates its own fake IDE on load is exactly that. The panels are static and
  there is nothing here for prefers-reduced-motion to suppress.
*/

/* The code sample. Real imports from src/app/page.tsx — a visitor who knows
   what they are looking at should find it consistent with the site, and §11's
   "never invent" applies to set dressing as much as to case studies. */
const CODE: { n: number; tokens: [string, string][] }[] = [
  { n: 1, tokens: [["kw", "import"], ["", " HeroArt "], ["kw", "from"], ["str", ' "@/components/HeroArt"'], ["punct", ";"]] },
  { n: 2, tokens: [["kw", "import"], ["", " FeaturedWork "], ["kw", "from"], ["str", ' "@/components/FeaturedWork"'], ["punct", ";"]] },
  { n: 3, tokens: [["kw", "import"], ["", " ServicesSection "], ["kw", "from"], ["str", ' "@/components/ServicesSection"'], ["punct", ";"]] },
  { n: 4, tokens: [] },
  { n: 5, tokens: [["kw", "export default function"], ["fn", " Home"], ["punct", "() {"]] },
  { n: 6, tokens: [["", "  "], ["kw", "return"], ["punct", " («"]] },
  { n: 7, tokens: [["", "    "], ["tag", "<HeroArt"], ["punct", " />"]] },
  { n: 8, tokens: [["", "    "], ["tag", "<FeaturedWork"], ["attr", " projects"], ["punct", "={"], ["", "projects"], ["punct", "} />"]] },
  { n: 9, tokens: [["", "    "], ["tag", "<ServicesSection"], ["punct", " />"]] },
  { n: 10, tokens: [["punct", "  );"]] },
  { n: 11, tokens: [["punct", "}"]] },
];

const TOKEN_CLASS: Record<string, string> = {
  kw: "text-code-keyword",
  str: "text-code-string",
  tag: "text-code-tag",
  attr: "text-code-attr",
  fn: "text-code-tag",
  punct: "text-code-punct",
  "": "text-text-secondary",
};

/* A panel's chrome: the three dots and a title, shared by all three screens so
   they read as one family of windows rather than three unrelated boxes. */
function TitleBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-2 py-1.5">
      <span className="h-1 w-1 rounded-full bg-code-punct" />
      <span className="h-1 w-1 rounded-full bg-code-punct" />
      <span className="h-1 w-1 rounded-full bg-code-punct" />
      <span className="ml-1 truncate text-[0.45rem] leading-none text-text-muted">
        {title}
      </span>
    </div>
  );
}

export default function HeroArt({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative aspect-[4/3] w-full max-w-[30rem] ${className}`}
    >
      {/*
        The same warm falloff the CTA panel and the service cards use
        (src/lib/glow.ts), sized wide and low and pinned behind everything —
        this is the render's rim light, rebuilt from the curve that is already
        the site's one glow implementation rather than a second gradient that
        merely resembles it. blur-2xl softens the stop banding that shows when
        a gradient this large is painted flat.
      */}
      {/*
        The rim light. Same fitted falloff as every other glow on the site —
        only the origin moves (§9.4), to sit low and behind the panels so the
        warmth reads as coming from under the screens the way the render's did.

        The mask is doing real work, not polish. The falloff's stop list runs
        out to 400% of the ellipse radius, which at any radius large enough to
        light the whole composition lands well outside this box — so the
        gradient was still a few percent opaque where the element ended, and
        clipped into a faintly visible rectangle across the hero. Feathering
        the element itself is what removes that edge; lowering the peak only
        made the rectangle dimmer.
      */}
      <div
        className="pointer-events-none absolute inset-x-[-18%] bottom-[-8%] top-[4%] -z-10 blur-2xl [mask-image:radial-gradient(ellipse_58%_48%_at_50%_74%,black_35%,transparent_82%)]"
        style={{
          backgroundImage: warmGlowImage({
            size: [58, 42],
            peak: 58,
            at: "50% 74%",
          }),
        }}
      />

      {/* The stage. perspective on the parent + preserve-3d here is what lets
          the three panels sit at different yaws and actually overlap in depth
          instead of looking like three flat rectangles stacked by z-index. */}
      <div className="absolute inset-0 [perspective:1200px]">
        <div className="relative h-full w-full [transform-style:preserve-3d]">
          {/* ---- Editor, centre back: the largest panel, faces front ---- */}
          <div className="absolute left-[16%] top-[4%] w-[74%] overflow-hidden rounded-md border border-border bg-bg shadow-[0_18px_40px_rgba(0,0,0,0.55)] [transform:rotateX(4deg)_rotateY(-6deg)]">
            <TitleBar title="page.tsx" />
            <div className="flex">
              {/* File tree. Real filenames from src/app and src/components. */}
              {/* Real paths from this repo, indented to their real depth —
                  the previous version indented every entry after the second,
                  which put `components` a level inside `app`. */}
              <ul className="hidden w-[26%] shrink-0 space-y-[3px] border-r border-border bg-surface px-1.5 py-1.5 sm:block">
                {(
                  [
                    ["src", 0],
                    ["app", 1],
                    ["page.tsx", 2],
                    ["layout.tsx", 2],
                    ["components", 1],
                    ["HeroArt.tsx", 2],
                    ["Navbar.tsx", 2],
                  ] as const
                ).map(([file, depth]) => (
                  <li
                    key={file}
                    style={{ paddingLeft: `${depth * 0.25}rem` }}
                    className={`truncate text-[0.4rem] leading-[1.5] ${
                      file === "page.tsx" ? "text-text" : "text-code-punct"
                    }`}
                  >
                    {file}
                  </li>
                ))}
              </ul>

              <pre className="min-w-0 flex-1 overflow-hidden px-2 py-1.5 font-mono text-[0.4rem] leading-[1.65]">
                {CODE.map((line) => (
                  <div key={line.n} className="flex gap-2 whitespace-pre">
                    <span className="w-2 shrink-0 text-right text-code-punct">
                      {line.n}
                    </span>
                    <span className="truncate">
                      {line.tokens.map(([kind, text], i) => (
                        <span key={i} className={TOKEN_CLASS[kind]}>
                          {text}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
            {/* Status bar — the detail that makes it read as an editor. */}
            <div className="flex items-center justify-between border-t border-border bg-surface-2 px-2 py-1 text-[0.38rem] leading-none text-code-punct">
              <span>main</span>
              <span>Ln 8, Col 34 · TypeScript JSX</span>
            </div>
          </div>

          {/* ---- Video editor, front left: turned inward ---- */}
          <div className="absolute bottom-[10%] left-0 w-[46%] overflow-hidden rounded-md border border-border bg-bg shadow-[0_18px_40px_rgba(0,0,0,0.6)] [transform:rotateX(4deg)_rotateY(11deg)_translateZ(60px)]">
            <TitleBar title="Resolve — orangecheasy" />
            <div className="relative aspect-[16/10] w-full">
              {/*
                Real project art, not a stand-in: this is the OrangeCheasy
                cover already in the bundle, so the panel shows actual work and
                the hero adds no new asset. `sizes` is small on purpose — it
                renders about 200px wide here, and the 0px arm keeps the
                preload from costing a phone real bytes on a block it never
                shows.
              */}
              <Image
                src="/portfolio/youtube/banner.webp"
                alt=""
                fill
                priority
                sizes="(max-width: 1023px) 0px, 14rem"
                className="object-cover"
              />
            </div>
            {/* Timecode + a timeline of clips, built from tokens. */}
            <div className="border-t border-border bg-surface px-1.5 py-1 font-mono text-[0.4rem] leading-none text-text-muted">
              01:00:24:12
            </div>
            <div className="space-y-[3px] bg-surface-2 px-1.5 pb-1.5 pt-1">
              {[
                [["w-[38%]", "bg-service-roblox"], ["w-[26%]", "bg-service-websites"], ["w-[18%]", "bg-accent"]],
                [["w-[22%]", "bg-service-excel"], ["w-[46%]", "bg-service-local"]],
              ].map((track, i) => (
                <div key={i} className="flex gap-[3px]">
                  {track.map(([w, bg], j) => (
                    // Full-strength service hues, not the -tint variants used
                    // elsewhere. §9.1 tints them because a chip sits directly
                    // on a dark surface at reading size; these are 4px slivers
                    // meant to read as coloured clips in a timeline, and at
                    // that size the tint disappears into the panel entirely.
                    <span
                      key={j}
                      className={`h-1 rounded-[1px] ${w} ${bg}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---- Design tool, right: turned inward the other way ---- */}
          <div className="absolute bottom-[4%] right-0 w-[36%] overflow-hidden rounded-md border border-border bg-bg shadow-[0_18px_40px_rgba(0,0,0,0.6)] [transform:rotateX(4deg)_rotateY(-15deg)_translateZ(40px)]">
            <TitleBar title="liamthemo.com" />
            <div className="flex">
              <ul className="w-[38%] shrink-0 space-y-[3px] border-r border-border bg-surface px-1.5 py-1.5">
                {["Header", "Hero", "Featured Work", "Services", "About Me", "Footer"].map(
                  (layer) => (
                    <li
                      key={layer}
                      className="truncate text-[0.38rem] leading-[1.5] text-code-punct"
                    >
                      {layer}
                    </li>
                  ),
                )}
              </ul>
              {/* The site's own hero, in miniature and in the real tokens. */}
              <div className="min-w-0 flex-1 px-1.5 py-1.5">
                <p className="text-[0.42rem] font-semibold leading-[1.35] text-text">
                  Hi, I&apos;m <span className="text-accent">Liam</span>.
                </p>
                <p className="text-[0.42rem] font-semibold leading-[1.35] text-text-secondary">
                  I design and build digital experiences.
                </p>
                <div className="mt-1.5 flex gap-[3px]">
                  <span className="h-2.5 flex-1 rounded-[1px] bg-service-roblox-tint" />
                  <span className="h-2.5 flex-1 rounded-[1px] bg-accent-dim" />
                  <span className="h-2.5 flex-1 rounded-[1px] bg-service-excel-tint" />
                </div>
              </div>
            </div>
          </div>

          {/* ---- Floating badges ----
              The mockup floats a </> tile and a Figma tile here. The </> is
              kept; Figma is not — putting another company's logo in our own
              hero implies a relationship we are not claiming, and the mark
              that belongs in this composition is ours. */}
          <div className="absolute right-[2%] top-[6%] flex h-7 w-7 items-center justify-center rounded-lg border border-accent bg-bg text-accent shadow-[0_0_20px_var(--color-accent-dim)] [transform:translateZ(90px)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M9.2 6.4 4.4 12l4.8 5.6M14.8 6.4 19.6 12l-4.8 5.6" />
            </svg>
          </div>

          {/* Bottom-left, floating clear of every panel. It sat on top of the
              video preview before, which made the mark read as a watermark
              stamped on the artwork rather than a badge in front of it. */}
          <div className="absolute bottom-[1%] left-[6%] flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-surface text-logo shadow-[0_6px_18px_rgba(0,0,0,0.6)] [transform:translateZ(120px)]">
            <Logo className="h-2 w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
