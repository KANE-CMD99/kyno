"use client";

import { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import { navLinks } from "@/data/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-6 py-4 transition-all ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-neutral-200"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse Products
          </a>
        </div>

        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-neutral-900 transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-neutral-900 transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-neutral-900 transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-base font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#products"
              onClick={closeMenu}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Browse Products
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
