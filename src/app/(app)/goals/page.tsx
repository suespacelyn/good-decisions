"use client";

import { useStore } from "@/core/data/store";
import { PageHeader } from "@/components/app-shell/page-header";
import { Penny } from "@/components/penny/penny";
import { AddGoalDialog } from "@/features/goals/components/add-goal-dialog";
import { GoalCard } from "@/features/goals/components/goal-card";

export default function GoalsPage() {
  const { state } = useStore();

  return (
    <div>
      <PageHeader
        back
        title="Goals"
        subtitle="What you're building toward."
        action={<AddGoalDialog />}
      />

      {state.goals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-10 text-center">
          <Penny size={72} mood="encouraging" />
          <p className="font-bold">No goals yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Set your first goal — an emergency fund, a trip, or a home — and
            Penny will help you plan for it.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {state.goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      )}
    </div>
  );
}
