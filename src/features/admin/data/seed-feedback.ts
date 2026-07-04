import type { FeedbackItem } from "@/core/types";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/**
 * Seed feedback so the admin portal has something to show in the demo.
 * In production this would come from a shared backend (Supabase).
 */
export function createSeedFeedback(): FeedbackItem[] {
  return [
    {
      id: "fb_seed_0",
      kind: "review",
      rating: 5,
      message: "Love the community feed — finally a finance app that feels fun!",
      author: "Mei",
      createdAt: daysAgo(1),
    },
    {
      id: "fb_seed_1",
      kind: "review",
      rating: 4,
      message: "The CPF section finally made it make sense to me 🙏",
      author: "Wei",
      createdAt: daysAgo(2),
    },
    {
      id: "fb_seed_2",
      kind: "feedback",
      message:
        "Could you add a way to set monthly budgets per category? Would help a lot.",
      author: "Priya",
      createdAt: daysAgo(3),
    },
    {
      id: "fb_seed_3",
      kind: "review",
      rating: 5,
      message: "The bite-sized knowledge check is genius. Keep it up!",
      author: "Daniel",
      createdAt: daysAgo(5),
    },
  ];
}
