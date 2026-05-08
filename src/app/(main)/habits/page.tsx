import { getDict } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const dict = await getDict();
  return (
    <div className="pt-2">
      <header className="mb-5 mt-2">
        <h1 className="text-3xl font-semibold leading-tight">
          {dict.habits.title}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          {dict.habits.subtitle}
        </p>
      </header>
      {/* TODO: Phase 5 — list active + archived habits with filter chips. */}
      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        TODO
      </p>
    </div>
  );
}
