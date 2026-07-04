/** Mock friends for the social layer (local-first; a real backend would supply these). */
export interface Friend {
  name: string;
  handle: string;
  avatarColor: string;
  /** Mock follower count for display. */
  followers: number;
  /** Current friend-streak length (days), Duolingo-style. */
  streak: number;
}

export const FRIENDS: Friend[] = [
  { name: "Mei", handle: "@meilearns", avatarColor: "var(--color-pastel-lavender)", followers: 42, streak: 21 },
  { name: "Wei", handle: "@weimoney", avatarColor: "var(--color-pastel-sky)", followers: 28, streak: 8 },
  { name: "Priya", handle: "@priyasaves", avatarColor: "var(--color-pastel-peach)", followers: 63, streak: 45 },
  { name: "Daniel", handle: "@danthrifty", avatarColor: "var(--color-pastel-mint)", followers: 19, streak: 5 },
  { name: "Bea", handle: "@beainvests", avatarColor: "var(--color-pastel-coral)", followers: 37, streak: 12 },
];

/** Friends the user follows by default in the demo. */
export const DEFAULT_FOLLOWING = ["Mei", "Priya", "Wei"];

/** Mock follower count for the current user. */
export const MY_FOLLOWERS = 24;
