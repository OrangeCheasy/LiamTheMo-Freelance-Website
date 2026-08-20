import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */

  // Codespaces serves the dev server through a forwarded *.app.github.dev
  // domain, not localhost. Next 15+ blocks cross-origin requests to dev
  // assets (JS chunks, HMR) by default, so without this the HTML loads but
  // hydration never happens — a blank white page with no visible error
  // outside the terminal log.
  allowedDevOrigins: ["*.app.github.dev"],
};

export default nextConfig;

// Makes Cloudflare bindings (ASSETS, IMAGES) available during `next dev`.
// Without this, anything reading a binding works in preview and production but
// is undefined in the dev server.
initOpenNextCloudflareForDev();
