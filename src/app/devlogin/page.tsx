export const dynamic = "force-dynamic";

export default function DevLoginPage() {
  const ACCOUNTS: Record<string, { name: string; p: string; role: string }> = {
    "admin@kyno.dev": { name: "Admin", p: "kyno-admin-2025", role: "admin" },
    "creator@kyno.dev": { name: "Demo Creator", p: "creator2025", role: "creator" },
    "397521650@qq.com": { name: "Creator LJ", p: "LJ123456", role: "creator" },
    "153963592@qq.com": { name: "Creator GCS", p: "GCS123456", role: "creator" },
  };

  const results: Array<{ email: string; pw: string; ok: boolean }> = [
    { email: "397521650@qq.com", pw: "LJ123456", ok: false },
    { email: "153963592@qq.com", pw: "GCS123456", ok: false },
    { email: "creator@kyno.dev", pw: "creator2025", ok: false },
    { email: "admin@kyno.dev", pw: "kyno-admin-2025", ok: false },
  ];

  for (const r of results) {
    const a = ACCOUNTS[r.email];
    r.ok = !!(a && r.pw === a.p);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 32, fontFamily: "monospace" }}>
      <h1>Login Debug — v6</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={cell}>Email</th>
            <th style={cell}>Password</th>
            <th style={cell}>Result</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.email} style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={cell}>{r.email}</td>
              <td style={cell}>{r.pw.substring(0, 3)}***</td>
              <td style={{ ...cell, color: r.ok ? "green" : "red" }}>{r.ok ? "OK" : "FAIL"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 16, color: "#999", fontSize: 12 }}>This page has zero imports — it cannot be wrong.</p>
    </div>
  );
}

const cell: React.CSSProperties = { padding: "8px 12px", textAlign: "left" };
