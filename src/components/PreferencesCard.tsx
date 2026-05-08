import { getAccent, getTheme } from "@/theme";
import { getDict } from "@/i18n";
import { LocaleToggle } from "./LocaleToggle";
import { ThemeToggle } from "./ThemeToggle";
import { AccentToggle } from "./AccentToggle";

export async function PreferencesCard() {
  const [theme, accent, dict] = await Promise.all([
    getTheme(),
    getAccent(),
    getDict(),
  ]);
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1.5px solid var(--color-border)",
        borderRadius: 22,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h2
        style={{
          fontFamily:
            "var(--font-display), Space Grotesk, system-ui, sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: "var(--color-text)",
        }}
      >
        {dict.settings.preferences}
      </h2>
      <Section label={dict.settings.language}>
        <LocaleToggle />
      </Section>
      <Section label={dict.settings.theme}>
        <ThemeToggle current={theme} />
      </Section>
      <Section label={dict.settings.accent}>
        <AccentToggle current={accent} />
      </Section>
    </div>
  );
}

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

function Section({ label, children }: SectionProps) {
  return (
    <div>
      <p
        style={{
          marginBottom: 8,
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "var(--color-muted)",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
