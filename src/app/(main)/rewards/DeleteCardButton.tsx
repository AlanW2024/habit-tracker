"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRewardCard } from "@/lib/actions";

export function DeleteCardButton({ cardId }: { cardId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="刪除呢張卡"
      onClick={() => {
        if (!confirm("刪咗呢張卡？")) return;
        startTransition(async () => {
          await deleteRewardCard(cardId);
        });
      }}
      disabled={pending}
      className="shrink-0 rounded-lg border border-[var(--color-border-strong)] p-2 text-[var(--color-fg-subtle)] hover:border-[var(--color-rose)] hover:text-[var(--color-rose)] disabled:opacity-40"
    >
      <Trash2 size={14} strokeWidth={2} />
    </button>
  );
}
