import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Makes Cloudflare bindings (ASSETS, IMAGES) available during `next dev`.
// Without this, anything reading a binding works in preview and production but
// is undefined in the dev server.
initOpenNextCloudflareForDev();
