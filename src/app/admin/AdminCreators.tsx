"use client";

import { useState, useEffect, useCallback } from "react";

interface Creator {
  id: string;
  username: string;
  name: string;
  email: string;
  bio: string;
  totalSales: number;
  totalEarnings: number;
  commission: number;
  status: "active" | "suspended";
  permissions: { canUpload: boolean; canEdit: boolean; canDelete: boolean; canViewAnalytics: boolean };
  createdAt: string;
}

export default function AdminCreators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [commission, setCommission] = useState(20);
  const [status, setStatus] = useState<"active" | "suspended">("active");
  const [perms, setPerms] = useState({ canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true });
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/admin/api/creators");
    if (res.ok) {
      const data = await res.json();
      setCreators(data.creators || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setName(""); setUsername(""); setEmail(""); setBio(""); setPassword("");
    setCommission(20); setStatus("active"); setPerms({ canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true });
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (c: Creator) => {
    setName(c.name || ""); setUsername(c.username || ""); setEmail(c.email || ""); setBio(c.bio || "");
    setCommission(c.commission || 20); setStatus(c.status || "active");
    setPerms(c.permissions || { canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true });
    setEditingId(c.id); setShowForm(true); setPassword("");
  };

  const handleCreate = async () => {
    setMsg("");
    const res = await fetch("/admin/api/creators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, username, email, bio, password, commission, status, permissions: perms,
        ...(editingId ? { id: editingId } : {}),
      }),
    });
    const data = await res.json();
    if (data.success) { resetForm(); load(); setMsg(editingId ? "Updated." : `Created! /${username}`); }
    else setMsg(data.error || "Failed");
  };

  const toggleStatus = async (creator: Creator) => {
    const current = creator.status || "active";
    const newStatus = current === "active" ? "suspended" : "active";
    const res = await fetch("/admin/api/creators", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: creator.id, status: newStatus }),
    });
    if (res.ok) load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Creators</h2>
          <p className="text-sm text-neutral-500">{creators.length} registered</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          {showForm ? "Cancel" : "+ Invite Creator"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-neutral-900">{editingId ? "Edit Creator Account" : "Invite New Creator"}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="Sarah Chen" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm font-mono outline-none focus:border-blue-500" placeholder="sarah" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="sarah@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">{editingId ? "New Password (leave blank to keep)" : "Password"}</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={editingId ? "••••••••" : "min 6 characters"} required={!editingId} />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" placeholder="A short bio for their profile page" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Kyno Commission %</label>
              <input type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} min={10} max={50} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "active" | "suspended")} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div className="mt-5">
            <h4 className="text-xs font-medium text-neutral-700 mb-2">Permissions</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["canUpload", "canEdit", "canDelete", "canViewAnalytics"] as Array<keyof typeof perms>).map((key) => (
                <label key={key} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 cursor-pointer hover:border-neutral-300">
                  <input type="checkbox" checked={perms[key]} onChange={(e) => setPerms((p) => ({ ...p, [key]: e.target.checked }))} className="h-3.5 w-3.5 rounded border-neutral-400 text-blue-600" />
                  <span className="text-xs text-neutral-700">{key.replace("can", "").replace(/([A-Z])/g, " $1").trim()}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button onClick={handleCreate} disabled={!name || !username || !email || (!editingId && !password)} className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50">
              {editingId ? "Save Changes" : "Create Account"}
            </button>
            <button onClick={resetForm} className="text-sm text-neutral-400 hover:text-neutral-600">Cancel</button>
          </div>
          {msg && <p className={`mt-3 rounded-md px-3 py-2 text-xs ${msg.includes("Failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>{msg}</p>}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-5 py-3 font-medium text-neutral-500">Creator</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Status</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Commission</th>
                <th className="px-5 py-3 font-medium text-neutral-500">Sales / Earnings</th>
                <th className="px-5 py-3 font-medium text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {creators.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-neutral-400">No creators yet. Invite your first designer.</td></tr>
              ) : (
                creators.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-neutral-900">{c.name}</p>
                      <p className="text-xs text-neutral-400">{c.email}</p>
                      <a href={`/${c.username}`} target="_blank" className="text-xs text-blue-600 hover:text-blue-700">/{c.username}</a>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleStatus(c)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${(c.status || "active") === "active" ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"}`}
                        title="Click to toggle"
                      >
                        {(c.status || "active") === "active" ? "Active" : "Suspended"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{c.commission}%</td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-neutral-900">${c.totalEarnings.toFixed(2)}</span>
                      <span className="ml-2 text-xs text-neutral-400">{c.totalSales} sales</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => startEdit(c)} className="text-xs font-medium text-blue-600 hover:text-blue-700 mr-3">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
