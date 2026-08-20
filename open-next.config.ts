import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/*
  An incremental cache is required even though this site never revalidates.

  Prerendered pages are NOT written to `.open-next/assets`. `next build` writes
  every one of them — including plain static routes — into `.open-next/cache`,
  and the Worker reads them back through whatever incremental cache is
  configured here. With no cache configured, that read has no backing store.

  A plain static route survives that: the Worker just renders it on demand. A
  route with `generateStaticParams` and `dynamicParams = false` does not. It
  will not render a param on demand by definition, and with no cache it cannot
  read the prerendered HTML either, so it 404s in production while working
  perfectly in `next dev`. That is what took the five service pages down.

  `staticAssetsIncrementalCache` is the right backing store here rather than R2
  or KV: it serves the prerendered pages from the assets binding, which is free
  and unmetered (§4.1), and it is read-only by design — writes are a no-op. That
  matches a site that prerenders everything and revalidates nothing. If ISR or
  on-demand revalidation is ever introduced, this must become R2-backed, because
  this cache cannot store a regenerated page.
*/
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
