"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";

type Step = "email" | "code";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/today";
  }
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function sendCode(successMessage: string) {
    setError(null);
    setNotice(null);
    setPending(true);

    const sb = getBrowserSupabase();
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: signInError } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirect, shouldCreateUser: false },
    });
    setPending(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setStep("code");
    setNotice(successMessage);
  }

  async function handleSendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendCode("Code 已寄出。請開新 email，複製 6 位數字返嚟。");
  }

  async function handleVerifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setPending(true);

    const sb = getBrowserSupabase();
    const { error: verifyError } = await sb.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });
    setPending(false);
    if (verifyError) {
      setError("Code 過期或已被用過。請重新寄 code，再用最新 email 入面嘅 6 位數字。");
      return;
    }
    router.replace(next);
    router.refresh();
  }

  if (step === "code") {
    return (
      <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
        <div className="surface-card px-5 py-4">
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            Email 已寄到 <span className="font-medium text-[var(--color-fg)]">{email}</span>。
            <br />
            入面有 <span className="font-medium text-[var(--color-accent)]">6 位數字</span> code，
            用 code 登入最穩；如果見到 magic link，先唔好撳。
          </p>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">6 位數 code</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="input-field tracking-[0.5em] text-center text-xl"
          />
        </label>

        {error && (
          <p className="rounded-[12px] border border-[var(--color-rose)] bg-[var(--color-rose-soft)] px-3 py-2 text-sm text-[var(--color-rose)]">
            {error}
          </p>
        )}

        {notice && !error && (
          <p className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg-muted)]">
            {notice}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={pending || code.length !== 6}
        >
          {pending ? "驗證中..." : "登入"}
        </button>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            className="text-[12px] text-[var(--color-fg-subtle)] underline"
            disabled={pending}
            onClick={() => sendCode("新 code 已寄出。只用最新 email 入面嘅 6 位數字。")}
          >
            重新寄 code
          </button>
          <button
            type="button"
            className="text-[12px] text-[var(--color-fg-subtle)] underline"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
              setNotice(null);
            }}
          >
            用第二個 email
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input-field"
        />
      </label>

      {error && (
        <p className="rounded-[12px] border border-[var(--color-rose)] bg-[var(--color-rose-soft)] px-3 py-2 text-sm text-[var(--color-rose)]">
          {error}
        </p>
      )}

      {notice && !error && (
        <p className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg-muted)]">
          {notice}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={pending || !email.trim()}>
        {pending ? "傳送中..." : "寄登入 code"}
      </button>
    </form>
  );
}
