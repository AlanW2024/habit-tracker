"use client";

import { useActionState, useState } from "react";
import { createHabit, type HabitFormState } from "@/lib/actions";

interface NewHabitFormProps {
  existingCount: number;
}

const TYPE_HINTS: Record<string, string> = {
  daily_must: "每日必達。最少做 tiny version。漏一日 OK，漏兩日會出 alert。",
  weekly_target: "每週達標 X/7 即達標。對唔係日日做嘅事比較人性。",
};

const PRESETS = [
  {
    name: "Vibe coding",
    target: 10,
    unit: "分鐘",
    if_then: "食完早餐 → 開 IDE 寫 1 行 code（喺書枱）",
  },
  {
    name: "閱讀",
    target: 1,
    unit: "頁",
    if_then: "瞓前 → 讀 1 頁紙本書（喺床頭櫃）",
  },
];

export function NewHabitForm({ existingCount }: NewHabitFormProps) {
  const [state, action, pending] = useActionState<HabitFormState, FormData>(
    createHabit,
    { ok: false },
  );
  const [type, setType] = useState<"daily_must" | "weekly_target">("daily_must");

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs text-[var(--color-fg-muted)]">快速開始</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => fillFromPreset(p)}
              className="btn-ghost text-sm"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <Field label="習慣名稱" name="name" error={state.fieldErrors?.name}>
        <input
          name="name"
          required
          maxLength={40}
          placeholder="例如：Vibe coding"
          className="input-field"
        />
      </Field>

      <div>
        <span className="mb-2 block text-sm font-medium">類型</span>
        <div className="grid grid-cols-2 gap-2">
          {(["daily_must", "weekly_target"] as const).map((t) => (
            <label
              key={t}
              className={`surface-card cursor-pointer px-3 py-3 text-sm ${
                type === t ? "ring-2 ring-[var(--color-accent)]" : ""
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
              />
              <span className="font-medium">
                {t === "daily_must" ? "每日必達" : "每週達標"}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-fg-muted)]">
          {TYPE_HINTS[type]}
        </p>
      </div>

      {type === "weekly_target" && (
        <Field label="每週目標 (天)" name="weekly_goal">
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
        <Field label="目標數量" name="target_qty">
          <input
            id="target_qty"
            type="number"
            name="target_qty"
            min={1}
            max={999}
            defaultValue={1}
            required
            className="input-field"
          />
        </Field>
        <Field label="單位" name="unit">
          <input
            id="unit"
            name="unit"
            maxLength={8}
            defaultValue="次"
            required
            className="input-field"
          />
        </Field>
      </div>

      <Field
        label="If-Then（強制）"
        name="if_then"
        error={state.fieldErrors?.if_then}
        hint="格式：「After ___, I will ___ at ___」。Gollwitzer 研究：填咗呢條，達標率高 60%。"
      >
        <textarea
          id="if_then"
          name="if_then"
          required
          minLength={6}
          maxLength={200}
          rows={2}
          placeholder="食完早餐 → 開 IDE 寫 1 行 code（喺書枱）"
          className="input-field"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="難度（建議 tiny）" name="difficulty">
          <select name="difficulty" defaultValue="tiny" className="input-field">
            <option value="tiny">tiny</option>
            <option value="normal">normal</option>
            <option value="stretch">stretch</option>
          </select>
        </Field>
        <Field label="提示時間（可選）" name="cue_time">
          <input
            type="time"
            name="cue_time"
            className="input-field"
          />
        </Field>
      </div>

      {state.error && !state.fieldErrors && (
        <p className="rounded-[12px] border border-[var(--color-rose)] bg-[var(--color-rose-soft)] px-3 py-2 text-sm text-[var(--color-rose)]">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn-primary mt-2" disabled={pending}>
        {pending ? "建立中..." : `建立 (剩 ${1 - existingCount} 個 slot)`}
      </button>
    </form>
  );
}

function fillFromPreset(p: {
  name: string;
  target: number;
  unit: string;
  if_then: string;
}) {
  const set = (id: string, value: string) => {
    const el = document.querySelector(`[name="${id}"]`) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (el) el.value = value;
  };
  set("name", p.name);
  set("target_qty", String(p.target));
  set("unit", p.unit);
  set("if_then", p.if_then);
}

function Field({
  label,
  name,
  hint,
  error,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-fg-subtle)]">
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1 text-[12px] text-[var(--color-rose)]" data-field={name}>
          {error}
        </p>
      )}
    </label>
  );
}
