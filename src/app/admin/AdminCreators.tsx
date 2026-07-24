"use client";

import { useState, useEffect, useCallback } from "react";

export default function AdminCreators() {
  const [creators, setCreators] = useState<Array<{ id: string; username: string; name: string; email: string; totalSales: number; totalEarnings: number; commission: number }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [commission, setCommission] = useState(20);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/admin/api/creators");
    if (res.ok) {
      const data = await res.json();
      setCreators(data.creators || []);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    setMsg("");
    const res = await fetch("/admin/api/creators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, bio, password, commission }),
    });
    const data = await res.json();
    if (data.success) {
      setName(""); setUsername(""); setEmail(""); setBio(""); setPassword(""); setCommission(20); setShowForm(false); load();
      setMsg(`Created! Profile: /${username}`);
    } else {
      setMsg(data.error || "Failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Creators</h2>
          <p className="text-sm text-neutral-500">{creators.length} invited</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          {showForm ? "Cancel" : "+ Invite Creator"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-neutral-900">Invite New Creator</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="Sarah Chen" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Username (letters only)</label>
              <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm font-mono outline-none focus:border-blue-500" placeholder="sarah" />
              {username && <p className="mt-1 text-xs text-neutral-400">Profile: kyno.dev/{username}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="sarah@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="min 6 characters" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Kyno Commission %</label>
              <input type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} min={10} max={50} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" placeholder="A short bio for their profile page" />
            </div>
          </div>
          {msg && <p className="mt-3 text-xs text-red-600">{msg}</p>}
          <button onClick={handleCreate} disabled={!name || !username || !email || !password} className="mt-4 rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50">Create Account</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-5 py-3 font-medium text-neutral-500">Name</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Profile</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Sales</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Earnings</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Commission</th>
            </tr>
          </thead>
          <tbody>
            {creators.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-neutral-400">No creators yet. Invite your first designer.</td></tr>
            ) : (
              creators.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-neutral-900">{c.name}</p>
                    <p className="text-xs text-neutral-400">{c.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <a href={`/${c.username}`} target="_blank" className="text-xs font-medium text-blue-600 hover:text-blue-700">/{c.username}</a>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{c.totalSales}</td>
                  <td className="px-5 py-3 font-medium text-neutral-900">${c.totalEarnings.toFixed(2)}</td>
                  <td className="px-5 py-3 text-neutral-600">{c.commission}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
