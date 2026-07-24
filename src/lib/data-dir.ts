import path from "path";

// Vercel serverless: project directory is read-only, use /tmp
// Local dev: use project-relative data/ directory
export const DATA_DIR =
  process.env.VERCEL
    ? path.join("/tmp", "data")
    : path.join(process.cwd(), "data");
