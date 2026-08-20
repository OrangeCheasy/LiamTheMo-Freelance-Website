import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { EDGE_PEAK, warmEdgeImage, warmGlowImage } from "@/lib/glow";

/*
  Shared renderer behind every opengraph-image.tsx in the app (CLAUDE.md §9,
  §14 step 7). One look for the whole site rather than one-off per page: molten
  dark surface, Bricolage Grotesque headline, Inter body, the same dot-grid
  motif as the home page hero.

  These are prerendered at build time wherever the parent route is static — a
  dynamic opengraph-image.tsx under a `[slug]` folder still needs its own
  `generateStaticParams` (App Router doesn't inherit the page's), matching the
  page's own static shell so the image route never invokes the Worker either
  (§4.1).

  STATIC RENDER, HAND-COPIED PALETTE.
  This is the one deliberate exception to "reference tokens, never hex"
  (§9.2): satori has no access to CSS custom properties, so the values below
  are copied from globals.css's §9.1 tokens by hand and will drift if the
  palette changes there. Keep them in sync. The site has no theme to branch
  on, so unlike the old two-theme version this always renders one look.

  THE LOGO MARK next to "LiamTheMo" is the real "lm" path from Logo.tsx
  (copied rather than imported — that component renders a plain `<svg>` and
  has nothing satori-specific to gain from importing it, and hand-copying
  keeps this file's satori-safety notes in one place), in --color-logo
  (#f75701), not --color-accent — same distinction Logo.tsx documents. It's a
  static, non-interactive marketing image, not a live page element, so §9.2's
  "orange only on clickables" rule (written for the site's UI) doesn't govern
  a logo mark the way it governs an in-page decoration.

  2026-08-20 REDESIGN (owner request): "match the theme, same glowing outline
  as the service triage buttons." Replaced the plain top-left corner ellipse
  with the triage card's own two-piece treatment (ServicesSection.tsx) —
  a lit top edge (warmEdgeImage) plus a round pool of light under its
  brightest point (warmGlowImage with `radius`) — and added the same flat
  neutral border the triage cards carry on their other three sides. It is a
  border on the embed's own edge rather than a bordered card floating inside
  it, since the embed already reads as one full-bleed surface (there's no
  page-background around it for a floating card to contrast against, the way
  there is on the actual triage cards).
  `warmEdgeImage` needed a satori-safe `rgba` mode added in glow.ts for this —
  it previously only spoke color-mix(), which the corner glow already worked
  around for the same reason (see `format` below).
*/

const LOGO_COLOR = "#f75701";
const LOGO_PATH =
  "M1.59 0L11.55 0L12.15 0.2L13.15 1.39L13.15 57.57L13.75 59.96L14.34 60.56L14.34 60.96L16.73 62.75L21.31 62.75L23.11 61.35L23.71 59.96L23.71 24.1L23.9 23.51L25.5 22.31L33.27 22.31L34.26 22.71L35.06 23.9L35.26 27.69L38.25 24.7L43.43 22.11L47.41 21.31L52.99 21.51L56.57 22.51L59.16 23.71L59.36 24.1L60.96 24.9L61.55 25.7L61.95 25.7L65.14 29.28L65.94 28.49L65.94 28.09L69.32 24.9L69.72 24.9L69.92 24.5L70.32 24.5L70.52 24.1L72.31 23.11L72.91 23.11L75.5 21.91L79.08 21.31L82.67 21.31L87.05 22.11L92.23 24.7L96.22 28.69L98.21 32.27L98.21 32.87L99 34.46L99.6 37.05L100 41.04L100 72.71L99.6 73.71L98.61 74.5L88.84 74.7L87.25 73.71L87.05 41.24L86.25 38.45L85.06 37.05L85.06 36.65L83.67 35.46L81.67 34.46L80.08 34.06L75.5 34.06L71.91 35.46L69.72 37.45L68.53 40.04L68.13 42.43L68.13 73.31L67.33 74.3L66.33 74.7L57.17 74.7L56.18 74.3L55.38 73.31L55.18 40.64L54.18 37.85L51.99 35.46L48.41 34.06L43.82 34.06L40.24 35.46L38.25 37.25L36.85 40.04L36.45 73.51L35.66 74.3L34.66 74.7L17.33 74.7L13.15 74.1L10.16 73.11L8.96 72.51L8.76 72.11L7.97 71.91L7.17 71.12L6.77 71.12L6.37 70.52L5.98 70.52L3.39 67.73L1.2 63.75L0 59.16L0 1.39L1 0.2L1.59 0.2Z";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

const FONT_DIR = join(process.cwd(), "src/assets/fonts");

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: "normal";
};

let fontsPromise: Promise<OgFont[]> | null = null;

function loadFonts(): Promise<OgFont[]> {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(join(FONT_DIR, "BricolageGrotesque-Bold.woff")),
      readFile(join(FONT_DIR, "Inter-Regular.woff")),
      readFile(join(FONT_DIR, "Inter-SemiBold.woff")),
    ]).then(([bricolageBold, interRegular, interSemiBold]) => [
      {
        name: "Bricolage Grotesque",
        data: bricolageBold,
        weight: 700,
        style: "normal",
      },
      { name: "Inter", data: interRegular, weight: 400, style: "normal" },
      { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
    ]);
  }
  return fontsPromise;
}

interface OgBadge {
  /** Rendered as an icon-only circle when set without `label`. */
  icon?: string;
  /** Rendered as a text pill (with `icon` alongside it, if also set). */
  label?: string;
  /** Hex fill — one of the --color-service-* tokens, or the accent-fill pink. */
  color: string;
}

interface RenderOgImageOptions {
  /**
   * A plain string renders through the shared 64px Bricolage title style
   * below, same as always. Pass JSX instead (home page only, for now) when a
   * title needs the hero's own multi-colour, multi-line treatment — see
   * src/app/opengraph-image.tsx. In that case the caller owns every style,
   * since the per-line colour tiers can't be expressed as one string.
   */
  title: React.ReactNode;
  description: string;
  badge?: OgBadge;
}

export async function renderOgImage({
  title,
  description,
  badge,
}: RenderOgImageOptions) {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          position: "relative",
          backgroundColor: "#0b0a0a",
          backgroundImage:
            "radial-gradient(circle, #2a2626 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          border: "1px solid #2a2626",
        }}
      >
        {/*
          The triage cards' round pool of light, centred under the lit edge's
          brightest point (`EDGE_PEAK`% from the left) — same `radius`/`at`
          idea as ServicesSection.tsx's CARD_GLOW, scaled up for this canvas
          (70px was fitted to a ~380px-wide card; this canvas is 1200px).
        */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage: warmGlowImage({
              radius: "260px",
              at: `${EDGE_PEAK}% 0%`,
              peak: 12,
              format: "rgba",
            }),
          }}
        />

        {/*
          The lit top edge itself, inset to the same 72px the content padding
          uses so it reads as bounding the content rather than the raw canvas
          edge — the same role the corner-radius inset plays for `LitEdge` on
          an actual card.
        */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "72px",
            right: "72px",
            height: "3px",
            display: "flex",
            backgroundImage: warmEdgeImage(100, "rgba"),
          }}
        />

        {/* position: relative on both content blocks — the glow layers above
            are absolutely positioned, so without it they would paint
            underneath. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <svg
            viewBox="0 0 100 74.7"
            width="28"
            height="20.9"
            fill={LOGO_COLOR}
            fillRule="evenodd"
          >
            <path d={LOGO_PATH} />
          </svg>
          <span
            style={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: "0.08em",
              color: "#a8a19c",
              textTransform: "uppercase",
            }}
          >
            LiamTheMo
          </span>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "1000px",
          }}
        >
          {badge && badge.label && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: "10px",
                borderRadius: "999px",
                padding: "10px 22px",
                backgroundColor: badge.color,
              }}
            >
              {badge.icon && (
                <span style={{ display: "flex", fontSize: 24 }}>
                  {badge.icon}
                </span>
              )}
              <span
                style={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: 22,
                  color: "#0b0a0a",
                }}
              >
                {badge.label}
              </span>
            </div>
          )}
          {badge && !badge.label && badge.icon && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "flex-start",
                width: 64,
                height: 64,
                borderRadius: "50%",
                fontSize: 32,
                backgroundColor: badge.color,
              }}
            >
              {badge.icon}
            </div>
          )}
          {typeof title === "string" ? (
            <span
              style={{
                display: "flex",
                fontFamily: "Bricolage Grotesque",
                fontWeight: 700,
                fontSize: 64,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#f5f3f1",
              }}
            >
              {title}
            </span>
          ) : (
            title
          )}
          <span
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 28,
              lineHeight: 1.5,
              color: "#a8a19c",
            }}
          >
            {description}
          </span>
        </div>
      </div>
    ),
    { ...ogImageSize, fonts },
  );
}
