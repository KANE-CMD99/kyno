"use client";

import { useState, useEffect, useCallback } from "react";

interface StatsData {
  today: {
    date: string;
    visits: number;
    uniqueIPs: string[];
    orders: number;
    revenue: number;
    downloads: number;
    customerEmails: string[];
  };
  history: Array<{
    date: string;
    visits: number;
    uniqueIPs: string[];
    orders: number;
    revenue: number;
    downloads: number;
    customerEmails: string[];
    timestamp: string;
  }>;
  customers: Array<{ email: string; name: string; date: string; product: string }>;
  total: { customers: number; orders: number; revenue: number };
}

export default function AdminAnalytics() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/admin/api/stats");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) {
    return <p className="text-sm text-neutral-500">Loading analytics...</p>;
  }

  const { today, history, customers, total } = data;
  const uniqueCustomers = customers.filter(
    (c, i, arr) => arr.findIndex((x) => x.email === c.email) === i
  );

  return (
    <div className="space-y-10">
      {/* Today's Stats Cards */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Today&apos;s Stats</h2>
        <p className="text-sm text-neutral-500">{today.date}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Visits" value={today.visits} sub={`${today.uniqueIPs.length} unique IPs`} />
          <StatCard label="Orders" value={today.orders} sub={`$${today.revenue.toFixed(2)} revenue`} />
          <StatCard label="Downloads" value={today.downloads || 0} sub="files delivered" />
          <StatCard label="Customers" value={today.customerEmails.length} sub="emails collected" />
          <StatCard label="Total" value={total.customers} sub={`${total.orders} orders · $${total.revenue.toFixed(2)}`} />
        </div>
      </div>

      {/* Recent History */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Recent Days</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-5 py-3 font-medium text-neutral-500">Date</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Visits</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Unique IPs</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Orders</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Revenue</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Downloads</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Customers</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().slice(0, 14).map((h) => (
                <tr key={h.date} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-5 py-3 font-medium text-neutral-900">{h.date}</td>
                  <td className="px-5 py-3">{h.visits}</td>
                  <td className="px-5 py-3">{h.uniqueIPs.length}</td>
                  <td className="px-5 py-3">{h.orders}</td>
                  <td className="px-5 py-3">${h.revenue.toFixed(2)}</td>
                  <td className="px-5 py-3">{h.downloads || 0}</td>
                  <td className="px-5 py-3">{h.customerEmails.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Email List */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Customer Emails</h2>
            <p className="text-sm text-neutral-500">{uniqueCustomers.length} unique customers</p>
          </div>
          <a
            href="/admin/api/stats?format=csv"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-400 transition-colors"
          >
            Export CSV
          </a>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-5 py-3 font-medium text-neutral-500">Email</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Name</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Last Purchase</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Product</th>
              </tr>
            </thead>
            <tbody>
              {uniqueCustomers.slice(0, 50).map((c) => (
                <tr key={c.email} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-5 py-3 font-medium text-neutral-900">{c.email}</td>
                  <td className="px-5 py-3 text-neutral-600">{c.name}</td>
                  <td className="px-5 py-3 text-neutral-500">{c.date}</td>
                  <td className="px-5 py-3 text-neutral-500">{c.product}</td>
                </tr>
              ))}
              {uniqueCustomers.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-neutral-400">No customer emails yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-neutral-900">{value.toLocaleString()}</p>
      <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>
    </div>
  );
}
