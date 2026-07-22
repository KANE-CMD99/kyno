"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Logo from "./Logo";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";
import UserMenu from "./UserMenu";
import { useCart } from "./CartContext";
import { navLinks, categoryPills } from "@/data/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full px-6 py-3 transition-all ${
          scrolled
            ? "bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800"
            : "bg-neutral-900 border-b border-neutral-800"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo dark />

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <UserMenu onOpenAuth={openAuth} />

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-md p-1.5 text-neutral-300 transition-colors hover:text-white"
              aria-label="Open cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>

          <button
            className="flex flex-col gap-1.5 p-2 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-transform ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-transform ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {menuOpen && (
          <div className="mt-3 rounded-lg border border-neutral-700 bg-neutral-800 p-6 shadow-lg md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-sm font-medium text-neutral-300"
                >
                  {link.label}
                </a>
              ))}
              <button onClick={() => { closeMenu(); openAuth("signup"); }} className="text-left text-sm font-medium text-green-500">Join</button>
              <button onClick={() => { closeMenu(); openAuth("signin"); }} className="rounded-lg border border-neutral-600 px-4 py-2.5 text-center text-sm font-medium text-neutral-200">Sign In</button>
            </div>
          </div>
        )}
      </nav>

      {/* Secondary Category Pills Bar */}
      <div className="fixed top-[53px] z-40 w-full border-b border-neutral-800 bg-neutral-900 px-6 py-2.5">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto">
          {categoryPills.map((pill) => (
            <Link
              key={pill.href}
              href={pill.href}
              className="shrink-0 rounded-full border border-neutral-700 px-4 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-400 hover:text-white"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </div>

      <AuthModal isOpen={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
