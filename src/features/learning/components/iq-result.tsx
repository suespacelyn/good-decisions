"use client";

import { motion } from "motion/react";
import type { FinancialIQ } from "@/core/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { StarRating } from "@/components/ui/star-rating";
import { Penny } from "@/components/penny/penny";
import { IQ_DOMAIN_LABELS, iqHeadline } from "@/features/onboarding/scoring";

const DOMAIN_ORDER = ["budgeting", "insurance", "cpf", "investing", "taxes"] as const;

/** The Financial IQ reveal — score ring + per-domain breakdown. */
export function IqResult({
  name,
  iq,
  onFinish,
  finishLabel = "Done",
}: {
  name: string;
  iq: FinancialIQ;
  onFinish: () => void;
  finishLabel?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
      >
        <Penny mood="celebrate" size={84} />
      </motion.div>

      <h1 className="mt-4 text-2xl font-extrabold">Steady, {name}! 🎉</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s your Financial IQ — we&apos;ll build it up together.
      </p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 160, damping: 14 }}
        className="mt-7"
      >
        <CircularProgress value={iq.overall} size={180} strokeWidth={16}>
          <span className="text-5xl font-black tabular-nums">{iq.overall}</span>
          <span className="text-xs font-bold text-muted-foreground">/ 100</span>
        </CircularProgress>
      </motion.div>

      <p className="mt-3 text-lg font-extrabold text-link">{iqHeadline(iq.overall)}</p>

      <Card className="mt-7 w-full p-5">
        <h3 className="mb-4 text-left text-sm font-extrabold text-muted-foreground">
          YOUR BREAKDOWN
        </h3>
        <ul className="flex flex-col gap-3">
          {DOMAIN_ORDER.map((domain, i) => (
            <motion.li
              key={domain}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="flex items-center justify-between"
            >
              <span className="font-bold">{IQ_DOMAIN_LABELS[domain]}</span>
              <StarRating value={iq.breakdown[domain]} size={18} />
            </motion.li>
          ))}
        </ul>
      </Card>

      <p className="mt-5 text-sm text-muted-foreground">
        Your weaker spots go straight to the top of your roadmap.
      </p>

      <div className="mt-6 w-full">
        <Button size="lg" className="w-full" onClick={onFinish}>
          {finishLabel}
        </Button>
      </div>
    </div>
  );
}
