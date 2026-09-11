import Link from "next/link";
import type { BlogPost } from "@/db/blog-posts";

export default function HeroSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="flex min-h-[90vh] items-center bg-[#FAFAFA] px-6 pb-24 pt-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 md:flex-row md:gap-12">
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
            Buy once.
            <br />
            Own forever.
            <br />
            <span className="text-blue-600">Create freely.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-neutral-500 md:mx-0">
            Resume templates, posters &amp; design assets — yours forever, from $1.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a href="#products" className="w-full rounded-lg bg-blue-600 px-8 py-3 text-center text-base font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
              Browse Products
            </a>
            <a href="/free-downloads" className="w-full rounded-lg border border-neutral-300 px-8 py-3 text-center text-base font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900 sm:w-auto">
              Free Downloads
            </a>
          </div>

          <p className="mt-4 text-sm text-neutral-400">Instant download &middot; No subscription</p>
        </div>

        {/* Right: Recent blog posts */}
        <div className="w-full max-w-md flex-1 md:max-w-none">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-900">From the blog</h2>
            <Link href="/blog" className="text-xs font-medium text-blue-600 hover:text-blue-700">View all →</Link>
          </div>
          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
              <p className="text-sm text-neutral-400">Blog posts coming soon</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-md">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt="" loading="lazy" decoding="async" className="h-14 w-20 shrink-0 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xl">📝</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-neutral-900">{post.title}</h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
