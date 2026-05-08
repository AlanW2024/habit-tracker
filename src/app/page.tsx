import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default function Home() {
  if (!isSupabaseConfigured()) {
    redirect("/setup");
  }
  redirect("/today");
}
