"use client";

import { Trash2 } from "lucide-react";
import type { Holding } from "@/core/types";
import { useStore } from "@/core/data/store";
import { HOLDING_TYPE_META } from "@/features/investments/data/holding-types";
import { formatSGD, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function HoldingList({ items }: { items: Holding[] }) {
  const { deleteHolding } = useStore();

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No holdings yet. Tap <strong>Add</strong> to track your first investment.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((h) => {
        const meta = HOLDING_TYPE_META[h.type];
        const gain = h.currentValue - h.costBasis;
        const gainPct = h.costBasis > 0 ? (gain / h.costBasis) * 100 : 0;
        const up = gain >= 0;
        return (
          <li
            key={h.id}
            className="group flex items-center gap-3 rounded-xl bg-card p-3.5 shadow-soft"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-lg">
              {meta.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold leading-tight">{h.name}</p>
              <p className="text-xs text-muted-foreground">
                {meta.label} · {h.broker}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-extrabold tabular-nums">
                {formatSGD(h.currentValue)}
              </p>
              <p
                className={cn(
                  "text-xs font-bold tabular-nums",
                  up ? "text-positive" : "text-destructive",
                )}
              >
                {up ? "+" : "−"}
                {formatSGD(Math.abs(gain))} ({formatPercent(Math.abs(gainPct), 1)})
              </p>
            </div>
            <button
              onClick={() => deleteHolding(h.id)}
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
