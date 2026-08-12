import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache override on purpose. The OpenNext quickstart wires an R2
// bucket here to back ISR and on-demand revalidation; this site prerenders every
// page at build time, so nothing would ever be written to it. See CLAUDE.md §13.
// If ISR is ever introduced, this is where the cache override goes.
export default defineCloudflareConfig({});
