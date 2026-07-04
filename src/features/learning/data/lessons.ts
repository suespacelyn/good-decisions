import type { IQDomain } from "@/core/types";

export interface LessonSection {
  heading?: string;
  body: string;
}

export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  domain: IQDomain;
  minutes: number;
  xp: number;
  summary: string;
  sections: LessonSection[];
  keyTakeaways: string[];
}

/**
 * Learning content — data-driven so lessons can be added or edited without
 * code changes. Singapore-contextualised, beginner-friendly, never selling a
 * specific product.
 */
export const LESSONS: Lesson[] = [
  {
    id: "emergency-fund",
    title: "Your Emergency Fund",
    emoji: "🛟",
    domain: "budgeting",
    minutes: 5,
    xp: 50,
    summary: "The cash cushion that keeps surprises from becoming setbacks.",
    sections: [
      {
        body: "An emergency fund is money set aside for life's surprises — a sudden medical bill, a broken phone, or a gap between jobs. It's the foundation every other money decision sits on.",
      },
      {
        heading: "How much?",
        body: "Aim for 3 to 6 months of your essential expenses. If you spend about $2,000 a month on needs, that's $6,000–$12,000. Start with one month, then build up.",
      },
      {
        heading: "Where to keep it",
        body: "Somewhere safe and easy to reach — a high-yield savings account, or partly in a Singapore Savings Bond (SSB) which stays liquid and pays a little more. Not in stocks: you don't want to sell at a loss during a crisis.",
      },
    ],
    keyTakeaways: [
      "Target 3–6 months of essential expenses",
      "Keep it liquid and safe, not invested in stocks",
      "Automate a transfer each payday to build it painlessly",
    ],
  },
  {
    id: "managing-debt",
    title: "Managing Debt",
    emoji: "💳",
    domain: "budgeting",
    minutes: 6,
    xp: 50,
    summary: "Why clearing high-interest debt is a guaranteed return.",
    sections: [
      {
        body: "Not all debt is equal. A 25%-a-year credit-card balance is very different from a low-rate HDB housing loan. The expensive stuff should go first.",
      },
      {
        heading: "The math",
        body: "Paying off a card charging 25% is like earning a guaranteed 25% return — no safe investment reliably beats that. So clearing high-interest debt usually comes before investing.",
      },
      {
        heading: "Two popular methods",
        body: "Avalanche: pay the highest-interest balance first to save the most money. Snowball: clear the smallest balance first for quick wins and motivation. Both work — pick what keeps you going.",
      },
    ],
    keyTakeaways: [
      "Clear high-interest debt before investing",
      "Always pay credit cards in full to avoid ~25% interest",
      "Low-rate housing loans aren't urgent to rush",
    ],
  },
  {
    id: "insurance-basics",
    title: "Insurance Basics",
    emoji: "🛡️",
    domain: "insurance",
    minutes: 6,
    xp: 50,
    summary: "Protect your savings from rare but expensive events.",
    sections: [
      {
        body: "Insurance isn't an investment — it's protection. It transfers the risk of a rare, costly event (a big hospital bill, loss of income) so a single event can't wipe out your savings.",
      },
      {
        heading: "The Singapore basics",
        body: "Every citizen and PR has MediShield Life, a national scheme for large hospital bills. Many add an Integrated Shield Plan for more coverage. If people depend on your income, term life and disability income are worth understanding.",
      },
      {
        heading: "A common trap",
        body: "Bundled investment-insurance products can quietly cost a lot in fees. It's often clearer to keep protection and investing separate — but learn the options before deciding. We'll never tell you which policy to buy.",
      },
    ],
    keyTakeaways: [
      "Insurance protects savings; it isn't for growth",
      "MediShield Life covers large hospital bills for all Singaporeans",
      "Understand term vs whole life before committing",
    ],
  },
  {
    id: "cpf-explained",
    title: "CPF Explained",
    emoji: "🇸🇬",
    domain: "cpf",
    minutes: 7,
    xp: 60,
    summary: "Your OA, SA and MediSave — and why they matter.",
    sections: [
      {
        body: "CPF is Singapore's mandatory savings system. Each month a slice of your salary (plus an employer contribution) goes into three accounts.",
      },
      {
        heading: "The three accounts",
        body: "Ordinary Account (OA) — housing, insurance, investment, education. Special Account (SA) — retirement, higher interest. MediSave (MA) — healthcare and medical insurance premiums.",
      },
      {
        heading: "Why care now",
        body: "CPF pays relatively high, government-guaranteed interest, with extra on your first balances. Voluntary top-ups can earn tax relief and compound for decades — powerful if you have spare cash after your emergency fund and debt are handled.",
      },
    ],
    keyTakeaways: [
      "OA = housing/investment, SA = retirement, MA = healthcare",
      "CPF interest is high and government-guaranteed",
      "Top-ups can earn tax relief — but lock money until retirement",
    ],
  },
  {
    id: "what-is-an-etf",
    title: "What is an ETF?",
    emoji: "📈",
    domain: "investing",
    minutes: 5,
    xp: 50,
    summary: "Own hundreds of companies in a single, low-cost fund.",
    sections: [
      {
        body: "An ETF (Exchange Traded Fund) bundles many investments into one fund that trades like a stock. Buy one share of a global ETF and you instantly own a slice of hundreds or thousands of companies.",
      },
      {
        heading: "Why beginners like them",
        body: "Instant diversification, low fees, and no need to pick individual winners. A broad, low-cost index ETF is a common core holding for long-term investors.",
      },
      {
        heading: "In Singapore",
        body: "You can buy global ETFs through local and overseas brokers. Watch the expense ratio (the annual fee) and consider how dividends are taxed depending on where the ETF is listed. We'll explain the trade-offs, not tell you which to buy.",
      },
    ],
    keyTakeaways: [
      "An ETF holds many assets in one tradable fund",
      "Low fees + diversification make them beginner-friendly",
      "Check the expense ratio and listing domicile",
    ],
  },
  {
    id: "dollar-cost-averaging",
    title: "Dollar Cost Averaging",
    emoji: "🔁",
    domain: "investing",
    minutes: 4,
    xp: 40,
    summary: "Invest a fixed amount regularly and stop trying to time the market.",
    sections: [
      {
        body: "Dollar Cost Averaging (DCA) means investing a set amount on a regular schedule — say $300 every month — regardless of whether prices are up or down.",
      },
      {
        heading: "Why it works",
        body: "You automatically buy more units when prices are low and fewer when high, smoothing your average cost. More importantly, it removes the stress and guesswork of timing — which even professionals rarely get right.",
      },
    ],
    keyTakeaways: [
      "Invest the same amount on a fixed schedule",
      "Removes the need to time the market",
      "Automate it so it happens without willpower",
    ],
  },
  {
    id: "risk-and-diversification",
    title: "Risk & Diversification",
    emoji: "⚖️",
    domain: "investing",
    minutes: 5,
    xp: 50,
    summary: "Don't put all your eggs in one basket.",
    sections: [
      {
        body: "Risk is the chance your investments fall in value, especially in the short term. You can't remove it — but you can manage it.",
      },
      {
        heading: "Diversification",
        body: "Spreading money across many companies, sectors, and regions means one failure won't sink you. A global index fund does a lot of this automatically.",
      },
      {
        heading: "Time horizon",
        body: "The longer you can leave money invested, the more short-term dips matter less. Only invest money you won't need for at least 5 years.",
      },
    ],
    keyTakeaways: [
      "Diversify across many holdings to lower risk",
      "Only invest money you won't need for 5+ years",
      "Higher potential returns always come with bigger swings",
    ],
  },
  {
    id: "budgeting-basics",
    title: "Budgeting Basics",
    emoji: "🧮",
    domain: "budgeting",
    minutes: 5,
    xp: 50,
    summary: "A simple frame to spend, save, and not feel restricted.",
    sections: [
      {
        body: "A budget isn't about restriction — it's about deciding where your money goes on purpose, so the important things are covered.",
      },
      {
        heading: "The 50/30/20 guideline",
        body: "Roughly 50% of take-home pay to needs (rent, food, transport), 30% to wants (dining, shopping), and 20% to savings and debt repayment. Adjust to your reality — it's a starting frame, not a rule.",
      },
      {
        heading: "Pay yourself first",
        body: "Automate your savings transfer on payday, before you can spend it. What's left is yours to enjoy guilt-free.",
      },
    ],
    keyTakeaways: [
      "Budgeting = intentional spending, not restriction",
      "Try 50/30/20 as a starting point",
      "Automate savings on payday — pay yourself first",
    ],
  },
  {
    id: "building-your-first-portfolio",
    title: "Building Your First Portfolio",
    emoji: "🏗️",
    domain: "investing",
    minutes: 7,
    xp: 60,
    summary: "Put the pieces together into a simple, durable plan.",
    sections: [
      {
        body: "Once your emergency fund is set and high-interest debt is gone, you're ready to invest for the long term. The goal is simple and boring — which, in investing, is good.",
      },
      {
        heading: "A simple structure",
        body: "Many beginners start with one or two broad, low-cost index ETFs covering global markets, invested monthly via DCA. Add bonds or SSBs for stability as you get closer to needing the money.",
      },
      {
        heading: "Then leave it alone",
        body: "The hardest part is doing nothing during scary headlines. Consistency and patience beat clever moves over the long run.",
      },
    ],
    keyTakeaways: [
      "Invest only after emergency fund + debt are handled",
      "Keep it simple: broad, low-cost, diversified, regular",
      "Consistency and patience beat trying to be clever",
    ],
  },
];

/** Quick id → title lookup for chips and links. */
export const LESSON_TITLES: Record<string, string> = Object.fromEntries(
  LESSONS.map((l) => [l.id, l.title]),
);

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

/**
 * Personalised roadmap: weakest IQ domains first, then a sensible default
 * order. Returns lessons grouped into weeks of one lesson each.
 */
export function buildRoadmap(
  domainScores: Record<IQDomain, number> | null,
): Lesson[] {
  if (!domainScores) return LESSONS;
  return [...LESSONS].sort(
    (a, b) => domainScores[a.domain] - domainScores[b.domain],
  );
}
