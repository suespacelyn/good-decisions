"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/core/data/store";
import { getCurrentUser } from "@/core/auth/auth";
import { Splash } from "@/components/splash";
import { AppShell } from "@/components/app-shell/app-shell";

/**
 * Guarded shell for the authenticated/onboarded app. Sends logged-out users
 * to the login page and un-onboarded users to the welcome flow.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { ready, state } = useStore();
  const router = useRouter();
  // null = not yet checked (avoids a hydration mismatch on the server pass)
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(Boolean(getCurrentUser()));
  }, []);

  useEffect(() => {
    if (authed === false) router.replace("/login");
    else if (authed && ready && !state.onboardingComplete)
      router.replace("/onboarding");
  }, [authed, ready, state.onboardingComplete, router]);

  if (!authed || !ready || !state.onboardingComplete) return <Splash />;
  return <AppShell>{children}</AppShell>;
}
