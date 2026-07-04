"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/core/data/store";
import { getCurrentUser } from "@/core/auth/auth";
import { Splash } from "@/components/splash";

/**
 * Entry gateway. Once persisted state hydrates, route the user:
 * logged out → login, onboarded → dashboard, otherwise → onboarding.
 * Client-side because all state lives in the browser (local-first).
 */
export default function Home() {
  const { ready, state } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!getCurrentUser()) {
      router.replace("/login");
      return;
    }
    router.replace(state.onboardingComplete ? "/dashboard" : "/onboarding");
  }, [ready, state.onboardingComplete, router]);

  return <Splash />;
}
