"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IncomeExpenseBucket } from "@/core/selectors";
import { formatSGD } from "@/lib/format";

/** Grouped bar chart comparing income vs. expenses across time buckets. */
export function IncomeExpenseBars({
  data,
  height = 200,
}: {
  data: IncomeExpenseBucket[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barGap={3}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fontWeight: 700, fill: "var(--color-muted-foreground)" }}
          dy={6}
        />
        <YAxis
          hide
          domain={[0, (max: number) => Math.max(max * 1.15, 10)]}
        />
        <Tooltip
          cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            background: "var(--color-popover)",
            fontSize: 12,
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
          labelStyle={{ color: "var(--color-muted-foreground)" }}
          formatter={(value, name) => [
            formatSGD(Number(value)),
            name === "income" ? "Income" : "Expenses",
          ]}
        />
        <Bar dataKey="income" fill="var(--color-positive)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="expenses" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
