"use client";

import { useState, useEffect } from "react";

interface UserMenuProps {
  onOpenAuth: (mode: "signin" | "signup") => void;
}

export default function UserMenu({ onOpenAuth }: UserMenuProps) {
  const [user, setUser] = useState<{ name: string; email: string } | null | undefined>(undefined);
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
        <button
          onClick={() => onOpenAuth("signup")}
          className="text-sm font-medium text-green-500 transition-colors hover:text-green-400"
        >
          Join
        </button>
        <button
          onClick={() => onOpenAuth("signin")}
          className="rounded-lg border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-400 hover:text-white"
        >
          Sign In
        </button>
      </div>
    );
  }

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
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
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
