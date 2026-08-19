"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateProduct, adminUpdateProduct } from "./product-actions";
import type { ProductRecord } from "@/db/products-store";

interface AdminProductFormProps {
  product: ProductRecord | null;
  defaultCategory?: string;
  onSaved: () => void;
}

const CATEGORIES = ["Photos", "Fonts", "Templates"];

export default function AdminProductForm({ product, defaultCategory, onSaved }: AdminProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || defaultCategory || "Photos");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() || "");
  const [creator, setCreator] = useState(product?.creator || "Kyno");
  const [description, setDescription] = useState(product?.description || "");
  const [features, setFeatures] = useState<string[]>(product?.features || [""]);
  const [includes, setIncludes] = useState<string[]>(product?.includes || [""]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(product?.previewImages || []);
  const [downloadFile, setDownloadFile] = useState<{ url: string; name: string; size: number } | undefined>(product?.downloadFile);
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isEditing = !!product?.id;

  const ALLOWED_FILE_TYPES = [
    "application/zip", "application/x-zip-compressed",
    "font/otf", "font/ttf", "font/woff2",
    "application/pdf",
    "application/octet-stream", // .xmp, .lrtemplate etc
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Only image files allowed for preview"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
    setUploading(true); setError("");
    const form = new FormData(); form.append("file", file);
    const res = await fetch("/admin/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) setUploadedImages((prev) => [...prev, data.url]);
    else setError(data.error || "Upload failed");
    setUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) { setError("File must be under 200MB"); return; }
    setUploadingFile(true); setError("");
    const form = new FormData(); form.append("file", file);
    const res = await fetch("/admin/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) setDownloadFile({ url: data.url, name: file.name, size: file.size });
    else setError(data.error || "Upload failed");
    setUploadingFile(false);
  };

  const removeImage = (url: string) => setUploadedImages((prev) => prev.filter((u) => u !== url));
  const removeFile = () => setDownloadFile(undefined);

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
      previewImages: uploadedImages,
      ...(downloadFile ? { downloadFile } : {}),
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

      {/* Preview Images */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Preview Images</h3>
          <p className="mt-0.5 text-xs text-neutral-500">Shown on storefront as product thumbnails</p>
        </div>

        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((url) => (
              <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-6 text-neutral-400 transition-colors hover:border-blue-400 hover:text-blue-600">
          {uploading ? <span className="text-sm">Uploading...</span> : (<>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-sm font-medium">Upload preview images</span>
            <span className="text-xs">PNG, JPG, WebP · Max 5MB each</span>
          </>)}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Digital Product File */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Digital Product File</h3>
          <p className="mt-0.5 text-xs text-neutral-500">The actual downloadable file customers receive after purchase</p>
        </div>

        {downloadFile ? (
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-blue-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <div>
                <p className="text-sm font-medium text-neutral-900">{downloadFile.name}</p>
                <p className="text-xs text-neutral-400">{(downloadFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
            <button type="button" onClick={removeFile} className="rounded p-1 text-neutral-400 transition-colors hover:text-red-500">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-6 text-neutral-400 transition-colors hover:border-blue-400 hover:text-blue-600">
            {uploadingFile ? <span className="text-sm">Uploading...</span> : (<>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-sm font-medium">Upload product file</span>
              <span className="text-xs">ZIP, OTF, TTF, WOFF2, PDF · Max 200MB</span>
            </>)}
            <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploadingFile} />
          </label>
        )}
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
