"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { ExpenseCategory } from "@/core/types";
import { CATEGORY_META } from "@/features/expenses/data/categories";
import { formatSGD } from "@/lib/format";

/** Donut of this-month spend by category, with a total in the middle. */
export function CategoryDonut({
  data,
  size = 180,
}: {
  data: Array<{ category: ExpenseCategory; amount: number }>;
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={size * 0.32}
            outerRadius={size * 0.48}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={CATEGORY_META[entry.category].color}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-muted-foreground">Spent</span>
        <span className="text-xl font-black tabular-nums">
          {formatSGD(total)}
        </span>
      </div>
    </div>
  );
}
