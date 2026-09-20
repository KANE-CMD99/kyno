import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedPosts, getPostBySlug } from "@/db/blog-posts";
import { getCreators } from "@/db/creators";
import { getAllProducts } from "@/db/products-store";
import { readingMinutes, selectRelatedPosts, selectRelatedProducts } from "@/lib/blog-content";
import { metaDescription, pageTitle } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import PostEndMatter from "@/components/PostEndMatter";
import "../markdown.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kynocreative.com";

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
  const image = post.coverImage ? `${SITE_URL}${post.coverImage}` : `${SITE_URL}/og-default.png`;
  const description = metaDescription(post.excerpt || post.content);
  return {
    title: pageTitle(post.title),
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
      // Cover art is 1600×900 or 1:1 depending on the post, so no fixed size is
      // declared — a wrong one makes scrapers crop the preview badly.
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
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

  const relatedPosts = selectRelatedPosts(await getPublishedPosts(), post.id, 3);
  const products = await getAllProducts().catch(() => []);
  const relatedProducts = selectRelatedProducts(
    products.map((p) => ({
      id: p.id,
      category: p.category,
      name: p.name,
      price: p.price,
      previewImages: p.previewImages,
    })),
    post.category,
    3
  );

  // 封面存的是站内路径，但仍补一层绝对 URL 判断 —— JSON-LD 里的相对路径会被判为无效。
  const coverPath = post.coverImage || "/og-default.png";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: coverPath.startsWith("http") ? coverPath : `${SITE_URL}${coverPath}`,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    // 空字符串同样会被判为无效标注，所以没有分类时整个字段不输出。
    ...(post.category ? { articleSection: post.category } : {}),
  };

  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        <ReadingProgress />
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

        <article>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* Hero —— 全宽封面，标题压图。整块在正文窄栏之外，所以不受 max-w-3xl 约束。 */}
          <div className="relative h-[320px] w-full overflow-hidden sm:h-[420px]">
            {post.coverImage ? (
              // `priority` 不能省：这张图就是 LCP 元素。
              <Image src={post.coverImage} alt="" fill priority sizes="100vw" className="object-cover" />
            ) : (
              // 无封面的降级：深色底块，白色标题仍然压得住。
              <div className="h-full w-full bg-neutral-900" />
            )}
            {/* 深色渐变保证白字对比度，不依赖封面本身的明暗。 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-8">
              {post.category && (
                <span className="mb-3 inline-block rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-800">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{post.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                {authorUsername ? (
                  <Link href={`/${authorUsername}`} className="font-medium text-white hover:underline">{post.author}</Link>
                ) : (
                  <span>{post.author}</span>
                )}
                {post.publishedAt && (
                  <>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString()}</time>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{readingMinutes(post.content)} min read</span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-6 pb-12">
            <div className="markdown-body mt-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ node, ...props }) => (
                    <div className="table-scroll" tabIndex={0} role="region" aria-label="Table">
                      <table {...props} />
                    </div>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        <PostEndMatter
          post={post}
          authorUsername={authorUsername}
          relatedPosts={relatedPosts}
          relatedProducts={relatedProducts}
        />
      </main>
      <Footer />
    </>
  );
}
