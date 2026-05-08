"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { ChunkyButton } from "@/components/ui/ChunkyButton";
import { useDict } from "@/i18n/Provider";

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
  const dict = useDict();

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
    await sendCode(dict.login.code_sent);
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
      setError(dict.login.code_expired);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  if (step === "code") {
    return (
      <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
        <div className="surface-card px-5 py-4">
          <p
            style={{
              fontSize: 14,
              color: "var(--color-muted)",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {dict.login.magic_link_warning_pre}
            <span style={{ fontWeight: 700, color: "var(--color-text)" }}>
              {email}
            </span>
            {dict.login.magic_link_warning_post}
          </p>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            {dict.login.code_label}
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder={dict.login.code_placeholder}
            className="input-field tracking-[0.5em] text-center text-xl"
          />
        </label>

        {error && (
          <p
            style={{
              borderRadius: 12,
              border: "1.5px solid var(--color-danger)",
              background: "color-mix(in srgb, var(--color-danger) 12%, transparent)",
              padding: "10px 12px",
              fontSize: 14,
              color: "var(--color-danger)",
            }}
          >
            {error}
          </p>
        )}

        {notice && !error && (
          <p
            style={{
              borderRadius: 12,
              border: "1.5px solid var(--color-border)",
              background: "var(--color-surface)",
              padding: "10px 12px",
              fontSize: 14,
              color: "var(--color-muted)",
            }}
          >
            {notice}
          </p>
        )}

        <ChunkyButton
          type="submit"
          full
          disabled={pending || code.length !== 6}
        >
          {pending ? dict.login.verifying : dict.login.verify}
        </ChunkyButton>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={pending}
            onClick={() => sendCode(dict.login.code_sent_again)}
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
              textDecoration: "underline",
            }}
          >
            {dict.login.resend}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
              setNotice(null);
            }}
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
              textDecoration: "underline",
            }}
          >
            {dict.login.use_other_email}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">
          {dict.login.email_label}
        </span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.login.email_placeholder}
          className="input-field"
        />
      </label>

      {error && (
        <p
          style={{
            borderRadius: 12,
            border: "1.5px solid var(--color-danger)",
            background: "color-mix(in srgb, var(--color-danger) 12%, transparent)",
            padding: "10px 12px",
            fontSize: 14,
            color: "var(--color-danger)",
          }}
        >
          {error}
        </p>
      )}

      {notice && !error && (
        <p
          style={{
            borderRadius: 12,
            border: "1.5px solid var(--color-border)",
            background: "var(--color-surface)",
            padding: "10px 12px",
            fontSize: 14,
            color: "var(--color-muted)",
          }}
        >
          {notice}
        </p>
      )}

      <ChunkyButton type="submit" full disabled={pending || !email.trim()}>
        {pending ? dict.login.sending : dict.login.send_code}
      </ChunkyButton>
    </form>
  );
}
