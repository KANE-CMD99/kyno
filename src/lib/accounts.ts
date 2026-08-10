// BUILT-IN ACCOUNTS — single source of truth
// Used by both loginAction (actions.ts) and admin-auth (admin-auth.ts)

export interface BuiltInAccount {
  name: string;
  password: string;
  role: "admin" | "creator";
  creatorId?: string;
  username?: string;
  commission?: number;
}

const ACCOUNTS: Record<string, BuiltInAccount> = {
  "admin@kyno.dev": {
    name: "Admin",
    password: process.env.ADMIN_PASSWORD || "kyno-admin-2025",
    role: "admin",
  },
  "creator@kyno.dev": {
    name: "Demo Creator",
    password: "creator2025",
    role: "creator",
    creatorId: "demo01",
    username: "creator01",
    commission: 20,
  },
  "shenhua@kyno.ltd": {
    name: "申花",
    password: "Shenhua7878",
    role: "creator",
    creatorId: "shenhua01",
    username: "ShenHua",
    commission: 20,
  },
  "33429296@qq.com": {
    name: "Caesar",
    password: "Kyno7878",
    role: "creator",
    creatorId: "caesar01",
    username: "Caesar",
    commission: 20,
  },
  "397521650@qq.com": {
    name: "Creator LJ",
    password: "LJ123456",
    role: "creator",
    creatorId: "creator02",
    username: "ljcreator",
    commission: 20,
  },
  "153963592@qq.com": {
    name: "Creator GCS",
    password: "GCS123456",
    role: "creator",
    creatorId: "creator03",
    username: "gcscreator",
    commission: 20,
  },
};

export function lookupAccount(email: string, password: string): BuiltInAccount | null {
  const key = email.trim().toLowerCase();
  const acct = ACCOUNTS[key];
  if (!acct) return null;
  if (password !== acct.password) return null;
  return acct;
}
