"use server";

import { createProduct, updateProduct, deleteProduct, getAllProducts } from "@/db/products-store";
import { revalidatePath } from "next/cache";

export async function adminGetProducts() {
  return await getAllProducts();
}

export async function adminCreateProduct(input: {
  name: string; category: string; price: number; originalPrice?: number;
  creator: string; description: string; features: string[]; includes: string[];
}) {
  try {
    const product = await createProduct({ ...input, previewImages: [] });
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true, id: product.id };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function adminUpdateProduct(id: string, input: {
  name: string; category: string; price: number; originalPrice?: number;
  creator: string; description: string; features: string[]; includes: string[];
}) {
  try {
    const result = await updateProduct(id, { ...input, previewImages: [] });
    if (!result) return { success: false, error: "Product not found" };
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function adminDeleteProduct(id: string) {
  try {
    await deleteProduct(id);
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
