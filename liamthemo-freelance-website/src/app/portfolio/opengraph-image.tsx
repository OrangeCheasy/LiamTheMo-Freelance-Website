import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Portfolio — LiamTheMo";

export default async function Image() {
  return renderOgImage({
    title: "Portfolio",
    description:
      "Real automation, spreadsheet and Roblox work — the problem, what was built, and what changed.",
  });
}
