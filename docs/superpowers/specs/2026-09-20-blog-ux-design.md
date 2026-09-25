# Blog UX Redesign — 2026-09-20

> 承接 `2026-09-09-blog-design.md`。原设计把「富文本编辑器」和「文章分类」列为不做；
> 本次**保留 Markdown**（与原决定一致），但**有意把分类加进来**，因为列表页筛选和详情页标签都需要它。

## Overview

博客现在「能用但不好用」：录入端是一个 16 行的纯文本框，阅览端正文之后什么都没有。
本次只改**界面与内容呈现**，不动数据流（仍是 JSON store + Server Actions）和渲染管道（仍是 `react-markdown` + `remark-gfm`）。

两端各自的目标：

- **录入端**：让写作者不必背 Markdown 语法，也不要在提交后才发现排版错了。
- **阅览端**：让详情页和列表页有视觉重心和内容层次，而不是一张白纸。

## Requirements（已与用户确认）

| # | 决定 |
|---|------|
| 1 | 保留 Markdown，**不上** WYSIWYG；加格式化工具栏 + 实时预览 + 正文插图 |
| 2 | 详情页 = **C 的 hero（全宽封面 + 标题压图）+ A 的正文与文末模块**（阅读优先） |
| 3 | 文末模块全要：作者卡 / 相关文章 / 相关商品 / 订阅框 / 顶部进度条 |
| 4 | 列表页 = **A：重点文章大卡 + 3 列竖版网格 + 分类筛选** |
| 5 | 商品导流**只在文末**，正文内不嵌商品 |
| 6 | **新增文章分类字段** |
| 7 | 那篇 2000×2000 的方图封面**重出为 16:9** |

## Data Model

`src/db/blog-posts.ts` 的 `BlogPost` 增加一个可选字段：

```
category?: string;   // 展示用分类，取值受限于 BLOG_CATEGORIES
```

**取值固定为常量表**（不做自由输入），因为列表页的筛选 tab 需要稳定的集合：

```ts
export const BLOG_CATEGORIES = [
  "Resume Tips",
  "Design",
  "Printables",
  "Career",
] as const;
```

- 分类是**可选**的：老文章没有该字段 → 详情页不渲染标签、列表页筛选归入「全部」。
- 现有 7 篇文章需要一次性**回填**分类（内容侧改动，见下）。
- `data-dir.ts` 的 seed 列表**不变**（同一文件，只多一个字段）。

## 录入端

`CreatorPostForm.tsx` 与 `AdminPostForm.tsx` 目前是两份高度相似的实现。
本次**抽出一个共享编辑器组件**，两边都改用它 —— 否则每改一处都要同步两遍。

新组件 `src/components/MarkdownEditor.tsx`：

| 能力 | 做法 |
|---|---|
| 格式化工具栏 | 加粗 / 斜体 / H2 / H3 / 列表 / 有序列表 / 引用 / 链接 / 插图。按钮对**选中文本**做包裹，无选中时插入占位符 |
| 实时预览 | 直接复用现有 `react-markdown` + `remark-gfm` + `markdown.css`。宽屏左右并排；窄屏收成「编辑 / 预览」切换 |
| 正文插图 | 复用现成的上传端点（创作者 `/api/creator/upload`，管理员 `/admin/api/upload`），上传成功后插入 `![](url)`。**同时支持拖拽**图片到编辑区 |
| 底部状态条 | 预计阅读时长：按正文**词数 ÷ 220** 估算（站点全英文），四舍五入到分钟，最少 1 分钟 |

表单其余改动：

- **摘要自动生成**：正文首个非标题段落，复用 `src/lib/seo.ts` 的 `metaDescription()` 截断。首次由正文生成，一旦手改过就不再自动覆盖（用一个 `excerptTouched` 标记）。
- **标题长度提示**：实时显示 `43/60`，超 60 变琥珀色。理由与详情页 SEO 一致（60 字符是 SERP 显示上限）。
- **分类下拉**：数据源为 `BLOG_CATEGORIES`。
- 封面区补一句**推荐 1600×900**的尺寸提示（hero 是 16:9）。

## 阅览端 · 详情页

自上而下：

1. **顶部阅读进度条** —— 新的 client 小组件，`scroll` 监听 + `requestAnimationFrame` 节流。必须尊重 `prefers-reduced-motion`（本项目已在 `ClientLayout` 用 `MotionConfig` 与 `globals.css` 处理全局动效，此处不新增例外）。
2. **Hero** —— 全宽封面，`next/image` 且带 `priority`（这是 LCP 元素）；标题、分类标签、作者·日期压在图上，加深色渐变保证对比度。
   **无封面时的降级**：深色底块 + 白色标题，不塌陷成空白。
   **方图处理**：hero 容器固定 16:9 并 `object-cover` 裁切，所以方图不会破版 —— **重出封面是为了视觉质量（构图不被裁掉上下），不是功能必需**。即使不重出，页面也是正常的。
3. **正文窄栏** —— 扩写 `markdown.css`（见下）。
4. **文末模块区**（浅灰底，与正文形成视觉断点）：
   - **作者卡** —— 头像 + 简介 + 「View Store」链接到 `/[username]`
   - **相关文章** —— 优先同分类，不足 3 篇则用最新文章补齐；**排除当前篇**。文章没有分类时直接按最新取 3。
   - **相关商品** —— 取 3。**按分类映射**（文章分类 → 商品分类），不足则用最新商品补齐：

     | 文章分类 | 商品分类 |
     |---|---|
     | Resume Tips | Templates |
     | Career | Templates |
     | Design | Photos |
     | Printables | Photos |
     | （无分类） | 最新 3 件 |

     绿色系配色与文章卡片区分，避免广告感
   - **订阅框** —— 复用现有 `/api/newsletter`

**新增结构化数据**：现在详情页没有 `BlogPosting` JSON-LD。本次补上（headline / image / datePublished / author / articleSection），对 Google 的富结果有帮助。

## 阅览端 · 列表页

- **置顶大卡**：最新一篇，左图右文 + 摘要。
- **3 列竖版网格**：其余文章。
- **分类筛选 tab**：`All` + `BLOG_CATEGORIES` 中实际有文章的项。
  **筛选是纯客户端状态，不生成可索引的筛选 URL** —— 否则 `?category=x` 会制造一堆重复内容。筛选后若无结果，显示空状态而不是空白页。

## Markdown 排版（`src/app/blog/markdown.css`）

现有 17 行只覆盖到 h3、p、列表、代码、引用、表格。补齐：

- `h4`–`h6`（现在落到浏览器默认样式）
- `img` 圆角 + `figure/figcaption` 图注（现在图片是裸的）
- `hr`、行内 `a:hover`、`code` 在标题里的表现
- 表格外层横向滚动容器（窄屏现在会撑破布局）
- 段落间距与首屏可读性微调

## 内容侧（一次性）

- 给现有 7 篇文章回填 `category`。
- 重出那张 2000×2000 的封面为 1600×900 —— `scripts/make-blog-covers.js` 已是这个尺寸与风格，扩用它即可。

## SEO

- 详情页补 `BlogPosting` JSON-LD。
- 列表页分类筛选**不产生新 URL**（见上）。
- canonical / sitemap / per-post metadata 现有实现保持不变，本次不动。

## 无障碍

- 工具栏按钮需要 `aria-label`（现在图标按钮无文字）。
- 编辑/预览切换要有可访问的状态语义。
- 进度条是装饰性元素，不进入 tab 序。
- 表格横向滚动容器加 `tabindex="0"` + 可见焦点环（键盘用户才能滚动）。
- 深色底上的文字对比度需过 WCAG AA 4.5:1（上一轮刚全站修过一遍对比度，hero 上不要再引入新的失败项）。

## Files touched

新增：
- `src/components/MarkdownEditor.tsx` — 工具栏 + 编辑区 + 预览
- `src/components/ReadingProgress.tsx`
- `src/components/PostCategoryTabs.tsx` — 列表页筛选（client）
- `src/components/PostEndMatter.tsx` — 文末模块区（作者卡/相关文章/相关商品/订阅）

修改：
- `src/db/blog-posts.ts` — `category` 字段 + `BLOG_CATEGORIES`
- `src/app/blog/[slug]/page.tsx` — hero、进度条、文末模块、BlogPosting JSON-LD
- `src/app/blog/page.tsx` — 置顶大卡 + 网格 + 筛选 tab
- `src/components/BlogCard.tsx` — 改为竖版大图卡
- `src/app/creator/dashboard/CreatorPostForm.tsx` / `src/app/admin/AdminPostForm.tsx` — 改用共享编辑器 + 分类 + 摘要自动生成
- `src/app/creator/dashboard/post-actions.ts` / `src/app/admin/post-actions.ts` — 透传 `category`
- `src/app/blog/markdown.css` — 排版补齐
- `scripts/make-blog-covers.js` — 重出方图封面

## Out of scope（本方案不做）

- **WYSIWYG 富文本编辑器** —— 沿用原设计的判断，保留 Markdown。
- **正文内嵌商品卡** —— 用户明确选择只在文末放相关商品。
- 文章评论（原设计即排除）。
- RSS / 定时发布（原设计即排除）。
- 搜索框。
- 分页 —— 当前 7 篇，等到 20+ 再谈。
