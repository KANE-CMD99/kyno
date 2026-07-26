import { supabaseAdmin, hasSupabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

const AF = path.join(DATA_DIR, "affiliates.json");
const CF = path.join(DATA_DIR, "affiliate-clicks.json");

function read<T>(f: string, d: T): T { try { return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf-8")) : d; } catch { return d; } }
function write(f: string, d: unknown) { const dir = path.dirname(f); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(f, JSON.stringify(d, null, 2)); }

export interface Affiliate { id: string; name: string; email: string; code: string; commission: number; totalEarnings: number; paidEarnings: number; createdAt: string; }
export interface AffiliateClick { code: string; timestamp: string; converted: boolean; orderId?: number; commission?: number; }

export async function getAffiliates(): Promise<Affiliate[]> {
  if (hasSupabase) { const { data } = await supabaseAdmin().from("affiliates").select("*"); return (data || []).map((a: Record<string, unknown>) => ({ id: a.id, name: a.name, email: a.email, code: a.code, commission: a.commission, totalEarnings: a.total_earnings, paidEarnings: a.paid_earnings, createdAt: a.created_at } as Affiliate)); }
  return read<Affiliate[]>(AF, []);
}

export async function saveAffiliates(affiliates: Affiliate[]): Promise<void> {
  if (hasSupabase) { for (const a of affiliates) await supabaseAdmin().from("affiliates").upsert({ id: a.id, name: a.name, email: a.email, code: a.code, commission: a.commission, total_earnings: a.totalEarnings, paid_earnings: a.paidEarnings, created_at: a.createdAt }); return; }
  write(AF, affiliates);
}

export async function getAffiliateByCode(code: string): Promise<Affiliate | undefined> {
  if (hasSupabase) { const { data } = await supabaseAdmin().from("affiliates").select("*").eq("code", code).single(); return data ? { id: data.id, name: data.name, email: data.email, code: data.code, commission: data.commission, totalEarnings: data.total_earnings, paidEarnings: data.paid_earnings, createdAt: data.created_at } : undefined; }
  return (await getAffiliates()).find(a => a.code === code);
}

export async function createAffiliate(data: Omit<Affiliate, "id" | "totalEarnings" | "paidEarnings" | "createdAt">): Promise<Affiliate> {
  const a: Affiliate = { ...data, id: String(Date.now()).slice(-8), totalEarnings: 0, paidEarnings: 0, createdAt: new Date().toISOString() };
  if (hasSupabase) { await supabaseAdmin().from("affiliates").insert({ id: a.id, name: a.name, email: a.email, code: a.code, commission: a.commission, total_earnings: 0, paid_earnings: 0, created_at: a.createdAt }); return a; }
  const all = await getAffiliates(); all.push(a); write(AF, all); return a;
}

export async function recordClick(code: string): Promise<void> {
  const click: AffiliateClick = { code, timestamp: new Date().toISOString(), converted: false };
  if (hasSupabase) { await supabaseAdmin().from("affiliate_clicks").insert({ code: click.code, timestamp: click.timestamp, converted: false }); return; }
  const all = read<AffiliateClick[]>(CF, []); all.push(click); write(CF, all);
}

export async function convertClick(code: string, orderId: number, orderTotal: number): Promise<void> {
  const affiliate = await getAffiliateByCode(code);
  if (!affiliate) return;
  const commission = Math.round(orderTotal * affiliate.commission) / 100;
  if (hasSupabase) {
    await supabaseAdmin().from("affiliate_clicks").insert({ code, timestamp: new Date().toISOString(), converted: true, order_id: orderId, commission });
    await supabaseAdmin().from("affiliates").update({ total_earnings: affiliate.totalEarnings + commission }).eq("code", code);
    return;
  }
  const clicks = read<AffiliateClick[]>(CF, []); clicks.push({ code, timestamp: new Date().toISOString(), converted: true, orderId, commission }); write(CF, clicks);
  const all = await getAffiliates(); const target = all.find(a => a.code === code);
  if (target) { target.totalEarnings += commission; write(AF, all); }
}

export async function getClicksForAffiliate(code: string): Promise<AffiliateClick[]> {
  if (hasSupabase) { const { data } = await supabaseAdmin().from("affiliate_clicks").select("*").eq("code", code); return data || []; }
  return read<AffiliateClick[]>(CF, []).filter(c => c.code === code);
}
