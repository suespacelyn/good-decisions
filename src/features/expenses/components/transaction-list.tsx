"use client";

import { Repeat, Trash2 } from "lucide-react";
import type { Transaction } from "@/core/types";
import { useStore } from "@/core/data/store";
import { CATEGORY_META } from "@/features/expenses/data/categories";
import { formatSGD, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TransactionList({ items }: { items: Transaction[] }) {
  const { deleteTransaction } = useStore();

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No transactions yet. Tap <strong>Add</strong> to log your first one.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((t) => {
        const meta = CATEGORY_META[t.category];
        const isIncome = t.kind === "income";
        return (
          <li
            key={t.id}
            className="group flex items-center gap-3 rounded-xl bg-card p-3 shadow-soft"
          >
            <span
              className="grid size-10 shrink-0 place-items-center rounded-xl text-lg"
              style={{ backgroundColor: isIncome ? "var(--color-positive)" : meta.color }}
            >
              {isIncome ? "💰" : meta.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold leading-tight">{t.label}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {formatDate(t.date)}
                {t.recurrence !== "once" && (
                  <span className="inline-flex items-center gap-0.5 capitalize">
                    <Repeat className="size-3" /> {t.recurrence}
                  </span>
                )}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 font-extrabold tabular-nums",
                isIncome ? "text-positive" : "text-foreground",
              )}
            >
              {isIncome ? "+" : "−"}
              {formatSGD(t.amount)}
            </span>
            <button
              onClick={() => deleteTransaction(t.id)}
              aria-label="Delete"
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground opacity-70 transition md:opacity-0 md:group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
