"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import { getUserByEmail, createUser } from "@/db/storage";
import { setSessionCookie } from "@/lib/auth";
import { lookupAccount } from "@/lib/accounts";

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

  // 1) Check built-in accounts (admin / creators)
  const acct = lookupAccount(email, password);
  if (acct) {
    const cs = await cookies();

    if (acct.role === "admin") {
      cs.set("kyno_admin_session", process.env.ADMIN_TOKEN || "kyno-admin-token-secure", {
        httpOnly: true, secure: process.env.NODE_ENV === "production",
        sameSite: "lax", maxAge: 12 * 3600, path: "/",
      });
      return { success: true, isAdmin: true };
    }

    cs.set("kyno_creator_session", JSON.stringify({
      id: acct.creatorId || "demo01", name: acct.name, email: key, role: "creator",
    }), {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 12 * 3600, path: "/",
    });
    cs.set("kyno_session_name", acct.name, {
      httpOnly: false, secure: false, sameSite: "lax", maxAge: 12 * 3600, path: "/",
    });
    return { success: true, isCreator: true };
  }

  // 2) Try database user (regular customer)
  const dbUser = await getUserByEmail(key);
  if (!dbUser) {
    return { success: false, error: "Invalid email or password." };
  }

  const [salt, storedHash] = dbUser.passwordHash.split(":");
  if (!salt || !storedHash) {
    return { success: false, error: "Invalid email or password." };
  }

  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  if (hash !== storedHash) {
    return { success: false, error: "Invalid email or password." };
  }

  await setSessionCookie({ id: dbUser.id, name: dbUser.name, email: dbUser.email });
  return { success: true };
}
