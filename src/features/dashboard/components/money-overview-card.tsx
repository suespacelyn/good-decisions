"use client";

import { Eye, EyeOff } from "lucide-react";
import { useStore } from "@/core/data/store";
import { monthlyCashflow, totalCpf } from "@/core/selectors";
import { formatSGD } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The home hero: the user's total savings + assets (cash + investments + CPF),
 * with this month's income / expenses / savings tucked in just below. The
 * detailed account breakdown lives in <AccountsBreakdown> directly under this.
 */
export function MoneyOverviewCard({
  hidden,
  onToggleHidden,
}: {
  hidden: boolean;
  onToggleHidden: () => void;
}) {
  const { state } = useStore();

  const total =
    state.snapshot.cashSavings +
    state.snapshot.investmentsValue +
    totalCpf(state.snapshot);
  const { expenses, savings } = monthlyCashflow(state.transactions);

  const show = (n: number) => (hidden ? "••••••" : formatSGD(n));

  const tiles = [
    { label: "Expenses", value: show(expenses), tone: "text-rose-300" },
    {
      label: "Saved",
      value: show(savings),
      tone: savings >= 0 ? "text-positive" : "text-rose-300",
    },
  ];

  return (
    <div
      data-tour="overview"
      className="overflow-hidden rounded-xl bg-ink p-5 text-ink-foreground shadow-soft-lg"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-muted">Total net worth</p>
        <button
          onClick={onToggleHidden}
          aria-label={hidden ? "Show balances" : "Hide balances"}
          className="grid size-8 place-items-center rounded-lg text-ink-muted transition hover:bg-white/10 hover:text-ink-foreground"
        >
          {hidden ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
        </button>
      </div>

      <p className="mt-1 text-[2.5rem] font-extrabold leading-none tracking-tight tabular-nums">
        {show(total)}
      </p>
      <p className="mt-2 text-sm font-semibold text-ink-muted">
        in savings &amp; assets
      </p>

      {/* This month — income / expenses / saved, right inside the hero */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink-muted">
          This month
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl bg-white/10 p-3">
              <p className="text-xs font-semibold text-ink-muted">{t.label}</p>
              <p
                className={cn(
                  "mt-0.5 text-lg font-extrabold tabular-nums",
                  t.tone,
                )}
              >
                {t.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {state.snapshot.debt > 0 && !hidden && (
        <p className="mt-3 text-xs font-medium text-ink-muted">
          You&apos;re also carrying {formatSGD(state.snapshot.debt)} in debt —
          your Coach can help.
        </p>
      )}
    </div>
  );
}
