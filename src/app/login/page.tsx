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
          冇密碼。輸入你嘅 email，會收到一條 magic link，撳一下就登入。
        </p>
      </header>

      <LoginForm />

      <p className="mt-10 text-[12px] leading-relaxed text-[var(--color-fg-subtle)]">
        Magic link 有效 1 小時。登入後 session 維持 30 日，phone 加 home screen 之後唔使再 login。
      </p>
    </div>
  );
}
