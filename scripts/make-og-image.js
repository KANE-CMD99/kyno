// Generates public/og-default.png (1200x630) — the fallback social share card
// used by pages that don't have a product image of their own.
//
// Regenerate with `node scripts/make-og-image.js`. It is a static file, so
// nothing rebuilds it automatically: the copy on it drifts unless someone
// remembers. It last drifted here — the card claimed "From $1." while the
// cheapest product on the store was $4.90, and it advertised "posters & design
// assets" for a catalogue that has neither. The price is deliberately gone
// rather than corrected: a figure printed into a PNG nobody regenerates goes
// stale every time the pricing changes, and the promise it was attached to
// does not.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect x="80" y="200" width="64" height="8" rx="4" fill="#2563eb"/>
  <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="104" font-weight="bold" fill="#ffffff">Kyno Studio</text>
  <text x="80" y="368" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#a3a3a3">Resume templates, printables &amp; menu templates</text>
  <text x="80" y="428" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="bold" fill="#3b82f6">Buy once. Own forever. No subscription.</text>
  <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#525252">www.kynocreative.com</text>
</svg>`;

const out = path.join(process.cwd(), "public", "og-default.png");

sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(out)
  .then((info) => console.log(`wrote ${out} — ${info.width}x${info.height}, ${info.size} bytes`))
  .catch((e) => {
    console.error("failed:", e.message);
    process.exit(1);
  });
