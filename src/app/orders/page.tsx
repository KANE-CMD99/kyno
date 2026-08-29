"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site-config";

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "none"; text: string } | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.sent) {
        setMessage({
          type: "success",
          text: "Download links have been sent to your email. Check your inbox (and spam folder).",
        });
      } else {
        setMessage({ type: "none", text: "No purchases found for that email." });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  return (
    <>
      <Nav />
      <main className="min-h-[80vh] bg-[#FAFAFA] pt-[105px]">
        <div className="mx-auto max-w-lg px-6 py-16 text-center">
          <span className="text-6xl select-none">{String.fromCodePoint(0x1F4E6)}</span>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">Find Your Downloads</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Enter the email you used during checkout and we&apos;ll email your download links.
          </p>

          <form onSubmit={handleLookup} className="mt-8 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Links"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 rounded-xl border p-5 ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50"
                  : message.type === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-neutral-200 bg-white"
              }`}
            >
              <p
                className={`text-sm ${
                  message.type === "error"
                    ? "text-red-600"
                    : message.type === "success"
                      ? "text-emerald-800"
                      : "text-neutral-600"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          <p className="mt-10 text-xs text-neutral-400">
            Need help?{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-blue-600 hover:text-blue-700">Contact support</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
