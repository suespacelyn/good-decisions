"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/core/data/store";
import { incomeExpenseSeries, type ChartPeriod } from "@/core/selectors";
import { Card, CardContent } from "@/components/ui/card";
import { IncomeExpenseBars } from "@/components/charts/income-expense-bars";
import { cn } from "@/lib/utils";

const PERIODS: { value: ChartPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

/**
 * Income-vs-expenses bar chart for the tracker. With `withControls`, shows a
 * Daily / Weekly / Monthly / Yearly view switcher; otherwise renders a static
 * monthly preview (used inside the tappable home card).
 */
export function IncomeExpenseChart({
  withControls = false,
  defaultPeriod = "monthly",
}: {
  withControls?: boolean;
  defaultPeriod?: ChartPeriod;
}) {
  const { state } = useStore();
  const [period, setPeriod] = useState<ChartPeriod>(defaultPeriod);

  const data = useMemo(
    () => incomeExpenseSeries(state.transactions, period),
    [state.transactions, period],
  );

  const inner = (
    <CardContent className="flex flex-col gap-3 p-5">
      {withControls && (
        <div className="flex rounded-full bg-muted p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "flex-1 rounded-full px-2 py-1.5 text-xs font-bold transition",
                period === p.value
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <IncomeExpenseBars data={data} />
    </CardContent>
  );

  return <Card>{inner}</Card>;
}
