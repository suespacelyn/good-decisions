"use client";

import { useState } from "react";
import { useStore } from "@/core/data/store";
import { CoachButton } from "@/components/penny/coach-button";
import { ProfileButton } from "@/components/app-shell/profile-button";
import { DemoBanner } from "@/features/dashboard/components/demo-banner";
import { MoneyOverviewCard } from "@/features/dashboard/components/money-overview-card";
import { AccountsBreakdown } from "@/features/dashboard/components/accounts-breakdown";
import { WelcomeTour } from "@/features/dashboard/components/welcome-tour";
import { ReviewPrompt } from "@/features/feedback/components/review-prompt";
import { TrackerSection } from "@/features/expenses/components/tracker-section";
import { ToolkitGrid } from "@/features/dashboard/components/toolkit-grid";
import {
  IqCard,
  PrimaryGoalCard,
} from "@/features/dashboard/components/dashboard-cards";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { state } = useStore();
  const [hidden, setHidden] = useState(false);
  const firstName = state.profile?.name?.split(" ")[0] ?? "Friend";

  return (
    <div className="flex flex-col gap-5">
      <WelcomeTour />
      <ReviewPrompt />
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProfileButton />
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              {greeting()},
            </p>
            <h1 className="text-xl font-extrabold leading-tight tracking-tight">
              {firstName} 👋
            </h1>
          </div>
        </div>
        <CoachButton />
      </header>

      <DemoBanner />

      {/* Consolidated money overview — hero + detailed breakdown */}
      <MoneyOverviewCard
        hidden={hidden}
        onToggleHidden={() => setHidden((h) => !h)}
      />
      <AccountsBreakdown hidden={hidden} />

      <ToolkitGrid />

      <TrackerSection limit={3} />

      <div className="grid gap-5 md:grid-cols-2">
        <IqCard />
        <PrimaryGoalCard />
      </div>
    </div>
  );
}
