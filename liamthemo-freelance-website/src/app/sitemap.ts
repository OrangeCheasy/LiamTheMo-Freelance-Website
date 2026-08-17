import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { serviceSlugs } from "@/data/services";

const BASE_URL = "https://liamthemo.com";

/*
  Static sitemap (CLAUDE.md §11, §14 step 7) — every route here is prerendered,
  so generating this at build time costs nothing extra (§4.1).

  `/` is deliberately left out. It is still `robots: { index: false }` (see the
  comment in src/app/page.tsx) because the quote form isn't operationally live
  yet — listing a noindex page in the sitemap sends search engines a
  contradictory signal. Add it back in the same change that removes the
  homepage's noindex.
*/
export default function sitemap(): MetadataRoute.Sitemap {
  // "/services" deliberately absent — the overview index route was removed;
  // the individual /services/[slug] pages below are still listed.
  const staticRoutes = ["/portfolio", "/about", "/contact"];

  const serviceRoutes = serviceSlugs.map((slug) => `/services/${slug}`);
  const projectRoutes = projects.map((project) => `/portfolio/${project.slug}`);

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));
}
