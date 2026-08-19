import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

export interface Comment {
  id: string;
  productId: string;
  name: string;
  email: string;
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
