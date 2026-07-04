"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/core/data/store";
import { getCurrentUser } from "@/core/auth/auth";
import { Splash } from "@/components/splash";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";

export default function OnboardingPage() {
  const { ready, state } = useStore();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(Boolean(getCurrentUser()));
  }, []);

  // Logged out → login; already onboarded → home.
  useEffect(() => {
    if (authed === false) router.replace("/login");
    else if (ready && state.onboardingComplete) router.replace("/dashboard");
  }, [authed, ready, state.onboardingComplete, router]);

  if (!authed || !ready || state.onboardingComplete) return <Splash />;
  return <OnboardingFlow />;
}
