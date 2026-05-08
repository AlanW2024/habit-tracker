import { getDict } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const dict = await getDict();
  return (
    <div className="pt-2">
      <header className="mb-5 mt-2">
        <h1 className="text-3xl font-semibold leading-tight">
          {dict.profile.title}
        </h1>
      </header>
      {/* TODO: Phase 6 — Disco header + level + identity tier + PreferencesCard + sign-out. */}
      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        TODO
      </p>
    </div>
  );
}
