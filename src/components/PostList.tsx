"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { filterByCategory } from "@/lib/blog-content";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import BlogCard from "./BlogCard";
// 只取类型：`import type` 会被编译期完全擦除，所以 `@/db/blog-posts` 的 `fs`
// 不会进浏览器 bundle（分类集合走零依赖的 `@/lib/blog-categories`）。
import type { BlogPost } from "@/db/blog-posts";

/**
 * 筛选状态纯客户端：**不写 URL**，没有 `?category=`、没有 router.push / replaceState。
 * 可索引的重复列表页对 SEO 是负收益，筛选结果不需要自己的地址。
 */
export default function PostList({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<string | null>(null);

  // 空分类是死路：tab 集合只列出真的有文章的分类。
  const categories = BLOG_CATEGORIES.filter((c) => posts.some((p) => p.category === c));
  const tabs: (string | null)[] = [null, ...categories];

  const visible = filterByCategory(posts, category);
  // 置顶位是「当前筛选结果的最新一篇」，不是永远的全站最新。
  const [featured, ...rest] = visible;

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab === category;
          return (
            <button
              key={tab ?? "All"}
              type="button"
              onClick={() => setCategory(tab)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
              }`}
            >
              {tab ?? "All"}
            </button>
          );
        })}
      </div>

      {!featured ? (
        <div className="mt-12 rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center">
          <p className="text-sm text-neutral-400">No posts in this category yet.</p>
          <button
            type="button"
            onClick={() => setCategory(null)}
            className="mt-4 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
          >
            View all posts
          </button>
        </div>
      ) : (
        <>
          <FeaturedCard post={featured} />
          {rest.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** 置顶大卡：左图右文 + 摘要。封面列在 sm 以上撑满卡片高度。 */
function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mt-6 grid overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg sm:grid-cols-2"
    >
      <div className="relative aspect-video bg-neutral-100 sm:aspect-auto sm:h-full sm:min-h-[260px]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">📝</div>
        )}
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8">
        {post.category && (
          <span className="mb-3 self-start rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-800">
            {post.category}
          </span>
        )}
        <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 transition-colors group-hover:text-blue-600 sm:text-2xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-500">{post.excerpt}</p>
        )}
        {post.publishedAt && (
          <p className="mt-4 text-xs text-neutral-400">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
          </p>
        )}
      </div>
    </Link>
  );
}
