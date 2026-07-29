import { lookupAccount, type BuiltInAccount } from "@/lib/accounts";
import { getCreatorByEmail, verifyCreatorPassword, type CreatorRecord } from "@/db/creators";
import { getUserByEmail } from "@/db/storage";
import crypto from "crypto";

export type AuthRole = "admin" | "creator" | "user";

export interface AuthResult {
  role: AuthRole;
  id: string;
  name: string;
  email: string;
  username?: string;
  commission?: number;
}

/**
 * Single source of truth for authentication.
 * Checks built-in accounts first, then database creators, then database users.
 * Returns AuthResult on success, null on failure.
 */
export async function authenticate(
  email: string,
  password: string
): Promise<AuthResult | null> {
  const key = email.toLowerCase().trim();

  // 1) Built-in accounts (hardcoded in accounts.ts)
  const acct = lookupAccount(email, password);
  if (acct) {
    return builtInToAuth(key, acct);
  }

  // 2) Database creators (creators.json / Supabase)
  const creator = await getCreatorByEmail(key);
  if (creator && (await verifyCreatorPassword(creator, password))) {
    return creatorToAuth(creator);
  }

  // 3) Database users (users.json / Supabase)
  const user = await getUserByEmail(key);
  if (user) {
    const [salt, storedHash] = user.passwordHash.split(":");
    if (salt && storedHash) {
      const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
      if (hash === storedHash) {
        return userToAuth(user);
      }
    }
  }

  return null;
}

function builtInToAuth(email: string, acct: BuiltInAccount): AuthResult {
  return {
    role: acct.role,
    id: acct.creatorId || acct.role,
    name: acct.name,
    email,
    username: acct.username,
    commission: acct.commission,
  };
}

function creatorToAuth(c: CreatorRecord): AuthResult {
  return {
    role: "creator",
    id: c.id,
    name: c.name,
    email: c.email,
    username: c.username,
    commission: c.commission,
  };
}

function userToAuth(u: { id: number; name: string; email: string }): AuthResult {
  return {
    role: "user",
    id: String(u.id),
    name: u.name,
    email: u.email,
  };
}
