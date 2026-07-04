import type {
  AppState,
  ExpenseCategory,
  FinancialSnapshot,
  Holding,
  Transaction,
} from "@/core/types";

/** Total CPF across all sub-accounts. */
export function totalCpf(snapshot: FinancialSnapshot): number {
  const { ordinaryAccount, specialAccount, medisave } = snapshot.cpf;
  return ordinaryAccount + specialAccount + medisave;
}

export interface NetWorth {
  total: number;
  cash: number;
  investments: number;
  cpf: number;
  debt: number;
}

export function netWorth(snapshot: FinancialSnapshot): NetWorth {
  const cpf = totalCpf(snapshot);
  const total =
    snapshot.cashSavings + snapshot.investmentsValue + cpf - snapshot.debt;
  return {
    total,
    cash: snapshot.cashSavings,
    investments: snapshot.investmentsValue,
    cpf,
    debt: snapshot.debt,
  };
}

function sameMonth(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

/** Normalise any recurrence to its monthly-equivalent amount. */
function monthlyEquivalent(t: Transaction): number {
  switch (t.recurrence) {
    case "daily":
      return t.amount * 30;
    case "weekly":
      return t.amount * 4.33;
    case "yearly":
      return t.amount / 12;
    case "monthly":
    case "once":
    default:
      return t.amount;
  }
}

export interface MonthlySnapshot {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number; // 0–100
}

/**
 * This-month cashflow. Recurring items count once at their monthly-equivalent;
 * one-off items count if they fall in the current calendar month.
 */
export function monthlyCashflow(transactions: Transaction[]): MonthlySnapshot {
  const now = new Date();
  let income = 0;
  let expenses = 0;

  for (const t of transactions) {
    const recurring = t.recurrence !== "once";
    const counts = recurring || sameMonth(t.date, now);
    if (!counts) continue;
    const amount = recurring ? monthlyEquivalent(t) : t.amount;
    if (t.kind === "income") income += amount;
    else expenses += amount;
  }

  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  return { income, expenses, savings, savingsRate };
}

export type CategoryTotals = Array<{
  category: ExpenseCategory;
  amount: number;
}>;

/** This-month spend per category, largest first. */
export function expensesByCategory(transactions: Transaction[]): CategoryTotals {
  const now = new Date();
  const totals = new Map<ExpenseCategory, number>();

  for (const t of transactions) {
    if (t.kind !== "expense") continue;
    const recurring = t.recurrence !== "once";
    if (!recurring && !sameMonth(t.date, now)) continue;
    const amount = recurring ? monthlyEquivalent(t) : t.amount;
    totals.set(t.category, (totals.get(t.category) ?? 0) + amount);
  }

  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export type ChartPeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface IncomeExpenseBucket {
  label: string;
  income: number;
  expenses: number;
}

/**
 * Income vs. expenses bucketed over time for the tracker bar chart. Transactions
 * are placed into the recent N periods by their recorded date (last 7 days,
 * 6 weeks, 6 months, or 4 years depending on the chosen view).
 */
export function incomeExpenseSeries(
  transactions: Transaction[],
  period: ChartPeriod,
): IncomeExpenseBucket[] {
  const now = new Date();
  type Bucket = IncomeExpenseBucket & { start: number; end: number };
  const buckets: Bucket[] = [];
  const make = (start: Date, end: Date, label: string): Bucket => ({
    start: start.getTime(),
    end: end.getTime(),
    label,
    income: 0,
    expenses: 0,
  });

  if (period === "daily") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const end = new Date(d);
      end.setDate(end.getDate() + 1);
      buckets.push(make(d, end, d.toLocaleDateString("en-SG", { weekday: "short" })));
    }
  } else if (period === "weekly") {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      const monOffset = (d.getDay() + 6) % 7; // days since Monday
      d.setDate(d.getDate() - monOffset - i * 7);
      const end = new Date(d);
      end.setDate(end.getDate() + 7);
      buckets.push(
        make(d, end, d.toLocaleDateString("en-SG", { day: "numeric", month: "short" })),
      );
    }
  } else if (period === "monthly") {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      buckets.push(make(d, end, d.toLocaleDateString("en-SG", { month: "short" })));
    }
  } else {
    for (let i = 3; i >= 0; i--) {
      const y = now.getFullYear() - i;
      buckets.push(make(new Date(y, 0, 1), new Date(y + 1, 0, 1), String(y)));
    }
  }

  for (const t of transactions) {
    const ts = new Date(t.date).getTime();
    const b = buckets.find((bk) => ts >= bk.start && ts < bk.end);
    if (!b) continue;
    if (t.kind === "income") b.income += t.amount;
    else b.expenses += t.amount;
  }

  return buckets.map(({ label, income, expenses }) => ({ label, income, expenses }));
}

export type PlatformTotals = Array<{ platform: string; value: number }>;

/** Investments grouped by broker/platform, largest first. */
export function investmentsByPlatform(holdings: Holding[]): PlatformTotals {
  const totals = new Map<string, number>();
  for (const h of holdings) {
    const key = h.broker?.trim() || "Other";
    totals.set(key, (totals.get(key) ?? 0) + h.currentValue);
  }
  return [...totals.entries()]
    .map(([platform, value]) => ({ platform, value }))
    .sort((a, b) => b.value - a.value);
}

export interface InvestmentSummary {
  cost: number;
  value: number;
  gain: number;
  gainPercent: number;
}

export function investmentSummary(holdings: Holding[]): InvestmentSummary {
  const cost = holdings.reduce((s, h) => s + h.costBasis, 0);
  const value = holdings.reduce((s, h) => s + h.currentValue, 0);
  const gain = value - cost;
  const gainPercent = cost > 0 ? (gain / cost) * 100 : 0;
  return { cost, value, gain, gainPercent };
}

/** Months of expenses currently covered by liquid cash — the emergency-fund gauge. */
export function emergencyFundMonths(state: AppState): number {
  const { expenses } = monthlyCashflow(state.transactions);
  if (expenses <= 0) return 0;
  return state.snapshot.cashSavings / expenses;
}

/** Rough 6-month net-worth trend for the dashboard sparkline (demo-friendly). */
export function netWorthTrend(state: AppState): Array<{ month: string; value: number }> {
  const current = netWorth(state.snapshot).total;
  const { savings } = monthlyCashflow(state.transactions);
  const months: Array<{ month: string; value: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    // Walk backwards from current by the monthly savings rate as an estimate.
    const value = Math.max(0, current - savings * i);
    months.push({
      month: d.toLocaleDateString("en-SG", { month: "short" }),
      value,
    });
  }
  return months;
}
