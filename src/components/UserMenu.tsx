"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserData {
  name: string;
  email: string;
  role?: string;
  username?: string;
}

export default function UserMenu() {
  const [user, setUser] = useState<UserData | null | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    window.location.href = "/auth/logout";
  };

  if (user === undefined) {
    return <div className="w-20 h-8 animate-pulse rounded bg-neutral-800 hidden md:block" />;
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/login"
          className="rounded-lg border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-400 hover:text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const isCreator = user.role === "creator";

  return (
    <div className="hidden items-center gap-4 md:flex">
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-800"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          {user.name}
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-neutral-700 bg-neutral-800 py-1 shadow-xl">
            <div className="px-4 py-2 border-b border-neutral-700">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-neutral-400">{user.email}</p>
              {user.role && (
                <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-500">
                  {isAdmin ? "Admin" : isCreator ? "Creator" : "Customer"}
                </p>
              )}
            </div>

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block w-full px-4 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {isCreator && (
              <>
                <Link
                  href="/creator/dashboard"
                  className="block w-full px-4 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.username && (
                  <Link
                    href={`/${user.username}`}
                    className="block w-full px-4 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Store
                  </Link>
                )}
              </>
            )}

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white border-t border-neutral-700 mt-0"
            >
              Sign Out
            </button>
          </div>
        )}
        {menuOpen && (
          <div className="fixed inset-0 z-[-1]" onClick={() => setMenuOpen(false)} />
        )}
      </div>
    </div>
  );
}
