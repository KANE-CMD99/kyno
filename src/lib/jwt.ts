function base64URL(str: string): string {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function utf8ToBytes(str: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(str) as Uint8Array<ArrayBuffer>;
}

export async function sign(payload: object, secret: string): Promise<string> {
  const header = base64URL(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64"));
  const body = base64URL(
    Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 12 * 3600 })).toString("base64")
  );
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey("raw", utf8ToBytes(secret) as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = base64URL(Buffer.from(await crypto.subtle.sign("HMAC", key, utf8ToBytes(data) as BufferSource)).toString("base64"));
  return `${data}.${sig}`;
}

export async function verify(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const [, body] = token.split(".");
    const key = await crypto.subtle.importKey("raw", utf8ToBytes(secret) as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const [headerB64, bodyB64, sigB64] = token.split(".");
    const data = `${headerB64}.${bodyB64}`;
    const sigBytes = new Uint8Array(Buffer.from(sigB64, "base64")) as BufferSource;
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes as BufferSource, utf8ToBytes(data) as BufferSource);
    if (!valid) return null;
    const payload = JSON.parse(Buffer.from(bodyB64, "base64").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}
