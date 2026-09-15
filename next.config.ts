import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      // /index duplicates the homepage; send it to the canonical URL.
      { source: "/index", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
