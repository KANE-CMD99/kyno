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
  /** Creator profile username —— 没有时整张作者卡不渲染（作者不是 creator）。 */
  authorUsername?: string;
  /** CreatorRecord.avatarUrl —— 站内路径时才走 next/image，见下方说明。 */
  authorAvatar?: string;
  /** CreatorRecord.bio */
  authorBio?: string;
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

export default function PostEndMatter({
  post,
  authorUsername,
  authorAvatar,
  authorBio,
  relatedPosts,
  relatedProducts,
}: Props) {
  // 头像可能存成外链，而 next.config 没有配 remotePatterns —— 扔给 next/image 会
  // 直接抛错把整页打成 500。所以只对站内路径走优化器，其余一律退回首字母圆牌。
  const optimizableAvatar = authorAvatar?.startsWith("/") ? authorAvatar : "";

  return (
    // 浅灰底 + 顶部细线，与正文形成视觉断点。
    <section className="mt-14 border-t border-neutral-200 bg-neutral-50 py-12">
      {/* 块间距统一交给 [&>*+*]，不写在各个块上：作者卡被省略时 KEEP READING 才是
          第一个子元素，否则它会带着 mt-12 叠在 section 的 py-12 上，顶部空出一倍。
          px-6 挪到内层（而非 section）：section 上的内边距会把内容盒撑成 768px，
          比正文的 max-w-3xl px-6（720px）宽出 48px，与上文对不齐。 */}
      <div className="mx-auto max-w-3xl px-6 [&>*+*]:mt-12">
        {/* 作者不是 creator 时（没有 username）整张卡省略，不留空壳。 */}
        {authorUsername && (
          <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-6">
            {optimizableAvatar ? (
              <Image
                src={optimizableAvatar}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-lg font-bold text-white">
                {(post.author || "").trim().charAt(0).toUpperCase() || "K"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Written by</p>
              <p className="mt-0.5 truncate text-base font-semibold text-neutral-900">{post.author}</p>
              {authorBio && <p className="mt-1 text-sm leading-relaxed text-neutral-500">{authorBio}</p>}
            </div>
            <Link
              href={`/${authorUsername}`}
              className="ml-auto shrink-0 rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              View Store
            </Link>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div>
            <BlockHeading>KEEP READING</BlockHeading>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div>
            <BlockHeading tone="emerald">SHOP THE LOOK</BlockHeading>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedProducts.map((p) => (
                <RelatedProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <div>
          <NewsletterSection />
        </div>
      </div>
    </section>
  );
}
