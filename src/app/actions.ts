// Server Action v2 — built-in accounts inline, no db dependency
// Force Vercel recompile: 2026-07-28
"use server";

import crypto from "crypto";
import { getUserByEmail, createUser } from "@/db/storage";
import { setSessionCookie } from "@/lib/auth";
import { setAdminSession } from "@/lib/admin-auth";
import { setCreatorSession } from "@/lib/creator-auth";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return hash === verify;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUILT-IN ACCOUNTS — hardcoded, always available
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ACCOUNTS: Record<string, { name: string; p: string; role: string; cid?: string; un?: string; com?: number }> = {
  "admin@kyno.dev":     { name: "Admin", p: process.env.ADMIN_PASSWORD || "kyno-admin-2025", role: "admin" },
  "creator@kyno.dev":   { name: "Demo Creator", p: "creator2025", role: "creator", cid: "demo01", un: "creator01", com: 20 },
  "397521650@qq.com":   { name: "Creator LJ",   p: "LJ123456",    role: "creator", cid: "creator02", un: "ljcreator", com: 20 },
  "153963592@qq.com":   { name: "Creator GCS",  p: "GCS123456",   role: "creator", cid: "creator03", un: "gcscreator", com: 20 },
};

export async function registerAction(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const user = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  });

  await setSessionCookie({ id: user.id, name: user.name, email: user.email });
  return { success: true };
}

export async function loginAction(email: string, password: string) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const key = email.toLowerCase().trim();
  const acct = ACCOUNTS[key];

  // Built-in account
  if (acct && password === acct.p) {
    if (acct.role === "admin") {
      await setAdminSession();
      return { success: true, isAdmin: true };
    }
    if (acct.role === "creator") {
      await setCreatorSession({
        id: acct.cid || "demo01",
        username: acct.un || "creator01",
        name: acct.name,
        email: key,
        commission: acct.com || 20,
      });
      return { success: true, isCreator: true };
    }
    return { success: false, error: "Unknown role." };
  }

  // Regular user login
  const user = await getUserByEmail(key);
  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return { success: false, error: "Invalid email or password." };
  }

  await setSessionCookie({ id: user.id, name: user.name, email: user.email });
  return { success: true };
}
