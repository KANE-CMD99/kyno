import Link from "next/link";
import type { BlogPost } from "@/db/blog-posts";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-md">
      {post.coverImage ? (
        <img src={post.coverImage} alt="" loading="lazy" decoding="async" className="h-16 w-24 shrink-0 rounded-md object-cover" />
      ) : (
        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-2xl">📝</div>
      )}
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{post.excerpt}</p>
        <p className="mt-1 text-[11px] text-neutral-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</p>
      </div>
    </Link>
  );
}
