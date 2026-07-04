"use client";

import { Flame, GraduationCap, Sparkles, Trophy } from "lucide-react";
import { useStore } from "@/core/data/store";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Highlighted gamification stats — streak, XP, level, lessons. */
export function GamificationCard() {
  const { state } = useStore();
  const p = state.progress;

  const stats = [
    { icon: Flame, tone: "text-warning", value: p.streakDays, label: "day streak" },
    { icon: Sparkles, tone: "text-link", value: p.xp, label: "total XP" },
    { icon: Trophy, tone: "text-primary", value: p.level, label: "level" },
    {
      icon: GraduationCap,
      tone: "text-link",
      value: p.completedLessonIds.length,
      label: "lessons done",
    },
  ];

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-3 p-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"
            >
              <Icon className={cn("size-7 shrink-0", s.tone)} />
              <div className="min-w-0">
                <p className="text-xl font-black leading-none tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-bold text-muted-foreground">
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
