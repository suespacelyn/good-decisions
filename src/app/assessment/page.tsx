"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/core/data/store";
import { Splash } from "@/components/splash";
import { KnowledgeCheck } from "@/features/learning/components/knowledge-check";

/**
 * The Financial IQ knowledge check — a focused, full-screen flow (no app shell),
 * reached from Learn / the investing section. Bite-sized rounds by topic.
 */
export default function AssessmentPage() {
  const { ready, state } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !state.onboardingComplete) router.replace("/onboarding");
  }, [ready, state.onboardingComplete, router]);

  if (!ready || !state.onboardingComplete) return <Splash />;
  return <KnowledgeCheck onExit={() => router.push("/learn")} />;
}
