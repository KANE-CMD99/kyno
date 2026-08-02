import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

const STATS_PATH = path.join(DATA_DIR, "analytics.json");
const HISTORY_PATH = path.join(DATA_DIR, "analytics-history.json");

// ──────────────────────────────────────────────
// Daily visit & customer email tracking
// ──────────────────────────────────────────────

export interface DailyStats {
  date: string; // YYYY-MM-DD
  visits: number;
  uniqueIPs: string[];
  orders: number;
  revenue: number;
  customerEmails: string[];
}

let cache: DailyStats | null = null;

function getFilePath(): string {
  const d = path.dirname(STATS_PATH);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  return STATS_PATH;
}

function readStats(): DailyStats {
  const today = new Date().toISOString().slice(0, 10);
  if (cache && cache.date === today) return cache;

  try {
    const raw = fs.readFileSync(getFilePath(), "utf-8");
    cache = JSON.parse(raw);
  } catch {
    cache = null;
  }

  if (!cache || cache.date !== today) {
    cache = {
      date: today,
      visits: 0,
      uniqueIPs: [],
      orders: 0,
      revenue: 0,
      customerEmails: [],
    };
  }
  return cache;
}

function writeStats(stats: DailyStats) {
  try {
    fs.writeFileSync(getFilePath(), JSON.stringify(stats, null, 2));
  } catch { /* fail silently */ }
  cache = stats;
}

export function recordVisit(ip: string) {
  const stats = readStats();
  stats.visits += 1;
  if (!stats.uniqueIPs.includes(ip)) {
    stats.uniqueIPs.push(ip);
  }
  writeStats(stats);
}

export function recordOrder(email: string, price: number) {
  const stats = readStats();
  stats.orders += 1;
  stats.revenue += price;
  if (email && !stats.customerEmails.includes(email)) {
    stats.customerEmails.push(email);
  }
  writeStats(stats);
}

export function getTodayStats(): DailyStats {
  return readStats();
}

// ──────────────────────────────────────────────
// Historical data functions
// ──────────────────────────────────────────────

export interface HistoricalEntry extends DailyStats {
  timestamp: string;
}

function historyPath(): string {
  const d = path.dirname(HISTORY_PATH);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  return HISTORY_PATH;
}

export function saveDaySnapshot() {
  const today = readStats();
  const entry: HistoricalEntry = { ...today, timestamp: new Date().toISOString() };
  try {
    let history: HistoricalEntry[] = [];
    try { history = JSON.parse(fs.readFileSync(historyPath(), "utf-8")); } catch { /* new file */ }
    history = history.filter((h) => h.date !== entry.date);
    history.push(entry);
    if (history.length > 90) history = history.slice(-90);
    fs.writeFileSync(historyPath(), JSON.stringify(history, null, 2));
  } catch { /* fail silently */ }
}

export function getHistory(): HistoricalEntry[] {
  try { return JSON.parse(fs.readFileSync(historyPath(), "utf-8")); } catch { return []; }
}

// ──────────────────────────────────────────────
// Aggregate all customer emails from orders
// ──────────────────────────────────────────────

export function getAllCustomerEmails(): { email: string; name: string; date: string; product: string }[] {
  try {
    const ordersPath = path.join(DATA_DIR, "orders.json");
    if (!fs.existsSync(ordersPath)) return [];
    const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8")) as Array<{
      customerEmail?: string; customerName?: string; createdAt: string; productName: string;
    }>;
    return orders
      .filter((o) => o.customerEmail)
      .map((o) => ({
        email: o.customerEmail || "",
        name: o.customerName || "",
        date: o.createdAt?.slice(0, 10) || "",
        product: o.productName || "",
      }));
  } catch { return []; }
}

export function exportCustomerEmailsCSV(): string {
  const records = getAllCustomerEmails();
  const unique = new Map<string, { name: string; date: string }>();
  records.forEach((r) => {
    if (!unique.has(r.email) || unique.get(r.email)!.date < r.date) {
      unique.set(r.email, { name: r.name, date: r.date });
    }
  });
  const header = "Email,Name,Last Purchase Date";
  const rows = Array.from(unique.entries()).map(
    ([email, { name, date }]) => `${email},${name},${date}`
  );
  return [header, ...rows].join("\n");
}
