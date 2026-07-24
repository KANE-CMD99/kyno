import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

const AFFILIATE_FILE = path.join(DATA_DIR, "affiliates.json");

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  commission: number; // percentage, e.g. 20 = 20%
  totalEarnings: number;
  paidEarnings: number;
  createdAt: string;
}

export interface AffiliateClick {
  code: string;
  timestamp: string;
  converted: boolean;
  orderId?: number;
  commission?: number;
}

export function getAffiliates(): Affiliate[] {
  try {
    if (!fs.existsSync(AFFILIATE_FILE)) return [];
    return JSON.parse(fs.readFileSync(AFFILIATE_FILE, "utf-8"));
  } catch { return []; }
}

export function saveAffiliates(affiliates: Affiliate[]) {
  const dir = path.dirname(AFFILIATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(AFFILIATE_FILE, JSON.stringify(affiliates, null, 2));
}

export function getAffiliateByCode(code: string): Affiliate | undefined {
  return getAffiliates().find((a) => a.code === code);
}

export function createAffiliate(data: Omit<Affiliate, "id" | "totalEarnings" | "paidEarnings" | "createdAt">): Affiliate {
  const affiliates = getAffiliates();
  const newAffiliate: Affiliate = {
    ...data,
    id: String(Date.now()).slice(-8),
    totalEarnings: 0,
    paidEarnings: 0,
    createdAt: new Date().toISOString(),
  };
  affiliates.push(newAffiliate);
  saveAffiliates(affiliates);
  return newAffiliate;
}

const CLICKS_FILE = path.join(DATA_DIR, "affiliate-clicks.json");

export function recordClick(code: string) {
  const clicks: AffiliateClick[] = (() => {
    try { return fs.existsSync(CLICKS_FILE) ? JSON.parse(fs.readFileSync(CLICKS_FILE, "utf-8")) : []; }
    catch { return []; }
  })();
  clicks.push({ code, timestamp: new Date().toISOString(), converted: false });
  const dir = path.dirname(CLICKS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CLICKS_FILE, JSON.stringify(clicks, null, 2));
}

export function convertClick(code: string, orderId: number, orderTotal: number) {
  const affiliate = getAffiliateByCode(code);
  if (!affiliate) return;

  const clicks: AffiliateClick[] = (() => {
    try { return fs.existsSync(CLICKS_FILE) ? JSON.parse(fs.readFileSync(CLICKS_FILE, "utf-8")) : []; }
    catch { return []; }
  })();

  const commission = Math.round(orderTotal * affiliate.commission) / 100;
  clicks.push({ code, timestamp: new Date().toISOString(), converted: true, orderId, commission });

  const dir = path.dirname(CLICKS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CLICKS_FILE, JSON.stringify(clicks, null, 2));

  // Update affiliate earnings
  const affiliates = getAffiliates();
  const target = affiliates.find((a) => a.code === code);
  if (target) {
    target.totalEarnings += commission;
    saveAffiliates(affiliates);
  }
}

export function getClicksForAffiliate(code: string): AffiliateClick[] {
  try {
    if (!fs.existsSync(CLICKS_FILE)) return [];
    const clicks: AffiliateClick[] = JSON.parse(fs.readFileSync(CLICKS_FILE, "utf-8"));
    return clicks.filter((c) => c.code === code);
  } catch { return []; }
}
