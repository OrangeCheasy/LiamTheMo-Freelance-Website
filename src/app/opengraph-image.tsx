import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt =
  "LiamTheMo — Hi, I'm Liam. I design and build digital experiences.";

/*
  Copy is the home page hero, word for word (owner request, 2026-08-18): the
  embed is the first thing anyone sees when the link is pasted, and it reading
  differently from the page it opens is the drift worth avoiding. If the hero
  changes, change this with it — src/app/page.tsx is the source.

  `description` briefly diverged from the hero paragraph (kept outcome
  wording for search-result purposes) before rejoining it 2026-08-21 — see
  the note on page.tsx's `openGraph.description`, which this matches.

  2026-08-20: the TITLE now also copies the hero's own three-tier styling
  (page.tsx's h1), not just its words — "Liam" in accent, the two lines under
  it in --color-text-secondary (#c3beba), everything else in --color-text
  (#f5f3f1). That's rich JSX rather than a plain string, which is what
  `renderOgImage`'s `title` prop grew a ReactNode branch for (see src/lib/og.tsx).
  Three explicit lines, not one wrapped string: satori wraps a lone text node
  inside a flex box fine (proven by every other page's single-string title),
  but does not reliably re-wrap several differently-styled inline children
  sharing one flex row, so each of the hero's own line breaks is spelled out
  as its own full-width row instead of left to automatic wrapping.

  &nbsp; BEFORE "Liam", NOT A PLAIN SPACE. Satori trims a text node's trailing
  whitespace before laying it out as a flex item, which swallowed an ordinary
  space between "I'm" and the accent-coloured "Liam" span and ran the two
  words together with no gap. A non-breaking space survives that trim.
*/
const TITLE_LINE_STYLE = {
  display: "flex" as const,
  fontFamily: "Bricolage Grotesque",
  fontWeight: 700 as const,
  fontSize: 64,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
};

export default async function Image() {
  return renderOgImage({
    title: (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ ...TITLE_LINE_STYLE, color: "#f5f3f1" }}>
          Hi, I&apos;m&nbsp;
          <span style={{ color: "#ff6a1a" }}>Liam</span>.
        </div>
        <div style={{ ...TITLE_LINE_STYLE, color: "#c3beba" }}>
          I design and build
        </div>
        <div style={{ ...TITLE_LINE_STYLE, color: "#c3beba" }}>
          digital experiences.
        </div>
      </div>
    ),
    description:
      "I'm a designer and developer who enjoys creating clean, functional, and user-focused solutions.",
  });
}
