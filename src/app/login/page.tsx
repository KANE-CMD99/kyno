"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const result = await loginAction(email, password);

    setLoading(false);

    if (result.success) {
      if ((result as { isAdmin?: boolean }).isAdmin) {
        router.push("/admin/dashboard");
      } else if ((result as { isCreator?: boolean }).isCreator) {
        router.push("/creator/dashboard");
      } else {
        router.push("/");
      }
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-6">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-lg">
        <h2 className="text-xl font-bold text-neutral-900">Sign in</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Sign in to manage your products and account.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-neutral-700">Email</label>
            <input id="email" name="email" type="email" required
              className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-neutral-700">Password</label>
            <div className="relative mt-1.5">
              <input id="password" name="password" type={showPassword ? "text" : "password"} required minLength={6}
                autoComplete="current-password"
                className="block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-neutral-500">
          Buying products?{" "}
          <Link href="/orders" className="font-medium text-blue-600 hover:text-blue-700">
            Find your downloads
          </Link>
          {" "}&mdash; no account needed.
        </p>

        <div className="mt-6 border-t border-neutral-200 pt-4 text-center">
          <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-600">
            &larr; Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
