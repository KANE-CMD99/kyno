import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-neutral-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
