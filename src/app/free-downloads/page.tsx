import type { Metadata } from "next";
import { getAllProducts } from "@/db/products-store";
import FreeDownloadsClient, { type FreeProduct } from "./FreeDownloadsClient";

// Prerender so the free products are in the HTML: they are the site's main
// lead magnet and were previously only reachable after a client-side fetch.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Free Downloads",
  description:
    "Free resume templates, printables and design assets. Enter your email and we'll send the download link — no signup required.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.kynocreative.com"}/free-downloads` },
};

const categoryEmoji: Record<string, string> = {
  Photos: "📷",
  Fonts: "🔤",
  Templates: "📐",
  Free: "🎁",
};

export default async function FreeDownloadsPage() {
  const products = await getAllProducts().catch(() => []);

  const free: FreeProduct[] = products
    .filter((p) => p.category === "Free" && p.downloadFile)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description || "",
      fileSize: p.downloadFile?.size ? `${(p.downloadFile.size / 1024 / 1024).toFixed(1)} MB` : "N/A",
      format: p.downloadFile?.name ? p.downloadFile.name.split(".").pop()?.toUpperCase() ?? "FILE" : "FILE",
      emoji: categoryEmoji[p.category] || "🎁",
      thumbnail: p.previewImages?.[0],
    }));

  return <FreeDownloadsClient products={free} />;
}
