import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_MODE === "static" ? "export" : undefined,
};

export default nextConfig;
