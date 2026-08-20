import { getService, serviceSlugs } from "@/data/services";
import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og";
import { SERVICE_META } from "@/lib/types";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "LiamTheMo service";

// Mirrors the page's own generateStaticParams (src/app/services/[slug]/page.tsx)
// — App Router doesn't inherit it, an image route under a dynamic segment needs
// its own copy to prerender one image per service instead of on demand (§4.1).
export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return renderOgImage({ title: "Services", description: "" });
  }

  return renderOgImage({
    title: service.title,
    description: service.tagline,
    badge: { icon: service.icon, color: SERVICE_META[service.slug].chipHex },
  });
}
