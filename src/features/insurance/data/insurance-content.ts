/**
 * Insurance education — Singapore-first. Strictly educational: we explain the
 * types of cover and help spot gaps. We never recommend a specific insurer.
 */

export interface InsuranceType {
  id: string;
  name: string;
  emoji: string;
  what: string;
  whoNeeds: string;
  sgContext: string;
  priority: "core" | "important" | "situational";
}

export const INSURANCE_TYPES: InsuranceType[] = [
  {
    id: "hospitalisation",
    name: "Hospitalisation",
    emoji: "🏥",
    what: "Covers large hospital bills so a serious illness doesn't drain your savings.",
    whoNeeds: "Everyone.",
    sgContext:
      "All Singaporeans/PRs have MediShield Life. Many add an Integrated Shield Plan for higher ward classes and private hospitals.",
    priority: "core",
  },
  {
    id: "critical_illness",
    name: "Critical Illness",
    emoji: "🎗️",
    what: "Pays a lump sum on diagnosis of a major illness (e.g. cancer), to cover income loss and treatment.",
    whoNeeds: "Most working adults, especially income earners.",
    sgContext:
      "Often bought as a rider or standalone term plan. Consider enough to cover a few years of expenses during recovery.",
    priority: "important",
  },
  {
    id: "life",
    name: "Life Insurance",
    emoji: "🛡️",
    what: "Pays your dependents a lump sum if you pass away.",
    whoNeeds: "Anyone with dependents (kids, parents, a mortgage).",
    sgContext:
      "Term life is usually the most cost-effective way to get high coverage during your working years. Keep it separate from investing.",
    priority: "important",
  },
  {
    id: "disability_income",
    name: "Disability Income",
    emoji: "♿",
    what: "Replaces part of your income if illness or injury stops you working.",
    whoNeeds: "Anyone who relies on their salary.",
    sgContext:
      "Your ability to earn is often your biggest asset. This protects it. CareShield Life provides a basic payout for severe disability.",
    priority: "situational",
  },
  {
    id: "personal_accident",
    name: "Personal Accident",
    emoji: "🤕",
    what: "Covers medical costs and payouts from accidents.",
    whoNeeds: "Active people, those with physical jobs or hobbies.",
    sgContext:
      "Relatively affordable. Useful top-up cover, but secondary to hospitalisation and income protection.",
    priority: "situational",
  },
];

export const INSURANCE_LESSON_IDS = ["insurance-basics"];
