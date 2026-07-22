"use server";

import crypto from "crypto";
import { getUserByEmail, createUser } from "@/db/storage";
import { setSessionCookie } from "@/lib/auth";

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

export async function registerAction(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = getUserByEmail(normalizedEmail);
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const user = createUser({
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

  const user = getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return { success: false, error: "Invalid email or password." };
  }

  await setSessionCookie({ id: user.id, name: user.name, email: user.email });
  return { success: true };
}
