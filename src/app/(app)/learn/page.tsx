"use client";

import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { useStore } from "@/core/data/store";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { PennySays } from "@/components/penny/penny-says";
import { buildRoadmap } from "@/features/learning/data/lessons";
import { iqHeadline } from "@/features/onboarding/scoring";
import { cn } from "@/lib/utils";

export default function LearnPage() {
  const { state } = useStore();
  const completed = new Set(state.progress.completedLessonIds);
  const roadmap = buildRoadmap(state.financialIQ?.breakdown ?? null);

  // First not-yet-completed lesson is the "current" one.
  const currentIndex = roadmap.findIndex((l) => !completed.has(l.id));

  return (
    <div>
      <PageHeader
        title="Learn"
        subtitle="Your personalised roadmap."
        action={
          <Badge variant="primary" className="h-7 px-3">
            {state.progress.xp} XP
          </Badge>
        }
      />

      <div className="mb-5">
        <PennySays>
          {state.financialIQ
            ? "Your roadmap starts with your weaker spots. Finish a lesson, earn XP and level up your Financial IQ. Slowly slowly can! 🌱"
            : "Do the quick check first and I'll line up your roadmap to focus where you need the most help. 🌱"}
        </PennySays>
      </div>

      {/* Financial IQ — take the check, or see your result */}
      {state.financialIQ ? (
        <Card className="mb-6 p-5">
          <div className="flex items-center gap-4">
            <CircularProgress value={state.financialIQ.overall} size={64} strokeWidth={8}>
              <span className="text-lg font-black tabular-nums">
                {state.financialIQ.overall}
              </span>
            </CircularProgress>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-muted-foreground">
                Financial IQ
              </p>
              <p className="font-extrabold leading-tight">
                {iqHeadline(state.financialIQ.overall)}
              </p>
            </div>
            <Link href="/assessment" className="text-sm font-bold text-link">
              Retake
            </Link>
          </div>
        </Card>
      ) : (
        <Link href="/assessment" className="mb-6 block">
          <Card className="border-primary/30 bg-primary/5 p-5 transition hover:border-primary/50">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-2xl">
                🧠
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold leading-tight">
                  Discover your Financial IQ
                </p>
                <p className="text-sm text-muted-foreground">
                  5 quick rounds · personalises your roadmap
                </p>
              </div>
              <span className="shrink-0 font-bold text-link">Start →</span>
            </div>
          </Card>
        </Link>
      )}

      <ol className="relative flex flex-col gap-3 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-0.5 before:bg-border">
        {roadmap.map((lesson, i) => {
          const done = completed.has(lesson.id);
          const current = i === currentIndex;
          const locked = currentIndex !== -1 && i > currentIndex;

          return (
            <li key={lesson.id} className="relative z-10">
              <Link
                href={`/learn/${lesson.id}`}
                className={cn(
                  "flex items-center gap-3",
                  locked && "opacity-55",
                )}
              >
                <span
                  className={cn(
                    "grid size-14 shrink-0 place-items-center rounded-xl border-2 text-xl transition",
                    done && "border-positive bg-positive text-positive-foreground",
                    current && "border-primary bg-primary/10",
                    !done && !current && "border-border bg-card",
                  )}
                >
                  {done ? (
                    <Check className="size-6" strokeWidth={3} />
                  ) : locked ? (
                    <Lock className="size-5 text-muted-foreground" />
                  ) : (
                    lesson.emoji
                  )}
                </span>
                <Card
                  className={cn(
                    "flex flex-1 items-center justify-between p-4 transition",
                    current && "border-primary/40",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Week {i + 1}
                    </p>
                    <p className="font-extrabold leading-tight">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.minutes} min · {lesson.xp} XP
                    </p>
                  </div>
                  {current && (
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Play className="size-4 fill-current" />
                    </span>
                  )}
                </Card>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
