import type { AppState } from "@/core/types";
import {
  emergencyFundMonths,
  monthlyCashflow,
  netWorth,
} from "@/core/selectors";
import { COACH_RULES } from "@/features/coach/rules";
import type {
  CoachContext,
  CoachService,
  Recommendation,
} from "@/features/coach/types";

function buildContext(state: AppState): CoachContext {
  const { income, expenses, savingsRate } = monthlyCashflow(state.transactions);
  const cash = state.snapshot.cashSavings;
  const invested = state.snapshot.investmentsValue;
  const liquid = cash + invested;

  const hasInsuranceExpense = state.transactions.some(
    (t) => t.category === "insurance" && t.kind === "expense",
  );

  return {
    state,
    monthlyExpenses: expenses,
    monthlyIncome: income,
    savingsRate,
    emergencyMonths: emergencyFundMonths(state),
    investmentRatioOfLiquid: liquid > 0 ? invested / liquid : 0,
    hasInsuranceExpense,
    netWorth: netWorth(state.snapshot).total,
  };
}

/**
 * Deterministic recommendation engine. Evaluates every rule against the
 * current context and returns the firing ones, most important first.
 *
 * This is the grounding layer. A future `ClaudeCoach` can wrap these same
 * recommendations to add conversational explanations without changing callers.
 */
export class RulesEngine implements CoachService {
  getRecommendations(state: AppState): Recommendation[] {
    const ctx = buildContext(state);
    return COACH_RULES.filter((rule) => safeWhen(rule.when, ctx))
      .map((rule) => rule.build(ctx))
      .sort((a, b) => b.priority - a.priority);
  }

  getTodaysFocus(state: AppState): Recommendation | null {
    return this.getRecommendations(state)[0] ?? null;
  }
}

function safeWhen(
  when: (ctx: CoachContext) => boolean,
  ctx: CoachContext,
): boolean {
  try {
    return when(ctx);
  } catch {
    return false;
  }
}

/** Default singleton used across the app. */
export const coach: CoachService = new RulesEngine();
