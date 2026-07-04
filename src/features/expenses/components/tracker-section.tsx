"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/core/data/store";
import { AddTransactionDialog } from "@/features/expenses/components/add-transaction-dialog";
import { IncomeExpenseChart } from "@/features/expenses/components/income-expense-chart";
import { TransactionList } from "@/features/expenses/components/transaction-list";

/**
 * Money tracker — income vs. expenses bar chart + recent transactions + quick
 * add. Used directly on the home page (and on the full /expenses view).
 */
export function TrackerSection({ limit }: { limit?: number }) {
  const { state } = useStore();

  const recent = useMemo(
    () =>
      [...state.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [state.transactions],
  );
  const shown = limit ? recent.slice(0, limit) : recent;

  return (
    <section data-tour="tracker" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Tracker
        </h2>
        <AddTransactionDialog />
      </div>

      {state.transactions.length > 0 &&
        (limit ? (
          // Home summary: a tappable monthly preview that opens the full tracker.
          <Link
            href="/expenses"
            aria-label="View full tracker"
            className="block transition hover:opacity-90"
          >
            <IncomeExpenseChart />
          </Link>
        ) : (
          // Full page: the interactive chart with a Daily/Weekly/Monthly/Yearly switcher.
          <IncomeExpenseChart withControls />
        ))}

      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Recent
        </h3>
        {limit && recent.length > limit && (
          <Link href="/expenses" className="text-sm font-bold text-link">
            See all
          </Link>
        )}
      </div>
      <TransactionList items={shown} />
    </section>
  );
}
