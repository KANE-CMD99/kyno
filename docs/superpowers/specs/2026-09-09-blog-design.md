# Blog Subsystem Design — 2026-09-09

## Overview

Add a blog to the Kyno site. The homepage hero right side (currently a 6-tile placeholder mosaic) becomes a "recent posts" area, backed by a full blog subsystem: data model, admin CRUD with draft/publish, public list + article pages, and SEO integration.

## Requirements (confirmed with user)

- Body written in **Markdown**, rendered with `react-markdown` + `remark-gfm`.
- **Cover image optional** per post, uploaded via the existing image upload endpoint.
- **Independent pages**: `/blog` (list) and `/blog/[slug]` (article).
- Homepage hero right side shows **recent 3 posts** (cover / title / excerpt / date).
- Posts have **draft / published** status; drafts are hidden from the public site.
- SEO: sitemap + per-article `generateMetadata` + `generateStaticParams`.

## Data Model

New file `data/blog-posts.json` (array), new access layer `src/db/blog-posts.ts` mirroring `src/db/products-store.ts`.

```
interface BlogPost {
  id: string;            // timestamp-based, like products
  slug: string;          // URL slug, unique, admin-editable
  title: string;
  excerpt: string;       // short summary for cards
  coverImage?: string;   // /uploads/... optional
  content: string;       // Markdown body
  publishedAt?: string;  // ISO date, set when published
  status: "draft" | "published";
  author: string;        // default "Kyno"
}
```

Access functions (mirror products-store): `getAllPosts()`, `getPublishedPosts()` (filters status, sorted by publishedAt desc), `getPostBySlug(slug)`, `createPost()`, `updatePost()`, `deletePost()`.

Slug generation: auto-slugify the title (lowercase, spaces→dashes, strip non-alphanumeric). If the user has a non-English title, the slug can be manually overridden in the admin form. On create, if auto-slug collides with an existing slug, append `-2`, `-3`, etc.

`data-dir.ts` `ensureDataDir()` seed list gains `blog-posts.json`.

## Dependencies

Add `react-markdown` and `remark-gfm` (and `remark` types as needed). No other new dependencies.

## Frontend

### 1. Homepage hero right side (`src/components/HeroSection.tsx`)

Replace the 6-tile mosaic (`placeholders` / `offsets` arrays) with a "recent posts" panel. HeroSection becomes an async server component (or receives `posts` as props) fetching `getPublishedPosts()` limited to 3.

Layout: a compact vertical stack of 3 post cards (cover thumb left + title/excerpt/date right, or a 3-column row if it fits). Each links to `/blog/[slug]`. A "View all posts →" link to `/blog`. Empty state: if no published posts, render a subtle placeholder (keeps hero balanced) or hide the panel.

Homepage `page.tsx` already `revalidate = 3600`; blog list is server-fetched so it participates in ISR. `revalidatePath("/")` is called after admin publish.

### 2. `/blog` list page (`src/app/blog/page.tsx`)

Server component. `getPublishedPosts()` sorted desc. Renders a grid of post cards (cover image, title, excerpt, date). `generateMetadata` sets title/description. Include in `sitemap.ts`.

### 3. `/blog/[slug]` article page (`src/app/blog/[slug]/page.tsx`)

Server component. `getPostBySlug(slug)`; if not found or status !== "published", `notFound()`. Renders title, date, author, cover image, and `<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>`. `generateMetadata` from post title/excerpt. `generateStaticParams` returns all published slugs.

Markdown styling: add `prose`-like styling via Tailwind (project uses Tailwind v4; either add `@tailwindcss/typography` or hand-roll minimal prose classes). Decision: hand-roll minimal markdown styles in a small CSS module to avoid another dependency, unless `@tailwindcss/typography` is already present (it is not).

### 4. Nav / footer links

Add "Blog" to `navLinks` (and/or footer "Resources" column) pointing to `/blog`.

## Admin

### `src/app/admin/dashboard/page.tsx`

Add `"blog"` to the `Tab` union and a "Blog" button in the top tab bar.

### `src/app/admin/AdminPostList.tsx`

Lists all posts (draft + published), each row: title, status badge, date, Edit / Delete buttons. "New Post" button.

### `src/app/admin/AdminPostForm.tsx`

Fields: title, slug (auto-filled, editable), excerpt (textarea), cover image (optional upload via `/admin/api/upload` type=image, reuse existing upload UI pattern from AdminProductForm), content (multiline textarea for Markdown), status toggle (draft / published), author (default "Kyno").

### `src/app/admin/post-actions.ts` (server actions)

`adminGetPosts`, `adminCreatePost`, `adminUpdatePost`, `adminDeletePost`. On any mutation, call `revalidatePath("/")`, `revalidatePath("/blog")`, `revalidatePath("/blog/[slug]")`, `revalidatePath("/admin/dashboard")`.

## SEO Integration

`src/app/sitemap.ts`: add `/blog` (priority 0.6) and one entry per published post (`/blog/${slug}`, priority 0.7).

## Error handling / edge cases

- `getPostBySlug` returns undefined → `notFound()` (404, no soft 404).
- Slug collision → auto-append `-2`, `-3`.
- Empty blog (no published posts) → `/blog` shows an empty state; hero panel hides gracefully.
- Markdown safety: `react-markdown` does not render raw HTML by default (no `rehype-raw`), so no stored-XSS surface. Cover image URL is server-controlled (upload whitelist already excludes html/svg).

## Files touched (new + modified)

New:
- `src/db/blog-posts.ts`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/admin/AdminPostList.tsx`
- `src/app/admin/AdminPostForm.tsx`
- `src/app/admin/post-actions.ts`
- (possibly) `src/components/BlogCard.tsx` and markdown styles

Modified:
- `src/components/HeroSection.tsx`
- `src/app/page.tsx` (fetch posts, pass to hero)
- `src/app/sitemap.ts`
- `src/app/admin/dashboard/page.tsx`
- `src/data/site.ts` (navLinks + footer)
- `src/lib/data-dir.ts` (seed list)
- `package.json` (deps)

## Out of scope

- Comments on posts.
- Rich-text/WYSIWYG editor.
- Post tags/categories.
- RSS feed (can add later).
- Scheduled publishing.
