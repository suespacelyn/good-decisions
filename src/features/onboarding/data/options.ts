import type {
  Confidence,
  GoalType,
  RiskAppetite,
} from "@/core/types";

export const GOAL_OPTIONS: Array<{
  value: GoalType;
  emoji: string;
  label: string;
}> = [
  { value: "bto", emoji: "🏠", label: "Buy a BTO / home" },
  { value: "emergency_fund", emoji: "🛟", label: "Build emergency fund" },
  { value: "travel", emoji: "✈️", label: "Travel" },
  { value: "invest", emoji: "📈", label: "Start investing" },
  { value: "early_retirement", emoji: "🌴", label: "Retire early" },
  { value: "wedding", emoji: "💍", label: "Wedding" },
  { value: "renovation", emoji: "🛋️", label: "Home renovation" },
  { value: "passive_income", emoji: "💸", label: "Passive income" },
  { value: "car", emoji: "🚗", label: "Buy a car" },
  { value: "family", emoji: "👪", label: "Support my family" },
];

export const RISK_OPTIONS: Array<{
  value: RiskAppetite;
  emoji: string;
  label: string;
  description: string;
}> = [
  {
    value: "very_conservative",
    emoji: "🛡️",
    label: "Very Conservative",
    description: "I want to protect my money above all",
  },
  {
    value: "conservative",
    emoji: "🌱",
    label: "Conservative",
    description: "Slow and steady, minimal ups and downs",
  },
  {
    value: "balanced",
    emoji: "⚖️",
    label: "Balanced",
    description: "A mix of growth and stability",
  },
  {
    value: "aggressive",
    emoji: "🚀",
    label: "Aggressive",
    description: "I'll ride bigger swings for more growth",
  },
  {
    value: "very_aggressive",
    emoji: "🔥",
    label: "Very Aggressive",
    description: "Maximum growth, I can stomach big drops",
  },
];

export const CONFIDENCE_OPTIONS: Array<{
  value: Confidence;
  emoji: string;
  label: string;
  description: string;
}> = [
  {
    value: "knows_nothing",
    emoji: "🐣",
    label: "I know nothing",
    description: "Totally new — start me from scratch",
  },
  {
    value: "knows_little",
    emoji: "📚",
    label: "I know a little",
    description: "I get the basics but want to learn more",
  },
  {
    value: "already_invests",
    emoji: "💪",
    label: "I already invest",
    description: "I'm comfortable and want to optimise",
  },
];

export const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not", label: "Prefer not to say" },
] as const;
