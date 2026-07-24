"use server";

import { getCreatorByEmail, verifyCreatorPassword } from "@/db/creators";
import { setCreatorSession } from "@/lib/creator-auth";

export async function creatorLogin(email: string, password: string) {
  if (!email || !password) return { success: false, error: "Email and password required" };
  const creator = getCreatorByEmail(email.toLowerCase().trim());
  if (!creator) return { success: false, error: "Invalid credentials" };
  if (!verifyCreatorPassword(creator, password)) return { success: false, error: "Invalid credentials" };
  await setCreatorSession({
    id: creator.id,
    username: creator.username,
    name: creator.name,
    email: creator.email,
    commission: creator.commission,
  });
  return { success: true };
}
