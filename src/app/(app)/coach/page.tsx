"use client";

import { useStore } from "@/core/data/store";
import { coach } from "@/features/coach/rules-engine";
import { RecommendationCard } from "@/features/coach/components/recommendation-card";
import { PageHeader } from "@/components/app-shell/page-header";
import { PennySays } from "@/components/penny/penny-says";

export default function CoachPage() {
  const { state } = useStore();
  const recs = coach.getRecommendations(state);

  return (
    <div>
      <PageHeader back title="Your Coach" subtitle="Personalised, in plain English." />

      <div className="mb-5">
        <PennySays mood="encouraging">
          Here&apos;s what I&apos;d look at next, based on your situation. I&apos;ll
          always tell you the <strong>why</strong> — and I won&apos;t ever push you
          to buy anything, ok? 🤝
        </PennySays>
      </div>

      <div className="flex flex-col gap-4">
        {recs.map((rec, i) => (
          <RecommendationCard key={rec.id} rec={rec} defaultOpen={i === 0} />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Educational guidance only — not financial advice. You always decide.
      </p>
    </div>
  );
}
