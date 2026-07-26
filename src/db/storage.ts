import { supabaseAdmin, hasSupabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { DATA_DIR } from "@/lib/data-dir";

function readJSON<T>(file: string, fallback: T): T {
  try {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch { return fallback; }
}

function writeJSON(file: string, data: unknown) {
  const dir = path.dirname(path.join(DATA_DIR, file));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

export interface UserRecord { id: number; name: string; email: string; passwordHash: string; createdAt: string; }
export interface OrderRecord { id: number; userId: number; productId: string; productName: string; price: number; customerEmail?: string; customerName?: string; downloadToken: string; downloadClaimed: boolean; createdAt: string; }

// ====== USERS ======
export async function getUsers(): Promise<UserRecord[]> {
  if (hasSupabase) {
    const { data } = await supabaseAdmin().from("users").select("*");
    return (data || []).map((u: Record<string, unknown>) => ({ id: u.id as number, name: u.name as string, email: u.email as string, passwordHash: u.password_hash as string, createdAt: u.created_at as string }));
  }
  return readJSON<UserRecord[]>("users.json", []);
}

export async function saveUsers(users: UserRecord[]): Promise<void> {
  if (hasSupabase) { for (const u of users) await supabaseAdmin().from("users").upsert({ id: u.id, name: u.name, email: u.email, password_hash: u.passwordHash, created_at: u.createdAt }); return; }
  writeJSON("users.json", users);
}

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  if (hasSupabase) { const { data } = await supabaseAdmin().from("users").select("*").eq("email", email).single(); return data ? { id: data.id, name: data.name, email: data.email, passwordHash: data.password_hash, createdAt: data.created_at } : undefined; }
  return getUsers().then(u => u.find(x => x.email === email));
}

export async function getUserById(id: number): Promise<UserRecord | undefined> {
  if (hasSupabase) { const { data } = await supabaseAdmin().from("users").select("*").eq("id", id).single(); return data ? { id: data.id, name: data.name, email: data.email, passwordHash: data.password_hash, createdAt: data.created_at } : undefined; }
  return getUsers().then(u => u.find(x => x.id === id));
}

export async function createUser(user: Omit<UserRecord, "id">): Promise<UserRecord> {
  if (hasSupabase) { const { data } = await supabaseAdmin().from("users").insert({ name: user.name, email: user.email, password_hash: user.passwordHash, created_at: user.createdAt }).select().single(); return { id: data.id, ...user }; }
  const all = await getUsers();
  const id = all.length > 0 ? Math.max(...all.map(u => u.id)) + 1 : 1;
  const nu: UserRecord = { ...user, id }; all.push(nu); writeJSON("users.json", all); return nu;
}

// ====== ORDERS ======
export async function getOrders(userId: number): Promise<OrderRecord[]> {
  if (hasSupabase) { const { data } = await supabaseAdmin().from("orders").select("*").eq("user_id", userId); return data || []; }
  return readJSON<OrderRecord[]>("orders.json", []).filter(o => o.userId === userId);
}

export async function createOrder(order: Omit<OrderRecord, "id" | "downloadToken" | "downloadClaimed">): Promise<OrderRecord> {
  const token = crypto.randomBytes(16).toString("hex");
  if (hasSupabase) {
    const { data } = await supabaseAdmin().from("orders").insert({
      user_id: order.userId, product_id: order.productId, product_name: order.productName,
      price: order.price, customer_email: order.customerEmail || "", customer_name: order.customerName || "",
      download_token: token, download_claimed: false, created_at: order.createdAt,
    }).select().single();
    return { ...order, id: data.id, downloadToken: token, downloadClaimed: false };
  }
  const all = readJSON<OrderRecord[]>("orders.json", []);
  const id = all.length > 0 ? Math.max(...all.map(o => o.id)) + 1 : 1;
  const no: OrderRecord = { ...order, id, downloadToken: token, downloadClaimed: false };
  all.push(no); writeJSON("orders.json", all);
  return no;
}

export async function getOrderByToken(token: string): Promise<OrderRecord | undefined> {
  if (hasSupabase) { const { data } = await supabaseAdmin().from("orders").select("*").eq("download_token", token).single(); return data || undefined; }
  return readJSON<OrderRecord[]>("orders.json", []).find(o => o.downloadToken === token);
}

export async function markOrderClaimed(orderId: number): Promise<void> {
  if (hasSupabase) { await supabaseAdmin().from("orders").update({ download_claimed: true }).eq("id", orderId); return; }
  const all = readJSON<OrderRecord[]>("orders.json", []);
  const o = all.find(x => x.id === orderId);
  if (o) { o.downloadClaimed = true; writeJSON("orders.json", all); }
}
