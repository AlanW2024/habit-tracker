"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/today";

  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const sb = getBrowserSupabase();
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: signInError } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirect },
    });
    setPending(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="surface-card px-5 py-6">
        <h2 className="text-lg font-semibold text-[var(--color-mint)]">
          Email 已寄出
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          Check 你 <span className="font-medium text-[var(--color-fg)]">{email}</span>{" "}
          嘅 inbox（同 spam）。撳 magic link 就會自動登入。
        </p>
        <p className="mt-3 text-[12px] text-[var(--color-fg-subtle)]">
          Email 唔啱？{" "}
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="text-[var(--color-accent)] underline"
          >
            重試
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

      <button type="submit" className="btn-primary" disabled={pending || !email.trim()}>
        {pending ? "傳送中..." : "寄 magic link"}
      </button>
    </form>
  );
}
