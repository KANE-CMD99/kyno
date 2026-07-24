import fs from "fs";
import path from "path";
import crypto from "crypto";
import { DATA_DIR } from "@/lib/data-dir";

function readJSON<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(file: string, data: unknown) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface OrderRecord {
  id: number;
  userId: number;
  productId: string;
  productName: string;
  price: number;
  customerEmail?: string;
  customerName?: string;
  downloadToken: string;
  downloadClaimed: boolean;
  createdAt: string;
}

export function getUsers(): UserRecord[] {
  return readJSON<UserRecord[]>("users.json", []);
}

export function saveUsers(users: UserRecord[]) {
  writeJSON("users.json", users);
}

export function getUserByEmail(email: string): UserRecord | undefined {
  return getUsers().find((u) => u.email === email);
}

export function getUserById(id: number): UserRecord | undefined {
  return getUsers().find((u) => u.id === id);
}

export function createUser(user: Omit<UserRecord, "id">): UserRecord {
  const users = getUsers();
  const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser: UserRecord = { ...user, id };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function getOrders(userId: number): OrderRecord[] {
  return readJSON<OrderRecord[]>("orders.json", []).filter((o) => o.userId === userId);
}

export function createOrder(order: Omit<OrderRecord, "id" | "downloadToken" | "downloadClaimed">): OrderRecord {
  const orders = readJSON<OrderRecord[]>("orders.json", []);
  const id = orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
  const newOrder: OrderRecord = {
    ...order,
    id,
    downloadToken: crypto.randomBytes(16).toString("hex"),
    downloadClaimed: false,
  };
  orders.push(newOrder);
  writeJSON("orders.json", orders);
  return newOrder;
}

export function getOrderByToken(token: string): OrderRecord | undefined {
  return readJSON<OrderRecord[]>("orders.json", []).find((o) => o.downloadToken === token);
}

export function markOrderClaimed(orderId: number) {
  const orders = readJSON<OrderRecord[]>("orders.json", []);
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.downloadClaimed = true;
    writeJSON("orders.json", orders);
  }
}
