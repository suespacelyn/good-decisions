"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  emoji?: string;
  title: string;
  description?: string;
  multi?: boolean;
  className?: string;
}

/** Big, tappable choice card used throughout onboarding (Duolingo-style). */
export function OptionCard({
  selected,
  onSelect,
  emoji,
  title,
  description,
  multi = false,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border-2 bg-card p-4 text-left transition-all active:scale-[0.99]",
        selected
          ? "border-primary bg-primary/5 shadow-soft"
          : "border-border hover:border-primary/40",
        className,
      )}
    >
      {emoji && (
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-2xl">
          {emoji}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold leading-tight">{title}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border",
        )}
      >
        {selected && <Check className="size-4" strokeWidth={3} />}
      </span>
    </button>
  );
}
