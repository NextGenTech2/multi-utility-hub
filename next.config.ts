import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // Generates static `out/` directory for Cloudflare Pages
  trailingSlash: true,   // Ensures clean URLs on Cloudflare's static file server
  images: {
    unoptimized: true,   // Required for static export (no Next.js image server)
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
