import Link from "next/link";
import { HabitCard } from "@/components/HabitCard";
import { DevPanel } from "@/components/DevPanel";
import { Disco } from "@/components/Disco";
import { ConfettiBurst, FlameIcon } from "@/components/icons";
import { ChunkyButton } from "@/components/ui/ChunkyButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProfile, getTodayHabits } from "@/lib/db";
import { todayIso } from "@/lib/domain";
import { getDict, getLocale, format } from "@/i18n";

const WEEKDAY_ZH = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
const WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pickGreeting(
  hour: number,
  dict: Awaited<ReturnType<typeof getDict>>,
): string {
  if (hour < 6) return dict.today.greeting_dawn;
  if (hour < 12) return dict.today.greeting_morning;
  if (hour < 18) return dict.today.greeting_afternoon;
  return dict.today.greeting_evening;
}

function nameFromProfile(displayName: string | null | undefined): string {
  if (!displayName) return "";
  const at = displayName.indexOf("@");
  if (at > 0) return displayName.slice(0, at);
  return displayName;
}

export default async function TodayPage() {
  const today = todayIso();
  const [profile, habits, dict, locale] = await Promise.all([
    getProfile(),
    getTodayHabits(today),
    getDict(),
    getLocale(),
  ]);

  const date = new Date();
  const weekdayList = locale === "en" ? WEEKDAY_EN : WEEKDAY_ZH;
  const dateLabel =
    locale === "en"
      ? `${date.toLocaleString("en-US", { month: "short" })} ${date.getDate()} · ${weekdayList[date.getDay()]}`
      : `${date.getMonth() + 1} 月 ${date.getDate()} 日 · ${weekdayList[date.getDay()]}`;

  const completedToday = habits.filter((h) => h.completed_today).length;
  const total = habits.length;
  const pct = total > 0 ? completedToday / total : 0;
  const longestStreak = habits.reduce(
    (max, h) => Math.max(max, h.streak?.current_streak ?? 0),
    0,
  );

  const mood = pct === 1 ? "cheer" : "happy";
  const greeting = pickGreeting(date.getHours(), dict);
  const userName = nameFromProfile(profile.display_name);

  if (total === 0) {
    return <EmptyToday dict={dict} />;
  }

  return (
    <div className="pt-2" style={{ paddingBottom: 120 }}>
      {/* Greeting */}
      <div style={{ marginTop: 4, marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--color-muted)",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {dateLabel}
        </div>
        <div
          style={{
            fontFamily:
              "var(--font-display), Space Grotesk, system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: -1,
            marginTop: 2,
          }}
        >
          {userName ? `${greeting}，${userName}` : greeting}
        </div>
      </div>

      {/* Hero — Mascot + progress */}
      <section
        style={{
          position: "relative",
          background:
            "linear-gradient(140deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 80%, transparent) 100%)",
          borderRadius: 28,
          padding: 20,
          color: "#fff",
          boxShadow:
            "0 12px 30px color-mix(in srgb, var(--color-primary) 40%, transparent), inset 0 -5px 0 rgba(0,0,0,0.12)",
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            opacity: 0.55,
          }}
          aria-hidden="true"
        >
          <ConfettiBurst size={70} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <Disco size={92} mood={mood} color="#FFFCF5" accent="var(--color-primary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 800,
                opacity: 0.9,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {dict.today.header_progress}
            </div>
            <div
              style={{
                fontFamily:
                  "var(--font-display), Space Grotesk, system-ui, sans-serif",
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1,
                marginTop: 2,
              }}
            >
              {Math.round(pct * 100)}
              <span style={{ fontSize: 22, opacity: 0.85 }}>%</span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 800,
                color: "var(--color-on-primary-subtle)",
                marginTop: 4,
              }}
            >
              {completedToday === total
                ? dict.today.all_done
                : format(dict.today.remaining_template, {
                    n: total - completedToday,
                  })}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 8,
            background: "rgba(0,0,0,0.18)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct * 100}%`,
              background: "#FFFCF5",
              borderRadius: 999,
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.08)",
              transition: "width 600ms cubic-bezier(.2,.9,.3,1.2)",
            }}
          />
        </div>
      </section>

      {/* Stat strip */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 8,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: 16,
            padding: "12px 16px",
            border: "1.5px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <FlameIcon size={22} color="var(--color-flame)" />
          <div>
            <div
              style={{
                fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 800,
                color: "var(--color-muted)",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {dict.today.stat_streak}
            </div>
            <div
              style={{
                fontFamily:
                  "var(--font-display), Space Grotesk, system-ui, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: -1,
                lineHeight: 1,
                marginTop: 2,
              }}
            >
              {longestStreak}
              <span
                style={{
                  fontSize: 13,
                  color: "var(--color-muted)",
                  marginLeft: 3,
                }}
              >
                {dict.today.stat_streak_unit}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: 16,
            padding: 12,
            border: "1.5px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 800,
              color: "var(--color-muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {dict.today.stat_week_rate}
          </div>
          <div
            style={{
              fontFamily:
                "var(--font-display), Space Grotesk, system-ui, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--color-text)",
              letterSpacing: -0.5,
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            {Math.round(pct * 100)}
            <span
              style={{
                fontSize: 12,
                color: "var(--color-muted)",
                marginLeft: 2,
              }}
            >
              %
            </span>
          </div>
        </div>
      </section>

      {/* Today's habits */}
      <section style={{ marginBottom: 18 }}>
        <SectionHeader
          title={dict.today.section_today}
          action={`${completedToday}/${total}`}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} />
          ))}
        </div>
      </section>

      {/* Reflection card (placeholder Write button) */}
      <section
        style={{
          background: "var(--color-surface)",
          border: "1.5px dashed var(--color-border)",
          borderRadius: 22,
          padding: 16,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "var(--color-primary-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--color-primary)",
          }}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 9 h 6 M9 13 h 6 M9 17 h 4" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 800,
              color: "var(--color-text)",
            }}
          >
            {dict.today.reflection_title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--color-muted)",
              marginTop: 2,
            }}
          >
            {dict.today.reflection_subtitle}
          </div>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          style={{
            background: "transparent",
            color: "var(--color-primary)",
            border: "1.5px solid var(--color-primary)",
            padding: "7px 14px",
            borderRadius: 999,
            fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 13,
            cursor: "not-allowed",
            opacity: 0.7,
          }}
        >
          {dict.today.reflection_cta}
        </button>
      </section>

      {/* Quote */}
      <div
        style={{
          textAlign: "center",
          padding: "4px 12px",
          fontFamily:
            "var(--font-display), Space Grotesk, system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 500,
          fontStyle: "italic",
          color: "var(--color-muted)",
          lineHeight: 1.4,
        }}
      >
        {dict.today.quote}
      </div>

      <DevPanel />
    </div>
  );
}

interface EmptyTodayProps {
  dict: Awaited<ReturnType<typeof getDict>>;
}

function EmptyToday({ dict }: EmptyTodayProps) {
  const chips = [
    dict.today.empty_chip_water,
    dict.today.empty_chip_walk,
    dict.today.empty_chip_read,
    dict.today.empty_chip_sleep,
  ];
  return (
    <div className="pt-8 text-center" style={{ paddingBottom: 120 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Disco size={120} mood="happy" color="var(--color-primary)" accent="#FFFCF5" />
      </div>
      <h2
        style={{
          fontFamily:
            "var(--font-display), Space Grotesk, system-ui, sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: "var(--color-text)",
          letterSpacing: -0.5,
        }}
      >
        {dict.today.empty_title}
      </h2>
      <p
        style={{
          marginTop: 12,
          fontSize: 14,
          fontWeight: 600,
          color: "var(--color-muted)",
          lineHeight: 1.6,
          whiteSpace: "pre-line",
        }}
      >
        {dict.today.empty_body}
      </p>
      <div
        style={{
          marginTop: 18,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {chips.map((c) => (
          <span
            key={c}
            style={{
              background: "var(--color-primary-soft)",
              color: "var(--color-primary)",
              padding: "6px 12px",
              borderRadius: 999,
              fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <Link href="/onboarding/new" style={{ textDecoration: "none" }}>
          <ChunkyButton full>{dict.today.empty_cta}</ChunkyButton>
        </Link>
      </div>
    </div>
  );
}
