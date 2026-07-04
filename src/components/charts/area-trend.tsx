"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatSGDCompact } from "@/lib/format";

/** Small filled area chart for net-worth / balance trends. */
export function AreaTrend({
  data,
  height = 140,
}: {
  data: Array<{ month: string; value: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fontWeight: 700, fill: "var(--color-muted-foreground)" }}
          dy={6}
        />
        <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
        <Tooltip
          cursor={{ stroke: "var(--color-border)" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            background: "var(--color-popover)",
            fontSize: 12,
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
          labelStyle={{ color: "var(--color-muted-foreground)" }}
          formatter={(value) => [formatSGDCompact(Number(value)), "Net worth"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-primary)"
          strokeWidth={3}
          fill="url(#areaFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
