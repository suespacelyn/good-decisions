import type { HoldingType } from "@/core/types";

export const HOLDING_TYPE_META: Record<
  HoldingType,
  { label: string; emoji: string }
> = {
  stock: { label: "Stock", emoji: "📊" },
  etf: { label: "ETF", emoji: "🌍" },
  reit: { label: "REIT", emoji: "🏢" },
  unit_trust: { label: "Unit Trust", emoji: "🧺" },
  ssb: { label: "Singapore Savings Bond", emoji: "🇸🇬" },
  t_bill: { label: "T-Bill", emoji: "🧾" },
  fixed_deposit: { label: "Fixed Deposit", emoji: "🔒" },
  cash_management: { label: "Cash Management", emoji: "💵" },
};

export const HOLDING_TYPES = Object.keys(HOLDING_TYPE_META) as HoldingType[];
