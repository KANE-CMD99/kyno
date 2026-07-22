"use server";

import { cookies } from "next/headers";
import { validateAdminCredentials, setAdminSession } from "@/lib/admin-auth";

export async function adminLogin(email: string, password: string) {
  if (!validateAdminCredentials(email, password)) {
    return { success: false, error: "Invalid credentials." };
  }
  await setAdminSession();
  return { success: true };
}
