import type { IQDomain } from "@/core/types";

export interface QuizQuestion {
  id: string;
  domain: IQDomain;
  question: string;
  options: string[];
  correctIndex: number;
  /** Shown after answering — this is where the teaching happens. */
  explanation: string;
}

/**
 * Financial literacy assessment. Data-driven so questions can be added or
 * reworded without touching scoring or UI. Singapore-contextualised.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-emergency",
    domain: "budgeting",
    question: "How many months of expenses is a common target for an emergency fund?",
    options: ["1 month", "3 to 6 months", "12 months", "You don't need one"],
    correctIndex: 1,
    explanation:
      "3–6 months of expenses is the usual sweet spot — enough to cover a job gap or surprise, without holding so much cash that inflation eats it.",
  },
  {
    id: "q-inflation",
    domain: "budgeting",
    question: "If prices rise 3% a year and your savings earn 0.05%, your cash is...",
    options: [
      "Growing in real value",
      "Losing purchasing power",
      "Staying exactly the same",
      "Earning 3%",
    ],
    correctIndex: 1,
    explanation:
      "When inflation outpaces your interest rate, the same dollars buy less over time. That's why money beyond your emergency fund is often invested.",
  },
  {
    id: "q-compound",
    domain: "investing",
    question: "What makes compound interest powerful over time?",
    options: [
      "You earn returns on your past returns, not just your deposits",
      "Banks guarantee high rates",
      "It only works for the wealthy",
      "It avoids all risk",
    ],
    correctIndex: 0,
    explanation:
      "Compounding means your gains start earning their own gains. The earlier and more consistently you invest, the more time does the heavy lifting.",
  },
  {
    id: "q-etf",
    domain: "investing",
    question: "What is an ETF?",
    options: [
      "A single company's stock",
      "A fund holding many assets that trades like a stock",
      "A type of fixed deposit",
      "A government tax",
    ],
    correctIndex: 1,
    explanation:
      "An ETF (Exchange Traded Fund) bundles many holdings — like hundreds of global companies — into one tradable fund. Low-cost, diversified ETFs are a beginner-friendly core.",
  },
  {
    id: "q-diversify",
    domain: "investing",
    question: "Why does diversification matter?",
    options: [
      "It guarantees profit",
      "It spreads risk so one bad bet doesn't sink you",
      "It avoids all taxes",
      "It doubles your returns",
    ],
    correctIndex: 1,
    explanation:
      "Spreading money across many companies and regions means no single failure wipes you out. It lowers risk without necessarily lowering long-term returns.",
  },
  {
    id: "q-dca",
    domain: "investing",
    question: "What is Dollar Cost Averaging (DCA)?",
    options: [
      "Investing a fixed amount regularly, regardless of price",
      "Buying only when prices are lowest",
      "Putting everything in at once",
      "Trading daily for quick profit",
    ],
    correctIndex: 0,
    explanation:
      "DCA means investing a set amount on a schedule. It removes the stress of timing the market and smooths out your average buy price over time.",
  },
  {
    id: "q-cpf-oa",
    domain: "cpf",
    question: "In Singapore, your CPF Ordinary Account (OA) can be used for...",
    options: [
      "Only retirement at 65",
      "Housing, insurance, investment and education",
      "Daily spending",
      "Nothing until you're 55",
    ],
    correctIndex: 1,
    explanation:
      "CPF OA can go toward housing (like a BTO), approved investments, certain insurance, and education. SA and MediSave have their own purposes.",
  },
  {
    id: "q-cpf-interest",
    domain: "cpf",
    question: "Compared to a normal bank savings account, CPF interest rates are generally...",
    options: ["Lower", "About the same", "Higher and government-guaranteed", "Zero"],
    correctIndex: 2,
    explanation:
      "CPF pays relatively high, government-guaranteed interest (with extra on the first balances). That's why voluntary top-ups can be attractive for long-term goals.",
  },
  {
    id: "q-medisave",
    domain: "cpf",
    question: "What is MediSave mainly for?",
    options: [
      "Buying a car",
      "Healthcare costs and approved medical insurance",
      "Overseas holidays",
      "Daily groceries",
    ],
    correctIndex: 1,
    explanation:
      "MediSave is earmarked for medical expenses, hospitalisation, and premiums like MediShield Life — your healthcare safety net.",
  },
  {
    id: "q-shield",
    domain: "insurance",
    question: "What does MediShield Life provide for Singaporeans?",
    options: [
      "Travel insurance",
      "Basic national health insurance for large hospital bills",
      "Car insurance",
      "Investment returns",
    ],
    correctIndex: 1,
    explanation:
      "MediShield Life is a basic national scheme covering large hospital bills. Many top it up with an Integrated Shield Plan for more coverage.",
  },
  {
    id: "q-term-life",
    domain: "insurance",
    question: "Term life insurance is best described as...",
    options: [
      "Coverage for a set period, usually cheaper",
      "An investment product",
      "Lifetime coverage that builds cash value",
      "The same as MediSave",
    ],
    correctIndex: 0,
    explanation:
      "Term insurance covers you for a fixed period at lower cost. It's often enough to protect dependents during your working years — separate from investing.",
  },
  {
    id: "q-insurance-need",
    domain: "insurance",
    question: "The main purpose of insurance is to...",
    options: [
      "Grow your wealth",
      "Protect against rare but expensive events",
      "Replace your savings",
      "Earn dividends",
    ],
    correctIndex: 1,
    explanation:
      "Insurance transfers the risk of low-probability, high-cost events (a serious illness, loss of income) so a single event can't wipe out your savings.",
  },
  {
    id: "q-tax-relief",
    domain: "taxes",
    question: "Which can reduce your taxable income in Singapore?",
    options: [
      "Spending more on shopping",
      "CPF cash top-ups and SRS contributions (within limits)",
      "Taking on debt",
      "Nothing reduces tax",
    ],
    correctIndex: 1,
    explanation:
      "Approved CPF top-ups and SRS contributions can earn tax relief within annual limits — a way to lower tax while saving for the long term.",
  },
  {
    id: "q-tax-progressive",
    domain: "taxes",
    question: "Singapore's personal income tax is progressive, meaning...",
    options: [
      "Everyone pays the same flat rate",
      "Higher income is taxed at higher marginal rates",
      "There is no income tax",
      "Only foreigners pay tax",
    ],
    correctIndex: 1,
    explanation:
      "Progressive tax means only the portion of income in each higher band is taxed at that band's rate — your whole income isn't taxed at the top rate.",
  },
  {
    id: "q-credit-card",
    domain: "budgeting",
    question: "What's the smartest way to use a credit card?",
    options: [
      "Pay only the minimum each month",
      "Pay the full balance every month to avoid interest",
      "Max it out for rewards",
      "Ignore the statement",
    ],
    correctIndex: 1,
    explanation:
      "Paying the full balance monthly means you enjoy the rewards and grace period without ever paying the ~25% interest. Minimum-only payments are a debt trap.",
  },
  {
    id: "q-needs-wants",
    domain: "budgeting",
    question: "A popular budgeting guideline is 50/30/20. The 20 refers to...",
    options: [
      "Wants",
      "Needs",
      "Savings and debt repayment",
      "Taxes",
    ],
    correctIndex: 2,
    explanation:
      "In 50/30/20, roughly 50% goes to needs, 30% to wants, and 20% to savings and paying down debt. It's a simple starting frame, not a strict rule.",
  },
];

export const QUIZ_DOMAINS: IQDomain[] = [
  "budgeting",
  "investing",
  "cpf",
  "insurance",
  "taxes",
];
