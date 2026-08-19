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

/*
  Panel lighting, shared by all three screens (Phase 1).

  Three effects in one box-shadow list:

  1. RIM LIGHT — `inset 0 -1px` picks out the bottom edge, the one facing the
     backlight below. In the mockup this is the clearest cue that the devices
     are lit by something rather than merely drawn: their near-bottom edges
     catch a hot orange line while their tops stay black.
  2. CONTACT SHADOW — tight, dark and barely offset, so the panel looks like
     it is resting on something. The wide soft shadow already here does depth;
     it does not do contact, and a panel with only the wide one reads as a
     sticker laid on the background.
  3. AMBIENT DROP — the existing wide falloff, kept.
  4. SCREEN BLOOM — a wide, very low-opacity warm halo around the whole panel,
     standing in for the light a lit screen throws onto what surrounds it. Kept
     deliberately faint: §9.6 rules out neon, and the moment this is legible as
     a ring rather than felt as air around the panel it has gone too far.

  `rim` varies per panel because the backlight is centred low: the video panel
  sits closest to it and catches the most, the editor sits highest and catches
  least. A uniform rim would flatten the depth this exists to create.
*/
function panelShadow(rim: number): string {
  return [
    // Bezel: a cool top highlight opposite the warm bottom rim. Two lit
    // edges of different temperature is what reads as thickness — one alone
    // reads as a coloured border.
    "inset 0 1px 0 0 rgba(255,255,255,0.07)",
    `inset 0 -1px 0 0 color-mix(in srgb, var(--color-accent) ${rim}%, transparent)`,
    "0 2px 6px rgba(0,0,0,0.75)",
    "0 18px 40px rgba(0,0,0,0.6)",
    `0 0 28px color-mix(in srgb, var(--color-accent) ${Math.round(rim / 6)}%, transparent)`,
  ].join(", ");
}

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
        THE BACKLIGHT. A wide, soft warm pool sitting at the base of the
        panels, as if a light source were behind the setup at desk level.

        THIS IS A BLOOM, NOT A LINE, and the distinction is the whole reason
        the previous attempt failed. Scanning the mockup row by row turns up a
        sharp single-row peak at the desk line, and a crisp 3px rule was built
        from it — which looked wrong immediately, because that row is the
        desk/wall seam sitting INSIDE a much broader soft pool, not the effect
        itself. Measuring the pool instead: it spans x 790..1180 of a 920px-
        wide art region and holds strength over roughly 46px vertically, so it
        is a wide flat ellipse centred near half width and 82% height, with
        half-max radii of about 21% by 6%.

        Radii here are those half-max figures divided by 0.85, because
        warmGlow's fitted curve is at 0.368 of peak by one radius and about
        half by 0.85 of it — so the ellipse has to be slightly larger than the
        measurement to put the measured falloff in the right place.

        Same warmGlowImage() every other glow on the site uses; only the origin
        and the radii differ (§9.4).

        TIGHT AND HOT, NOT WIDE AND SOFT. The first pass ran peak 72 over
        radii [26, 9] under blur-2xl and read as a diffuse haze across the
        lower half rather than as a light source — the mockup's pool is
        intense and localised, and stacking a 40px blur on a gradient that is
        already soft threw away the only definition it had. Peak up, radii in,
        blur down one step.
      */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-xl"
        style={{
          backgroundImage: warmGlowImage({
            size: [21, 7.5],
            peak: 98,
            at: "48% 84%",
          }),
        }}
      />

      {/*
        THE DESK PLANE (Phase 2).

        A surface for the panels to stand on, and — more to the point — a
        surface for the backlight to bounce off. Phase 1's bloom was tamer
        than the mockup's partly because the mockup's light lands on a desk
        that throws it back; ours had nothing to reflect from, so all it could
        do was sit in empty space.

        Two layers. The tone gradient lifts the surface fractionally at the
        horizon and recedes to nothing toward the viewer, which is what gives
        the impression of a plane rather than a band. Over it sits a second
        warm glow anchored to the TOP edge of this box — that is the
        reflection: same light, directly below its source, dimmer and blurred,
        spreading downward the way a reflection on a matte surface does.

        Deliberately no horizon rule. The mockup has a visible desk/wall seam
        and drawing one is tempting, but a bright horizontal line across the
        hero is exactly what was tried and rejected earlier; the tone change
        between plane and background carries the edge on its own.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[16%] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-surface) 85%, transparent), transparent 88%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-45 blur-lg"
          style={{
            backgroundImage: warmGlowImage({
              size: [21, 42],
              peak: 70,
              at: "48% 0%",
            }),
          }}
        />
      </div>

      {/* The stage. perspective on the parent + preserve-3d here is what lets
          the three panels sit at different yaws and actually overlap in depth
          instead of looking like three flat rectangles stacked by z-index. */}
      <div className="absolute inset-0 [perspective:1000px]">
        <div className="relative h-full w-full [transform-style:preserve-3d]">
          {/* ---- Editor, centre back: the largest panel, faces front ---- */}
          <div
            className="absolute left-[16%] top-[2%] w-[74%] overflow-hidden rounded-md border border-border bg-bg [transform:rotateX(6deg)_rotateY(-9deg)]"
            style={{ boxShadow: panelShadow(26) }}
          >
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
          <div
            className="absolute bottom-[17%] left-0 w-[46%] overflow-hidden rounded-md border border-border bg-bg [transform:rotateX(6deg)_rotateY(14deg)_translateZ(80px)]"
            style={{ boxShadow: panelShadow(55) }}
          >
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
          <div
            className="absolute bottom-[15%] right-0 w-[36%] overflow-hidden rounded-md border border-border bg-bg [transform:rotateX(6deg)_rotateY(-18deg)_translateZ(60px)]"
            style={{ boxShadow: panelShadow(48) }}
          >
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
          <div className="absolute bottom-[6%] left-[6%] flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-surface text-logo shadow-[0_6px_18px_rgba(0,0,0,0.6)] [transform:translateZ(120px)]">
            <Logo className="h-2 w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
