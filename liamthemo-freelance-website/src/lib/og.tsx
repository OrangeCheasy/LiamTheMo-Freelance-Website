import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

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

  The small brand dot next to "LiamTheMo" is accent-coloured deliberately —
  it's a static, non-interactive marketing image, not a live page element, so
  §9.2's "orange only on clickables" rule (written for the site's UI) doesn't
  govern a logo mark the way it governs an in-page decoration.
*/

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
  title: string;
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
          backgroundColor: "#0b0a0a",
          backgroundImage:
            "radial-gradient(circle, #2a2626 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff6a1a",
            }}
          />
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
