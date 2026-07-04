import type { ExpenseCategory } from "@/core/types";

export interface CategoryMeta {
  label: string;
  emoji: string;
  /** A CSS colour token reference for charts and accents. */
  color: string;
}

export const CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  food: { label: "Food", emoji: "🍜", color: "var(--color-pastel-peach)" },
  transport: { label: "Transport", emoji: "🚇", color: "var(--color-pastel-sky)" },
  shopping: { label: "Shopping", emoji: "🛍️", color: "var(--color-pastel-rose)" },
  entertainment: { label: "Fun", emoji: "🎬", color: "var(--color-pastel-lavender)" },
  utilities: { label: "Utilities", emoji: "💡", color: "var(--color-pastel-lemon)" },
  insurance: { label: "Insurance", emoji: "🛡️", color: "var(--color-pastel-teal)" },
  tax: { label: "Tax", emoji: "🧾", color: "var(--color-pastel-coral)" },
  healthcare: { label: "Health", emoji: "🩺", color: "var(--color-pastel-mint)" },
  travel: { label: "Travel", emoji: "✈️", color: "var(--color-pastel-sky)" },
  education: { label: "Education", emoji: "📚", color: "var(--color-pastel-lavender)" },
  housing: { label: "Housing", emoji: "🏠", color: "var(--color-pastel-coral)" },
  family: { label: "Family", emoji: "🧧", color: "var(--color-pastel-rose)" },
  other: { label: "Other", emoji: "📦", color: "var(--color-muted-foreground)" },
};

export const EXPENSE_CATEGORIES = Object.keys(CATEGORY_META) as ExpenseCategory[];

export function categoryLabel(c: ExpenseCategory): string {
  return CATEGORY_META[c].label;
}
