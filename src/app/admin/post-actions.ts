"use server";

import { createPost, updatePost, deletePost, getAllPosts, getPostById, slugify } from "@/db/blog-posts";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import type { BlogPost, BlogStatus } from "@/db/blog-posts";

type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  /** 必填但可为 undefined —— 漏传的调用点应当在编译期就暴露。 */
  category: string | undefined;
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
  await requireAdmin();
  return await getAllPosts();
}

export async function adminCreatePost(input: BlogPostInput) {
  await requireAdmin();
  try {
    const post = await createPost(normalize(input));
    revalidate();
    return { success: true as const, id: post.id };
  } catch (e) {
    return { success: false as const, error: String(e) };
  }
}

export async function adminUpdatePost(id: string, input: BlogPostInput) {
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
  try {
    const existing = await getPostById(id);
    if (!existing) return { success: false, error: "Post not found" };
    const result = await updatePost(id, {
      slug: existing.slug,
      title: existing.title,
      excerpt: existing.excerpt,
      category: existing.category,
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
  await requireAdmin();
  try {
    const existing = await getPostById(id);
    if (!existing) return { success: false, error: "Post not found" };
    const result = await updatePost(id, {
      slug: existing.slug,
      title: existing.title,
      excerpt: existing.excerpt,
      category: existing.category,
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
