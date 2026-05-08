import {
  getActiveHabits,
  getCompletionStats,
  getMonthLogs,
  getProfile,
  getRecentDraws,
} from "@/lib/db";
import { MonthlyHeatmap } from "@/components/MonthlyHeatmap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDict, format } from "@/i18n";
import { identityTitleFor, levelFromTotalXp } from "@/lib/identity";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: 18,
        border: "1.5px solid var(--color-border)",
        padding: "12px 14px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "var(--color-muted)",
        }}
      >
        {label}
      </p>
      <p
        style={{
          marginTop: 4,
          fontFamily:
            "var(--font-display), Space Grotesk, system-ui, sans-serif",
          fontSize: 26,
          fontWeight: 700,
          color: "var(--color-text)",
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {hint && (
        <p
          style={{
            marginTop: 4,
            fontSize: 11,
            color: "var(--color-muted)",
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export default async function StatsPage() {
  const dict = await getDict();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [profile, habits, stats, draws, monthLogs] = await Promise.all([
    getProfile(),
    getActiveHabits(),
    getCompletionStats(30),
    getRecentDraws(8),
    getMonthLogs(year, month),
  ]);
  const { level } = levelFromTotalXp(profile.xp);
  const identityTitle = identityTitleFor(level, dict);

  const dayCount = Object.keys(stats.perDay).length;
  const avgPerDay = dayCount > 0 ? stats.totalCompletions / dayCount : 0;
  const completionRate30 =
    habits.length > 0 ? (dayCount / 30) * 100 : 0;

  // Habit ranking — top 5 from perHabit map
  const ranking = Object.values(stats.perHabit)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxRank = ranking.length > 0 ? ranking[0].count : 1;

  return (
    <div className="pt-2" style={{ paddingBottom: 120 }}>
      <header className="mb-5 mt-2">
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--color-muted)",
          }}
        >
          {dict.stats.title}
        </p>
        <h1
          style={{
            marginTop: 4,
            fontFamily:
              "var(--font-display), Space Grotesk, system-ui, sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: -1,
          }}
        >
          {identityTitle}
        </h1>
        <p
          style={{
            marginTop: 4,
            fontSize: 14,
            color: "var(--color-muted)",
          }}
        >
          {format(dict.stats.subtitle, { level, xp: profile.xp })}
        </p>
      </header>

      <section style={{ marginBottom: 24 }}>
        <SectionHeader title={dict.stats.section_overview} />
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label={dict.stats.stat_30d}
            value={String(stats.totalCompletions)}
          />
          <StatCard
            label={dict.stats.stat_attendance}
            value={`${Math.round(completionRate30)}%`}
            hint={dict.stats.stat_attendance_hint}
          />
          <StatCard
            label={dict.stats.stat_avg}
            value={avgPerDay.toFixed(1)}
          />
          <StatCard
            label={dict.stats.stat_top}
            value={stats.topHabit?.name ?? "—"}
            hint={
              stats.topHabit
                ? format(dict.stats.stat_top_count, {
                    count: stats.topHabit.count,
                  })
                : undefined
            }
          />
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <SectionHeader title={dict.stats.section_calendar} />
        {habits.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--color-muted)" }}>
            {dict.stats.calendar_no_habits}
          </p>
        ) : (
          <MonthlyHeatmap
            year={year}
            month={month}
            habits={habits}
            logs={monthLogs}
          />
        )}
      </section>

      {ranking.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader title={dict.stats.section_ranking} />
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ranking.map((r) => {
              const widthPct = Math.max(8, (r.count / maxRank) * 100);
              return (
                <li
                  key={r.name}
                  style={{
                    background: "var(--color-surface)",
                    borderRadius: 16,
                    border: "1.5px solid var(--color-border)",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "var(--color-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.name}
                    </p>
                    <div
                      style={{
                        marginTop: 6,
                        height: 6,
                        width: "100%",
                        background: "var(--color-surface-alt)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${widthPct}%`,
                          background: "var(--color-primary)",
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "var(--color-muted)",
                      flexShrink: 0,
                    }}
                  >
                    {format(dict.stats.ranking_count, { count: r.count })}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section style={{ marginBottom: 24 }}>
        <SectionHeader title={dict.stats.section_recent_draws} />
        {draws.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--color-muted)" }}>
            {dict.stats.no_draws}
          </p>
        ) : (
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {draws.map((d) => (
              <li
                key={d.id}
                style={{
                  background: "var(--color-surface)",
                  borderRadius: 16,
                  border: "1.5px solid var(--color-border)",
                  padding: "12px 14px",
                }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--color-text)",
                    }}
                  >
                    {d.card.title}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                    }}
                  >
                    {dict.rarities[d.card.rarity]}
                  </span>
                </div>
                <p
                  style={{
                    marginTop: 2,
                    fontSize: 13,
                    color: "var(--color-muted)",
                  }}
                >
                  {d.card.copy}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionHeader title={dict.stats.section_reflection} />
        <p
          style={{
            background: "var(--color-surface)",
            borderRadius: 22,
            border: "1.5px solid var(--color-border)",
            padding: 16,
            fontSize: 14,
            color: "var(--color-muted)",
            lineHeight: 1.6,
          }}
        >
          {dict.stats.reflection_text}
        </p>
      </section>
    </div>
  );
}
