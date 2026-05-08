import Link from "next/link";
import { HabitCard } from "@/components/HabitCard";
import { getProfile, getTodayHabits } from "@/lib/db";
import { todayIso } from "@/lib/domain";
import { identityFor, levelFromTotalXp } from "@/lib/identity";

const WEEKDAY = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

export default async function TodayPage() {
  const today = todayIso();
  const [profile, habits] = await Promise.all([getProfile(), getTodayHabits(today)]);
  const { level, inLevelXp, needed } = levelFromTotalXp(profile.xp);
  const identity = identityFor(level);
  const date = new Date();
  const dateLabel = `${date.getMonth() + 1} 月 ${date.getDate()} 日 · ${WEEKDAY[date.getDay()]}`;

  const completedToday = habits.filter((h) => h.completed_today).length;
  const total = habits.length;

  return (
    <div className="pt-2">
      <header className="mb-6 mt-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          {dateLabel}
        </p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight">
          Lv.{level} · {identity.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{identity.blurb}</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
          <div
            className="h-full bg-[var(--color-accent)] transition-all"
            style={{ width: `${Math.min(100, (inLevelXp / needed) * 100)}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-[var(--color-fg-subtle)]">
          {inLevelXp} / {needed} XP
        </p>
      </header>

      {habits.length > 0 ? (
        <>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-[var(--color-fg-muted)]">
              今日 · {completedToday}/{total}
            </h2>
            {total < 2 && (
              <Link
                href="/onboarding/new"
                className="text-xs text-[var(--color-accent)]"
              >
                + 加 habit
              </Link>
            )}
          </div>
          <ul className="flex flex-col gap-3">
            {habits.map((h) => (
              <li key={h.id}>
                <HabitCard habit={h} />
              </li>
            ))}
          </ul>
          {completedToday === total && total > 0 && (
            <p className="mt-6 text-center text-sm text-[var(--color-mint)]">
              今日完滿。明日再見。
            </p>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="surface-card mt-8 px-5 py-10 text-center">
      <h2 className="text-xl font-semibold">由一個 habit 開始</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        Day 1 最多 2 個 habit。新研究：太多反而 14 日內全部放棄。
        <br />
        揀一個你今晚就會做嘅 tiny version。
      </p>
      <Link
        href="/onboarding/new"
        className="btn-primary mt-6 inline-block min-w-[180px] text-center no-underline"
      >
        新增第一個 habit
      </Link>
    </div>
  );
}
