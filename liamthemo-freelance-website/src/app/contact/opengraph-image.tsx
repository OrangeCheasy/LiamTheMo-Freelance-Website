import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Contact LiamTheMo";

export default async function Image() {
  return renderOgImage({
    title: "Contact",
    description:
      "Tell me what you're trying to get done. I'll reply within one business day with what it would take.",
  });
}
