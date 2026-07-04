"use client";

import Link from "next/link";
import {
  Plus,
  TrendingUp,
  Target,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

const ACTIONS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/expenses", label: "Add money", icon: Plus },
  { href: "/investments", label: "Invest", icon: TrendingUp },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/learn", label: "Learn", icon: GraduationCap },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {ACTIONS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-2 rounded-xl py-1 text-center"
        >
          <span className="grid size-12 place-items-center rounded-xl bg-secondary text-link transition active:scale-95">
            <Icon className="size-5" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
