import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured()) redirect("/setup");
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-24 safe-top">
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
