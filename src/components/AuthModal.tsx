"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "signin" | "signup";
  onClose: () => void;
}

export default function AuthModal({ isOpen, initialMode = "signin", onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  const switchMode = () => setMode(mode === "signin" ? "signup" : "signin");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>

            {/* Header */}
            <h2 className="text-xl font-bold text-neutral-900">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {mode === "signin"
                ? "Sign in to access your library and downloads."
                : "Join Kyno and start downloading premium assets."}
            </p>

            {/* Tabs */}
            <div className="mt-6 flex rounded-lg bg-neutral-100 p-1">
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "signin"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "signup"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              {mode === "signup" && (
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-neutral-700">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-neutral-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-neutral-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {mode === "signin" && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Footer text */}
            <p className="mt-5 text-center text-xs text-neutral-500">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={switchMode}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
