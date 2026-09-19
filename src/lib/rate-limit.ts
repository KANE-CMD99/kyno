/**
 * Fixed-window rate limiter shared by the public write endpoints.
 *
 * Buckets are keyed per endpoint, so a burst against one route cannot spend
 * another's budget.
 *
 * Best-effort: counters live in the Next process, so they reset on deploy and
 * are not shared across instances. That is enough to stop a script from
 * draining the Resend quota or using the site as a mail relay; it is not a
 * substitute for a limit at the edge.
 */
const windows = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
    .split(",")[0]
    .trim();
}

/** True when this caller has already used up its allowance for the window. */
export function isRateLimited(
  bucket: string,
  ip: string,
  limit: number,
  windowMs = 60_000
): boolean {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || entry.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

export const TOO_MANY = {
  error: "Too many requests. Please try again in a minute.",
} as const;
