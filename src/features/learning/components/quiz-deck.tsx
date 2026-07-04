"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/features/onboarding/data/quiz";

/**
 * A small deck of quiz questions, shown one at a time. Answering reveals the
 * correct choice + a short explanation (the teaching moment). Generic over any
 * subset of questions, so it powers each bite-sized chunk of the knowledge check.
 */
export function QuizDeck({
  questions,
  answers,
  onAnswer,
  onComplete,
  finishLabel = "Done",
}: {
  questions: QuizQuestion[];
  answers: Record<string, number>;
  onAnswer: (questionId: string, optionIndex: number) => void;
  onComplete: () => void;
  finishLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const question = questions[index];
  const selected = answers[question.id];
  const isLast = index === questions.length - 1;
  const isCorrect = selected === question.correctIndex;

  function choose(optionIndex: number) {
    if (revealed) return;
    onAnswer(question.id, optionIndex);
    setRevealed(true);
  }

  function next() {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <span className="capitalize">{question.domain}</span>
        </div>
        <Progress value={((index + (revealed ? 1 : 0)) / questions.length) * 100} />
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-1 flex-col"
      >
          <h2 className="text-xl font-extrabold leading-snug">
            {question.question}
          </h2>

          <div className="mt-5 flex flex-col gap-3">
            {question.options.map((opt, i) => {
              const isChosen = selected === i;
              const showCorrect = revealed && i === question.correctIndex;
              const showWrong = revealed && isChosen && !isCorrect;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={revealed}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border-2 bg-card p-4 text-left font-bold transition-all active:scale-[0.99] disabled:active:scale-100",
                    !revealed && "hover:border-primary/40",
                    showCorrect && "border-positive bg-positive/10",
                    showWrong && "border-destructive bg-destructive/10",
                    !showCorrect && !showWrong && "border-border",
                  )}
                >
                  <span>{opt}</span>
                  {showCorrect && (
                    <span className="grid size-6 place-items-center rounded-full bg-positive text-positive-foreground">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                  )}
                  {showWrong && (
                    <span className="grid size-6 place-items-center rounded-full bg-destructive text-destructive-foreground">
                      <X className="size-4" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 overflow-hidden"
              >
                <div
                  className={cn(
                    "rounded-xl p-4 text-sm font-medium leading-relaxed",
                    isCorrect ? "bg-positive/10 text-foreground" : "bg-muted text-foreground",
                  )}
                >
                  <span className="font-extrabold">
                    {isCorrect ? "Correct! " : "Good to know. "}
                  </span>
                  {question.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      <div className="mt-6">
        <Button size="lg" className="w-full" disabled={!revealed} onClick={next}>
          {isLast ? finishLabel : "Next"}
        </Button>
      </div>
    </div>
  );
}
