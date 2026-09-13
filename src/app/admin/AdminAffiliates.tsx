"use client";

import { useState, useEffect, useCallback } from "react";
import { adminGetProducts } from "./product-actions";

export default function AdminAffiliates() {
  const [data, setData] = useState<{
    affiliates: Array<{ name: string; code: string; commission: number; totalEarnings: number; id: string }>;
    recentClicks: Array<{ code: string; timestamp: string; converted: boolean; commission?: number; orderId?: number }>;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [commission, setCommission] = useState(20);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/admin/api/affiliates");
    if (res.ok) setData(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    setMsg("");
    const res = await fetch("/admin/api/affiliates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), code: code.trim().toUpperCase(), commission }),
    });
    const result = await res.json();
    if (result.success) {
      setName(""); setEmail(""); setCode(""); setCommission(20); setShowForm(false); load();
    } else {
      setMsg(result.error || "Failed");
    }
  };

  if (!data) return <p className="text-sm text-neutral-500">Loading...</p>;

  const referralUrl = typeof window !== "undefined" ? `${window.location.origin}/r/` : "/r/";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Affiliates</h2>
          <p className="text-sm text-neutral-500">{data.affiliates.length} registered</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ New Affiliate"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-neutral-900">Create Affiliate Link</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Referral Code (letters only)</label>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm font-mono outline-none focus:border-blue-500" placeholder="e.g. SARAH20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Commission %</label>
              <input type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} min={5} max={50} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          {msg && <p className="mt-3 text-xs text-red-600">{msg}</p>}
          <button onClick={create} disabled={!name || !email || !code} className="mt-4 rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50">Create Affiliate</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-5 py-3 font-medium text-neutral-500">Name</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Code</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Commission</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Earnings</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Link</th>
            </tr>
          </thead>
          <tbody>
            {data.affiliates.map((a) => (
              <tr key={a.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-5 py-3 font-medium text-neutral-900">{a.name}</td>
                <td className="px-5 py-3 font-mono text-xs text-neutral-600">{a.code}</td>
                <td className="px-5 py-3 text-neutral-600">{a.commission}%</td>
                <td className="px-5 py-3 font-medium text-neutral-900">${a.totalEarnings.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => { navigator.clipboard?.writeText(`${referralUrl}${a.code}`); setMsg(`Copied: ${referralUrl}${a.code}`); }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Copy Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {msg && <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">{msg}</p>}
    </div>
  );
}
