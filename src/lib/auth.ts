import { cookies } from "next/headers";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "kyno-dev-secret-change-in-production";
const COOKIE_NAME = "kyno_session";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
}

function base64URL(str: string): string {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64URL(str: string): string {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return s;
}

function utf8ToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

async function signJWT(payload: object, secret: string): Promise<string> {
  const header = base64URL(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64"));
  const body = base64URL(Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 86400 })).toString("base64"));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey("raw", utf8ToBytes(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = base64URL(Buffer.from(await crypto.subtle.sign("HMAC", key, utf8ToBytes(data))).toString("base64"));
  return `${data}.${sig}`;
}

async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const [header, body, sig] = token.split(".");
    const data = `${header}.${body}`;
    const key = await crypto.subtle.importKey("raw", utf8ToBytes(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigBytes = new Uint8Array(Buffer.from(fromBase64URL(sig), "base64"));
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, utf8ToBytes(data));
    if (!valid) return null;
    const payload = JSON.parse(Buffer.from(fromBase64URL(body), "base64").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createToken(user: SessionUser): Promise<string> {
  return signJWT({ sub: String(user.id), name: user.name, email: user.email }, JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  const payload = await verifyJWT(token, JWT_SECRET);
  if (!payload) return null;
  return {
    id: parseInt((payload.sub as string) || "0"),
    name: payload.name as string,
    email: payload.email as string,
  };
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
