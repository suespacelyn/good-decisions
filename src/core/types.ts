/**
 * Core domain types — the shared contract for every feature module.
 * Feature-specific UI types live inside each feature folder; anything that
 * crosses module boundaries (or is persisted) lives here.
 */

// ─── User & onboarding ───────────────────────────────────────────────

export type Gender = "female" | "male" | "other" | "prefer_not";

export type RiskAppetite =
  | "very_conservative"
  | "conservative"
  | "balanced"
  | "aggressive"
  | "very_aggressive";

export type Confidence = "knows_nothing" | "knows_little" | "already_invests";

export type GoalType =
  | "bto"
  | "emergency_fund"
  | "travel"
  | "invest"
  | "early_retirement"
  | "wedding"
  | "renovation"
  | "passive_income"
  | "car"
  | "family"
  | "custom";

export interface UserProfile {
  name: string;
  age: number;
  gender?: Gender;
  occupation: string;
  // Income (monthly SGD unless noted)
  monthlySalary: number;
  annualBonus: number;
  otherMonthlyIncome: number;
  // Preferences
  riskAppetite: RiskAppetite;
  confidence: Confidence;
  selectedGoals: GoalType[];
}

/** A point-in-time picture of what the user owns and owes. */
export interface FinancialSnapshot {
  /** Total cash — kept in sync with the sum of `bankAccounts`. */
  cashSavings: number;
  cpf: CpfBalances;
  investmentsValue: number;
  debt: number;
}

/** A single bank/cash account; cash is the sum of these. */
export interface BankAccount {
  id: string;
  name: string;
  balance: number;
}

export interface CpfBalances {
  ordinaryAccount: number; // OA
  specialAccount: number; // SA
  medisave: number; // MA
}

// ─── Expenses & income tracking ──────────────────────────────────────

export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "utilities"
  | "insurance"
  | "tax"
  | "healthcare"
  | "travel"
  | "education"
  | "housing"
  | "family"
  | "other";

export type Recurrence = "once" | "daily" | "weekly" | "monthly" | "yearly";

export type TransactionKind = "income" | "expense";

export interface Transaction {
  id: string;
  kind: TransactionKind;
  category: ExpenseCategory;
  label: string;
  amount: number; // always positive; `kind` gives direction
  date: string; // ISO date
  recurrence: Recurrence;
  note?: string;
}

// ─── Investments ─────────────────────────────────────────────────────

export type HoldingType =
  | "stock"
  | "etf"
  | "reit"
  | "unit_trust"
  | "ssb"
  | "t_bill"
  | "fixed_deposit"
  | "cash_management";

export interface Holding {
  id: string;
  name: string;
  type: HoldingType;
  broker: string;
  quantity: number;
  costBasis: number; // total amount invested (SGD)
  currentValue: number; // current market value (SGD)
  note?: string;
}

// ─── Goals ───────────────────────────────────────────────────────────

export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO date
  monthlyContribution: number;
}

// ─── Financial IQ (literacy assessment) ──────────────────────────────

export type IQDomain =
  | "budgeting"
  | "insurance"
  | "cpf"
  | "investing"
  | "taxes";

export interface FinancialIQ {
  /** Overall score out of 100. */
  overall: number;
  /** Star rating 0–5 per knowledge domain. */
  breakdown: Record<IQDomain, number>;
  takenAt: string; // ISO date
}

// ─── Gamification ────────────────────────────────────────────────────

export interface Progress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string; // ISO date
  completedLessonIds: string[];
  earnedBadgeIds: string[];
}

// ─── Community feed ──────────────────────────────────────────────────

export interface PostComment {
  id: string;
  author: string;
  text: string;
  createdAt: string; // ISO
}

export interface Post {
  id: string;
  author: string;
  /** True if this post belongs to the current user. */
  isMe: boolean;
  /** Pastel colour token reference for the avatar. */
  avatarColor: string;
  content: string;
  link?: string;
  likes: number;
  likedByMe: boolean;
  comments: PostComment[];
  createdAt: string; // ISO
}

// ─── Feedback (collected for the app admin) ──────────────────────────

export interface FeedbackItem {
  id: string;
  kind: "review" | "feedback";
  rating?: number; // 1–5 for reviews
  message: string;
  author: string;
  createdAt: string; // ISO
}

// ─── The persisted application state ─────────────────────────────────

export interface AppState {
  /** Schema version — lets us migrate localStorage payloads safely. */
  version: number;
  onboardingComplete: boolean;
  /** First-run mascot tour seen? Gates the coachmarks on the dashboard. */
  tourSeen: boolean;
  isDemo: boolean;
  profile: UserProfile | null;
  snapshot: FinancialSnapshot;
  bankAccounts: BankAccount[];
  financialIQ: FinancialIQ | null;
  transactions: Transaction[];
  holdings: Holding[];
  goals: Goal[];
  posts: Post[];
  /** Friend display-names the user follows (drives notifications). */
  following: string[];
  /** When the user first opened the app — gates the review prompt. */
  firstUseAt: string;
  /** True once the 2-hour review prompt has been answered/dismissed. */
  reviewPromptDone: boolean;
  /** Feedback + reviews collected on this device (for the admin portal). */
  feedback: FeedbackItem[];
  progress: Progress;
}
