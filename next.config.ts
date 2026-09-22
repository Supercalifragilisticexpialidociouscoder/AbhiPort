import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the workspace root (a stray lockfile higher up would otherwise confuse Turbopack).
  turbopack: { root: path.resolve(".") },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
