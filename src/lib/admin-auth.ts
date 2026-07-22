import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@kyno.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kyno-admin-2025";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "kyno-admin-token-secure";
const COOKIE_NAME = "kyno_admin_session";

export function validateAdminCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password.trim() === ADMIN_PASSWORD;
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
  const token = cs.get(COOKIE_NAME)?.value;
  return token === ADMIN_TOKEN;
}
