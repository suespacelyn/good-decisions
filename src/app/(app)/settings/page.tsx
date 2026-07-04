"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useStore } from "@/core/data/store";
import { getCurrentUser, logout } from "@/core/auth/auth";
import { ChangePasswordDialog } from "@/features/auth/components/change-password-dialog";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeSetting } from "@/features/profile/components/theme-setting";
import { FeedbackForm } from "@/features/feedback/components/feedback-form";
import {
  CONFIDENCE_OPTIONS,
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  RISK_OPTIONS,
} from "@/features/onboarding/data/options";
import { formatSGD } from "@/lib/format";

export default function SettingsPage() {
  const { state, resetAll } = useStore();
  const router = useRouter();
  const p = state.profile;
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getCurrentUser());
  }, []);

  function clearAll() {
    resetAll();
    router.replace("/onboarding");
  }

  function logOut() {
    logout();
    // Full navigation so the store drops this user's in-memory state.
    window.location.assign("/login");
  }

  const genderLabel = GENDER_OPTIONS.find((g) => g.value === p?.gender)?.label;
  const riskLabel = RISK_OPTIONS.find((r) => r.value === p?.riskAppetite)?.label;
  const confLabel = CONFIDENCE_OPTIONS.find(
    (c) => c.value === p?.confidence,
  )?.label;
  const goals = (p?.selectedGoals ?? [])
    .map((g) => GOAL_OPTIONS.find((o) => o.value === g))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader back title="Settings" />

      <Section title="Account">
        <Row label="Logged in as" value={username ? "@" + username : "—"} />
        <p className="text-sm text-muted-foreground">
          Your password works on this device. Change it to something only you
          know, ok?
        </p>
        <ChangePasswordDialog />
        <Button variant="outline" className="w-full" onClick={logOut}>
          <LogOut /> Log out
        </Button>
      </Section>

      {p && (
        <>
          <Section title="About you">
            <Row label="Age" value={p.age ? String(p.age) : "—"} />
            <Row label="Gender" value={genderLabel ?? "Not specified"} />
            <Row label="Occupation" value={p.occupation || "—"} />
          </Section>

          <Section title="Income">
            <Row label="Monthly salary" value={formatSGD(p.monthlySalary)} />
            <Row label="Annual bonus" value={formatSGD(p.annualBonus)} />
            <Row
              label="Other monthly income"
              value={formatSGD(p.otherMonthlyIncome)}
            />
          </Section>

          <Section title="Money preferences">
            <Row label="Risk appetite" value={riskLabel ?? "—"} />
            <Row label="Confidence" value={confLabel ?? "—"} />
            <div className="pt-1">
              <p className="mb-2 text-sm text-muted-foreground">Goals</p>
              <div className="flex flex-wrap gap-2">
                {goals.length === 0 ? (
                  <span className="text-sm text-muted-foreground">None yet</span>
                ) : (
                  goals.map((g) => (
                    <span
                      key={g!.value}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-bold text-secondary-foreground"
                    >
                      <span>{g!.emoji}</span>
                      {g!.label}
                    </span>
                  ))
                )}
              </div>
            </div>
          </Section>
        </>
      )}

      <Section title="Send feedback">
        <FeedbackForm />
      </Section>

      <Section title="Appearance">
        <p className="mb-2 text-sm font-bold">Theme</p>
        <ThemeSetting />
      </Section>

      <Section title="Data">
        <p className="text-sm text-muted-foreground">
          Your data lives only on this device. Clearing it removes your profile,
          finances and posts, and starts you fresh.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-1 w-full">
              Clear all data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Clear all data?</DialogTitle>
              <DialogDescription>
                This permanently removes everything on this device and can&apos;t
                be undone. You&apos;ll be taken back to onboarding.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Button variant="destructive" onClick={clearAll}>
                Yes, clear everything
              </Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </Section>

      <p className="px-1 pb-2 text-center text-xs text-muted-foreground">
        Good Decisions · educational guidance only, not financial advice.
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <Card>
        <CardContent className="flex flex-col gap-2 p-5">{children}</CardContent>
      </Card>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
