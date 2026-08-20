import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "About LiamTheMo";

export default async function Image() {
  return renderOgImage({
    title: "About",
    description:
      "A computer science student in Calgary who builds automation, spreadsheets and websites, and fixes computers.",
  });
}
