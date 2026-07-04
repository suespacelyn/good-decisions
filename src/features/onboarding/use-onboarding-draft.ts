"use client";

import { useState } from "react";
import type {
  Confidence,
  FinancialSnapshot,
  Gender,
  GoalType,
  RiskAppetite,
  UserProfile,
} from "@/core/types";

export interface OnboardingDraft {
  name: string;
  age: string;
  gender?: Gender;
  occupation: string;
  monthlySalary: number;
  annualBonus: number;
  otherMonthlyIncome: number;
  cashSavings: number;
  oa: number;
  sa: number;
  ma: number;
  investmentsValue: number;
  debt: number;
  selectedGoals: GoalType[];
  riskAppetite?: RiskAppetite;
  confidence?: Confidence;
  quizAnswers: Record<string, number>;
}

const INITIAL: OnboardingDraft = {
  name: "",
  age: "",
  occupation: "",
  monthlySalary: 0,
  annualBonus: 0,
  otherMonthlyIncome: 0,
  cashSavings: 0,
  oa: 0,
  sa: 0,
  ma: 0,
  investmentsValue: 0,
  debt: 0,
  selectedGoals: [],
  quizAnswers: {},
};

export function useOnboardingDraft() {
  const [draft, setDraft] = useState<OnboardingDraft>(INITIAL);

  const update = (patch: Partial<OnboardingDraft>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const toggleGoal = (goal: GoalType) =>
    setDraft((prev) => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goal)
        ? prev.selectedGoals.filter((g) => g !== goal)
        : [...prev.selectedGoals, goal],
    }));

  const answerQuiz = (questionId: string, optionIndex: number) =>
    setDraft((prev) => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [questionId]: optionIndex },
    }));

  return { draft, update, toggleGoal, answerQuiz };
}

/** Build the persisted profile + snapshot from a completed draft. */
export function draftToProfile(draft: OnboardingDraft): UserProfile {
  return {
    name: draft.name.trim() || "Friend",
    age: Number(draft.age) || 0,
    gender: draft.gender,
    occupation: draft.occupation.trim(),
    monthlySalary: draft.monthlySalary,
    annualBonus: draft.annualBonus,
    otherMonthlyIncome: draft.otherMonthlyIncome,
    riskAppetite: draft.riskAppetite ?? "balanced",
    confidence: draft.confidence ?? "knows_little",
    selectedGoals: draft.selectedGoals,
  };
}

export function draftToSnapshot(draft: OnboardingDraft): FinancialSnapshot {
  return {
    cashSavings: draft.cashSavings,
    cpf: {
      ordinaryAccount: draft.oa,
      specialAccount: draft.sa,
      medisave: draft.ma,
    },
    investmentsValue: draft.investmentsValue,
    debt: draft.debt,
  };
}
