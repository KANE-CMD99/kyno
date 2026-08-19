import path from "path";
import fs from "fs";

// Vercel serverless: project directory is read-only, use /tmp
// Local dev: use project-relative data/ directory
export const DATA_DIR =
  process.env.VERCEL
    ? path.join("/tmp", "data")
    : path.join(process.cwd(), "data");

// Auto-seed: copy initial data from repo to runtime directory on Vercel
export function ensureDataDir() {
  const repoData = path.join(process.cwd(), "data");
  const target = DATA_DIR;
  if (target === repoData) return; // same dir, no need to seed

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = ["products-store.json", "creators.json", "orders.json", "users.json", "affiliates.json", "affiliate-clicks.json", "newsletter-subscribers.json"];
  for (const file of files) {
    const src = path.join(repoData, file);
    const dest = path.join(target, file);
    if (!fs.existsSync(dest) && fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`[bootstrap] Seeded ${file} to ${target}`);
    }
  }
}
