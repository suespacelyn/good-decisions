"use client";

import { useState } from "react";
import { CalendarClock, Check, Plus, Trash2 } from "lucide-react";
import type { Goal } from "@/core/types";
import { useStore } from "@/core/data/store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GOAL_OPTIONS } from "@/features/onboarding/data/options";
import { formatSGD } from "@/lib/format";

/** Months and projected date to reach a goal at its monthly contribution. */
function projection(goal: Goal): string {
  const remaining = goal.targetAmount - goal.currentAmount;
  if (remaining <= 0) return "Reached! 🎉";
  if (goal.monthlyContribution <= 0) return "Set a monthly amount to project";
  const months = Math.ceil(remaining / goal.monthlyContribution);
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  const when = d.toLocaleDateString("en-SG", { month: "short", year: "numeric" });
  return `~${months} ${months === 1 ? "month" : "months"} · ${when}`;
}

export function GoalCard({ goal }: { goal: Goal }) {
  const { contributeToGoal, deleteGoal } = useStore();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const pct =
    goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const reached = goal.currentAmount >= goal.targetAmount;
  const emoji = GOAL_OPTIONS.find((o) => o.value === goal.type)?.emoji ?? "🎯";

  function addContribution() {
    if (amount > 0) contributeToGoal(goal.id, amount);
    setAmount(0);
    setOpen(false);
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-muted text-xl">
              {emoji}
            </span>
            <div>
              <p className="font-extrabold leading-tight">{goal.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="size-3" />
                {projection(goal)}
              </p>
            </div>
          </div>
          <button
            onClick={() => deleteGoal(goal.id)}
            aria-label="Delete goal"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <Progress
          value={pct}
          indicatorClassName={reached ? "bg-positive" : undefined}
        />
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-bold tabular-nums">
            {formatSGD(goal.currentAmount)}
          </span>
          <span className="text-muted-foreground tabular-nums">
            of {formatSGD(goal.targetAmount)} · {Math.round(pct)}%
          </span>
        </div>

        {!reached && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Plus /> Add to this goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add to {goal.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Label>Amount</Label>
                <MoneyInput
                  value={amount || ""}
                  onValueChange={setAmount}
                  placeholder="100"
                  autoFocus
                />
                <Button onClick={addContribution} disabled={amount <= 0}>
                  <Check /> Add {amount > 0 ? formatSGD(amount) : ""}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
