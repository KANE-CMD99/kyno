import { cookies } from "next/headers";

// Hardcoded accounts — always available, no db needed
const BUILTIN_ACCOUNTS: Record<
  string,
  { name: string; role: "admin" | "creator"; creatorId?: string; username?: string; commission?: number }
> = {
  "admin@kyno.dev": {
    name: "Admin",
    role: "admin",
  },
  "creator@kyno.dev": {
    name: "Demo Creator",
    role: "creator",
    creatorId: "demo01",
    username: "creator01",
    commission: 20,
  },
  "397521650@qq.com": {
    name: "Creator LJ",
    role: "creator",
    creatorId: "creator02",
    username: "ljcreator",
    commission: 20,
  },
};

// Override with env vars if set
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@kyno.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kyno-admin-2025";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "kyno-admin-token-secure";
const COOKIE_NAME = "kyno_admin_session";

export function validateAdminCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password.trim() === ADMIN_PASSWORD;
}

export function lookupBuiltinAccount(email: string, password: string) {
  const lowered = email.trim().toLowerCase();
  const acct = BUILTIN_ACCOUNTS[lowered];
  if (!acct) return null;

  const pws: Record<string, string> = {
    "admin@kyno.dev": ADMIN_PASSWORD,
    "creator@kyno.dev": process.env.CREATOR_PASSWORD || "creator2025",
    "397521650@qq.com": "LJ123456",
  };

  if (password !== (pws[lowered] || "")) return null;
  return acct;
}

export async function setAdminSession() {
  const cs = await cookies();
  cs.set(COOKIE_NAME, ADMIN_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 12 * 3600,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cs = await cookies();
  cs.delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const cs = await cookies();
  return cs.get(COOKIE_NAME)?.value === ADMIN_TOKEN;
}
