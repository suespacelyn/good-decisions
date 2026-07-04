"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AppState,
  BankAccount,
  FinancialIQ,
  FinancialSnapshot,
  Goal,
  Holding,
  Transaction,
  UserProfile,
} from "@/core/types";
import {
  createEmptyState,
  type DataRepository,
} from "@/core/data/repository";
import { LocalStorageRepository } from "@/core/data/local-repository";
import { createDemoState } from "@/core/data/seed";
import { makeId } from "@/lib/id";

interface StoreValue {
  /** True once we've attempted to load persisted state (avoids UI flash). */
  ready: boolean;
  state: AppState;

  // Lifecycle
  startDemo: () => void;
  startFresh: () => void;
  completeOnboarding: (input: {
    profile: UserProfile;
    snapshot: FinancialSnapshot;
  }) => void;
  resetAll: () => void;
  /** Set the Financial IQ result once the knowledge check is taken (in Learn). */
  setFinancialIQ: (iq: FinancialIQ) => void;
  /** Mark the first-run mascot tour as seen. */
  markTourSeen: () => void;

  // Snapshot
  updateSnapshot: (patch: Partial<FinancialSnapshot>) => void;

  // Bank / cash accounts (cash = sum of these)
  addBankAccount: (input: Omit<BankAccount, "id">) => void;
  updateBankAccount: (id: string, patch: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;

  // Transactions
  addTransaction: (input: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Holdings
  addHolding: (input: Omit<Holding, "id">) => void;
  updateHolding: (id: string, patch: Partial<Holding>) => void;
  deleteHolding: (id: string) => void;

  // Goals
  addGoal: (input: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;

  // Gamification
  awardXp: (amount: number) => void;
  completeLesson: (lessonId: string, xp: number) => void;

  // Community feed
  addPost: (input: { content: string; link?: string }) => void;
  toggleLikePost: (id: string) => void;
  addComment: (postId: string, text: string) => void;

  // Social
  toggleFollow: (name: string) => void;

  // Feedback + reviews
  submitFeedback: (input: {
    kind: "review" | "feedback";
    rating?: number;
    message: string;
    author?: string;
  }) => void;
  markReviewDone: () => void;

  // Admin access (local prototype)
  isAdmin: boolean;
  loginAsAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
}

// Hardcoded admin credentials for the local prototype portal.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "gooddecisions25";
const ADMIN_KEY = "fff:admin";

const StoreContext = createContext<StoreValue | null>(null);

const repository: DataRepository = new LocalStorageRepository();

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(createEmptyState);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const hydrated = useRef(false);

  // Load persisted state once on mount.
  useEffect(() => {
    let active = true;
    repository.load().then((loaded) => {
      if (!active) return;
      if (loaded) setState(loaded);
      hydrated.current = true;
      setReady(true);
    });
    if (typeof window !== "undefined") {
      setIsAdmin(window.localStorage.getItem(ADMIN_KEY) === "true");
    }
    return () => {
      active = false;
    };
  }, []);

  // Persist on every change — but only after hydration, so we never clobber
  // stored data with the initial empty state during the first render.
  useEffect(() => {
    if (!hydrated.current) return;
    void repository.save(state);
  }, [state]);

  // Generic immutable updater that keeps the streak fresh on interaction.
  const mutate = useCallback((fn: (prev: AppState) => AppState) => {
    setState((prev) => fn(prev));
  }, []);

  const value = useMemo<StoreValue>(() => {
    return {
      ready,
      state,

      startDemo: () => {
        hydrated.current = true;
        setState(createDemoState());
      },
      startFresh: () => {
        hydrated.current = true;
        setState({ ...createEmptyState(), onboardingComplete: false });
      },
      completeOnboarding: ({ profile, snapshot }) =>
        mutate((prev) => ({
          ...prev,
          onboardingComplete: true,
          tourSeen: false, // trigger the first-run mascot tour
          isDemo: false,
          profile,
          snapshot: { ...snapshot, investmentsValue: snapshot.investmentsValue },
          bankAccounts:
            snapshot.cashSavings > 0
              ? [
                  {
                    id: makeId("bank"),
                    name: "Main account",
                    balance: snapshot.cashSavings,
                  },
                ]
              : [],
          progress: {
            ...prev.progress,
            xp: prev.progress.xp + 50,
            earnedBadgeIds: addUnique(
              prev.progress.earnedBadgeIds,
              "onboarded",
            ),
          },
        })),
      resetAll: () => {
        void repository.clear();
        hydrated.current = true;
        setState({ ...createEmptyState() });
      },
      setFinancialIQ: (iq) =>
        mutate((prev) => ({
          ...prev,
          financialIQ: iq,
          progress: {
            ...prev.progress,
            xp: prev.progress.xp + 30,
            earnedBadgeIds: addUnique(
              prev.progress.earnedBadgeIds,
              "iq-checked",
            ),
          },
        })),
      markTourSeen: () =>
        mutate((prev) => ({ ...prev, tourSeen: true })),

      updateSnapshot: (patch) =>
        mutate((prev) => ({
          ...prev,
          snapshot: { ...prev.snapshot, ...patch },
        })),

      addBankAccount: (input) =>
        mutate((prev) =>
          withSyncedCash(prev, [
            ...prev.bankAccounts,
            { ...input, id: makeId("bank") },
          ]),
        ),
      updateBankAccount: (id, patch) =>
        mutate((prev) =>
          withSyncedCash(
            prev,
            prev.bankAccounts.map((b) =>
              b.id === id ? { ...b, ...patch } : b,
            ),
          ),
        ),
      deleteBankAccount: (id) =>
        mutate((prev) =>
          withSyncedCash(
            prev,
            prev.bankAccounts.filter((b) => b.id !== id),
          ),
        ),

      addTransaction: (input) =>
        mutate((prev) => ({
          ...prev,
          transactions: [
            { ...input, id: makeId("tx") },
            ...prev.transactions,
          ],
        })),
      updateTransaction: (id, patch) =>
        mutate((prev) => ({
          ...prev,
          transactions: prev.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        })),
      deleteTransaction: (id) =>
        mutate((prev) => ({
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== id),
        })),

      addHolding: (input) =>
        mutate((prev) => {
          const holdings = [{ ...input, id: makeId("h") }, ...prev.holdings];
          return {
            ...prev,
            holdings,
            snapshot: {
              ...prev.snapshot,
              investmentsValue: sumValue(holdings),
            },
          };
        }),
      updateHolding: (id, patch) =>
        mutate((prev) => {
          const holdings = prev.holdings.map((h) =>
            h.id === id ? { ...h, ...patch } : h,
          );
          return {
            ...prev,
            holdings,
            snapshot: {
              ...prev.snapshot,
              investmentsValue: sumValue(holdings),
            },
          };
        }),
      deleteHolding: (id) =>
        mutate((prev) => {
          const holdings = prev.holdings.filter((h) => h.id !== id);
          return {
            ...prev,
            holdings,
            snapshot: {
              ...prev.snapshot,
              investmentsValue: sumValue(holdings),
            },
          };
        }),

      addGoal: (input) =>
        mutate((prev) => ({
          ...prev,
          goals: [...prev.goals, { ...input, id: makeId("g") }],
        })),
      updateGoal: (id, patch) =>
        mutate((prev) => ({
          ...prev,
          goals: prev.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),
      deleteGoal: (id) =>
        mutate((prev) => ({
          ...prev,
          goals: prev.goals.filter((g) => g.id !== id),
        })),
      contributeToGoal: (id, amount) =>
        mutate((prev) => ({
          ...prev,
          goals: prev.goals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  currentAmount: Math.min(
                    g.targetAmount,
                    g.currentAmount + amount,
                  ),
                }
              : g,
          ),
        })),

      awardXp: (amount) =>
        mutate((prev) => {
          const xp = prev.progress.xp + amount;
          return {
            ...prev,
            progress: { ...prev.progress, xp, level: levelForXp(xp) },
          };
        }),
      addPost: ({ content, link }) =>
        mutate((prev) => ({
          ...prev,
          posts: [
            {
              id: makeId("post"),
              author: prev.profile?.name?.split(" ")[0] ?? "You",
              isMe: true,
              avatarColor: "var(--color-pastel-rose)",
              content: content.trim(),
              link: link?.trim() || undefined,
              likes: 0,
              likedByMe: false,
              comments: [],
              createdAt: new Date().toISOString(),
            },
            ...prev.posts,
          ],
        })),
      toggleLikePost: (id) =>
        mutate((prev) => ({
          ...prev,
          posts: prev.posts.map((p) =>
            p.id === id
              ? {
                  ...p,
                  likedByMe: !p.likedByMe,
                  likes: p.likes + (p.likedByMe ? -1 : 1),
                }
              : p,
          ),
        })),
      addComment: (postId, text) =>
        mutate((prev) => ({
          ...prev,
          posts: prev.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [
                    ...p.comments,
                    {
                      id: makeId("c"),
                      author: prev.profile?.name?.split(" ")[0] ?? "You",
                      text: text.trim(),
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : p,
          ),
        })),

      completeLesson: (lessonId, xp) =>
        mutate((prev) => {
          if (prev.progress.completedLessonIds.includes(lessonId)) return prev;
          const totalXp = prev.progress.xp + xp;
          return {
            ...prev,
            progress: {
              ...prev.progress,
              xp: totalXp,
              level: levelForXp(totalXp),
              completedLessonIds: [
                ...prev.progress.completedLessonIds,
                lessonId,
              ],
              earnedBadgeIds: addUnique(
                prev.progress.earnedBadgeIds,
                "first-lesson",
              ),
            },
          };
        }),

      toggleFollow: (name) =>
        mutate((prev) => ({
          ...prev,
          following: prev.following.includes(name)
            ? prev.following.filter((n) => n !== name)
            : [...prev.following, name],
        })),

      submitFeedback: ({ kind, rating, message, author }) =>
        mutate((prev) => ({
          ...prev,
          feedback: [
            {
              id: makeId("fb"),
              kind,
              rating,
              message: message.trim(),
              author: author?.trim() || prev.profile?.name || "Anonymous",
              createdAt: new Date().toISOString(),
            },
            ...prev.feedback,
          ],
        })),
      markReviewDone: () =>
        mutate((prev) => ({ ...prev, reviewPromptDone: true })),

      isAdmin,
      loginAsAdmin: (username, password) => {
        const ok =
          username.trim().toLowerCase() === ADMIN_USERNAME &&
          password === ADMIN_PASSWORD;
        if (ok) {
          setIsAdmin(true);
          if (typeof window !== "undefined")
            window.localStorage.setItem(ADMIN_KEY, "true");
        }
        return ok;
      },
      logoutAdmin: () => {
        setIsAdmin(false);
        if (typeof window !== "undefined")
          window.localStorage.removeItem(ADMIN_KEY);
      },
    };
  }, [ready, state, mutate, isAdmin]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}

// ─── helpers ─────────────────────────────────────────────────────────

function sumValue(holdings: Holding[]): number {
  return holdings.reduce((s, h) => s + h.currentValue, 0);
}

/** Replace bank accounts and keep `snapshot.cashSavings` in sync with their sum. */
function withSyncedCash(prev: AppState, bankAccounts: BankAccount[]): AppState {
  const cashSavings = bankAccounts.reduce((s, b) => s + b.balance, 0);
  return {
    ...prev,
    bankAccounts,
    snapshot: { ...prev.snapshot, cashSavings },
  };
}

function addUnique(list: string[], item: string): string[] {
  return list.includes(item) ? list : [...list, item];
}

function levelForXp(xp: number): number {
  // Gentle curve: 150 XP per level.
  return Math.max(1, Math.floor(xp / 150) + 1);
}
