/**
 * Deliberately permissive — we only need to reject obvious garbage and
 * non-string input, not verify deliverability.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}
