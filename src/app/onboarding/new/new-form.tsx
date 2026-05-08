"use client";

import { useActionState, useState } from "react";
import { createHabit, type HabitFormState } from "@/lib/actions";
import { ChunkyButton } from "@/components/ui/ChunkyButton";
import { useDict } from "@/i18n/Provider";
import type { Dict } from "@/i18n";

type HabitType = "daily_must" | "weekly_target";
type HabitDifficulty = "tiny" | "normal" | "stretch";

interface Preset {
  nameKey: keyof Dict["onboarding"];
  unitKey: keyof Dict["onboarding"];
  ifThenKey: keyof Dict["onboarding"];
  target: number;
}

const PRESETS: readonly Preset[] = [
  {
    nameKey: "preset_vibe_name",
    unitKey: "preset_vibe_unit",
    ifThenKey: "preset_vibe_if_then",
    target: 10,
  },
  {
    nameKey: "preset_read_name",
    unitKey: "preset_read_unit",
    ifThenKey: "preset_read_if_then",
    target: 1,
  },
] as const;

const DIFFICULTY_OPTIONS: readonly HabitDifficulty[] = [
  "tiny",
  "normal",
  "stretch",
];

export function NewHabitForm() {
  const dict = useDict();
  const [state, action, pending] = useActionState<HabitFormState, FormData>(
    createHabit,
    { ok: false },
  );
  const [type, setType] = useState<HabitType>("daily_must");
  const [difficulty, setDifficulty] = useState<HabitDifficulty>("tiny");

  const fillPreset = (preset: Preset) => {
    const set = (id: string, value: string) => {
      const el = document.querySelector(`[name="${id}"]`) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (el) el.value = value;
    };
    set("name", dict.onboarding[preset.nameKey]);
    set("target_qty", String(preset.target));
    set("unit", dict.onboarding[preset.unitKey]);
    set("if_then", dict.onboarding[preset.ifThenKey]);
  };

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <p
          style={{
            marginBottom: 8,
            fontSize: 12,
            fontWeight: 700,
            color: "var(--color-muted)",
          }}
        >
          {dict.onboarding.form_quick_start}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRESETS.map((p) => (
            <button
              key={p.nameKey}
              type="button"
              onClick={() => fillPreset(p)}
              style={{
                background: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                border: "none",
                borderRadius: 999,
                padding: "8px 14px",
                fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {dict.onboarding[p.nameKey]}
            </button>
          ))}
        </div>
      </div>

      <Field label={dict.onboarding.form_name_label} name="name" error={state.fieldErrors?.name}>
        <input
          name="name"
          required
          maxLength={40}
          placeholder={dict.onboarding.form_name_placeholder}
          className="input-field"
        />
      </Field>

      <div>
        <span className="mb-2 block text-sm font-medium">
          {dict.onboarding.form_type_label}
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {(["daily_must", "weekly_target"] as const).map((t) => {
            const active = type === t;
            return (
              <label
                key={t}
                style={{
                  background: active
                    ? "var(--color-primary-soft)"
                    : "var(--color-surface)",
                  color: active ? "var(--color-primary)" : "var(--color-text)",
                  border: `1.5px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                  borderRadius: 16,
                  padding: "12px 14px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={active}
                  onChange={() => setType(t)}
                  className="sr-only"
                />
                {t === "daily_must"
                  ? dict.onboarding.form_type_daily
                  : dict.onboarding.form_type_weekly}
              </label>
            );
          })}
        </div>
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "var(--color-muted)",
            lineHeight: 1.6,
          }}
        >
          {type === "daily_must"
            ? dict.onboarding.form_type_hint_daily
            : dict.onboarding.form_type_hint_weekly}
        </p>
      </div>

      {type === "weekly_target" && (
        <Field label={dict.onboarding.form_weekly_goal_label} name="weekly_goal">
          <input
            type="number"
            name="weekly_goal"
            min={1}
            max={7}
            defaultValue={5}
            className="input-field"
          />
        </Field>
      )}
      {type === "daily_must" && (
        <input type="hidden" name="weekly_goal" value="7" />
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label={dict.onboarding.form_target_qty_label} name="target_qty">
          <input
            type="number"
            name="target_qty"
            min={1}
            max={999}
            defaultValue={1}
            required
            className="input-field"
          />
        </Field>
        <Field label={dict.onboarding.form_unit_label} name="unit">
          <input
            name="unit"
            maxLength={8}
            defaultValue="次"
            required
            className="input-field"
          />
        </Field>
      </div>

      <Field
        label={dict.onboarding.form_if_then_label}
        name="if_then"
        error={state.fieldErrors?.if_then}
        hint={dict.onboarding.form_if_then_hint}
      >
        <textarea
          name="if_then"
          required
          minLength={6}
          maxLength={200}
          rows={2}
          placeholder={dict.onboarding.form_if_then_placeholder}
          className="input-field"
        />
      </Field>

      <div>
        <span className="mb-2 block text-sm font-medium">
          {dict.onboarding.form_difficulty_label}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {DIFFICULTY_OPTIONS.map((d) => {
            const active = difficulty === d;
            return (
              <label
                key={d}
                style={{
                  flex: 1,
                  background: active
                    ? "var(--color-primary-soft)"
                    : "var(--color-surface)",
                  color: active ? "var(--color-primary)" : "var(--color-text)",
                  border: `1.5px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                  borderRadius: 999,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={d}
                  checked={active}
                  onChange={() => setDifficulty(d)}
                  className="sr-only"
                />
                {d}
              </label>
            );
          })}
        </div>
      </div>

      <Field label={dict.onboarding.form_cue_time_label} name="cue_time">
        <input type="time" name="cue_time" className="input-field" />
      </Field>

      {state.error && !state.fieldErrors && (
        <p
          style={{
            borderRadius: 12,
            border: "1.5px solid var(--color-danger)",
            background:
              "color-mix(in srgb, var(--color-danger) 12%, transparent)",
            padding: "10px 12px",
            fontSize: 14,
            color: "var(--color-danger)",
          }}
        >
          {state.error}
        </p>
      )}

      <ChunkyButton type="submit" full disabled={pending}>
        {pending ? dict.onboarding.form_submitting : dict.onboarding.form_submit}
      </ChunkyButton>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, name, hint, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && (
        <p
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "var(--color-muted)",
            lineHeight: 1.6,
          }}
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          style={{
            marginTop: 4,
            fontSize: 12,
            color: "var(--color-danger)",
          }}
          data-field={name}
        >
          {error}
        </p>
      )}
    </label>
  );
}
