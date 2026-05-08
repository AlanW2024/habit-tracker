import {
  getActiveHabits,
  getCompletionStats,
  getProfile,
  getRecentDraws,
} from "@/lib/db";
import { signOut } from "@/lib/actions";
import { identityFor, levelFromTotalXp } from "@/lib/identity";

export default async function StatsPage() {
  const [profile, habits, stats, draws] = await Promise.all([
    getProfile(),
    getActiveHabits(),
    getCompletionStats(30),
    getRecentDraws(8),
  ]);
  const { level } = levelFromTotalXp(profile.xp);
  const identity = identityFor(level);

  const dayCount = Object.keys(stats.perDay).length;
  const avgPerDay = dayCount > 0 ? stats.totalCompletions / dayCount : 0;
  const completionRate30 =
    habits.length > 0 ? (dayCount / 30) * 100 : 0;

  return (
    <div className="pt-2">
      <header className="mb-5 mt-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          GROWTH
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{identity.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          Lv.{level} · {profile.xp} 累積 XP
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <Stat label="30 日完成" value={String(stats.totalCompletions)} />
        <Stat
          label="出席率"
          value={`${Math.round(completionRate30)}%`}
          hint="有打卡嘅日數 / 30"
        />
        <Stat label="日均完成" value={avgPerDay.toFixed(1)} />
        <Stat
          label="本月最強"
          value={stats.topHabit?.name ?? "—"}
          hint={stats.topHabit ? `${stats.topHabit.count} 次` : undefined}
        />
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-sm font-medium text-[var(--color-fg-muted)]">
          最近抽卡
        </h2>
        {draws.length === 0 ? (
          <p className="text-sm text-[var(--color-fg-subtle)]">
            完成今日就會有抽卡機會。
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {draws.map((d) => (
              <li key={d.id} className="surface-card px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-semibold">{d.card.title}</span>
                  <span className="text-[10px] uppercase tracking-wide text-[var(--color-fg-subtle)]">
                    {d.card.rarity}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-[var(--color-fg-muted)]">
                  {d.card.copy}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-7">
        <h2 className="mb-2 text-sm font-medium text-[var(--color-fg-muted)]">
          每週反思
        </h2>
        <p className="surface-card px-4 py-4 text-[14px] leading-relaxed text-[var(--color-fg-muted)]">
          今個禮拜邊個 if-then 最少 friction？邊個最多？下星期可以 tweak 邊一個？
        </p>
      </section>

      <form action={signOut} className="mt-10">
        <button
          type="submit"
          className="text-[12px] text-[var(--color-fg-subtle)] underline-offset-2 hover:text-[var(--color-rose)] hover:underline"
        >
          登出
        </button>
      </form>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="surface-card px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-[var(--color-fg-subtle)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold leading-tight">{value}</p>
      {hint && (
        <p className="mt-0.5 text-[11px] text-[var(--color-fg-subtle)]">{hint}</p>
      )}
    </div>
  );
}
