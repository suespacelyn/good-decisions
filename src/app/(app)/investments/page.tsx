"use client";

import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useStore } from "@/core/data/store";
import { investmentSummary } from "@/core/selectors";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AddHoldingDialog } from "@/features/investments/components/add-holding-dialog";
import { HoldingList } from "@/features/investments/components/holding-list";
import { LESSONS } from "@/features/learning/data/lessons";
import { formatSGD, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const LEARN_IDS = [
  "what-is-an-etf",
  "dollar-cost-averaging",
  "risk-and-diversification",
  "building-your-first-portfolio",
];

export default function InvestmentsPage() {
  const { state } = useStore();
  const summary = investmentSummary(state.holdings);
  const up = summary.gain >= 0;
  const lessons = LESSONS.filter((l) => LEARN_IDS.includes(l.id));

  return (
    <div>
      <PageHeader
        title="Invest"
        subtitle="Track holdings and learn as you go."
      />

      <Card className="mb-5">
        <CardContent className="p-5">
          <p className="text-sm font-bold text-muted-foreground">
            Portfolio value
          </p>
          <p className="mt-1 text-3xl font-black tabular-nums">
            {formatSGD(summary.value)}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              Invested {formatSGD(summary.cost)}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 font-extrabold",
                up ? "text-positive" : "text-destructive",
              )}
            >
              {up ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
              {up ? "+" : "−"}
              {formatSGD(Math.abs(summary.gain))} (
              {formatPercent(Math.abs(summary.gainPercent), 1)})
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
          Holdings
        </h2>
        <AddHoldingDialog />
      </div>
      <HoldingList items={state.holdings} />

      {/* Learning centre */}
      <h2 className="mb-2 mt-6 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
        Learn investing
      </h2>

      {!state.financialIQ && (
        <Link href="/assessment" className="mb-3 block">
          <Card className="border-primary/30 bg-primary/5 p-4 transition hover:border-primary/50">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-xl">
                🧠
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold leading-tight">
                  New to investing? Start with a quick check
                </p>
                <p className="text-xs text-muted-foreground">
                  Find your Financial IQ so we teach the right things first
                </p>
              </div>
              <span className="shrink-0 font-bold text-link">Start →</span>
            </div>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        {lessons.map((l) => (
          <Link key={l.id} href={`/learn/${l.id}`}>
            <Card className="h-full transition hover:border-primary/40">
              <CardContent className="p-4">
                <span className="text-2xl">{l.emoji}</span>
                <p className="mt-1.5 font-extrabold leading-tight">{l.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {l.minutes} min · {l.xp} XP
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
