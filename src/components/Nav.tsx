"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import { navLinks } from "@/data/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-6 py-4 transition-colors ${
        scrolled
          ? "bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/[0.06]"
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
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
