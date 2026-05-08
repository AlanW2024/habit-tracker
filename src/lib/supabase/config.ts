export const SELF_USER_ID =
  process.env.NEXT_PUBLIC_SELF_USER_ID ??
  "00000000-0000-0000-0000-000000000001";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase 未設定。請複製 .env.local.example 為 .env.local 並填入金鑰。",
    );
  }
  return { url, anonKey };
}
