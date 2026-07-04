import type { CoachRule } from "@/features/coach/types";

/**
 * Data-driven financial rules, ordered by the PRD's priority ladder:
 * emergency savings → debt → CPF → insurance → investing → habits.
 *
 * Each rule is self-contained copy + a predicate, so new guidance can be added
 * here without touching the engine or the UI. Nothing here names a product.
 */
export const COACH_RULES: CoachRule[] = [
  // 1 — Emergency fund below 3 months (most urgent).
  {
    id: "emergency-under-3",
    when: (c) => c.emergencyMonths < 3 && c.monthlyExpenses > 0,
    build: (c) => ({
      id: "emergency-under-3",
      severity: "attention",
      domain: "savings",
      title: "Build your safety net first",
      summary: `You have about ${c.emergencyMonths.toFixed(1)} months of expenses saved. Aim for 3 to start.`,
      why: "An emergency fund is the foundation everything else sits on. Without it, a sudden expense or job gap forces you into debt or to sell investments at a bad time.",
      benefits: [
        "Covers surprises (medical, job change) without borrowing",
        "Lets you invest later with a calm, long-term mindset",
        "Reduces money stress day to day",
      ],
      risks: [
        "Holding too much cash long-term loses value to inflation — 3–6 months is the sweet spot, not more",
      ],
      alternatives: [
        "Keep it in a high-yield savings account or a Singapore Savings Bond for liquidity",
        "Automate a fixed transfer on payday so it grows without thinking",
      ],
      learnMore: ["emergency-fund"],
      priority: 100,
    }),
  },

  // 2 — High-interest debt present.
  {
    id: "high-interest-debt",
    when: (c) => c.state.snapshot.debt > 0,
    build: (c) => ({
      id: "high-interest-debt",
      severity: "attention",
      domain: "debt",
      title: "Clear high-interest debt early",
      summary: `You're carrying about $${Math.round(c.state.snapshot.debt).toLocaleString()} in debt. Paying it down is a guaranteed return.`,
      why: "Credit-card and similar debt often charges ~25% a year. No safe investment reliably beats that, so clearing it is mathematically one of the best returns available to you.",
      benefits: [
        "Every dollar repaid 'earns' the interest rate you avoid",
        "Frees up future cashflow for saving and investing",
        "Improves your borrowing options later (e.g. an HDB loan)",
      ],
      risks: [
        "Draining your entire emergency buffer to repay can backfire — balance both",
      ],
      alternatives: [
        "Avalanche: pay highest-interest balance first to save the most",
        "Snowball: clear the smallest balance first for momentum",
      ],
      learnMore: ["managing-debt"],
      priority: 95,
    }),
  },

  // 3 — Emergency fund 3–6 months: keep going.
  {
    id: "emergency-3-to-6",
    when: (c) =>
      c.emergencyMonths >= 3 && c.emergencyMonths < 6 && c.monthlyExpenses > 0,
    build: (c) => ({
      id: "emergency-3-to-6",
      severity: "info",
      domain: "savings",
      title: "Top up to six months",
      summary: `Nice — about ${c.emergencyMonths.toFixed(1)} months saved. Six months is the comfortable target.`,
      why: "Three months is a solid start. Stretching to six gives more breathing room for a longer job search or bigger surprise before you lean harder into investing.",
      benefits: [
        "More resilience to income shocks",
        "Confidence to invest the rest for the long term",
      ],
      risks: ["Beyond ~6 months, extra cash is better put to work than idle"],
      alternatives: [
        "Split the buffer: keep some in savings, some in SSBs for a little more yield",
      ],
      learnMore: ["emergency-fund"],
      priority: 70,
    }),
  },

  // 4 — No insurance expense detected.
  {
    id: "no-insurance",
    when: (c) => !c.hasInsuranceExpense,
    build: () => ({
      id: "no-insurance",
      severity: "info",
      domain: "insurance",
      title: "Understand your insurance gaps",
      summary:
        "We didn't spot any insurance in your expenses. It's worth learning what cover you actually need.",
      why: "Insurance protects your savings from rare but expensive events — a big hospital bill or losing your income. Knowing the few types that matter helps you avoid both being under-covered and over-paying.",
      benefits: [
        "Protects your emergency fund and investments from a single big event",
        "MediShield Life + a modest Integrated Shield plan covers most hospital costs in Singapore",
      ],
      risks: [
        "Over-insuring or buying bundled investment-insurance products can quietly cost a lot — learn before you commit",
      ],
      alternatives: [
        "Start by reviewing your existing MediShield Life coverage",
        "Learn the difference between term and whole life before deciding",
      ],
      learnMore: ["insurance-basics"],
      priority: 60,
    }),
  },

  // 5 — Strong emergency fund + low investment ratio: ready to invest more.
  {
    id: "ready-to-invest",
    when: (c) =>
      c.emergencyMonths >= 6 &&
      c.state.snapshot.debt === 0 &&
      c.investmentRatioOfLiquid < 0.5,
    build: () => ({
      id: "ready-to-invest",
      severity: "info",
      domain: "investing",
      title: "You're ready to invest more steadily",
      summary:
        "Your safety net is solid and you're debt-free. Consistent, diversified investing can now do the heavy lifting.",
      why: "With a full emergency fund and no high-interest debt, idle cash is losing value to inflation. A diversified, low-cost approach invested regularly historically grows wealth over the long term.",
      benefits: [
        "Compounding works hardest with time in the market",
        "Dollar-cost averaging removes the stress of timing",
        "Low-cost diversified funds spread risk across many companies",
      ],
      risks: [
        "Markets fall sometimes — only invest money you won't need for 5+ years",
        "Higher returns always come with higher short-term ups and downs",
      ],
      alternatives: [
        "Increase contributions gradually rather than all at once",
        "Keep enough cash that a market dip never forces you to sell",
      ],
      learnMore: ["what-is-an-etf", "dollar-cost-averaging"],
      priority: 65,
    }),
  },

  // 6 — Investment ratio very high relative to cash: rebalance toward safety.
  {
    id: "over-invested",
    when: (c) => c.investmentRatioOfLiquid > 0.85 && c.emergencyMonths < 3,
    build: () => ({
      id: "over-invested",
      severity: "attention",
      domain: "investing",
      title: "Keep more cash within reach",
      summary:
        "Most of your liquid money is invested while your cash buffer is thin. A little rebalancing adds resilience.",
      why: "If nearly everything is invested and an emergency hits, you may be forced to sell during a dip and lock in a loss. A cash buffer lets your investments ride out bad months.",
      benefits: [
        "Avoids selling investments at the worst time",
        "Lower stress when markets wobble",
      ],
      risks: ["Holding too much cash long-term underperforms — this is about balance, not retreating"],
      alternatives: [
        "Direct new savings to cash until you're back to 3–6 months",
        "Pause additional investing briefly rather than selling existing holdings",
      ],
      learnMore: ["emergency-fund", "risk-and-diversification"],
      priority: 80,
    }),
  },

  // 7 — Low savings rate.
  {
    id: "low-savings-rate",
    when: (c) => c.monthlyIncome > 0 && c.savingsRate < 10,
    build: (c) => ({
      id: "low-savings-rate",
      severity: "info",
      domain: "budgeting",
      title: "Lift your savings rate",
      summary: `You're saving about ${Math.round(c.savingsRate)}% of your income. Even small increases compound.`,
      why: "Your savings rate is the single biggest lever you control. Nudging it up — even a few percent — has a larger long-term impact than chasing higher investment returns.",
      benefits: [
        "Reaches every goal faster",
        "Builds a habit that scales as your income grows",
      ],
      risks: ["Cutting too hard can be unsustainable — aim for steady, livable changes"],
      alternatives: [
        "Try the 50/30/20 guideline as a starting frame",
        "Automate savings on payday so it happens before you can spend it",
      ],
      learnMore: ["budgeting-basics"],
      priority: 55,
    }),
  },

  // 8 — Healthy state: celebrate + keep the habit.
  {
    id: "on-track",
    when: (c) =>
      c.emergencyMonths >= 6 &&
      c.state.snapshot.debt === 0 &&
      c.savingsRate >= 20,
    build: () => ({
      id: "on-track",
      severity: "celebrate",
      domain: "savings",
      title: "You're on a great track 🎉",
      summary:
        "Strong safety net, no costly debt, and a healthy savings rate. Keep the habit going.",
      why: "You've covered the fundamentals in the right order. From here, consistency and patience matter more than any clever move.",
      benefits: [
        "Your money is working with low stress",
        "You're well-placed for bigger goals like a home",
      ],
      risks: ["The main risk now is lifestyle creep quietly eroding your savings rate"],
      alternatives: [
        "Consider CPF top-ups for tax relief and long-term growth",
        "Revisit your goals and set the next milestone",
      ],
      learnMore: ["cpf-explained", "building-your-first-portfolio"],
      priority: 40,
    }),
  },
];
