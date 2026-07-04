/** CPF educational content — data-driven, Singapore-first. */

export interface CpfAccountInfo {
  key: "oa" | "sa" | "ma";
  name: string;
  short: string;
  emoji: string;
  interest: string;
  uses: string;
  color: string;
}

export const CPF_ACCOUNTS: CpfAccountInfo[] = [
  {
    key: "oa",
    name: "Ordinary Account",
    short: "OA",
    emoji: "🏠",
    interest: "Up to 3.5% p.a.",
    uses: "Housing (BTO/HDB), approved investments, insurance and education.",
    color: "var(--color-pastel-sky)",
  },
  {
    key: "sa",
    name: "Special Account",
    short: "SA",
    emoji: "🌱",
    interest: "Up to 5% p.a.",
    uses: "Retirement savings — higher interest, harder to touch before 55.",
    color: "var(--color-pastel-mint)",
  },
  {
    key: "ma",
    name: "MediSave",
    short: "MA",
    emoji: "🩺",
    interest: "Up to 5% p.a.",
    uses: "Healthcare, hospitalisation and approved medical insurance premiums.",
    color: "var(--color-pastel-coral)",
  },
];

export interface CpfMilestone {
  age: number;
  title: string;
  detail: string;
}

export const CPF_MILESTONES: CpfMilestone[] = [
  {
    age: 25,
    title: "Build the habit",
    detail:
      "Your employer + you contribute ~37% of salary. Understand where it goes — it's already part of your wealth.",
  },
  {
    age: 30,
    title: "Housing decisions",
    detail:
      "OA often funds a BTO downpayment and monthly loan. Learn the trade-off: using OA means less compounding for retirement.",
  },
  {
    age: 35,
    title: "Consider top-ups",
    detail:
      "Voluntary SA/RA top-ups earn high guaranteed interest and tax relief — powerful if your emergency fund and debt are handled.",
  },
  {
    age: 55,
    title: "Retirement Account forms",
    detail:
      "SA + OA combine into your Retirement Account, setting up CPF LIFE — your lifelong monthly payout in retirement.",
  },
  {
    age: 65,
    title: "CPF LIFE payouts",
    detail:
      "CPF LIFE begins paying you a monthly income for life, based on your Retirement Account balance.",
  },
];

export const CPF_LESSON_IDS = ["cpf-explained"];
