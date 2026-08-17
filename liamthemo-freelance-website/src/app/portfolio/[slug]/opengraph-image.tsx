import { projects } from "@/data/projects";
import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "LiamTheMo project case study";

// Mirrors the page's own generateStaticParams (src/app/portfolio/[slug]/page.tsx)
// — see the same note in src/app/services/[slug]/opengraph-image.tsx.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return renderOgImage({ title: "Projects", description: "" });
  }

  return renderOgImage({
    title: project.title,
    description: project.summary,
    badge: { label: "Projects", color: "#ff6a1a" },
  });
}
