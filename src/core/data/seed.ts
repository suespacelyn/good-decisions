import type {
  AppState,
  Holding,
  Transaction,
  ExpenseCategory,
} from "@/core/types";
import { APP_STATE_VERSION } from "@/core/data/repository";
import { createSeedPosts } from "@/features/community/data/seed-posts";
import { DEFAULT_FOLLOWING } from "@/features/community/data/friends";
import { createSeedFeedback } from "@/features/admin/data/seed-feedback";

/**
 * Demo persona — "Jia Hui", 27, marketing executive.
 * Realistic young-Singaporean finances: decent salary, a starter emergency
 * fund, first ETF positions, some lifestyle creep, a bit of credit-card debt.
 * Lets a new user explore the whole app before entering anything real.
 */

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function monthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
}

let counter = 0;
function tx(
  kind: Transaction["kind"],
  category: ExpenseCategory,
  label: string,
  amount: number,
  date: string,
  recurrence: Transaction["recurrence"] = "once",
): Transaction {
  return {
    id: `demo_tx_${counter++}`,
    kind,
    category,
    label,
    amount,
    date,
    recurrence,
  };
}

function buildTransactions(): Transaction[] {
  const list: Transaction[] = [];

  // Recurring monthly anchors — defined ONCE. A `monthly` recurrence already
  // means "every month", so the cashflow selector counts each at its monthly
  // rate. (Duplicating per month would multiply income/expenses incorrectly.)
  const thisMonth = monthsAgo(0);
  list.push(
    tx("income", "other", "Salary", 4500, thisMonth, "monthly"),
    tx("expense", "housing", "Rent (room)", 950, thisMonth, "monthly"),
    tx("expense", "family", "Allowance to parents", 500, thisMonth, "monthly"),
    tx("expense", "utilities", "Phone + broadband", 65, thisMonth, "monthly"),
    tx("expense", "insurance", "Hospitalisation rider", 42, thisMonth, "monthly"),
    tx("expense", "transport", "Public transport", 120, thisMonth, "monthly"),
    tx("expense", "entertainment", "Spotify + Netflix", 28, thisMonth, "monthly"),
  );

  // Recent daily-ish spending (this month) to make charts feel alive.
  const recent: Array<[ExpenseCategory, string, number, number]> = [
    ["food", "Hawker lunch", 6, 1],
    ["food", "Bubble tea", 5.5, 2],
    ["food", "Cafe brunch", 24, 3],
    ["shopping", "Uniqlo tee", 39, 4],
    ["food", "Grocery run", 58, 5],
    ["transport", "Grab home", 14, 6],
    ["food", "Dinner with friends", 45, 7],
    ["entertainment", "Movie night", 17, 9],
    ["healthcare", "Pharmacy", 22, 11],
    ["food", "Hawker lunch", 6.5, 12],
    ["shopping", "Shopee order", 31, 14],
    ["food", "Coffee", 4.8, 15],
    ["travel", "Flight to Bangkok (savings)", 180, 18],
    ["food", "Zi char dinner", 52, 20],
    ["food", "Hawker lunch", 6, 22],
  ];
  for (const [cat, label, amount, ago] of recent) {
    list.push(tx("expense", cat, label, amount, daysAgo(ago)));
  }

  // One-off bonus a couple months back.
  list.push(tx("income", "other", "Mid-year bonus", 4500, monthsAgo(2)));

  return list;
}

function buildHoldings(): Holding[] {
  return [
    {
      id: "demo_h_0",
      name: "IWDA — iShares Core MSCI World",
      type: "etf",
      broker: "IBKR",
      quantity: 120,
      costBasis: 12_400,
      currentValue: 13_950,
      note: "Monthly DCA, core global equity",
    },
    {
      id: "demo_h_1",
      name: "CapitaLand Integrated Comm. Trust",
      type: "reit",
      broker: "Tiger Brokers",
      quantity: 1500,
      costBasis: 3_000,
      currentValue: 3_180,
    },
    {
      id: "demo_h_2",
      name: "Singapore Savings Bond (SSB)",
      type: "ssb",
      broker: "CDP",
      quantity: 1,
      costBasis: 3_000,
      currentValue: 3_060,
      note: "Emergency-fund buffer, fully liquid",
    },
    {
      id: "demo_h_3",
      name: "6-month T-Bill",
      type: "t_bill",
      broker: "CDP",
      quantity: 1,
      costBasis: 2_000,
      currentValue: 2_035,
    },
  ];
}

export function createDemoState(): AppState {
  const transactions = buildTransactions();
  const holdings = buildHoldings();
  const investmentsValue = holdings.reduce((s, h) => s + h.currentValue, 0);

  return {
    version: APP_STATE_VERSION,
    onboardingComplete: true,
    tourSeen: false,
    isDemo: true,
    profile: {
      name: "Jia Hui",
      age: 27,
      gender: "female",
      occupation: "Marketing Executive",
      monthlySalary: 4500,
      annualBonus: 9000,
      otherMonthlyIncome: 0,
      riskAppetite: "balanced",
      confidence: "knows_little",
      selectedGoals: ["emergency_fund", "bto", "travel", "invest"],
    },
    snapshot: {
      cashSavings: 18_400,
      cpf: { ordinaryAccount: 32_100, specialAccount: 14_300, medisave: 11_200 },
      investmentsValue,
      debt: 3_200, // lingering credit-card balance
    },
    bankAccounts: [
      { id: "demo_bank_0", name: "DBS Multiplier", balance: 12_400 },
      { id: "demo_bank_1", name: "OCBC 360", balance: 6_000 },
    ],
    financialIQ: {
      overall: 52,
      breakdown: {
        budgeting: 4,
        insurance: 2,
        cpf: 1,
        investing: 3,
        taxes: 2,
      },
      takenAt: monthsAgo(1),
    },
    transactions,
    holdings,
    goals: [
      {
        id: "demo_g_0",
        type: "emergency_fund",
        name: "Emergency Fund",
        targetAmount: 16_200, // ~6 months of expenses
        currentAmount: 11_000,
        monthlyContribution: 500,
      },
      {
        id: "demo_g_1",
        type: "bto",
        name: "BTO Downpayment",
        targetAmount: 40_000,
        currentAmount: 12_000,
        deadline: (() => {
          const d = new Date();
          d.setFullYear(d.getFullYear() + 3);
          return d.toISOString();
        })(),
        monthlyContribution: 600,
      },
      {
        id: "demo_g_2",
        type: "travel",
        name: "Japan Trip",
        targetAmount: 4_000,
        currentAmount: 1_500,
        deadline: (() => {
          const d = new Date();
          d.setMonth(d.getMonth() + 8);
          return d.toISOString();
        })(),
        monthlyContribution: 300,
      },
    ],
    posts: createSeedPosts(),
    following: [...DEFAULT_FOLLOWING],
    // 3h ago so the "enjoying the app?" review prompt shows in the demo.
    firstUseAt: (() => {
      const d = new Date();
      d.setHours(d.getHours() - 3);
      return d.toISOString();
    })(),
    reviewPromptDone: false,
    feedback: createSeedFeedback(),
    progress: {
      xp: 340,
      level: 3,
      streakDays: 5,
      lastActiveDate: new Date().toISOString(),
      completedLessonIds: ["emergency-fund", "what-is-an-etf"],
      earnedBadgeIds: ["first-lesson", "streak-5", "first-goal"],
    },
  };
}
