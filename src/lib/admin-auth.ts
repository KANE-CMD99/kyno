import { cookies } from "next/headers";
import { lookupAccount } from "@/lib/accounts";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "kyno-admin-token-secure";
const ADMIN_COOKIE = "kyno_admin_session";

export function validateAdminCredentials(email: string, password: string): boolean {
  const acct = lookupAccount(email, password);
  return acct?.role === "admin";
}

export async function setAdminSession() {
  const cs = await cookies();
  cs.set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 12 * 3600,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cs = await cookies();
  cs.delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const cs = await cookies();
  return cs.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
}
