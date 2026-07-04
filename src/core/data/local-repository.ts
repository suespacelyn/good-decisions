import type { AppState } from "@/core/types";
import {
  APP_STATE_VERSION,
  type DataRepository,
} from "@/core/data/repository";
import { makeId } from "@/lib/id";
import { createSeedPosts } from "@/features/community/data/seed-posts";
import { DEFAULT_FOLLOWING } from "@/features/community/data/friends";
import { createSeedFeedback } from "@/features/admin/data/seed-feedback";
import { getCurrentUser } from "@/core/auth/auth";

const LEGACY_KEY = "fff:app-state";

/**
 * Each logged-in user gets their own state bucket, so friends sharing a
 * device don't see each other's finances. Pre-login (or legacy) state uses
 * the old un-scoped key.
 */
function storageKey(): string {
  const user = getCurrentUser();
  return user ? `${LEGACY_KEY}:${user}` : LEGACY_KEY;
}

/**
 * localStorage-backed repository. Safe to instantiate on the server (every
 * method guards on `window`) — the provider only calls it in the browser.
 */
export class LocalStorageRepository implements DataRepository {
  async load(): Promise<AppState | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AppState;
      return migrate(parsed);
    } catch {
      // Corrupt payload — treat as a fresh install rather than crashing.
      return null;
    }
  }

  async save(state: AppState): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey(), JSON.stringify(state));
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(storageKey());
  }
}

/** Forward-compatible migration hook. Bump APP_STATE_VERSION when shape changes. */
function migrate(state: AppState): AppState {
  let s = state;

  // v2: introduce bank accounts. Seed a default account from existing cash.
  if (!Array.isArray(s.bankAccounts)) {
    const cash = s.snapshot?.cashSavings ?? 0;
    s = {
      ...s,
      bankAccounts:
        cash > 0
          ? [{ id: makeId("bank"), name: "Main account", balance: cash }]
          : [],
    };
  }

  // v3: first-run mascot tour flag. Existing users have already seen the app,
  // so treat them as if the tour is done.
  if (typeof s.tourSeen !== "boolean") {
    s = { ...s, tourSeen: true };
  }

  // v4: community feed. Seed it for existing users so they have something to see.
  if (!Array.isArray(s.posts)) {
    s = { ...s, posts: createSeedPosts() };
  }

  // v5: social following, review-prompt timing, and feedback collection.
  if (!Array.isArray(s.following)) {
    s = { ...s, following: [...DEFAULT_FOLLOWING] };
  }
  if (typeof s.firstUseAt !== "string") {
    s = { ...s, firstUseAt: new Date().toISOString() };
  }
  if (typeof s.reviewPromptDone !== "boolean") {
    s = { ...s, reviewPromptDone: false };
  }
  if (!Array.isArray(s.feedback)) {
    s = { ...s, feedback: createSeedFeedback() };
  }

  if (s.version !== APP_STATE_VERSION) s = { ...s, version: APP_STATE_VERSION };
  return s;
}
