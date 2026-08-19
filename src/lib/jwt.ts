import crypto from "crypto";

function base64URL(str: string): string {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64URL(str: string): string {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return s;
}

export async function sign(payload: object, secret: string): Promise<string> {
  const header = base64URL(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64"));
  const body = base64URL(
    Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 12 * 3600 })).toString("base64")
  );
  const data = `${header}.${body}`;
  const sig = base64URL(crypto.createHmac("sha256", secret).update(data).digest("base64"));
  return `${data}.${sig}`;
}

export async function verify(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, bodyB64, sigB64] = parts;
    const data = `${headerB64}.${bodyB64}`;
    const expectedSig = base64URL(crypto.createHmac("sha256", secret).update(data).digest("base64"));
    if (!crypto.timingSafeEqual(Buffer.from(fromBase64URL(sigB64), "base64"), Buffer.from(fromBase64URL(expectedSig), "base64"))) return null;
    const payload = JSON.parse(Buffer.from(fromBase64URL(bodyB64), "base64").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}
