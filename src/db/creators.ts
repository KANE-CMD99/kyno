import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREATORS_FILE = path.join(process.cwd(), "data", "creators.json");

export interface CreatorRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  passwordHash: string;
  commission: number; // 20 = 20% to Kyno
  totalSales: number;
  totalEarnings: number;
  createdAt: string;
}

export function getCreators(): CreatorRecord[] {
  try {
    if (!fs.existsSync(CREATORS_FILE)) return [];
    return JSON.parse(fs.readFileSync(CREATORS_FILE, "utf-8"));
  } catch { return []; }
}

function saveCreators(creators: CreatorRecord[]) {
  const dir = path.dirname(CREATORS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CREATORS_FILE, JSON.stringify(creators, null, 2));
}

export function getCreatorByUsername(username: string): CreatorRecord | undefined {
  return getCreators().find((c) => c.username === username.toLowerCase());
}

export function getCreatorById(id: string): CreatorRecord | undefined {
  return getCreators().find((c) => c.id === id);
}

export function getCreatorByEmail(email: string): CreatorRecord | undefined {
  return getCreators().find((c) => c.email === email.toLowerCase().trim());
}

export function createCreator(data: {
  username: string;
  name: string;
  email: string;
  bio: string;
  password: string;
  avatarUrl?: string;
  commission?: number;
}): CreatorRecord {
  const creators = getCreators();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(data.password, salt, 100000, 64, "sha512").toString("hex");
  const passwordHash = `${salt}:${hash}`;

  const creator: CreatorRecord = {
    id: String(Date.now()).slice(-6),
    username: data.username.toLowerCase(),
    name: data.name,
    email: data.email.toLowerCase().trim(),
    bio: data.bio,
    avatarUrl: data.avatarUrl || "",
    passwordHash,
    commission: data.commission || 20,
    totalSales: 0,
    totalEarnings: 0,
    createdAt: new Date().toISOString(),
  };
  creators.push(creator);
  saveCreators(creators);
  return creator;
}

export function verifyCreatorPassword(creator: CreatorRecord, password: string): boolean {
  const [salt, storedHash] = creator.passwordHash.split(":");
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return storedHash === verify;
}

export function updateCreatorStats(creatorId: string, salePrice: number) {
  const creators = getCreators();
  const c = creators.find((x) => x.id === creatorId);
  if (c) {
    c.totalSales++;
    c.totalEarnings += salePrice;
    saveCreators(creators);
  }
}

export function getCreatorProducts(creatorId: string) {
  const { getAllProducts } = require("./products-store");
  return getAllProducts().filter((p: { creatorId?: string }) => p.creatorId === creatorId);
}
