"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductRecord } from "@/db/products-store";
import AdminProductList from "../AdminProductList";
import AdminProductForm from "../AdminProductForm";

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [view, setView] = useState<"list" | { mode: "create" } | { mode: "edit"; product: ProductRecord }>("list");
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

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-neutral-900">Admin Panel</h1>
            <p className="text-xs text-neutral-500">Product management</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs text-blue-600 hover:text-blue-700">View Site</a>
            <button
              onClick={() => { document.cookie = "kyno_admin_session=; Max-Age=0; path=/"; router.push("/admin"); }}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {view === "list" ? (
          <AdminProductList
            onEdit={(product) => setView({ mode: "edit", product })}
            onAdd={() => setView({ mode: "create" })}
          />
        ) : (
          <div>
            <button
              onClick={() => setView("list")}
              className="mb-6 text-sm text-blue-600 hover:text-blue-700"
            >
              &larr; Back to product list
            </button>
            <AdminProductForm
              product={view.mode === "edit" ? view.product : null}
              onSaved={() => setView("list")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
