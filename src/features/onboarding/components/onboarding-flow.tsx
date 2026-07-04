"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { Input, MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionCard } from "@/components/ui/option-card";
import { Progress } from "@/components/ui/progress";
import { Penny } from "@/components/penny/penny";
import { PennySays } from "@/components/penny/penny-says";
import {
  CONFIDENCE_OPTIONS,
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  RISK_OPTIONS,
} from "@/features/onboarding/data/options";
import {
  draftToProfile,
  draftToSnapshot,
  useOnboardingDraft,
} from "@/features/onboarding/use-onboarding-draft";
import { cn } from "@/lib/utils";

export function OnboardingFlow() {
  const router = useRouter();
  const { completeOnboarding, startDemo } = useStore();
  const { draft, update, toggleGoal } = useOnboardingDraft();
  const [step, setStep] = useState(0); // 0 welcome … 6 confidence … 7 done

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  function complete() {
    completeOnboarding({
      profile: draftToProfile(draft),
      snapshot: draftToSnapshot(draft),
    });
    router.push("/dashboard");
  }

  function tryDemo() {
    startDemo();
    router.push("/dashboard");
  }

  const canContinue = useMemo(() => {
    switch (step) {
      case 1:
        return Number(draft.age) > 0 && draft.occupation.trim().length > 0;
      case 4:
        return draft.selectedGoals.length > 0;
      case 5:
        return !!draft.riskAppetite;
      case 6:
        return !!draft.confidence;
      default:
        return true;
    }
  }, [step, draft]);

  const showProgress = step >= 1 && step <= 6;
  const progressValue = (Math.min(step, 6) / 6) * 100;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      {/* Header */}
      <div className="flex h-10 items-center justify-between">
        {step > 0 && step < 7 ? (
          <button
            onClick={back}
            className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
        ) : (
          <span className="size-9" />
        )}
        {showProgress ? (
          <Progress value={progressValue} className="mx-3 h-2.5 flex-1" />
        ) : (
          <span className="flex-1" />
        )}
        <span className="size-9" />
      </div>

      {/* Step body */}
      <div className="flex flex-1 flex-col pt-4">
        {/* Plain keyed div — motion entrance animations freeze mid-tween here,
            leaving the step stuck translated (causes horizontal overflow). */}
        <div key={step} className="flex flex-1 flex-col">
            {step === 0 && (
              <WelcomeStep
                name={draft.name}
                onName={(name) => update({ name })}
                onStart={next}
                onDemo={tryDemo}
              />
            )}

            {step === 1 && (
              <StepScaffold
                title="A little about you"
                subtitle="This helps Penny tailor your roadmap."
              >
                <Field label="Age">
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="27"
                    value={draft.age}
                    onChange={(e) => update({ age: e.target.value })}
                  />
                </Field>
                <Field label="Gender (optional)">
                  <div className="grid grid-cols-2 gap-2">
                    {GENDER_OPTIONS.map((g) => (
                      <OptionCard
                        key={g.value}
                        title={g.label}
                        selected={draft.gender === g.value}
                        onSelect={() => update({ gender: g.value })}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="Occupation">
                  <Input
                    placeholder="e.g. Marketing Executive"
                    value={draft.occupation}
                    onChange={(e) => update({ occupation: e.target.value })}
                  />
                </Field>
              </StepScaffold>
            )}

            {step === 2 && (
              <StepScaffold
                title="What comes in?"
                subtitle="Pay changes every month? No stress — just put your usual take-home. You can update it anytime."
              >
                <Field label="Usual monthly take-home">
                  <MoneyInput
                    value={draft.monthlySalary || ""}
                    onValueChange={(v) => update({ monthlySalary: v })}
                    placeholder="4,500"
                  />
                </Field>
                <Field label="Annual bonus (optional)">
                  <MoneyInput
                    value={draft.annualBonus || ""}
                    onValueChange={(v) => update({ annualBonus: v })}
                    placeholder="9,000"
                  />
                </Field>
                <Field label="Other income — allowances, side gigs (optional)">
                  <MoneyInput
                    value={draft.otherMonthlyIncome || ""}
                    onValueChange={(v) => update({ otherMonthlyIncome: v })}
                    placeholder="0"
                  />
                </Field>
              </StepScaffold>
            )}

            {step === 3 && (
              <StepScaffold
                title="Where are you today?"
                subtitle="A rough snapshot of what you have and owe."
              >
                <Field label="Cash savings">
                  <MoneyInput
                    value={draft.cashSavings || ""}
                    onValueChange={(v) => update({ cashSavings: v })}
                    placeholder="18,000"
                  />
                </Field>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="CPF OA">
                    <MoneyInput
                      value={draft.oa || ""}
                      onValueChange={(v) => update({ oa: v })}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="CPF SA">
                    <MoneyInput
                      value={draft.sa || ""}
                      onValueChange={(v) => update({ sa: v })}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="MediSave">
                    <MoneyInput
                      value={draft.ma || ""}
                      onValueChange={(v) => update({ ma: v })}
                      placeholder="0"
                    />
                  </Field>
                </div>
                <Field label="Investments">
                  <MoneyInput
                    value={draft.investmentsValue || ""}
                    onValueChange={(v) => update({ investmentsValue: v })}
                    placeholder="0"
                  />
                </Field>
                <Field label="Debt (cards, loans)">
                  <MoneyInput
                    value={draft.debt || ""}
                    onValueChange={(v) => update({ debt: v })}
                    placeholder="0"
                  />
                </Field>
              </StepScaffold>
            )}

            {step === 4 && (
              <StepScaffold
                title="What are you working toward?"
                subtitle="Pick all that apply — Penny will help you plan for them."
              >
                <div className="grid gap-2.5">
                  {GOAL_OPTIONS.map((g) => (
                    <OptionCard
                      key={g.value}
                      multi
                      emoji={g.emoji}
                      title={g.label}
                      selected={draft.selectedGoals.includes(g.value)}
                      onSelect={() => toggleGoal(g.value)}
                    />
                  ))}
                </div>
              </StepScaffold>
            )}

            {step === 5 && (
              <StepScaffold
                title="How do you feel about risk?"
                subtitle="There's no wrong answer — it shapes what we teach, not what we sell."
              >
                <div className="grid gap-2.5">
                  {RISK_OPTIONS.map((r) => (
                    <OptionCard
                      key={r.value}
                      emoji={r.emoji}
                      title={r.label}
                      description={r.description}
                      selected={draft.riskAppetite === r.value}
                      onSelect={() => update({ riskAppetite: r.value })}
                    />
                  ))}
                </div>
              </StepScaffold>
            )}

            {step === 6 && (
              <StepScaffold
                title="How confident are you with money?"
                subtitle="Be honest — it sets your starting point."
              >
                <div className="grid gap-2.5">
                  {CONFIDENCE_OPTIONS.map((c) => (
                    <OptionCard
                      key={c.value}
                      emoji={c.emoji}
                      title={c.label}
                      description={c.description}
                      selected={draft.confidence === c.value}
                      onSelect={() => update({ confidence: c.value })}
                    />
                  ))}
                </div>
              </StepScaffold>
            )}

            {step === 7 && (
              <DoneStep
                name={draft.name.trim() || "Friend"}
                onFinish={complete}
              />
            )}
        </div>
      </div>

      {/* Shared footer for form steps (1–6) */}
      {step >= 1 && step <= 6 && (
        <div className="pt-4">
          <Button
            size="lg"
            className="w-full"
            disabled={!canContinue}
            onClick={next}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── small building blocks ───────────────────────────────────────────

function StepScaffold({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      )}
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5")}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function WelcomeStep({
  name,
  onName,
  onStart,
  onDemo,
}: {
  name: string;
  onName: (v: string) => void;
  onStart: () => void;
  onDemo: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-8">
        <PennySays mood="wave" size={96}>
          Hi, I&apos;m <strong>Penny</strong> 👋 Think of me as your money kaki.
          We&apos;ll sort out your finances together — slowly slowly, no stress.
        </PennySays>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">What should I call you?</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => onName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) onStart();
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6">
        <Button
          size="lg"
          className="w-full"
          disabled={!name.trim()}
          onClick={onStart}
        >
          Let&apos;s go
        </Button>
        <Button variant="ghost" className="w-full" onClick={onDemo}>
          Just exploring? Try with demo data
        </Button>
        <Link
          href="/admin"
          className="mt-1 text-center text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

function DoneStep({
  name,
  onFinish,
}: {
  name: string;
  onFinish: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {/* No entrance animation — motion tweens freeze mid-fade here and can
            leave Penny stuck invisible. */}
        <Penny mood="celebrate" size={104} />
        <h1 className="mt-5 text-2xl font-extrabold">
          All set, {name}! 🎉
        </h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Your dashboard is ready to go. We&apos;ll pick things up as we go
          along — no boring quiz to sit through, promise.
        </p>
      </div>

      <div className="pt-6">
        <Button size="lg" className="w-full" onClick={onFinish}>
          Go to my dashboard
        </Button>
      </div>
    </div>
  );
}
