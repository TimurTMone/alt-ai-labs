import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "export" for Capacitor static mobile builds (BUILD_MODE=static)
  // "standalone" for optimized Node server output (default for production Hetzner deploy)
  output:
    process.env.BUILD_MODE === "static" ? "export" : "standalone",
};

export default nextConfig;
