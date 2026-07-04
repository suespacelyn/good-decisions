"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { IQDomain } from "@/core/types";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Penny } from "@/components/penny/penny";
import { PennySays } from "@/components/penny/penny-says";
import { QUIZ_QUESTIONS } from "@/features/onboarding/data/quiz";
import { scoreQuiz, IQ_DOMAIN_LABELS } from "@/features/onboarding/scoring";
import { QuizDeck } from "@/features/learning/components/quiz-deck";
import { IqResult } from "@/features/learning/components/iq-result";

// Bite-sized rounds, one knowledge area at a time.
const DOMAIN_SEQUENCE: IQDomain[] = [
  "budgeting",
  "investing",
  "cpf",
  "insurance",
  "taxes",
];
const DOMAIN_EMOJI: Record<IQDomain, string> = {
  budgeting: "🧮",
  investing: "📈",
  cpf: "🇸🇬",
  insurance: "🛡️",
  taxes: "🧾",
};

type Phase = "intro" | "chunk" | "interstitial" | "result";

export function KnowledgeCheck({ onExit }: { onExit: () => void }) {
  const { state, setFinancialIQ } = useStore();
  const [phase, setPhase] = useState<Phase>("intro");
  const [chunkIndex, setChunkIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const chunks = useMemo(
    () =>
      DOMAIN_SEQUENCE.map((domain) => ({
        domain,
        questions: QUIZ_QUESTIONS.filter((q) => q.domain === domain),
      })).filter((c) => c.questions.length > 0),
    [],
  );

  const firstName = state.profile?.name?.split(" ")[0] ?? "Friend";
  const chunk = chunks[chunkIndex];
  const isLastChunk = chunkIndex === chunks.length - 1;

  function answer(qId: string, idx: number) {
    setAnswers((a) => ({ ...a, [qId]: idx }));
  }

  function finishChunk() {
    if (isLastChunk) {
      setFinancialIQ(scoreQuiz(answers));
      setPhase("result");
    } else {
      setPhase("interstitial");
    }
  }

  function nextChunk() {
    setChunkIndex((i) => i + 1);
    setPhase("chunk");
  }

  const chunkCorrect = chunk
    ? chunk.questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex h-10 items-center justify-between">
        <button
          onClick={onExit}
          className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Exit"
        >
          <ArrowLeft className="size-5" />
        </button>
        {phase !== "intro" && phase !== "result" && (
          <Progress
            value={(chunkIndex / chunks.length) * 100}
            className="mx-3 h-2.5 flex-1"
          />
        )}
        <span className="size-9" />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        {phase === "intro" && (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-8">
              <PennySays mood="thinking" size={96}>
                Let&apos;s suss out your <strong>Financial IQ</strong> in{" "}
                {chunks.length} short rounds — about a minute each. Every answer
                teaches you something, so no need to memorise ya! 🌱
              </PennySays>
              <ul className="flex flex-wrap justify-center gap-2">
                {chunks.map((c) => (
                  <li
                    key={c.domain}
                    className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-bold text-secondary-foreground"
                  >
                    <span>{DOMAIN_EMOJI[c.domain]}</span>
                    {IQ_DOMAIN_LABELS[c.domain]}
                  </li>
                ))}
              </ul>
            </div>
            <Button size="lg" className="w-full" onClick={() => setPhase("chunk")}>
              Start round 1
            </Button>
          </div>
        )}

        {phase === "chunk" && chunk && (
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">{DOMAIN_EMOJI[chunk.domain]}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Round {chunkIndex + 1} of {chunks.length}
                </p>
                <h1 className="text-lg font-extrabold leading-tight">
                  {IQ_DOMAIN_LABELS[chunk.domain]}
                </h1>
              </div>
            </div>
            <QuizDeck
              key={chunk.domain}
              questions={chunk.questions}
              answers={answers}
              onAnswer={answer}
              onComplete={finishChunk}
              finishLabel={isLastChunk ? "See my Financial IQ" : "Finish round"}
            />
          </div>
        )}

        {phase === "interstitial" && chunk && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              <Penny mood="celebrate" size={88} />
            </motion.div>
            <h1 className="mt-4 text-2xl font-extrabold">
              Round {chunkIndex + 1} done!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You got <strong>{chunkCorrect}</strong> of{" "}
              {chunk.questions.length} on {IQ_DOMAIN_LABELS[chunk.domain]}.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-bold">
              Next up {DOMAIN_EMOJI[chunks[chunkIndex + 1].domain]}{" "}
              {IQ_DOMAIN_LABELS[chunks[chunkIndex + 1].domain]}
            </div>
            <div className="mt-8 w-full">
              <Button size="lg" className="w-full" onClick={nextChunk}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {phase === "result" && state.financialIQ && (
          <IqResult
            name={firstName}
            iq={state.financialIQ}
            onFinish={onExit}
            finishLabel="Back to Learn"
          />
        )}
      </div>
    </div>
  );
}
