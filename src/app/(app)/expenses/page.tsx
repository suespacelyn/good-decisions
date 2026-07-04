"use client";

import { useMemo } from "react";
import { useStore } from "@/core/data/store";
import { monthlyCashflow } from "@/core/selectors";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AddTransactionDialog } from "@/features/expenses/components/add-transaction-dialog";
import { IncomeExpenseChart } from "@/features/expenses/components/income-expense-chart";
import { TransactionList } from "@/features/expenses/components/transaction-list";
import { formatSGD, formatPercent } from "@/lib/format";

export default function ExpensesPage() {
  const { state } = useStore();
  const flow = monthlyCashflow(state.transactions);

  const recent = useMemo(
    () =>
      [...state.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [state.transactions],
  );

  return (
    <div>
      <PageHeader
        back
        title="Money"
        subtitle="Track what comes in and goes out."
        action={<AddTransactionDialog />}
      />

      {/* Monthly summary */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <SummaryTile label="Income" value={formatSGD(flow.income)} tone="text-positive" />
        <SummaryTile label="Expenses" value={formatSGD(flow.expenses)} tone="text-destructive" />
        <SummaryTile label="Saved" value={formatPercent(flow.savingsRate)} tone="" />
      </div>

      {/* Income vs. expenses — switch between daily / weekly / monthly / yearly */}
      {state.transactions.length > 0 && (
        <div className="mb-5">
          <IncomeExpenseChart withControls />
        </div>
      )}

      <h2 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
        Recent
      </h2>
      <TransactionList items={recent} />
    </div>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <Card>
      <CardContent className="p-3.5">
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <p className={`mt-0.5 text-base font-extrabold tabular-nums ${tone}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
