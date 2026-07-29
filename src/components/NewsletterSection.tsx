"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* fail silently */ }
    setStatus("submitted");
  };

  return (
    <section className="bg-neutral-900 px-6 py-20">
      <motion.div
        className="mx-auto max-w-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white">Stay in the loop</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Get notified about new products, freebies, and exclusive discounts.
        </p>

        {status === "submitted" ? (
          <motion.p
            className="mt-6 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Thanks for subscribing! Check your inbox.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!consent}
                className="shrink-0 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                Subscribe
              </button>
            </div>
            <label className="flex items-center gap-2 text-left cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-3.5 w-3.5 rounded border-neutral-600 text-blue-600" />
              <span className="text-xs text-neutral-500">I agree to receive product updates and marketing emails.{" "}
                <a href="/privacy" className="text-blue-400 underline hover:text-blue-300">Privacy Policy</a>
              </span>
            </label>
          </form>
        )}

        <p className="mt-3 text-xs text-neutral-600">
          No spam. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}
