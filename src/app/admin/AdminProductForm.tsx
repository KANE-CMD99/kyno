"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateProduct, adminUpdateProduct } from "./product-actions";
import type { ProductRecord } from "@/db/products-store";

interface AdminProductFormProps {
  product: ProductRecord | null;
  onSaved: () => void;
}

const CATEGORIES = ["Photos", "Fonts", "Templates"];

export default function AdminProductForm({ product, onSaved }: AdminProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "Photos");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() || "");
  const [creator, setCreator] = useState(product?.creator || "Kyno");
  const [description, setDescription] = useState(product?.description || "");
  const [features, setFeatures] = useState<string[]>(product?.features || [""]);
  const [includes, setIncludes] = useState<string[]>(product?.includes || [""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isEditing = !!product?.id;

  const addLine = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
  };

  const updateLine = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, arr: string[]) => {
    const next = [...arr];
    next[index] = value;
    setter(next);
  };

  const removeLine = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>, arr: string[]) => {
    setter(arr.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const input: Omit<ProductRecord, "id"> = {
      name,
      category,
      price: parseFloat(price) || 0,
      ...(originalPrice ? { originalPrice: parseFloat(originalPrice) } : {}),
      creator,
      description,
      features: features.filter((f) => f.trim()),
      includes: includes.filter((f) => f.trim()),
      previewImages: [],
    };

    const result = isEditing
      ? await adminUpdateProduct(product!.id, input)
      : await adminCreateProduct(input);

    if (result.success) {
      onSaved();
      router.refresh();
    } else {
      setError(result.error || "Save failed");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">
          {isEditing ? `Edit: ${product?.name}` : "New Product"}
        </h2>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
        </button>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
        <h3 className="text-sm font-semibold text-neutral-900">Basic Info</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-neutral-700">Product Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">Price ($)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">Original Price ($) — optional</label>
            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} min="0" step="0.01" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Creator</label>
          <input value={creator} onChange={(e) => setCreator(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
        </div>
      </div>

      {/* Features */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Features</h3>
          <button type="button" onClick={() => addLine(setFeatures)} className="text-xs text-blue-600 hover:text-blue-700">+ Add</button>
        </div>
        {features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <input value={f} onChange={(e) => updateLine(i, e.target.value, setFeatures, features)} className="flex-1 rounded-lg border border-neutral-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500" />
            {features.length > 1 && (
              <button type="button" onClick={() => removeLine(i, setFeatures, features)} className="shrink-0 text-xs text-red-500 hover:text-red-600">Remove</button>
            )}
          </div>
        ))}
      </div>

      {/* Includes */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">What&apos;s Included</h3>
          <button type="button" onClick={() => addLine(setIncludes)} className="text-xs text-blue-600 hover:text-blue-700">+ Add</button>
        </div>
        {includes.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={(e) => updateLine(i, e.target.value, setIncludes, includes)} className="flex-1 rounded-lg border border-neutral-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500" />
            {includes.length > 1 && (
              <button type="button" onClick={() => removeLine(i, setIncludes, includes)} className="shrink-0 text-xs text-red-500 hover:text-red-600">Remove</button>
            )}
          </div>
        ))}
      </div>
    </form>
  );
}
