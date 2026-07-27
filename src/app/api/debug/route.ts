import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    hasSupabase,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING",
    vercelEnv: process.env.VERCEL_ENV || "local",
    nodeEnv: process.env.NODE_ENV || "development",
  });
}
