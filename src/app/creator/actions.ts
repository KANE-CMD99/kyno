"use server";

import { authenticate } from "@/lib/auth-service";
import { setCreatorSession } from "@/lib/creator-auth";

export async function creatorLogin(email: string, password: string) {
  if (!email || !password) return { success: false, error: "Email and password required" };

  const result = await authenticate(email, password);
  if (!result || result.role !== "creator") {
    return { success: false, error: "Invalid credentials" };
  }

  await setCreatorSession({
    id: result.id,
    username: result.username || result.id,
    name: result.name,
    email: result.email,
    commission: result.commission || 20,
  });
  return { success: true };
}
