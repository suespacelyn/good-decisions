import type { AppState } from "@/core/types";
import { createSeedPosts } from "@/features/community/data/seed-posts";
import { DEFAULT_FOLLOWING } from "@/features/community/data/friends";
import { createSeedFeedback } from "@/features/admin/data/seed-feedback";

/**
 * Persistence boundary for the whole app.
 *
 * Today this is backed by localStorage. When we add accounts, a
 * `SupabaseRepository` implements the same interface and the UI layer does not
 * change. Keep this surface small and storage-agnostic.
 */
export interface DataRepository {
  load(): Promise<AppState | null>;
  save(state: AppState): Promise<void>;
  clear(): Promise<void>;
}

export const APP_STATE_VERSION = 5;

/** A blank slate for a brand-new (non-demo) user. */
export function createEmptyState(): AppState {
  const today = new Date().toISOString();
  return {
    version: APP_STATE_VERSION,
    onboardingComplete: false,
    tourSeen: false,
    isDemo: false,
    profile: null,
    snapshot: {
      cashSavings: 0,
      cpf: { ordinaryAccount: 0, specialAccount: 0, medisave: 0 },
      investmentsValue: 0,
      debt: 0,
    },
    bankAccounts: [],
    financialIQ: null,
    transactions: [],
    holdings: [],
    goals: [],
    posts: createSeedPosts(),
    following: [...DEFAULT_FOLLOWING],
    firstUseAt: today,
    reviewPromptDone: false,
    feedback: createSeedFeedback(),
    progress: {
      xp: 0,
      level: 1,
      streakDays: 0,
      lastActiveDate: today,
      completedLessonIds: [],
      earnedBadgeIds: [],
    },
  };
}
