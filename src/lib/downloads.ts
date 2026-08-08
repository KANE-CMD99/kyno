import fs from "fs";
import path from "path";

export function getProductFilePath(productId: string): string | null {
  // In production, return a path to the actual file
  // For now, check if the product JSON exists as proof of purchase
  const jsonPath = path.join(process.cwd(), "src", "data", "products", `${productId}.json`);
  if (fs.existsSync(jsonPath)) return jsonPath;
  return null;
}

export function getProductDownloadName(productId: string, productName: string): string {
  return `${productName.toLowerCase().replace(/\s+/g, "-")}.zip`;
}
