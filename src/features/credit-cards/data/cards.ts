/**
 * Credit-card STRATEGY database — data-driven so it can be updated without an
 * app release (PRD requirement). Per our product principle we never tell users
 * which card to buy: we describe strategy archetypes matched to a spending
 * profile and teach what to look for, so the user decides for themselves.
 */

export type SpendCategory =
  | "dining"
  | "travel"
  | "online"
  | "groceries"
  | "petrol"
  | "lifestyle";

export const SPEND_CATEGORIES: Array<{
  value: SpendCategory;
  emoji: string;
  label: string;
}> = [
  { value: "dining", emoji: "🍽️", label: "Dining" },
  { value: "travel", emoji: "✈️", label: "Travel" },
  { value: "online", emoji: "🛒", label: "Online shopping" },
  { value: "groceries", emoji: "🥬", label: "Groceries" },
  { value: "petrol", emoji: "⛽", label: "Petrol" },
  { value: "lifestyle", emoji: "🎬", label: "Lifestyle" },
];

export interface CardStrategy {
  id: string;
  name: string;
  emoji: string;
  matches: SpendCategory[];
  idea: string;
  lookFor: string[];
  watchOut: string;
}

export const CARD_STRATEGIES: CardStrategy[] = [
  {
    id: "cashback-everyday",
    name: "Everyday cashback",
    emoji: "💵",
    matches: ["dining", "groceries", "petrol", "lifestyle"],
    idea: "A flat or category cashback card returns a % of what you spend as cash — simple and predictable.",
    lookFor: [
      "Cashback rate on your biggest categories",
      "Minimum monthly spend to unlock the rate",
      "Monthly cashback cap",
    ],
    watchOut:
      "High rates often require a minimum spend — don't overspend just to hit it.",
  },
  {
    id: "miles-travel",
    name: "Air miles",
    emoji: "✈️",
    matches: ["travel", "dining", "online"],
    idea: "Miles cards earn points you convert to flights. Best if you travel and pay in full every month.",
    lookFor: [
      "Miles per dollar on local vs overseas spend",
      "Transfer partners and conversion fees",
      "Annual fee vs the value of miles you'll actually use",
    ],
    watchOut:
      "Miles can expire and lose value. Only worth it if you'll redeem them.",
  },
  {
    id: "online-shopping",
    name: "Online & entertainment",
    emoji: "🛒",
    matches: ["online", "lifestyle", "dining"],
    idea: "Some cards boost rewards on online spend, streaming and food delivery — handy for a digital lifestyle.",
    lookFor: [
      "Bonus rate specifically on online transactions",
      "Whether food delivery and streaming count",
      "Reward caps",
    ],
    watchOut:
      "Definitions of 'online' vary by bank — check the merchant categories.",
  },
  {
    id: "groceries-family",
    name: "Groceries & essentials",
    emoji: "🥬",
    matches: ["groceries", "petrol", "lifestyle"],
    idea: "If a big chunk of spend is supermarkets and daily needs, a groceries-focused card maximises everyday rebates.",
    lookFor: [
      "Rebate at the supermarkets you actually use",
      "Whether NTUC/online groceries qualify",
      "Petrol discounts if you drive",
    ],
    watchOut: "Rebates may be capped or exclude certain retailers.",
  },
];

export const CREDIT_PRINCIPLES = [
  "Always pay your statement in full — interest is ~25% a year and wipes out any rewards.",
  "A card's rewards only matter on spending you'd do anyway. Never spend more to earn more.",
  "Match the card to where your money already goes, not to the flashiest sign-up bonus.",
  "Track annual fees — a fee only makes sense if your rewards clearly exceed it.",
];

export const CREDIT_LESSON_IDS = ["managing-debt", "budgeting-basics"];
