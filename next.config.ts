import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev server's artifacts separate so a production build cannot
  // replace webpack manifests underneath a running local portal.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "standalone",
};

export default nextConfig;
