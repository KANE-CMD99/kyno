"use client";

import { useState, useEffect, useCallback } from "react";

interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface Customer {
  email: string;
  name: string;
  date: string;
  product: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    // Fetch registered users
    const usersRes = await fetch("/admin/api/users");
    if (usersRes.ok) {
      const data = await usersRes.json();
      setUsers(data.users || []);
    }
    // Fetch customer emails from purchases
    const statsRes = await fetch("/admin/api/stats");
    if (statsRes.ok) {
      const data = await statsRes.json();
      const all: Customer[] = data.customers || [];
      // Dedupe by email, keep latest
      const seen = new Map<string, Customer>();
      all.forEach((c: Customer) => {
        if (!seen.has(c.email) || seen.get(c.email)!.date < c.date) {
          seen.set(c.email, c);
        }
      });
      setCustomers(Array.from(seen.values()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setName(""); setEmail(""); setPassword("");
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (u: RegisteredUser) => {
    setName(u.name); setEmail(u.email);
    setEditingId(u.id); setShowForm(true); setPassword("");
  };

  const handleSubmit = async () => {
    setMsg("");
    const res = await fetch("/admin/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, email, password: password || undefined,
        ...(editingId ? { id: editingId } : {}),
      }),
    });
    const data = await res.json();
    if (data.success) { resetForm(); load(); setMsg(editingId ? "Updated." : "Created."); }
    else setMsg(data.error || "Failed");
  };

  const handleDelete = async (user: RegisteredUser) => {
    if (!confirm(`Delete "${user.name}" permanently?`)) return;
    const res = await fetch(`/admin/api/users?id=${user.id}`, { method: "DELETE" });
    if (res.ok) load();
    else setMsg("Delete failed");
  };

  return (
    <div className="space-y-10">
      {/* Registered Users */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Registered Users</h2>
            <p className="text-sm text-neutral-500">{users.length} account{users.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            {showForm ? "Cancel" : "+ Add User"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-neutral-900">{editingId ? "Edit User" : "Add New User"}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-neutral-700">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="john@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">{editingId ? "New Password (leave blank to keep)" : "Password"}</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" placeholder={editingId ? "••••••••" : "min 6 characters"} required={!editingId} />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={handleSubmit} disabled={!name || !email || (!editingId && !password)} className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50">
                {editingId ? "Save Changes" : "Create User"}
              </button>
              <button onClick={resetForm} className="text-sm text-neutral-400 hover:text-neutral-600">Cancel</button>
            </div>
            {msg && <p className={`mt-3 rounded-md px-3 py-2 text-xs ${msg.includes("Failed") || msg.includes("already") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>{msg}</p>}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-3 font-medium text-neutral-500">User</th>
                  <th className="px-5 py-3 font-medium text-neutral-500">Email</th>
                  <th className="px-5 py-3 font-medium text-neutral-500">Joined</th>
                  <th className="px-5 py-3 font-medium text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-neutral-400">No registered users yet.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                      <td className="px-5 py-3 font-medium text-neutral-900">{u.name}</td>
                      <td className="px-5 py-3 text-neutral-600">{u.email}</td>
                      <td className="px-5 py-3 text-neutral-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => startEdit(u)} className="text-xs font-medium text-blue-600 hover:text-blue-700 mr-3">Edit</button>
                        <button onClick={() => handleDelete(u)} className="text-xs font-medium text-red-500 hover:text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Emails (from purchases) */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-neutral-900">Customer Emails</h2>
          <p className="text-sm text-neutral-500">{customers.length} unique customer{customers.length !== 1 ? "s" : ""} from purchases</p>
        </div>

        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
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
                {customers.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-neutral-400">No customer purchases yet.</td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.email} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                      <td className="px-5 py-3 font-medium text-neutral-900">{c.email}</td>
                      <td className="px-5 py-3 text-neutral-600">{c.name}</td>
                      <td className="px-5 py-3 text-neutral-500">{c.date}</td>
                      <td className="px-5 py-3 text-neutral-500">{c.product}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
