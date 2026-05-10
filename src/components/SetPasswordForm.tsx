"use client";

import { useActionState, useState } from "react";
import { setUserPassword, type SetPasswordState } from "@/lib/actions";
import { ChunkyButton } from "@/components/ui/ChunkyButton";
import { useDict } from "@/i18n/Provider";

export function SetPasswordForm() {
  const dict = useDict();
  const [state, formAction, pending] = useActionState<
    SetPasswordState | undefined,
    FormData
  >(setUserPassword, undefined);
  const [password, setPassword] = useState("");

  const errorText =
    state?.errorKey === "password_too_short"
      ? dict.errors.password_too_short
      : state?.errorMessage;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <p
        style={{
          fontSize: 12,
          color: "var(--color-muted)",
          lineHeight: 1.55,
        }}
      >
        {dict.profile.password_section_hint}
      </p>

      <label className="block">
        <span className="sr-only">{dict.profile.password_label}</span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={6}
          required
          placeholder={dict.profile.password_placeholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
      </label>

      {errorText && (
        <p
          style={{
            fontSize: 13,
            color: "var(--color-danger)",
          }}
        >
          {errorText}
        </p>
      )}

      {state?.saved && !errorText && (
        <p
          style={{
            fontSize: 13,
            color: "var(--color-success)",
          }}
        >
          {dict.profile.password_saved}
        </p>
      )}

      <ChunkyButton type="submit" disabled={pending || password.length < 6}>
        {pending
          ? dict.profile.password_saving
          : state?.saved
            ? dict.profile.password_change_cta
            : dict.profile.password_set_cta}
      </ChunkyButton>
    </form>
  );
}
