"use client";

import { useState, useEffect } from "react";
import type { ProductRecord } from "@/db/products-store";
import { useLang } from "@/components/LangContext";

const CATEGORIES = ["Photos", "Fonts", "Templates", "Free"];

interface Props {
  product: ProductRecord | null;
  onSaved: () => void;
}

export default function CreatorProductForm({ product, onSaved }: Props) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "Photos");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [features, setFeatures] = useState<string[]>(product?.features || [""]);
  const [includes, setIncludes] = useState<string[]>(product?.includes || [""]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(product?.previewImages || []);
  const [downloadFile, setDownloadFile] = useState<{ url: string; name: string; size: number } | undefined>(product?.downloadFile);
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useLang();

  const isEditing = !!product?.id;

  useEffect(() => {
    if (category === "Free") {
      setPrice("0");
      setOriginalPrice("");
    }
  }, [category]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Only image files"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Max 5MB"); return; }
    setUploading(true); setError("");
    const form = new FormData(); form.append("file", file);
    const res = await fetch("/api/creator/upload", { method: "POST", body: form, credentials: "include" });
    const data = await res.json();
    if (data.url) setUploadedImages((prev) => [...prev, data.url]);
    else setError(data.error || "Upload failed");
    setUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) { setError("Max 200MB"); return; }
    setUploadingFile(true); setError("");
    const form = new FormData(); form.append("file", file);
    const res = await fetch("/api/creator/upload", { method: "POST", body: form, credentials: "include" });
    const data = await res.json();
    if (data.url) setDownloadFile({ url: data.url, name: file.name, size: file.size });
    else setError(data.error || "Upload failed");
    setUploadingFile(false);
  };

  const addLine = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((prev) => [...prev, ""]);
  const updateLine = (i: number, v: string, s: React.Dispatch<React.SetStateAction<string[]>>, a: string[]) => { const n = [...a]; n[i] = v; s(n); };
  const removeLine = (i: number, s: React.Dispatch<React.SetStateAction<string[]>>, a: string[]) => s(a.filter((_, ix) => ix !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaving(true);
    const res = await fetch("/api/creator/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(isEditing ? { id: product!.id } : {}),
        name, category, price, ...(originalPrice ? { originalPrice } : {}),
        description, features: features.filter(Boolean), includes: includes.filter(Boolean),
        previewImages: uploadedImages, ...(downloadFile ? { downloadFile } : {}),
      }),
    });
    const data = await res.json();
    if (data.success) { setSuccess(t("common.success")); setTimeout(onSaved, 800); }
    else setError(data.error || "Failed");
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">{isEditing ? `Edit: ${product?.name}` : t("creator.new_product")}</h2>
        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60">
          {saving ? t("admin.saving") : isEditing ? t("admin.save") : t("admin.create")}
        </button>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      {success && <p className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">{success}</p>}

      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
        <h3 className="text-sm font-semibold text-neutral-900">{t("admin.basic_info")}</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-neutral-700">{t("admin.product_name")}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">{t("admin.category")}</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">{t("admin.price")} ($)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" disabled={category === "Free"} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-neutral-100 disabled:text-neutral-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">Original Price ($) — optional</label>
            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} min="0" step="0.01" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">{t("admin.description")}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
        </div>
      </div>

      {/* Upload sections — simplified versions of admin upload */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900">{t("admin.preview_images")}</h3>
        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((url) => (
              <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setUploadedImages((p) => p.filter((u) => u !== url))} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-6 text-neutral-400 transition-colors hover:border-blue-400 hover:text-blue-600">
          {uploading ? <span className="text-sm">{t("admin.uploading")}</span> : <><span className="text-sm font-medium">{t("admin.upload_images")}</span><span className="text-xs">{t("admin.images_hint")}</span></>}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900">{t("admin.digital_file")}</h3>
        {downloadFile ? (
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <div><p className="text-sm font-medium text-neutral-900">{downloadFile.name}</p><p className="text-xs text-neutral-400">{(downloadFile.size / 1024 / 1024).toFixed(1)} MB</p></div>
            </div>
            <button type="button" onClick={() => setDownloadFile(undefined)} className="rounded p-1 text-neutral-400 hover:text-red-500">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15" /></svg>
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-6 text-neutral-400 transition-colors hover:border-blue-400 hover:text-blue-600">
            {uploadingFile ? <span className="text-sm">{t("admin.uploading")}</span> : <><span className="text-sm font-medium">{t("admin.upload_file")}</span><span className="text-xs">{t("admin.file_hint")}</span></>}
            <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploadingFile} />
          </label>
        )}
      </div>

      {/* Features */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-neutral-900">{t("admin.features")}</h3><button type="button" onClick={() => addLine(setFeatures)} className="text-xs text-blue-600 hover:text-blue-700">{t("common.add")}</button></div>
        {features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <input value={f} onChange={(e) => updateLine(i, e.target.value, setFeatures, features)} className="flex-1 rounded-lg border border-neutral-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500" />
            {features.length > 1 && <button type="button" onClick={() => removeLine(i, setFeatures, features)} className="shrink-0 text-xs text-red-500 hover:text-red-600">{t("common.remove")}</button>}
          </div>
        ))}
      </div>

      {/* Includes */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-neutral-900">{t("admin.includes")}</h3><button type="button" onClick={() => addLine(setIncludes)} className="text-xs text-blue-600 hover:text-blue-700">{t("common.add")}</button></div>
        {includes.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={(e) => updateLine(i, e.target.value, setIncludes, includes)} className="flex-1 rounded-lg border border-neutral-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500" />
            {includes.length > 1 && <button type="button" onClick={() => removeLine(i, setIncludes, includes)} className="shrink-0 text-xs text-red-500 hover:text-red-600">{t("common.remove")}</button>}
          </div>
        ))}
      </div>
    </form>
  );
}
