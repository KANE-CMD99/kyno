"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import { getUserByEmail, createUser } from "@/db/storage";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUILT-IN ACCOUNTS — hardcoded, always available
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ACCOUNTS: Record<string, { name: string; p: string; role: string; cid?: string }> = {
  "admin@kyno.dev":   { name: "Admin",        p: "kyno-admin-2025", role: "admin" },
  "creator@kyno.dev": { name: "Demo Creator",  p: "creator2025",     role: "creator", cid: "demo01" },
  "397521650@qq.com": { name: "Creator LJ",    p: "LJ123456",       role: "creator", cid: "creator02" },
  "153963592@qq.com": { name: "Creator GCS",   p: "GCS123456",      role: "creator", cid: "creator03" },
};

export async function registerAction(name: string, email: string, password: string) {
  if (process.env.ALLOW_OPEN_REGISTRATION !== "true") {
    return { success: false, error: "Registration is invitation-only at this time." };
  }
  if (!name || !email || !password) return { success: false, error: "All fields required." };
  if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await getUserByEmail(normalizedEmail);
  if (existing) return { success: false, error: "An account with this email already exists." };

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");

  await createUser({
    name: name.trim(), email: normalizedEmail,
    passwordHash: `${salt}:${hash}`,
    createdAt: new Date().toISOString(),
  });
  return { success: true };
}

export async function loginAction(email: string, password: string) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const key = email.toLowerCase().trim();
  const acct = ACCOUNTS[key];

  if (!acct || password !== acct.p) {
    return { success: false, error: "Invalid email or password." };
  }

  // Set session cookie directly — no external crypto/JWT deps
  const cs = await cookies();

  if (acct.role === "admin") {
    cs.set("kyno_admin_session", process.env.ADMIN_TOKEN || "kyno-admin-token-secure", {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 12 * 3600, path: "/",
    });
    return { success: true, isAdmin: true };
  }

  // Creator — store session data directly in a cookie
  cs.set("kyno_creator_session", JSON.stringify({
    id: acct.cid || "demo01", name: acct.name, email: key, role: "creator",
  }), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 12 * 3600, path: "/",
  });

  // Also set as kyno_session for UserMenu recognition
  cs.set("kyno_session_name", acct.name, {
    httpOnly: false, secure: false, sameSite: "lax", maxAge: 12 * 3600, path: "/",
  });

  return { success: true, isCreator: true };
}
