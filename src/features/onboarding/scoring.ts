import type { FinancialIQ, IQDomain } from "@/core/types";
import { QUIZ_QUESTIONS } from "@/features/onboarding/data/quiz";

/**
 * Turn quiz answers into a Financial IQ.
 * `answers` maps question id → chosen option index.
 * Overall is the % answered correctly; each domain gets a 0–5 star rating.
 */
export function scoreQuiz(answers: Record<string, number>): FinancialIQ {
  const domainCorrect: Record<string, number> = {};
  const domainTotal: Record<string, number> = {};
  let correct = 0;

  for (const q of QUIZ_QUESTIONS) {
    domainTotal[q.domain] = (domainTotal[q.domain] ?? 0) + 1;
    const isCorrect = answers[q.id] === q.correctIndex;
    if (isCorrect) {
      correct += 1;
      domainCorrect[q.domain] = (domainCorrect[q.domain] ?? 0) + 1;
    }
  }

  const domains: IQDomain[] = ["budgeting", "insurance", "cpf", "investing", "taxes"];
  const breakdown = domains.reduce(
    (acc, d) => {
      const total = domainTotal[d] ?? 0;
      const got = domainCorrect[d] ?? 0;
      acc[d] = total > 0 ? Math.round((got / total) * 5) : 0;
      return acc;
    },
    {} as Record<IQDomain, number>,
  );

  const overall = Math.round((correct / QUIZ_QUESTIONS.length) * 100);

  return { overall, breakdown, takenAt: new Date().toISOString() };
}

export const IQ_DOMAIN_LABELS: Record<IQDomain, string> = {
  budgeting: "Budgeting",
  insurance: "Insurance",
  cpf: "CPF",
  investing: "Investing",
  taxes: "Taxes",
};

/** A friendly headline for an overall score. */
export function iqHeadline(overall: number): string {
  if (overall >= 80) return "Steady lah! 🌟";
  if (overall >= 60) return "Solid foundation 💪";
  if (overall >= 40) return "Good start 🌱";
  return "We learn together 🐣";
}
