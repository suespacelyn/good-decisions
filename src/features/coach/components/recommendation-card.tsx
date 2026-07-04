"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Recommendation } from "@/features/coach/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LESSON_TITLES } from "@/features/learning/data/lessons";
import { cn } from "@/lib/utils";

const SEVERITY: Record<
  Recommendation["severity"],
  { label: string; badge: "primary" | "positive" | "attention"; ring: string }
> = {
  celebrate: { label: "Great job", badge: "positive", ring: "bg-positive" },
  info: { label: "Suggestion", badge: "primary", ring: "bg-primary" },
  attention: { label: "Worth a look", badge: "attention", ring: "bg-warning" },
};

export function RecommendationCard({
  rec,
  defaultOpen = false,
}: {
  rec: Recommendation;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const sev = SEVERITY[rec.severity];

  return (
    <Card className="overflow-hidden">
      <div className={cn("h-1.5 w-full", sev.ring)} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant={sev.badge} className="mb-2">
              {sev.label}
            </Badge>
            <h3 className="text-lg font-extrabold leading-tight">{rec.title}</h3>
          </div>
          <Sparkles className="size-5 shrink-0 text-link" />
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{rec.summary}</p>

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 flex items-center gap-1 text-sm font-bold text-link"
        >
          {open ? "Show less" : "Why this matters"}
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
                <Section title="Why">
                  <p className="text-sm leading-relaxed text-foreground">
                    {rec.why}
                  </p>
                </Section>

                <Section title="Benefits" icon={<Lightbulb className="size-4 text-positive" />}>
                  <BulletList items={rec.benefits} dotClass="bg-positive" />
                </Section>

                <Section title="Tradeoffs" icon={<ShieldAlert className="size-4 text-warning" />}>
                  <BulletList items={rec.risks} dotClass="bg-warning" />
                </Section>

                <Section title="Other valid paths">
                  <BulletList items={rec.alternatives} dotClass="bg-primary" />
                </Section>

                {rec.learnMore.length > 0 && (
                  <Section title="Learn more">
                    <div className="flex flex-wrap gap-2">
                      {rec.learnMore.map((id) => (
                        <Link
                          key={id}
                          href={`/learn/${id}`}
                          className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground transition hover:brightness-95"
                        >
                          {LESSON_TITLES[id] ?? id}
                        </Link>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, dotClass }: { items: string[]; dotClass: string }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed">
          <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", dotClass)} />
          {item}
        </li>
      ))}
    </ul>
  );
}
