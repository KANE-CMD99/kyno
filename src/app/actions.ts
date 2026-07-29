"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import { getUserByEmail, createUser } from "@/db/storage";
import { setSessionCookie } from "@/lib/auth";
import { authenticate } from "@/lib/auth-service";

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

  const result = await authenticate(email, password);
  if (!result) {
    return { success: false, error: "Invalid email or password." };
  }

  const cs = await cookies();

  if (result.role === "admin") {
    cs.set("kyno_admin_session", process.env.ADMIN_TOKEN || "kyno-admin-token-secure", {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 12 * 3600, path: "/",
    });
    return { success: true, isAdmin: true };
  }

  if (result.role === "creator") {
    cs.set("kyno_creator_session", JSON.stringify({
      id: result.id,
      username: result.username || result.id,
      name: result.name,
      email: result.email,
      role: "creator",
    }), {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 12 * 3600, path: "/",
    });
    cs.set("kyno_session_name", result.name, {
      httpOnly: false, secure: false, sameSite: "lax", maxAge: 12 * 3600, path: "/",
    });
    return { success: true, isCreator: true };
  }

  // Regular user
  await setSessionCookie({
    id: parseInt(result.id),
    name: result.name,
    email: result.email,
  });
  return { success: true };
}
