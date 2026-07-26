import { supabaseAdmin, hasSupabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { DATA_DIR } from "@/lib/data-dir";

function getCreatorsJSON() {
  try {
    const p = path.join(DATA_DIR, "creators.json");
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

function saveCreatorsJSON(creators: CreatorRecord[]) {
  const p = path.join(DATA_DIR, "creators.json");
  fs.writeFileSync(p, JSON.stringify(creators, null, 2));
}

export interface CreatorRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  passwordHash: string;
  commission: number;
  totalSales: number;
  totalEarnings: number;
  status: "active" | "suspended";
  permissions: {
    canUpload: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canViewAnalytics: boolean;
  };
  createdAt: string;
}

export async function getCreators(): Promise<CreatorRecord[]> {
  if (hasSupabase) {
    const { data, error } = await supabaseAdmin.from("creators").select("*");
    if (error) { console.error("Supabase getCreators:", error); return []; }
    return (data || []).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      username: c.username as string,
      name: c.name as string,
      email: c.email as string,
      bio: (c.bio as string) || "",
      avatarUrl: (c.avatar_url as string) || "",
      passwordHash: c.password_hash as string,
      commission: c.commission as number,
      totalSales: c.total_sales as number,
      totalEarnings: c.total_earnings as number,
      status: (c.status as "active" | "suspended") || "active",
      permissions: (c.permissions as CreatorRecord["permissions"]) || { canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true },
      createdAt: c.created_at as string,
    }));
  }
  return getCreatorsJSON() as CreatorRecord[];
}

export async function saveCreators(creators: CreatorRecord[]): Promise<void> {
  if (hasSupabase) {
    // Upsert each creator individually
    for (const c of creators) {
      await supabaseAdmin.from("creators").upsert({
        id: c.id, username: c.username, name: c.name, email: c.email,
        bio: c.bio, avatar_url: c.avatarUrl, password_hash: c.passwordHash,
        commission: c.commission, total_sales: c.totalSales, total_earnings: c.totalEarnings,
        status: c.status, permissions: c.permissions, created_at: c.createdAt,
      });
    }
    return;
  }
  saveCreatorsJSON(creators);
}

export async function getCreatorByUsername(username: string): Promise<CreatorRecord | undefined> {
  if (hasSupabase) {
    const { data } = await supabaseAdmin.from("creators").select("*").eq("username", username.toLowerCase()).single();
    if (!data) return undefined;
    return { id: data.id, username: data.username, name: data.name, email: data.email, bio: data.bio || "", avatarUrl: data.avatar_url || "", passwordHash: data.password_hash, commission: data.commission, totalSales: data.total_sales || 0, totalEarnings: data.total_earnings || 0, status: data.status || "active", permissions: data.permissions || { canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true }, createdAt: data.created_at };
  }
  return getCreatorsJSON().find((c: CreatorRecord) => c.username === username.toLowerCase());
}

export async function getCreatorByEmail(email: string): Promise<CreatorRecord | undefined> {
  if (hasSupabase) {
    const { data } = await supabaseAdmin.from("creators").select("*").eq("email", email.toLowerCase().trim()).single();
    if (!data) return undefined;
    return { id: data.id, username: data.username, name: data.name, email: data.email, bio: data.bio || "", avatarUrl: data.avatar_url || "", passwordHash: data.password_hash, commission: data.commission, totalSales: data.total_sales || 0, totalEarnings: data.total_earnings || 0, status: data.status || "active", permissions: data.permissions || { canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true }, createdAt: data.created_at };
  }
  return getCreatorsJSON().find((c: CreatorRecord) => c.email === email.toLowerCase().trim());
}

export async function getCreatorById(id: string): Promise<CreatorRecord | undefined> {
  if (hasSupabase) {
    const { data } = await supabaseAdmin.from("creators").select("*").eq("id", id).single();
    if (!data) return undefined;
    return { id: data.id, username: data.username, name: data.name, email: data.email, bio: data.bio || "", avatarUrl: data.avatar_url || "", passwordHash: data.password_hash, commission: data.commission, totalSales: data.total_sales || 0, totalEarnings: data.total_earnings || 0, status: data.status || "active", permissions: data.permissions || { canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true }, createdAt: data.created_at };
  }
  return getCreatorsJSON().find((c: CreatorRecord) => c.id === id);
}

export async function createCreator(data: {
  username: string; name: string; email: string; bio: string; password: string;
  avatarUrl?: string; commission?: number; status?: "active" | "suspended";
  permissions?: { canUpload: boolean; canEdit: boolean; canDelete: boolean; canViewAnalytics: boolean };
}): Promise<CreatorRecord> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(data.password, salt, 100000, 64, "sha512").toString("hex");
  const creator: CreatorRecord = {
    id: String(Date.now()).slice(-6),
    username: data.username.toLowerCase(),
    name: data.name,
    email: data.email.toLowerCase().trim(),
    bio: data.bio,
    avatarUrl: data.avatarUrl || "",
    passwordHash: `${salt}:${hash}`,
    commission: data.commission || 20,
    totalSales: 0, totalEarnings: 0,
    status: data.status || "active",
    permissions: data.permissions || { canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true },
    createdAt: new Date().toISOString(),
  };

  if (hasSupabase) {
    await supabaseAdmin.from("creators").insert({
      id: creator.id, username: creator.username, name: creator.name, email: creator.email,
      bio: creator.bio, avatar_url: creator.avatarUrl, password_hash: creator.passwordHash,
      commission: creator.commission, total_sales: 0, total_earnings: 0,
      status: creator.status, permissions: creator.permissions, created_at: creator.createdAt,
    });
    return creator;
  }

  const all = getCreatorsJSON();
  all.push(creator);
  saveCreatorsJSON(all);
  return creator;
}

export async function verifyCreatorPassword(creator: CreatorRecord, password: string): Promise<boolean> {
  const [salt, storedHash] = creator.passwordHash.split(":");
  try {
    const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return storedHash === verify;
  } catch { return false; }
}

export async function updateCreatorStats(creatorId: string, salePrice: number) {
  if (hasSupabase) {
    const { data } = await supabaseAdmin.from("creators").select("*").eq("id", creatorId).single();
    if (data) {
      await supabaseAdmin.from("creators").update({
        total_sales: (data.total_sales || 0) + 1,
        total_earnings: (data.total_earnings || 0) + salePrice,
      }).eq("id", creatorId);
    }
    return;
  }
  const creators = getCreatorsJSON();
  const c = creators.find((x: CreatorRecord) => x.id === creatorId);
  if (c) { c.totalSales++; c.totalEarnings += salePrice; saveCreatorsJSON(creators); }
}

export async function deleteCreator(id: string): Promise<boolean> {
  if (hasSupabase) { const { error } = await supabaseAdmin.from("creators").delete().eq("id", id); return !error; }
  const all = getCreatorsJSON(); const filtered = all.filter((c: CreatorRecord) => c.id !== id);
  if (filtered.length === all.length) return false;
  saveCreatorsJSON(filtered); return true;
}

export async function getCreatorProducts(creatorId: string) {
  const { getAllProducts } = await import("./products-store");
  const products = await getAllProducts();
  return products.filter((p) => p.creatorId === creatorId);
}
