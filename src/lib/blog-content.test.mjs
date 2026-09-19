import { test } from "node:test";
import assert from "node:assert";
import {
  deriveExcerpt,
  readingMinutes,
  filterByCategory,
  selectRelatedPosts,
  selectRelatedProducts,
} from "./blog-content.ts";

test("deriveExcerpt skips headings and returns the first prose paragraph", () => {
  const md = "## A heading\n\nFirst real paragraph of the post.\n\nSecond one.";
  assert.equal(deriveExcerpt(md), "First real paragraph of the post.");
});

test("deriveExcerpt strips inline markdown emphasis and links", () => {
  assert.equal(
    deriveExcerpt("Text with **bold** and a [link](https://x.test) inside."),
    "Text with bold and a link inside."
  );
});

test("deriveExcerpt truncates long prose at a word boundary, not mid-word", () => {
  // 钉死确切输出，不要只断言长度 —— `"word ".repeat(100)` 在第 39 字符处正好
  // 落在词尾，所以朴素的硬切实现也能满足「长度 ≤ 41 / 以省略号结尾」这类断言。
  assert.equal(deriveExcerpt("word ".repeat(100), 40), "word ".repeat(7).trimEnd() + "…");
  // 再来一个前缀截在词中间的输入，验证残缺词被丢弃而不是留下半截。
  assert.equal(deriveExcerpt("abcdefgh ".repeat(20), 40), "abcdefgh ".repeat(4).trimEnd() + "…");
});

test("readingMinutes is at least 1 and rounds to the nearest minute", () => {
  assert.equal(readingMinutes("short"), 1);
  assert.equal(readingMinutes("word ".repeat(220)), 1);
  assert.equal(readingMinutes("word ".repeat(330)), 2);
});

test("filterByCategory returns everything for null and matches exactly otherwise", () => {
  const posts = [{ category: "Design" }, { category: "Career" }, {}];
  assert.equal(filterByCategory(posts, null).length, 3);
  assert.equal(filterByCategory(posts, "Design").length, 1);
  assert.equal(filterByCategory(posts, "Nope").length, 0);
});

test("selectRelatedPosts prefers the same category and never returns the current post", () => {
  const mk = (id, category, publishedAt) => ({ id, category, publishedAt, title: id, slug: id, excerpt: "", content: "", status: "published", author: "x" });
  const posts = [
    mk("a", "Design", "2026-01-01"),
    mk("b", "Design", "2026-01-02"),
    mk("c", "Career", "2026-01-03"),
    mk("d", "Career", "2026-01-04"),
  ];
  const out = selectRelatedPosts(posts, "a", 3);
  assert.equal(out.length, 3);
  assert.ok(!out.some((p) => p.id === "a"));
  assert.equal(out[0].id, "b"); // same category first
});

test("selectRelatedPosts falls back to newest when the category is thin", () => {
  const mk = (id, category, publishedAt) => ({ id, category, publishedAt, title: id, slug: id, excerpt: "", content: "", status: "published", author: "x" });
  const posts = [mk("a", "Design", "2026-01-01"), mk("b", undefined, "2026-01-05"), mk("c", undefined, "2026-01-04")];
  const out = selectRelatedPosts(posts, "a", 2);
  assert.deepEqual(out.map((p) => p.id), ["b", "c"]);
});

test("selectRelatedProducts maps the post category to a product category", () => {
  const products = [
    { id: "1", category: "Templates" },
    { id: "2", category: "Photos" },
    { id: "3", category: "Templates" },
  ];
  const out = selectRelatedProducts(products, "Resume Tips", 2);
  assert.deepEqual(out.map((p) => p.id), ["1", "3"]);
});

test("selectRelatedProducts pads with other products when the mapped category is thin", () => {
  const products = [{ id: "1", category: "Photos" }, { id: "2", category: "Templates" }];
  const out = selectRelatedProducts(products, "Resume Tips", 3);
  assert.equal(out.length, 2);
});

test("selectRelatedProducts with no post category returns the first n products", () => {
  const products = [{ id: "1", category: "Photos" }, { id: "2", category: "Templates" }];
  assert.deepEqual(selectRelatedProducts(products, undefined, 2).map((p) => p.id), ["1", "2"]);
});
