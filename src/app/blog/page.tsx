import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/db/blog-posts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PostList from "@/components/PostList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kynocreative.com";

export const metadata: Metadata = {
  title: "Blog",
  description: "Design tips, resume advice, and creative resources from Kyno.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

export const revalidate = 3600;

export default async function BlogPage() {
  // 剥掉正文再交给客户端组件：`PostList` 是 client component，传进去的每个字段都会
  // 被序列化进 `/blog` 的 RSC payload —— 也就是可索引的 HTML 本身。列表页一个字都
  // 不渲染正文，20 篇真实文章的正文会给这个页面平白加上约 160 KB。
  // 只改类型没用（类型是编译期的，props 按运行时数据序列化），必须在边界上真的删掉。
  const posts = (await getPublishedPosts()).map(({ content, ...listItem }) => listItem);

  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        <div className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">Blog</span>
            </p>
          </div>
        </div>

        <section className="px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">Blog</h1>
            <p className="mt-2 text-neutral-500">Design tips and creative resources.</p>

            {posts.length === 0 ? (
              <div className="mt-12 rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center">
                <p className="text-sm text-neutral-400">No posts yet. Check back soon!</p>
              </div>
            ) : (
              <PostList posts={posts} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
