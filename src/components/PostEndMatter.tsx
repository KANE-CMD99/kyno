import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/db/blog-posts";
import BlogCard from "./BlogCard";
import NewsletterSection from "./NewsletterSection";

/** 文末商品卡只需要这几个字段 —— 详情页从 `ProductRecord` 里挑出这些再传进来。 */
export interface RelatedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  previewImages?: string[];
}

interface Props {
  post: BlogPost;
  /** Creator profile username —— 没有时作者卡只显示名字，不显示「View Store」。 */
  authorUsername?: string;
  relatedPosts: BlogPost[];
  relatedProducts: RelatedProduct[];
}

/** 小标题统一走这里：空数据时整块不渲染，所以标题永远不会孤立出现。 */
function BlockHeading({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "emerald" }) {
  return (
    <h2
      className={`mb-4 text-xs font-bold tracking-widest ${
        tone === "emerald" ? "text-emerald-700" : "text-neutral-400"
      }`}
    >
      {children}
    </h2>
  );
}

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  const thumb = product.previewImages?.[0];
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50 transition-colors hover:border-emerald-500"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-emerald-100">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover"
          />
        ) : (
          // 商品图缺失时的降级 —— 与文字同色系，不塌陷成白洞。
          <div className="flex h-full items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-emerald-400"
              aria-hidden="true"
            >
              <path d="M3 7h18l-1.5 12.5a2 2 0 0 1-2 1.5h-13a2 2 0 0 1-2-1.5L3 7Z" />
              <path d="M8 7V6a4 4 0 0 1 8 0v1" />
            </svg>
          </div>
        )}
      </div>
      <div className="px-3 py-3">
        <h3 className="truncate text-sm font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        {/* 与站内「$0 显示成 Free」的既有约定保持一致。 */}
        <p className="mt-1 text-xs font-bold text-emerald-700">
          {product.price === 0 ? "Free" : `$${product.price}`}
        </p>
      </div>
    </Link>
  );
}

export default function PostEndMatter({ post, authorUsername, relatedPosts, relatedProducts }: Props) {
  return (
    // 浅灰底 + 顶部细线，与正文形成视觉断点。
    <section className="mt-14 border-t border-neutral-200 bg-neutral-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-lg font-bold text-white">
            {(post.author || "").trim().charAt(0).toUpperCase() || "K"}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Written by</p>
            <p className="mt-0.5 truncate text-base font-semibold text-neutral-900">{post.author}</p>
          </div>
          {authorUsername && (
            <Link
              href={`/${authorUsername}`}
              className="ml-auto shrink-0 rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              View Store
            </Link>
          )}
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <BlockHeading>KEEP READING</BlockHeading>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <BlockHeading tone="emerald">SHOP THE LOOK</BlockHeading>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedProducts.map((p) => (
                <RelatedProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <NewsletterSection />
        </div>
      </div>
    </section>
  );
}
