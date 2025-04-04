// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker/ARM
  output: "standalone", 
  reactStrictMode: true,
};

export default nextConfig;