"use server";

import { createPost, updatePost, deletePost, getAllPosts, getPostById, slugify } from "@/db/blog-posts";
import { revalidatePath } from "next/cache";
import type { BlogPost, BlogStatus } from "@/db/blog-posts";

type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  status: BlogStatus;
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
    // Editing a creator-submitted post must not drop its ownership.
    const existing = await getPostById(id);
    const result = await updatePost(id, { ...normalize(input), authorId: existing?.authorId });
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

/** Approve a creator-submitted post — publishes it live. */
export async function adminApprovePost(id: string) {
  try {
    const existing = await getPostById(id);
    if (!existing) return { success: false, error: "Post not found" };
    const result = await updatePost(id, {
      slug: existing.slug,
      title: existing.title,
      excerpt: existing.excerpt,
      coverImage: existing.coverImage,
      content: existing.content,
      author: existing.author,
      authorId: existing.authorId,
      status: "published",
      publishedAt: new Date().toISOString(),
    });
    if (!result) return { success: false, error: "Post not found" };
    revalidate();
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

/** Send a post back to its author as a draft. */
export async function adminRejectPost(id: string) {
  try {
    const existing = await getPostById(id);
    if (!existing) return { success: false, error: "Post not found" };
    const result = await updatePost(id, {
      slug: existing.slug,
      title: existing.title,
      excerpt: existing.excerpt,
      coverImage: existing.coverImage,
      content: existing.content,
      author: existing.author,
      authorId: existing.authorId,
      status: "draft",
      publishedAt: undefined,
    });
    if (!result) return { success: false, error: "Post not found" };
    revalidate();
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
