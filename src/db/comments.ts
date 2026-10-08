import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

export interface Comment {
  id: string;
  productId: string;
  name: string;
  email: string;
  /** 1–5 stars. Optional: anything left before ratings existed has none. */
  rating?: number;
  text: string;
  createdAt: string;
}

function commentsPath(): string {
  return path.join(DATA_DIR, "comments.json");
}

function readComments(): Comment[] {
  try {
    const p = commentsPath();
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

function writeComments(comments: Comment[]) {
  const p = commentsPath();
  const d = path.dirname(p);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(comments, null, 2));
}

export function getCommentsForProduct(productId: string): Comment[] {
  return readComments()
    .filter((c) => c.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addComment(comment: Omit<Comment, "id" | "createdAt">): Comment {
  const all = readComments();
  const newComment: Comment = {
    ...comment,
    id: String(Date.now()).slice(-8),
    createdAt: new Date().toISOString(),
  };
  all.push(newComment);
  writeComments(all);
  return newComment;
}

/**
 * Average of the ratings left so far, and how many contributed. Comments
 * without a rating are ignored, so this stays an honest reflection of the
 * people who actually scored the product.
 */
export function getRatingSummary(productId: string): { average: number; count: number } {
  const rated = getCommentsForProduct(productId).filter(
    (c) => typeof c.rating === "number" && c.rating >= 1 && c.rating <= 5
  );
  if (rated.length === 0) return { average: 0, count: 0 };
  const sum = rated.reduce((total, c) => total + (c.rating as number), 0);
  return { average: Math.round((sum / rated.length) * 10) / 10, count: rated.length };
}
