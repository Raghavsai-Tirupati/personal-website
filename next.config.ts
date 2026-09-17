import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Clean, static-friendly build. No runtime image optimization dependency:
  // link assets/thumbnails are plain <img> served from /public.
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
