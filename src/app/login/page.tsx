import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pt-16 pb-24 safe-top">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          1% — 自律打卡
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">登入</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          冇密碼。輸入你嘅 email，會收到一組 6 位數登入 code。
        </p>
      </header>

      <LoginForm />

      <p className="mt-10 text-[12px] leading-relaxed text-[var(--color-fg-subtle)]">
        Code 有效 1 小時。Email 入面如果見到 magic link，先唔好撳，直接返嚟輸入 code 最穩。
      </p>
    </div>
  );
}
