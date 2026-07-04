"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Penny } from "@/components/penny/penny";
import { getLesson } from "@/features/learning/data/lessons";

export default function LessonPage({ params }: PageProps<"/learn/[id]">) {
  const { id } = use(params);
  const lesson = getLesson(id);
  const { state, completeLesson } = useStore();
  const [celebrate, setCelebrate] = useState(false);

  if (!lesson) {
    return (
      <div className="py-16 text-center">
        <p className="font-bold">Lesson not found.</p>
        <Link href="/learn" className="mt-2 inline-block font-bold text-link">
          Back to roadmap
        </Link>
      </div>
    );
  }

  const alreadyDone = state.progress.completedLessonIds.includes(lesson.id);

  function finish() {
    completeLesson(lesson!.id, lesson!.xp);
    setCelebrate(true);
  }

  if (celebrate) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          <Penny mood="celebrate" size={104} />
        </motion.div>
        <h1 className="text-2xl font-black">Lesson complete! 🎉</h1>
        <Badge variant="positive" className="h-8 px-4 text-sm">
          +{lesson.xp} XP earned
        </Badge>
        <Link href="/learn" className="mt-4 w-full max-w-xs">
          <Button size="lg" className="w-full">
            Back to roadmap
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/learn"
        className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Roadmap
      </Link>

      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-14 place-items-center rounded-xl bg-muted text-3xl">
          {lesson.emoji}
        </span>
        <div>
          <h1 className="text-2xl font-black leading-tight">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">
            {lesson.minutes} min · {lesson.xp} XP
          </p>
        </div>
      </div>

      <p className="mb-6 text-base font-semibold text-muted-foreground">
        {lesson.summary}
      </p>

      <div className="flex flex-col gap-5">
        {lesson.sections.map((s, i) => (
          <div key={i}>
            {s.heading && (
              <h2 className="mb-1.5 text-lg font-extrabold">{s.heading}</h2>
            )}
            <p className="text-[15px] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-link">
            <Sparkles className="size-4" /> Key takeaways
          </div>
          <ul className="flex flex-col gap-2">
            {lesson.keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-[15px] font-medium">
                <Check className="mt-0.5 size-4 shrink-0 text-positive" strokeWidth={3} />
                {t}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6">
        {alreadyDone ? (
          <Button size="lg" variant="positive" className="w-full" disabled>
            <Check /> Completed
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={finish}>
            Mark as complete · +{lesson.xp} XP
          </Button>
        )}
      </div>
    </div>
  );
}
