"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Flame, GraduationCap } from "lucide-react";
import { useStore } from "@/core/data/store";
import {
  emergencyFundMonths,
  monthlyCashflow,
  netWorth,
  netWorthTrend,
} from "@/core/selectors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Progress } from "@/components/ui/progress";
import { AreaTrend } from "@/components/charts/area-trend";
import { GOAL_OPTIONS } from "@/features/onboarding/data/options";
import { iqHeadline } from "@/features/onboarding/scoring";
import { formatSGD, formatSGDCompact, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function NetWorthCard() {
  const { state } = useStore();
  const nw = netWorth(state.snapshot);
  const trend = netWorthTrend(state);
  const rows = [
    { label: "Cash", value: nw.cash, tone: "" },
    { label: "Investments", value: nw.investments, tone: "" },
    { label: "CPF", value: nw.cpf, tone: "" },
    { label: "Debt", value: -nw.debt, tone: "text-destructive" },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <p className="text-sm font-bold text-muted-foreground">Net worth</p>
        <p className="mt-1 text-4xl font-black tracking-tight tabular-nums">
          {formatSGD(nw.total)}
        </p>
        <div className="mt-3">
          <AreaTrend data={trend} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className={cn("text-sm font-bold tabular-nums", r.tone)}>
                {formatSGDCompact(r.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function IqCard() {
  const { state } = useStore();
  const iq = state.financialIQ;
  if (!iq) return null;

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <CircularProgress value={iq.overall} size={92} strokeWidth={10}>
          <span className="text-2xl font-black tabular-nums">{iq.overall}</span>
        </CircularProgress>
        <div className="min-w-0">
          <p className="text-sm font-bold text-muted-foreground">Financial IQ</p>
          <p className="text-lg font-extrabold leading-tight">
            {iqHeadline(iq.overall)}
          </p>
          <Link
            href="/learn"
            className="mt-1 inline-block text-sm font-bold text-link"
          >
            Grow it in Learn →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function MonthlySnapshotCard() {
  const { state } = useStore();
  const { income, expenses, savings, savingsRate } = monthlyCashflow(
    state.transactions,
  );

  const tiles = [
    { label: "Income", value: formatSGD(income), icon: ArrowUpRight, tone: "text-positive" },
    { label: "Expenses", value: formatSGD(expenses), icon: ArrowDownRight, tone: "text-destructive" },
    { label: "Saved", value: formatSGD(savings), icon: null, tone: savings >= 0 ? "text-positive" : "text-destructive" },
    { label: "Savings rate", value: formatPercent(savingsRate), icon: null, tone: "" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>This month</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-muted/60 p-3">
            <p className="text-xs font-bold text-muted-foreground">{t.label}</p>
            <p className={cn("mt-0.5 text-lg font-extrabold tabular-nums", t.tone)}>
              {t.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PrimaryGoalCard() {
  const { state } = useStore();
  // Show the emergency fund if present, else the first goal.
  const goal =
    state.goals.find((g) => g.type === "emergency_fund") ?? state.goals[0];
  if (!goal) return null;

  const pct = goal.targetAmount > 0
    ? (goal.currentAmount / goal.targetAmount) * 100
    : 0;
  const emoji = GOAL_OPTIONS.find((o) => o.value === goal.type)?.emoji ?? "🎯";

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <span className="font-extrabold">{goal.name}</span>
          </div>
          <Link href="/goals" className="text-sm font-bold text-link">
            All goals
          </Link>
        </div>
        <Progress value={pct} className="h-3.5" />
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-bold tabular-nums">
            {formatSGD(goal.currentAmount)}
          </span>
          <span className="text-muted-foreground tabular-nums">
            of {formatSGD(goal.targetAmount)} · {Math.round(pct)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StreakCard() {
  const { state } = useStore();
  const months = emergencyFundMonths(state);

  const tiles = [
    {
      icon: Flame,
      value: state.progress.streakDays,
      label: state.progress.streakDays === 1 ? "day streak" : "day streak",
      tone: "text-warning",
    },
    {
      icon: GraduationCap,
      value: state.progress.completedLessonIds.length,
      label: "lessons done",
      tone: "text-link",
    },
  ];

  return (
    <Card>
      <CardContent className="flex items-center justify-around p-5">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="flex flex-col items-center gap-1">
              <Icon className={cn("size-6", t.tone)} />
              <span className="text-2xl font-black tabular-nums">{t.value}</span>
              <span className="text-xs font-bold text-muted-foreground">
                {t.label}
              </span>
            </div>
          );
        })}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-muted-foreground">Emergency</span>
          <span className="text-2xl font-black tabular-nums">
            {months.toFixed(1)}
          </span>
          <span className="text-xs font-bold text-muted-foreground">
            months saved
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
