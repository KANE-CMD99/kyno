/**
 * 该模块刻意零运行时依赖：`node --test` 无法解析 `@/` 路径别名，而相对导入
 * 必须带 `.ts` 扩展名（TypeScript 默认拒绝）。所以下面的截断逻辑是就地实现的，
 * 没有复用 `@/lib/seo` 的 `metaDescription` —— 别把它「优化」成 import。
 */

/** 文章分类 → 商品分类。没有映射的分类走「最新商品」兜底。 */
export const POST_CATEGORY_TO_PRODUCT: Record<string, string> = {
  "Resume Tips": "Templates",
  Career: "Templates",
  Design: "Photos",
  Printables: "Photos",
};

const WORDS_PER_MINUTE = 220;

/** 按词边界截断并补省略号 —— 与 `@/lib/seo` 的 metaDescription 同一策略。 */
function truncate(clean: string, max: number): string {
  if (clean.length <= max) return clean;
  const clipped = clean.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

/**
 * 摘要在卡片和 meta description 里都会用到，所以从正文首个**非标题、非引用、
 * 非代码块**段落提取 —— 直接截正文开头经常截到 "## What you get" 这种标题。
 */
export function deriveExcerpt(content: string, max = 160): string {
  const paragraphs = content.split(/\n{2,}/);
  for (const raw of paragraphs) {
    const block = raw.trim();
    if (!block) continue;
    if (/^(#{1,6}\s|>|\s*```|\s*[-*+]\s|\s*\d+\.\s|\|)/.test(block)) continue;
    const plain = block
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")    // images
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links keep their text
      .replace(/[*_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (plain) return truncate(plain, max);
  }
  return "";
}

/** 词数 ÷ 220，四舍五入到分钟，最少 1 分钟。 */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** 日期统一按 UTC 的 en-US 输出：时间戳是 UTC，而访客的时区与语言各不相同 ——
 *  用本地时区会让美西访客看到早一天，用本地 locale 会让服务端与客户端渲染不一致（水合不匹配）。 */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { timeZone: "UTC" });
}

/** `null` = 全部；否则精确匹配。没有分类的老文章只出现在「全部」里。 */
export function filterByCategory<T extends { category?: string }>(
  posts: T[],
  category: string | null
): T[] {
  if (!category) return posts;
  return posts.filter((p) => p.category === category);
}

/** 同分类优先，不足则按发布时间倒序补齐；永不返回当前篇。 */
export function selectRelatedPosts<
  T extends { id: string; category?: string; publishedAt?: string }
>(posts: T[], currentId: string, n = 3): T[] {
  const others = posts.filter((p) => p.id !== currentId);
  const current = posts.find((p) => p.id === currentId);
  const newest = (a: { publishedAt?: string }, b: { publishedAt?: string }) =>
    (b.publishedAt || "").localeCompare(a.publishedAt || "");

  if (!current?.category) return [...others].sort(newest).slice(0, n);

  const same = others.filter((p) => p.category === current.category).sort(newest);
  const rest = others.filter((p) => p.category !== current.category).sort(newest);
  return [...same, ...rest].slice(0, n);
}

/** 按映射挑同分类商品，不足则用其余商品补齐。 */
export function selectRelatedProducts<T extends { id: string; category: string }>(
  products: T[],
  postCategory: string | undefined,
  n = 3
): T[] {
  const target = postCategory ? POST_CATEGORY_TO_PRODUCT[postCategory] : undefined;
  if (!target) return products.slice(0, n);
  const matching = products.filter((p) => p.category === target);
  const rest = products.filter((p) => p.category !== target);
  return [...matching, ...rest].slice(0, n);
}
