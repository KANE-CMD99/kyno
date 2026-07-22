"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminGetProducts, adminDeleteProduct } from "./product-actions";
import type { ProductRecord } from "@/db/products-store";

interface AdminProductListProps {
  onEdit: (product: ProductRecord) => void;
  onAdd: () => void;
}

export default function AdminProductList({ onEdit, onAdd }: AdminProductListProps) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await adminGetProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await adminDeleteProduct(id);
    await loadProducts();
    router.refresh();
  };

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading products...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Products</h2>
          <p className="text-sm text-neutral-500">{products.length} total</p>
        </div>
        <button
          onClick={onAdd}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          + New Product
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-5 py-3 font-medium text-neutral-500">Product</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Category</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Price</th>
              <th className="px-5 py-3 font-medium text-neutral-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-neutral-400">
                  No products yet. Create your first one.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-neutral-900">{p.name}</p>
                    <p className="text-xs text-neutral-400">ID: {p.id}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-medium text-neutral-900">${p.price}</span>
                    {p.originalPrice && (
                      <span className="ml-2 text-xs text-neutral-400 line-through">${p.originalPrice}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onEdit(p)}
                      className="mr-3 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
