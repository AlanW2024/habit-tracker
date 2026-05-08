import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveHabits } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ChunkyButton } from "@/components/ui/ChunkyButton";
import { getDict } from "@/i18n";
import { NewHabitForm } from "./new-form";

export const dynamic = "force-dynamic";

export default async function NewHabitPage() {
  if (!isSupabaseConfigured()) redirect("/setup");
  const [habits, dict] = await Promise.all([getActiveHabits(), getDict()]);
  const atCap = habits.length >= 2;

  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pb-24 pt-6 safe-top">
      <Link
        href="/today"
        style={{
          fontSize: 12,
          color: "var(--color-muted)",
          textDecoration: "none",
        }}
      >
        {dict.onboarding.back_to_today}
      </Link>
      <header className="mt-4 mb-6">
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          {dict.onboarding.section_label}
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
          {dict.onboarding.title}
        </h1>
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "var(--color-muted)",
            lineHeight: 1.6,
          }}
        >
          {dict.onboarding.subtitle}
        </p>
      </header>

      {atCap ? (
        <div className="surface-card px-5 py-6">
          <h2
            style={{
              fontFamily:
                "var(--font-display), Space Grotesk, system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "var(--color-text)",
            }}
          >
            {dict.onboarding.at_cap_title}
          </h2>
          <p
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "var(--color-muted)",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {dict.onboarding.at_cap_body}
          </p>
          <Link
            href="/today"
            style={{ display: "inline-block", marginTop: 18, textDecoration: "none" }}
          >
            <ChunkyButton>{dict.onboarding.back_button}</ChunkyButton>
          </Link>
        </div>
      ) : (
        <NewHabitForm />
      )}
    </div>
  );
}
