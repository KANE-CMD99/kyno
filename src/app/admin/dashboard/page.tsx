"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductRecord } from "@/db/products-store";
import AdminProductList from "../AdminProductList";
import AdminProductForm from "../AdminProductForm";
import AdminAffiliates from "../AdminAffiliates";
import AdminCreators from "../AdminCreators";
import AdminUsers from "../AdminUsers";
import AdminAnalytics from "../AdminAnalytics";

type Tab = "analytics" | "products" | "creators" | "affiliates" | "users";

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("analytics");
  const [view, setView] = useState<
    "list"
    | { mode: "create"; category?: string }
    | { mode: "edit"; product: ProductRecord }
  >("list");
  const router = useRouter();

  useEffect(() => {
    fetch("/admin/api/check")
      .then((r) => r.json())
      .then((data) => {
        if (!data.isAdmin) router.push("/admin");
        else setAuthorized(true);
      })
      .catch(() => router.push("/admin"));
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  const handleAdd = (category?: string) => {
    setView({ mode: "create", category });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top bar — same style as homepage Nav */}
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-neutral-900">Admin Panel</h1>
            <div className="flex rounded-lg bg-neutral-100 p-1">
              <button
                onClick={() => setTab("analytics")}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${tab === "analytics" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Analytics
              </button>
              <button
                onClick={() => { setTab("products"); setView("list"); }}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${tab === "products" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Products
              </button>
              <button
                onClick={() => setTab("creators")}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${tab === "creators" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Creators
              </button>
              <button
                onClick={() => setTab("affiliates")}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${tab === "affiliates" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Affiliates
              </button>
              <button
                onClick={() => setTab("users")}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${tab === "users" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Users
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs text-blue-600 hover:text-blue-700">View Site</a>
            <button
              onClick={() => router.push("/auth/logout")}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {tab === "analytics" ? (
          <AdminAnalytics />
        ) : tab === "creators" ? (
          <AdminCreators />
        ) : tab === "users" ? (
          <AdminUsers />
        ) : tab === "affiliates" ? (
          <AdminAffiliates />
        ) : view === "list" ? (
          <AdminProductList
            onEdit={(product) => setView({ mode: "edit", product })}
            onAdd={handleAdd}
          />
        ) : (
          <div>
            <button
              onClick={() => setView("list")}
              className="mb-6 text-sm text-blue-600 hover:text-blue-700"
            >
              &larr; Back to products
            </button>
            <AdminProductForm
              product={view.mode === "edit" ? view.product : null}
              defaultCategory={view.mode === "create" ? view.category : undefined}
              onSaved={() => setView("list")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
