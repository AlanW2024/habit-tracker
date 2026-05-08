"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

let cached: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
  if (cached) return cached;
  const { url, anonKey } = getSupabaseEnv();
  cached = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: false },
  });
  return cached;
}
