"use client";

import Link from "next/link";
import { useStore } from "@/core/data/store";
import { totalCpf } from "@/core/selectors";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PennySays } from "@/components/penny/penny-says";
import {
  CPF_ACCOUNTS,
  CPF_MILESTONES,
} from "@/features/cpf/data/cpf-content";
import { getLesson } from "@/features/learning/data/lessons";
import { formatSGD } from "@/lib/format";

export default function CpfPage() {
  const { state } = useStore();
  const cpf = state.snapshot.cpf;
  const total = totalCpf(state.snapshot);
  const userAge = state.profile?.age ?? 27;
  const balances = { oa: cpf.ordinaryAccount, sa: cpf.specialAccount, ma: cpf.medisave };
  const lesson = getLesson("cpf-explained");

  return (
    <div>
      <PageHeader back title="CPF" subtitle="Your Singapore retirement system, explained." />

      <div className="mb-5">
        <PennySays mood="thinking">
          CPF always feel like a bit of a black box right? Let&apos;s make it make
          sense — it&apos;s actually a big chunk of your net worth already. 🇸🇬
        </PennySays>
      </div>

      <Card className="mb-5">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-muted-foreground">Total CPF</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums">
            {formatSGD(total)}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {CPF_ACCOUNTS.map((acc) => {
          const value = balances[acc.key];
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <Card key={acc.key}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid size-10 place-items-center rounded-xl text-lg"
                      style={{ backgroundColor: acc.color }}
                    >
                      {acc.emoji}
                    </span>
                    <div>
                      <p className="font-extrabold leading-tight">{acc.name}</p>
                      <p className="text-xs font-semibold text-link">
                        {acc.interest}
                      </p>
                    </div>
                  </div>
                  <p className="font-extrabold tabular-nums">{formatSGD(value)}</p>
                </div>
                <Progress
                  value={pct}
                  className="mt-3 h-2"
                  indicatorClassName="bg-primary"
                />
                <p className="mt-2.5 text-sm text-muted-foreground">{acc.uses}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Age milestones */}
      <h2 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Your CPF journey
      </h2>
      <ol className="relative flex flex-col gap-3 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-0.5 before:bg-border">
        {CPF_MILESTONES.map((m) => {
          const reached = userAge >= m.age;
          return (
            <li key={m.age} className="relative z-10 flex gap-3">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold ${
                  reached
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {m.age}
              </span>
              <Card className="flex-1">
                <CardContent className="p-4">
                  <p className="font-extrabold leading-tight">{m.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.detail}</p>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>

      {lesson && (
        <Link href={`/learn/${lesson.id}`} className="mt-6 block">
          <Card className="transition hover:border-primary/40">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-2xl">{lesson.emoji}</span>
              <div className="flex-1">
                <p className="font-extrabold leading-tight">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">
                  {lesson.minutes} min lesson · {lesson.xp} XP
                </p>
              </div>
              <span className="font-bold text-link">Learn →</span>
            </CardContent>
          </Card>
        </Link>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Educational only. CPF rules and rates change — always check cpf.gov.sg.
      </p>
    </div>
  );
}
