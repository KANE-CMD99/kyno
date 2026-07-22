"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { registerAction, loginAction } from "@/app/actions";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "signin" | "signup";
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, initialMode = "signin", onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const switchMode = () => {
    setError("");
    setMode(mode === "signin" ? "signup" : "signin");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    startTransition(async () => {
      let result;
      if (mode === "signup") {
        const name = form.get("name") as string;
        result = await registerAction(name, email, password);
      } else {
        result = await loginAction(email, password);
      }

      if (result.success) {
        onClose();
        if ((result as { isAdmin?: boolean }).isAdmin) {
          router.push("/admin/dashboard");
        } else {
          onSuccess?.();
        }
      } else {
        setError(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-neutral-900">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {mode === "signin"
                ? "Sign in to access your library and downloads."
                : "Join Kyno and start downloading premium assets."}
            </p>

            <div className="mt-6 flex rounded-lg bg-neutral-100 p-1">
              <button
                onClick={() => { setError(""); setMode("signin"); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "signin"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setError(""); setMode("signup"); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "signup"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-neutral-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-neutral-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-neutral-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {mode === "signup" && (
                  <p className="mt-1 text-xs text-neutral-400">At least 6 characters</p>
                )}
              </div>

              {mode === "signin" && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700">Forgot password?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {isPending ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-neutral-500">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={switchMode} className="font-medium text-blue-600 hover:text-blue-700">
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
