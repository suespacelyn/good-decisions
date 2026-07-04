"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PennySays } from "@/components/penny/penny-says";
import {
  INSURANCE_TYPES,
  type InsuranceType,
} from "@/features/insurance/data/insurance-content";
import { getLesson } from "@/features/learning/data/lessons";
import { cn } from "@/lib/utils";

const PRIORITY_LABEL: Record<InsuranceType["priority"], string> = {
  core: "Everyone",
  important: "Important",
  situational: "Situational",
};

export default function InsurancePage() {
  // Self-check is local to the session — a private "what do I have?" tool.
  const [covered, setCovered] = useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setCovered((c) => ({ ...c, [id]: !c[id] }));

  const gaps = INSURANCE_TYPES.filter(
    (t) => t.priority !== "situational" && !covered[t.id],
  );
  const lesson = getLesson("insurance-basics");

  return (
    <div>
      <PageHeader
        back
        title="Insurance"
        subtitle="Protect your savings — learn what you actually need."
      />

      <div className="mb-5">
        <PennySays mood="encouraging">
          Tick what you&apos;ve already got, and I&apos;ll flag the gaps to read up
          on. I won&apos;t ever push you towards any insurer or policy — that part
          you decide. 🤝
        </PennySays>
      </div>

      {gaps.length > 0 && (
        <Card className="mb-5 border-warning/30 bg-warning/10">
          <CardContent className="p-4">
            <p className="text-sm font-bold">
              Possible gaps to read up on:{" "}
              <span className="font-extrabold">
                {gaps.map((g) => g.name).join(", ")}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {INSURANCE_TYPES.map((t) => {
          const has = !!covered[t.id];
          return (
            <Card key={t.id} className={cn(has && "border-positive/40")}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-10 place-items-center rounded-xl bg-muted text-lg">
                      {t.emoji}
                    </span>
                    <div>
                      <p className="font-extrabold leading-tight">{t.name}</p>
                      <Badge
                        variant={t.priority === "core" ? "primary" : "outline"}
                        className="mt-1"
                      >
                        {PRIORITY_LABEL[t.priority]}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(t.id)}
                    aria-pressed={has}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition",
                      has
                        ? "border-positive bg-positive text-positive-foreground"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {has ? <Check className="size-4" strokeWidth={3} /> : <ShieldCheck className="size-4" />}
                    {has ? "Covered" : "I have this"}
                  </button>
                </div>

                <p className="mt-3 text-sm">{t.what}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">In Singapore: </span>
                  {t.sgContext}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {lesson && (
        <Link href={`/learn/${lesson.id}`} className="mt-6 block">
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
        Educational only — not insurance advice. Always compare policies and
        read the terms before deciding.
      </p>
    </div>
  );
}
