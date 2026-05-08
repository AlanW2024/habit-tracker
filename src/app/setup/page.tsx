export default function SetupPage() {
  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pt-12 pb-24 safe-top">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
        SETUP
      </p>
      <h1 className="mt-1 text-3xl font-semibold leading-tight">
        Supabase 未設定
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        呢個 app 用 Supabase 做 storage。5 分鐘可以搞掂：
      </p>
      <ol className="mt-6 flex flex-col gap-4 text-[14px] leading-relaxed">
        <Step n={1}>
          開 <code className="font-mono text-[var(--color-accent)]">supabase.com</code>
          ，新建 free project。
        </Step>
        <Step n={2}>
          Project Settings → API，複製 <code className="font-mono">URL</code> 同{" "}
          <code className="font-mono">anon key</code>。
        </Step>
        <Step n={3}>
          複製{" "}
          <code className="font-mono text-[var(--color-accent)]">
            .env.local.example
          </code>{" "}
          做 <code className="font-mono">.env.local</code>，填入以上兩個值。
        </Step>
        <Step n={4}>
          落 SQL Editor，跑{" "}
          <code className="font-mono text-[var(--color-accent)]">
            supabase/migrations/0001_init.sql
          </code>
          。
        </Step>
        <Step n={5}>
          Restart dev server：
          <code className="font-mono"> npm run dev</code>
        </Step>
      </ol>
      <p className="mt-8 text-[13px] text-[var(--color-fg-subtle)]">
        Phase 2 會加 Supabase Auth + 多裝置同步。MVP 純單機自用。
      </p>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="surface-card flex h-7 w-7 shrink-0 items-center justify-center text-xs font-semibold text-[var(--color-accent)]">
        {n}
      </span>
      <span className="flex-1 pt-0.5">{children}</span>
    </li>
  );
}
