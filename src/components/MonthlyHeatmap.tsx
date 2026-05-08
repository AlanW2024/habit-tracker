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
  return new Date(year, month - 1, 1).getDay();
}

const HABIT_COLORS = [
  "#FF6B3D",
  "#7C3AED",
  "#5C9F22",
  "#2D6FF0",
  "#E0A800",
  "#9B6BFF",
];

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
      <div className="mb-2 grid grid-cols-7 text-center" style={{ fontSize: 11, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
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
          const level = ids.length;
          const innerRing = level >= 3;
          return (
            <div
              key={cell.key}
              className="heat-cell relative flex flex-col items-center justify-center"
              title={`${cell.date} • ${ids.length}`}
              style={{
                boxShadow: innerRing
                  ? "inset 0 0 0 1.5px var(--color-surface)"
                  : undefined,
                background:
                  level > 0
                    ? `color-mix(in srgb, var(--color-primary) ${Math.min(80, 16 * level)}%, var(--color-surface-alt))`
                    : undefined,
              }}
            >
              <span style={{ fontSize: 11, color: level >= 2 ? "var(--color-on-primary-strong)" : "var(--color-muted)", fontWeight: 700 }}>
                {dayNum}
              </span>
              {ids.length > 0 && (
                <div className="mt-0.5 flex gap-0.5">
                  {ids.slice(0, 4).map((id) => (
                    <span
                      key={id}
                      style={{
                        display: "block",
                        height: 3,
                        width: 3,
                        borderRadius: 99,
                        background: habitColor.get(id) ?? "#fff",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {habits.length > 0 && (
        <ul
          className="mt-4 flex flex-wrap gap-3"
          style={{ fontSize: 12, color: "var(--color-muted)" }}
        >
          {habits.map((h) => (
            <li key={h.id} className="flex items-center gap-1.5">
              <span
                style={{
                  display: "block",
                  height: 8,
                  width: 8,
                  borderRadius: 99,
                  background: habitColor.get(h.id),
                }}
              />
              {h.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
