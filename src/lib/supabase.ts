import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

function getServiceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

// Check if Supabase is configured — works with NEXT_PUBLIC_ vars OR service key alone
export const hasSupabase = !!(getUrl() && (getAnonKey() || getServiceKey()));

// Lazy-init to avoid "supabaseKey is required" crash when env vars are missing
let _cached: SupabaseClient | null = null;
let _cachedAdmin: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!_cached) {
    const url = getUrl();
    const key = getAnonKey();
    if (!url || !key) {
      throw new Error(
        "Supabase URL and anon key are required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }
    _cached = createClient(url, key);
  }
  return _cached;
}

export function supabaseAdmin(): SupabaseClient {
  if (!_cachedAdmin) {
    const url = getUrl();
    const serviceKey = getServiceKey();
    if (!url || !serviceKey) {
      return supabase(); // fallback to anon client
    }
    _cachedAdmin = createClient(url, serviceKey);
  }
  return _cachedAdmin;
}
