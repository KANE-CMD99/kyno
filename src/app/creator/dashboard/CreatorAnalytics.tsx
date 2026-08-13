"use client";

import { useState, useEffect, useCallback } from "react";

interface CreatorStats {
  totalSales: number;
  totalRevenue: number;
  totalDownloads: number;
  recentOrders: Array<{
    productName: string;
    customerEmail: string;
    date: string;
    downloaded: boolean;
  }>;
}

export default function CreatorAnalytics() {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/creator/stats");
    if (res.ok) setStats(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading || !stats) {
    return <p className="text-sm text-neutral-500">Loading analytics...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Total Sales</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{stats.totalSales}</p>
          <p className="mt-0.5 text-xs text-neutral-400">orders</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">${stats.totalRevenue.toFixed(2)}</p>
          <p className="mt-0.5 text-xs text-neutral-400">lifetime</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Downloads</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{stats.totalDownloads}</p>
          <p className="mt-0.5 text-xs text-neutral-400">files delivered</p>
        </div>
      </div>

      {/* Recent orders table */}
      <div>
        <h3 className="text-sm font-bold text-neutral-900 mb-3">Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-neutral-400">No orders yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-3 font-medium text-neutral-500">Product</th>
                  <th className="px-5 py-3 font-medium text-neutral-500">Customer</th>
                  <th className="px-5 py-3 font-medium text-neutral-500">Date</th>
                  <th className="px-5 py-3 font-medium text-neutral-500">Downloaded</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o, i) => (
                  <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-5 py-3 font-medium text-neutral-900">{o.productName}</td>
                    <td className="px-5 py-3 text-neutral-500">{o.customerEmail}</td>
                    <td className="px-5 py-3 text-neutral-500">{o.date}</td>
                    <td className="px-5 py-3">
                      {o.downloaded ? (
                        <span className="text-xs font-medium text-green-600">Yes</span>
                      ) : (
                        <span className="text-xs font-medium text-neutral-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button onClick={load} className="text-xs text-blue-600 hover:text-blue-700">
        Refresh
      </button>
    </div>
  );
}
