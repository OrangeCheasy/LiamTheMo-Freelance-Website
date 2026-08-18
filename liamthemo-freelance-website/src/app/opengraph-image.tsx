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
*/
export default async function Image() {
  return renderOgImage({
    title: "Hi, I'm Liam. I design and build digital experiences.",
    description:
      "Custom automation, spreadsheets, websites, and technology solutions for individuals and small businesses.",
  });
}
