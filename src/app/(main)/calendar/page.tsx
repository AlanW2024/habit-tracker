import { MonthlyHeatmap } from "@/components/MonthlyHeatmap";
import { getActiveHabits, getMonthLogs } from "@/lib/db";

export default async function CalendarPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [habits, logs] = await Promise.all([
    getActiveHabits(),
    getMonthLogs(year, month),
  ]);
  const monthLabel = `${year} 年 ${month} 月`;

  return (
    <div className="pt-2">
      <header className="mb-5 mt-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          PUNCH CARD
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{monthLabel}</h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          每日積累。冇 streak banner 壓力，唔代表唔重要。
        </p>
      </header>

      {habits.length === 0 ? (
        <p className="text-sm text-[var(--color-fg-muted)]">
          仲未有 habit。落「今日」頁加一個。
        </p>
      ) : (
        <MonthlyHeatmap year={year} month={month} habits={habits} logs={logs} />
      )}
    </div>
  );
}
