import type { MetadataRoute } from "next";

/*
  CLAUDE.md §11, §14 step 7. Deliberately does NOT disallow "/" — the homepage's
  noindex is set via a robots meta tag (src/app/page.tsx), and crawlers have to
  be allowed to fetch a page to see that tag and honor it. Disallowing it here
  would hide the noindex signal instead of the page.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://liamthemo.com/sitemap.xml",
  };
}
