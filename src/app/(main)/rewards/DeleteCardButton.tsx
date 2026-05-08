"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRewardCard } from "@/lib/actions";
import { useDict } from "@/i18n/Provider";

export function DeleteCardButton({ cardId }: { cardId: string }) {
  const dict = useDict();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label={dict.rewards.delete_aria}
      onClick={() => {
        if (!confirm(dict.rewards.delete_confirm)) return;
        startTransition(async () => {
          await deleteRewardCard(cardId);
        });
      }}
      disabled={pending}
      style={{
        flexShrink: 0,
        borderRadius: 12,
        border: "1.5px solid var(--color-border)",
        padding: 8,
        color: "var(--color-muted)",
        background: "transparent",
        opacity: pending ? 0.4 : 1,
        cursor: pending ? "default" : "pointer",
      }}
    >
      <Trash2 size={14} strokeWidth={2} />
    </button>
  );
}
