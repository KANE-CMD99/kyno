import { getAllProducts } from "@/db/products-store";
import FreeDownloadsClient, { type FreeProduct } from "./FreeDownloadsClient";

// Prerender so the free products are in the HTML: they are the site's main
// lead magnet and were previously only reachable after a client-side fetch.
// (Title/description/canonical live in this route's layout.tsx.)
export const revalidate = 3600;

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
