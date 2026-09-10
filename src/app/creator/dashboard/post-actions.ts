"use server";

import {
  getPostsByAuthor,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  slugify,
  type BlogStatus,
} from "@/db/blog-posts";
import { getCreatorSessionFromCookie } from "@/lib/creator-auth";
import { revalidatePath } from "next/cache";

export type CreatorPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  /** true = submit for admin review, false = keep as a private draft. */
  submit: boolean;
};

function revalidate() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]");
  revalidatePath("/admin/dashboard");
  revalidatePath("/creator/dashboard");
}

export async function creatorGetPosts() {
  const session = await getCreatorSessionFromCookie();
  if (!session) return { success: false as const, error: "Unauthorized", posts: [] };
  const posts = await getPostsByAuthor(session.id);
  return { success: true as const, posts };
}

export async function creatorCreatePost(input: CreatorPostInput) {
  const session = await getCreatorSessionFromCookie();
  if (!session) return { success: false as const, error: "Unauthorized" };

  const slug = slugify((input.slug || "").trim() || input.title);
  const status: BlogStatus = input.submit ? "pending" : "draft";

  try {
    const post = await createPost({
      slug,
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      coverImage: input.coverImage || undefined,
      content: input.content,
      status,
      author: session.name || session.username,
      authorId: session.id,
    });
    revalidate();
    return { success: true as const, id: post.id };
  } catch (e) {
    return { success: false as const, error: String(e) };
  }
}

export async function creatorUpdatePost(id: string, input: CreatorPostInput) {
  const session = await getCreatorSessionFromCookie();
  if (!session) return { success: false as const, error: "Unauthorized" };

  const existing = await getPostById(id);
  if (!existing || existing.authorId !== session.id)
    return { success: false as const, error: "Not found or not yours" };

  const slug = slugify((input.slug || "").trim() || input.title);
  // Editing an already-published post sends it back for review, so an approved
  // post can't be swapped for different content after the fact.
  const status: BlogStatus = input.submit
    ? "pending"
    : existing.status === "published"
      ? "pending"
      : "draft";

  try {
    const result = await updatePost(id, {
      slug,
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      coverImage: input.coverImage || undefined,
      content: input.content,
      status,
      author: session.name || session.username,
      authorId: session.id,
    });
    if (!result) return { success: false as const, error: "Post not found" };
    revalidate();
    return { success: true as const };
  } catch (e) {
    return { success: false as const, error: String(e) };
  }
}

export async function creatorDeletePost(id: string) {
  const session = await getCreatorSessionFromCookie();
  if (!session) return { success: false as const, error: "Unauthorized" };

  const existing = await getPostById(id);
  if (!existing || existing.authorId !== session.id)
    return { success: false as const, error: "Not found or not yours" };

  try {
    await deletePost(id);
    revalidate();
    return { success: true as const };
  } catch (e) {
    return { success: false as const, error: String(e) };
  }
}
