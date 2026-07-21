"use client";

import { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import { navLinks, categoryPills } from "@/data/site";

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
    <>
      <nav
        className={`fixed top-0 z-50 w-full px-6 py-3 transition-all ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-neutral-200"
            : "bg-white border-b border-neutral-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo />

          <div className="hidden items-center gap-6 md:flex">
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
              href="#"
              className="text-sm font-medium text-green-600 transition-colors hover:text-green-700"
            >
              Join
            </a>
            <a
              href="#"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400"
            >
              Sign In
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
          <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-6 shadow-lg md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-sm font-medium text-neutral-600"
                >
                  {link.label}
                </a>
              ))}
              <a href="#" onClick={closeMenu} className="text-sm font-medium text-green-600">Join</a>
              <a href="#" onClick={closeMenu} className="rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium">Sign In</a>
            </div>
          </div>
        )}
      </nav>

      {/* Secondary Category Pills Bar */}
      <div className="fixed top-[53px] z-40 w-full border-b border-neutral-200 bg-white px-6 py-2.5">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto">
          {categoryPills.map((pill) => (
            <a
              key={pill.href}
              href={pill.href}
              className="shrink-0 rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
            >
              {pill.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
