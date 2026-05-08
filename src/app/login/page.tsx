import { Disco } from "@/components/Disco";
import { getDict } from "@/i18n";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const dict = await getDict();
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pt-12 pb-24 safe-top">
      <header className="mb-8">
        <div style={{ marginBottom: 16 }}>
          <Disco size={72} mood="happy" color="var(--color-primary)" accent="#FFFCF5" />
        </div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          {dict.login.brand}
        </p>
        <h1
          style={{
            marginTop: 8,
            fontFamily:
              "var(--font-display), Space Grotesk, system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: -1,
          }}
        >
          {dict.login.title}
        </h1>
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "var(--color-muted)",
            lineHeight: 1.5,
          }}
        >
          {dict.login.subtitle}
        </p>
      </header>

      <LoginForm />

      <p
        style={{
          marginTop: 32,
          fontSize: 12,
          color: "var(--color-muted)",
          opacity: 0.8,
          lineHeight: 1.6,
        }}
      >
        {dict.login.code_validity}
      </p>
    </div>
  );
}
