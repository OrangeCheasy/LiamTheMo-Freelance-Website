import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "LiamTheMo — I build tools that save you time";

export default async function Image() {
  return renderOgImage({
    title: "I build tools that save you time",
    description:
      "Custom automation, spreadsheets, websites, and local tech help for individuals and small businesses.",
  });
}
