import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedPosts, getPostBySlug } from "@/db/blog-posts";
import { getCreators } from "@/db/creators";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "../markdown.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Not Found" };
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt.slice(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 160),
      type: "article",
      url,
      ...(post.coverImage ? { images: [{ url: `${SITE_URL}${post.coverImage}`, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  // Link the byline to the author's creator profile when the post was
  // submitted from a creator dashboard.
  const authorUsername = post.authorId
    ? (await getCreators()).find((c) => c.id === post.authorId)?.username
    : undefined;

  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        <div className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-neutral-600 transition-colors">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">{post.title}</span>
            </p>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
            {authorUsername ? (
              <Link href={`/${authorUsername}`} className="font-medium text-blue-600 hover:text-blue-700">{post.author}</Link>
            ) : (
              <span>{post.author}</span>
            )}
            <span>·</span>
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</span>
          </div>
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="mt-6 w-full rounded-xl object-cover" />
          )}
          <div className="markdown-body mt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
