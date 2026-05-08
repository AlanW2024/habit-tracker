import type { Habit, HabitLog } from "@/lib/types";

interface MonthlyHeatmapProps {
  year: number;
  month: number; // 1..12
  habits: Habit[];
  logs: HabitLog[];
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function firstWeekdayOffset(year: number, month: number): number {
  // Sunday-first calendar (matches user's HK convention).
  return new Date(year, month - 1, 1).getDay();
}

const HABIT_COLORS = ["#fbbf24", "#5eead4", "#fb7185", "#a78bfa", "#facc15"];

export function MonthlyHeatmap({
  year,
  month,
  habits,
  logs,
}: MonthlyHeatmapProps) {
  const total = daysInMonth(year, month);
  const offset = firstWeekdayOffset(year, month);

  const logsByDate = new Map<string, Set<string>>();
  for (const l of logs) {
    if (!logsByDate.has(l.log_date)) logsByDate.set(l.log_date, new Set());
    logsByDate.get(l.log_date)!.add(l.habit_id);
  }

  const habitColor = new Map<string, string>();
  habits.forEach((h, i) =>
    habitColor.set(h.id, HABIT_COLORS[i % HABIT_COLORS.length]),
  );

  const cells: Array<{ key: string; date?: string; ids?: string[] }> = [];
  for (let i = 0; i < offset; i++) cells.push({ key: `pad-${i}` });
  for (let d = 1; d <= total; d++) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      key: iso,
      date: iso,
      ids: Array.from(logsByDate.get(iso) ?? []),
    });
  }

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 text-center text-[11px] uppercase tracking-wide text-[var(--color-fg-subtle)]">
        {["日", "一", "二", "三", "四", "五", "六"].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => {
          if (!cell.date)
            return <div key={cell.key} className="aspect-square" />;
          const ids = cell.ids ?? [];
          const dayNum = Number(cell.date.slice(8));
          return (
            <div
              key={cell.key}
              className="heat-cell relative flex flex-col items-center justify-center"
              title={`${cell.date} • ${ids.length} 個習慣完成`}
            >
              <span className="text-[11px] text-[var(--color-fg-subtle)]">
                {dayNum}
              </span>
              <div className="mt-0.5 flex gap-0.5">
                {ids.map((id) => (
                  <span
                    key={id}
                    className="block h-1 w-1 rounded-full"
                    style={{ background: habitColor.get(id) }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {habits.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--color-fg-muted)]">
          {habits.map((h) => (
            <li key={h.id} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: habitColor.get(h.id) }}
              />
              {h.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
