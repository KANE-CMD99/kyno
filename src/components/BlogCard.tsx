import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/db/blog-posts";
import { formatPostDate } from "@/lib/blog-content";

/**
 * 列表里用到的字段 —— 刻意去掉正文。
 *
 * `<PostList>` 是客户端组件，传进去的每个字段都会被序列化进 `/blog` 的 RSC
 * payload（也就在可索引的 HTML 里）。正文是长 markdown，而列表页一个字都不渲染，
 * 20 篇真实文章的正文会给首页式页面平白加上约 160 KB。完整 `BlogPost` 结构上
 * 可赋给本类型，所以服务端的 `PostEndMatter` / `blog/page.tsx` 无需改动。
 */
export type BlogListItem = Omit<BlogPost, "content">;

/**
 * 竖版卡片：顶部 16:9 封面，下方分类 / 标题 / 摘要 / 日期。
 *
 * 两个使用方都是多列网格（列表页 sm:2 / lg:3，文末 KEEP READING sm:3），所以
 * `sizes` 按「手机整宽、平板两列、桌面三列」给，最大约 33vw。
 * 卡片用 flex-col + 摘要下面的 `mt-auto` 把日期顶到底部，同一行里高度不齐时
 * 日期仍然对齐。
 */
export default function BlogCard({ post }: { post: BlogListItem }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video shrink-0 bg-neutral-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">📝</div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {post.category && (
          <span className="mb-1.5 self-start rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-800">
            {post.category}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 transition-colors group-hover:text-blue-600">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs text-neutral-500">{post.excerpt}</p>
        {post.publishedAt && (
          <p className="mt-auto pt-3 text-[11px] text-neutral-400">
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          </p>
        )}
      </div>
    </Link>
  );
}
