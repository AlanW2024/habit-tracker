export default function SetupPage() {
  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pt-12 pb-24 safe-top">
      <p
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-muted)",
        }}
      >
        SETUP
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
        Supabase 未設定
      </h1>
      <p
        style={{
          marginTop: 12,
          fontSize: 14,
          color: "var(--color-muted)",
          lineHeight: 1.6,
        }}
      >
        這個 app 用 Supabase 做 storage。5 分鐘可以搞定：
      </p>
      <ol className="mt-6 flex flex-col gap-4" style={{ fontSize: 14, lineHeight: 1.6 }}>
        <Step n={1}>
          打開{" "}
          <code className="font-mono" style={{ color: "var(--color-primary)" }}>
            supabase.com
          </code>
          ，新建 free project。
        </Step>
        <Step n={2}>
          Project Settings → API，複製 <code className="font-mono">URL</code> 和{" "}
          <code className="font-mono">anon key</code>。
        </Step>
        <Step n={3}>
          複製{" "}
          <code className="font-mono" style={{ color: "var(--color-primary)" }}>
            .env.local.example
          </code>{" "}
          為 <code className="font-mono">.env.local</code>，填入以上兩個值。
        </Step>
        <Step n={4}>
          打開 SQL Editor，執行{" "}
          <code className="font-mono" style={{ color: "var(--color-primary)" }}>
            supabase/migrations/0001_init.sql
          </code>
          。
        </Step>
        <Step n={5}>
          Restart dev server：
          <code className="font-mono"> npm run dev</code>
        </Step>
      </ol>
      <p
        style={{
          marginTop: 32,
          fontSize: 13,
          color: "var(--color-muted)",
          opacity: 0.8,
        }}
      >
        Phase 2 會加 Supabase Auth + 多裝置同步。MVP 純單機自用。
      </p>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        className="surface-card flex h-7 w-7 shrink-0 items-center justify-center"
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: "var(--color-primary)",
        }}
      >
        {n}
      </span>
      <span className="flex-1 pt-0.5">{children}</span>
    </li>
  );
}
