"use server";

import { createPost, updatePost, deletePost, getAllPosts, slugify } from "@/db/blog-posts";
import { revalidatePath } from "next/cache";
import type { BlogPost } from "@/db/blog-posts";

type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  status: "draft" | "published";
  author: string;
};

function normalize(input: BlogPostInput): Omit<BlogPost, "id"> {
  const slug = slugify((input.slug || "").trim() || input.title);
  return {
    ...input,
    slug,
    publishedAt: input.status === "published" ? new Date().toISOString() : undefined,
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]");
  revalidatePath("/admin/dashboard");
}

export async function adminGetPosts(): Promise<BlogPost[]> {
  return await getAllPosts();
}

export async function adminCreatePost(input: BlogPostInput) {
  try {
    const post = await createPost(normalize(input));
    revalidate();
    return { success: true as const, id: post.id };
  } catch (e) {
    return { success: false as const, error: String(e) };
  }
}

export async function adminUpdatePost(id: string, input: BlogPostInput) {
  try {
    const result = await updatePost(id, normalize(input));
    if (!result) return { success: false, error: "Post not found" };
    revalidate();
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function adminDeletePost(id: string) {
  try {
    await deletePost(id);
    revalidate();
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
