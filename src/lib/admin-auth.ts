import { cookies } from "next/headers";
import { lookupAccount } from "@/lib/accounts";

export const ADMIN_TOKEN = (() => {
  const v = process.env.ADMIN_TOKEN;
  if (v) return v;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_TOKEN must be set in production environment");
  }
  return "kyno-admin-token-secure";
})();

const ADMIN_COOKIE = "kyno_admin_session";

export function validateAdminCredentials(email: string, password: string): boolean {
  const acct = lookupAccount(email, password);
  return acct?.role === "admin";
}

export async function clearAdminSession() {
  const cs = await cookies();
  cs.delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const cs = await cookies();
  return cs.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
}

/**
 * Guard for admin Server Actions.
 *
 * Server Actions are their own RPC endpoints: they do NOT pass through the
 * /admin/api/* route guards, and their action ids ship in the publicly
 * downloadable JS bundle. So every exported admin action has to check the
 * session itself, or it is callable by anyone.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
