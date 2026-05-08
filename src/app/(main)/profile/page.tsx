import { Disco } from "@/components/Disco";
import { PreferencesCard } from "@/components/PreferencesCard";
import { getDict, format } from "@/i18n";
import {
  identityBlurbFor,
  identityTitleFor,
  levelFromTotalXp,
} from "@/lib/identity";
import { signOut } from "@/lib/actions";
import { getProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [profile, dict] = await Promise.all([getProfile(), getDict()]);
  const { level, inLevelXp, needed } = levelFromTotalXp(profile.xp);
  const identityTitle = identityTitleFor(level, dict);
  const identityBlurb = identityBlurbFor(level, dict);
  const pct = needed > 0 ? Math.min(100, (inLevelXp / needed) * 100) : 0;

  return (
    <div className="pt-2" style={{ paddingBottom: 120 }}>
      <header
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Disco size={88} mood="happy" color="var(--color-primary)" accent="#FFFCF5" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            {format(dict.profile.level, { level })}
          </p>
          <h1
            style={{
              marginTop: 2,
              fontFamily:
                "var(--font-display), Space Grotesk, system-ui, sans-serif",
              fontSize: 26,
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
              fontSize: 13,
              color: "var(--color-muted)",
              lineHeight: 1.5,
            }}
          >
            {identityBlurb}
          </p>
        </div>
      </header>

      <div
        style={{
          marginBottom: 24,
          background: "var(--color-surface)",
          border: "1.5px solid var(--color-border)",
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div
          style={{
            height: 8,
            background: "var(--color-surface-alt)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "var(--color-primary)",
              borderRadius: 999,
              transition: "width 600ms cubic-bezier(.2,.9,.3,1.2)",
            }}
          />
        </div>
        <p
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "var(--color-muted)",
          }}
        >
          {format(dict.profile.xp_progress, {
            cur: inLevelXp,
            need: needed,
          })}
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <PreferencesCard />
      </div>

      <form action={signOut}>
        <button
          type="submit"
          style={{
            background: "transparent",
            border: "none",
            fontSize: 13,
            color: "var(--color-muted)",
            textDecoration: "underline",
            textUnderlineOffset: 2,
            cursor: "pointer",
          }}
        >
          {dict.settings.sign_out}
        </button>
      </form>
    </div>
  );
}
