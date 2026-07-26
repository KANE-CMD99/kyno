import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Use service_role key on server for full CRUD access
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = serviceKey
  ? createClient(supabaseUrl, serviceKey)
  : supabase;

// Check if Supabase is configured
export const hasSupabase = !!supabaseUrl && !!supabaseAnonKey;
