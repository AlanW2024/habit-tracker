import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveHabits } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NewHabitForm } from "./new-form";

export const dynamic = "force-dynamic";

export default async function NewHabitPage() {
  if (!isSupabaseConfigured()) redirect("/setup");
  const habits = await getActiveHabits();
  const atCap = habits.length >= 2;

  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pb-24 pt-6 safe-top">
      <Link
        href="/today"
        className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      >
        ← 返今日
      </Link>
      <header className="mt-4 mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          NEW HABIT
        </p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight">
          選一個 tiny version
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          唔好諗大事。寫 1 行 code、讀 1 頁書、做 1 個 push-up。BJ Fogg：
          tiny first，再慢慢加長。
        </p>
      </header>

      {atCap ? (
        <div className="surface-card px-5 py-6">
          <h2 className="text-lg font-semibold">已達 Day 1 cap：2 個</h2>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
            研究共識：頭 21 日只練 1-2 個 habit。21 日後系統會 unlock 加 habit。
            而家專注呢兩個。
          </p>
          <Link href="/today" className="btn-primary mt-5 inline-block">
            返今日
          </Link>
        </div>
      ) : (
        <NewHabitForm existingCount={habits.length} />
      )}
    </div>
  );
}
