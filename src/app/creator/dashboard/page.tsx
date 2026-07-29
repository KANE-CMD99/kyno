"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { getAllProducts, deleteProduct, type ProductRecord } from "@/db/products-store";
import CreatorProductForm from "./CreatorProductForm";

export default function CreatorDashboardPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [creator, setCreator] = useState<{ id: string; username: string; name: string; email: string } | null>(null);
  const [view, setView] = useState<"list" | "create" | { edit: ProductRecord }>("list");
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t, lang, setLang } = useLang();

  useEffect(() => {
    fetch("/api/creator/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.creator) router.push("/creator");
        else {
          setCreator(data.creator);
          setAuthorized(true);
        }
      })
      .catch(() => router.push("/creator"));
  }, [router]);

  const loadProducts = useCallback(() => {
    setLoading(true);
    fetch("/api/creator/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (authorized) loadProducts(); }, [authorized, loadProducts]);

  const handleDelete = async (product: ProductRecord) => {
    if (!confirm(t("admin.delete_confirm", { name: product.name }))) return;
    await fetch(`/api/creator/products?id=${product.id}`, { method: "DELETE" });
    loadProducts();
  };

  if (!authorized) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-100"><p className="text-sm text-neutral-500">{t("common.loading")}</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-neutral-900">{t("creator.title")}</h1>
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span>{creator?.name}</span>
              {creator?.username && (
                <Link href={`/${creator.username}`} className="text-blue-600 hover:text-blue-700">{t("creator.view_profile")}</Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Lang toggle */}
            <div className="flex rounded-lg bg-neutral-100 p-0.5">
              <button onClick={() => setLang("en")} className={`rounded px-2 py-0.5 text-xs font-medium ${lang === "en" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400"}`}>EN</button>
              <button onClick={() => setLang("zh")} className={`rounded px-2 py-0.5 text-xs font-medium ${lang === "zh" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400"}`}>中文</button>
            </div>
            <Link href={`/${creator?.username || ""}`} className="text-xs text-blue-600 hover:text-blue-700">{t("creator.view_store")}</Link>
            <button onClick={() => router.push("/auth/logout")} className="text-xs text-neutral-400 hover:text-neutral-600">{t("creator.signout")}</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {view === "list" ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{t("creator.products")}</h2>
                <p className="text-sm text-neutral-500">{t("admin.total", { n: products.length })}</p>
              </div>
              <button onClick={() => setView("create")} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">{t("creator.new_product")}</button>
            </div>

            {loading ? (
              <p className="text-sm text-neutral-500">{t("common.loading")}</p>
            ) : products.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-neutral-500">{t("creator.no_products")}</p>
                <p className="mt-1 text-sm text-neutral-400">{t("creator.no_products_hint")}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-5 py-3 font-medium text-neutral-500">{t("nav.products")}</th>
                      <th className="px-5 py-3 font-medium text-neutral-500">{t("admin.category")}</th>
                      <th className="px-5 py-3 font-medium text-neutral-500">{t("admin.price")}</th>
                      <th className="px-5 py-3 font-medium text-neutral-500 text-right">{t("admin.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                        <td className="px-5 py-3"><p className="font-medium text-neutral-900">{p.name}</p><p className="text-xs text-neutral-400">ID: {p.id}</p></td>
                        <td className="px-5 py-3"><span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">{p.category}</span></td>
                        <td className="px-5 py-3"><span className="font-medium text-neutral-900">${p.price}</span>{p.originalPrice && <span className="ml-2 text-xs text-neutral-400 line-through">${p.originalPrice}</span>}</td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => setView({ edit: p })} className="mr-3 text-xs font-medium text-blue-600 hover:text-blue-700">{t("creator.edit")}</button>
                          <button onClick={() => handleDelete(p)} className="text-xs font-medium text-red-500 hover:text-red-600">{t("creator.delete")}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button onClick={() => setView("list")} className="mb-6 text-sm text-blue-600 hover:text-blue-700">&larr; {t("creator.back")}</button>
            <CreatorProductForm
              product={view !== "create" ? view.edit : null}
              onSaved={() => { setView("list"); loadProducts(); }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
