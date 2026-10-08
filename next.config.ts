import type { NextConfig } from "next";

// Per-visitor areas. Their HTML is a client shell with no personal data in it,
// but Next still marks the prerendered response as shareable for a year
// (s-maxage=31536000). That is invisible while there is no shared cache and a
// cross-visitor leak the moment a CDN or proxy_cache is put in front of the
// site, so the pages are kept out of shared caches up front.
const PRIVATE_PATHS = "checkout|login|orders|admin|creator";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Next re-optimizes an image whenever its cached entry expires, and the
    // default entry lives 60 seconds — so nearly every view of a less-popular
    // product re-encodes the source. A week keeps that CPU work off the server
    // without making a replaced image stale for long: uploads get timestamped
    // names, but scripts/make-blog-covers.js overwrites semantic ones, so a
    // regenerated cover does sit behind this until the week is up.
    minimumCacheTTL: 604800,
  },
  async redirects() {
    return [
      // /index duplicates the homepage; send it to the canonical URL.
      { source: "/index", destination: "/", permanent: true },
      // The fonts category was dropped from the catalogue when the store
      // settled on resume templates, printables and menus. kyno.top still
      // points 134 of its 254 pairing pages here — those clicks were landing
      // on a 404. /products is the honest target: the store sells no fonts,
      // so there is nothing more specific to send them to.
      { source: "/categories/fonts", destination: "/products", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: `/:section(${PRIVATE_PATHS})/:rest*`,
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
        ],
      },
      // Matches the bare path too, e.g. /admin with nothing after it.
      {
        source: `/:section(${PRIVATE_PATHS})`,
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
