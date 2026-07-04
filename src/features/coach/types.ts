import type { AppState, IQDomain } from "@/core/types";

/**
 * A coaching recommendation.
 *
 * PRODUCT PRINCIPLE, ENFORCED BY THE TYPE: there is no field for "the product
 * to buy". A recommendation can only explain WHY a decision is appropriate and
 * point to learning. It teaches; it never sells.
 */
export interface Recommendation {
  id: string;
  /** Drives tone + colour. `celebrate` = positive reinforcement. */
  severity: "celebrate" | "info" | "attention";
  /** Knowledge area this relates to (for IQ + lesson linking). */
  domain: IQDomain | "savings" | "debt" | "goals";
  /** Short headline, Penny's voice. */
  title: string;
  /** One-line plain-English summary shown on cards. */
  summary: string;
  /** The reasoning. Always present. */
  why: string;
  benefits: string[];
  risks: string[];
  /** Other valid paths — keeps it educational, not prescriptive. */
  alternatives: string[];
  /** Lesson ids to learn more (links into the learning module). */
  learnMore: string[];
  /** Higher = more urgent; used to pick "Today's focus". */
  priority: number;
}

/** Context passed to every rule predicate. Pre-computed for cheap evaluation. */
export interface CoachContext {
  state: AppState;
  monthlyExpenses: number;
  monthlyIncome: number;
  savingsRate: number;
  emergencyMonths: number;
  investmentRatioOfLiquid: number; // investments / (cash + investments)
  hasInsuranceExpense: boolean;
  netWorth: number;
}

/** A single data-driven rule. Logic lives in `when`; copy lives in `build`. */
export interface CoachRule {
  id: string;
  when: (ctx: CoachContext) => boolean;
  build: (ctx: CoachContext) => Recommendation;
}

/**
 * The pluggable coach. `RulesEngine` implements this now. A `ClaudeCoach` will
 * implement the same interface later, using the rules output as grounding and
 * adding a conversational `explain()`.
 */
export interface CoachService {
  /** All currently-firing recommendations, highest priority first. */
  getRecommendations: (state: AppState) => Recommendation[];
  /** The single most important next step. */
  getTodaysFocus: (state: AppState) => Recommendation | null;
}
