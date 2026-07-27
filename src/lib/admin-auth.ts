import { cookies } from "next/headers";

// Hardcoded accounts — always available, no db needed
const ACCOUNTS = {
  "admin@kyno.dev": {
    name: "Admin",
    password: process.env.ADMIN_PASSWORD || "kyno-admin-2025",
    role: "admin" as const,
  },
  "creator@kyno.dev": {
    name: "Demo Creator",
    password: "creator2025",
    role: "creator" as const,
    creatorId: "demo01",
    username: "creator01",
    commission: 20,
  },
  "397521650@qq.com": {
    name: "Creator LJ",
    password: "LJ123456",
    role: "creator" as const,
    creatorId: "creator02",
    username: "ljcreator",
    commission: 20,
  },
  "153963592@qq.com": {
    name: "Creator GCS",
    password: "GCS123456",
    role: "creator" as const,
    creatorId: "creator03",
    username: "gcscreator",
    commission: 20,
  },
};

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "kyno-admin-token-secure";
const ADMIN_COOKIE = "kyno_admin_session";

export function lookupAccount(email: string, password: string) {
  const key = email.trim().toLowerCase();
  const acct = ACCOUNTS[key as keyof typeof ACCOUNTS];
  if (!acct) return null;
  if (password !== acct.password) return null;
  return acct;
}

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
