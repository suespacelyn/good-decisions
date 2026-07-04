"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Info } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { OptionCard } from "@/components/ui/option-card";
import { PennySays } from "@/components/penny/penny-says";
import {
  CARD_STRATEGIES,
  CREDIT_PRINCIPLES,
  SPEND_CATEGORIES,
  type SpendCategory,
} from "@/features/credit-cards/data/cards";
import { getLesson } from "@/features/learning/data/lessons";

export default function CreditCardsPage() {
  const [selected, setSelected] = useState<SpendCategory[]>([]);
  const toggle = (c: SpendCategory) =>
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const ranked = useMemo(() => {
    if (selected.length === 0) return [];
    return CARD_STRATEGIES.map((s) => ({
      strategy: s,
      score: s.matches.filter((m) => selected.includes(m)).length,
    }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [selected]);

  const lesson = getLesson("managing-debt");

  return (
    <div>
      <PageHeader
        back
        title="Card Strategy"
        subtitle="Match a card to how you already spend."
      />

      <div className="mb-5">
        <PennySays mood="thinking">
          Tell me where your money usually goes, and I&apos;ll explain which card
          <em> styles</em> tend to fit. You compare and decide ah — I won&apos;t
          tell you which one to apply for.
        </PennySays>
      </div>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Where do you spend most?
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        {SPEND_CATEGORIES.map((c) => (
          <OptionCard
            key={c.value}
            multi
            emoji={c.emoji}
            title={c.label}
            selected={selected.includes(c.value)}
            onSelect={() => toggle(c.value)}
          />
        ))}
      </div>

      {ranked.length > 0 && (
        <>
          <h2 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Strategies that tend to fit
          </h2>
          <div className="flex flex-col gap-3">
            {ranked.map(({ strategy }) => (
              <Card key={strategy.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-10 place-items-center rounded-xl bg-muted text-lg">
                      {strategy.emoji}
                    </span>
                    <p className="font-extrabold">{strategy.name}</p>
                  </div>
                  <p className="mt-3 text-sm">{strategy.idea}</p>

                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    What to look for
                  </p>
                  <ul className="mt-1.5 flex flex-col gap-1.5">
                    {strategy.lookFor.map((f, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-positive" strokeWidth={3} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-3 flex gap-2 rounded-lg bg-warning/10 p-2.5 text-sm">
                    <Info className="mt-0.5 size-4 shrink-0 text-warning" />
                    <span>{strategy.watchOut}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Always-on principles */}
      <h2 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Golden rules
      </h2>
      <Card>
        <CardContent className="p-5">
          <ul className="flex flex-col gap-3">
            {CREDIT_PRINCIPLES.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm font-medium">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-link">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {lesson && (
        <Link href={`/learn/${lesson.id}`} className="mt-5 block">
          <Card className="transition hover:border-primary/40">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-2xl">{lesson.emoji}</span>
              <div className="flex-1">
                <p className="font-extrabold leading-tight">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">
                  {lesson.minutes} min lesson · {lesson.xp} XP
                </p>
              </div>
              <span className="font-bold text-link">Learn →</span>
            </CardContent>
          </Card>
        </Link>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Educational only — not a recommendation or endorsement. Always check
        current terms before applying.
      </p>
    </div>
  );
}
