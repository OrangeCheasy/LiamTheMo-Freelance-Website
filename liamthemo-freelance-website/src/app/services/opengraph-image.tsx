import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Services — LiamTheMo";

export default async function Image() {
  return renderOgImage({
    title: "Services",
    description:
      "Automation, spreadsheets and data, websites, local tech help around Calgary, and Roblox development.",
  });
}
