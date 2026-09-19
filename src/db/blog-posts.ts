import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

const STORE_PATH = path.join(DATA_DIR, "blog-posts.json");

export type BlogStatus = "draft" | "pending" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  publishedAt?: string;
  status: BlogStatus;
  author: string;
  /** Creator id when the post was submitted from a creator dashboard. */
  authorId?: string;
}

function getJSON(): BlogPost[] {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function saveJSON(data: BlogPost[]) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

function uniqueSlug(base: string, existing: BlogPost[], excludeId?: string): string {
  let candidate = base;
  let n = 2;
  while (existing.some((p) => p.slug === candidate && p.id !== excludeId)) {
    candidate = `${base}-${n}`;
    n++;
  }
  return candidate;
}

export { slugify } from "./slug.mjs";

export async function getAllPosts(): Promise<BlogPost[]> {
  return getJSON();
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  return getJSON()
    .filter((p) => p.status === "published")
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return getJSON().find((p) => p.slug === slug);
}

/** Posts owned by a creator, newest first — for the creator dashboard. */
export async function getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
  return getJSON()
    .filter((p) => p.authorId === authorId)
    .sort((a, b) => b.id.localeCompare(a.id));
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  return getJSON().find((p) => p.id === id);
}

export async function createPost(data: Omit<BlogPost, "id">): Promise<BlogPost> {
  const all = getJSON();
  const post: BlogPost = {
    ...data,
    id: String(Date.now()).slice(-8),
    slug: uniqueSlug(data.slug, all),
  };
  all.push(post);
  saveJSON(all);
  return post;
}

export async function updatePost(id: string, data: Omit<BlogPost, "id">): Promise<BlogPost | null> {
  const all = getJSON();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated: BlogPost = { ...data, id, slug: uniqueSlug(data.slug, all, id) };
  all[idx] = updated;
  saveJSON(all);
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const all = getJSON();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  saveJSON(filtered);
  return true;
}
