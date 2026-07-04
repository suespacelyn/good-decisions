import type { Post } from "@/core/types";

function hoursAgo(n: number): string {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

/**
 * Seed community feed — friends sharing good finance tips and links. Fresh
 * objects each call so the immutable store never mutates a shared reference.
 */
export function createSeedPosts(): Post[] {
  return [
    {
      id: "post_seed_0",
      author: "Mei",
      isMe: false,
      avatarColor: "var(--color-pastel-lavender)",
      content:
        "Just hit 6 months of emergency fund 🎉 Automating $500 on payday before I could spend it was the whole trick. Highly recommend.",
      likes: 14,
      likedByMe: false,
      comments: [
        {
          id: "c_seed_0",
          author: "Daniel",
          text: "Congrats! What account are you keeping it in?",
          createdAt: hoursAgo(3),
        },
      ],
      createdAt: hoursAgo(5),
    },
    {
      id: "post_seed_1",
      author: "Wei",
      isMe: false,
      avatarColor: "var(--color-pastel-sky)",
      content:
        "TIL the latest 6-month T-bill cut-off yield is ~3.7%. Parked some idle cash there instead of letting it sit in the bank 😎",
      link: "https://www.mas.gov.sg/bonds-and-bills",
      likes: 9,
      likedByMe: false,
      comments: [],
      createdAt: hoursAgo(20),
    },
    {
      id: "post_seed_2",
      author: "Priya",
      isMe: false,
      avatarColor: "var(--color-pastel-peach)",
      content:
        "Friendly reminder: pay your credit card in FULL every month. The minimum payment is a ~25% interest trap 😬",
      likes: 23,
      likedByMe: true,
      comments: [
        {
          id: "c_seed_1",
          author: "Mei",
          text: "Set up GIRO autopay for full amount and never think about it again 🙌",
          createdAt: hoursAgo(26),
        },
      ],
      createdAt: hoursAgo(28),
    },
    {
      id: "post_seed_3",
      author: "Daniel",
      isMe: false,
      avatarColor: "var(--color-pastel-mint)",
      content:
        "Doing my CPF SA top-up before year end for the tax relief. Anyone else? Trying to figure out the right amount.",
      likes: 7,
      likedByMe: false,
      comments: [],
      createdAt: hoursAgo(40),
    },
  ];
}
