/**
 * Deliberately permissive — we only need to reject obvious garbage and
 * non-string input, not verify deliverability.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// RFC 5321 caps an address at 254 characters. Without this the regex happily
// accepts a kilobyte-long local part, which lands in the subscriber file and
// gets handed to the mail provider.
const MAX_EMAIL_LENGTH = 254;

export function isEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(trimmed);
}
