import Link from "next/link";
import type { Metadata } from "next";

// Without this the 404 inherits the homepage's <title>, so the one page that
// should never be mistaken for the shop is titled as the shop. Next already
// emits `noindex` for a 404, so declaring robots here only duplicates the tag.
export const metadata: Metadata = {
  title: "Page not found",
};

const SUGGESTIONS = [
  { href: "/products", label: "Shop all products" },
  { href: "/free-downloads", label: "Free downloads" },
  { href: "/blog", label: "Guides & ideas" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-neutral-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        {/* A bare "Back to Home" strands anyone who arrived from a stale link. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Back to Home
          </Link>
          {SUGGESTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-block rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
