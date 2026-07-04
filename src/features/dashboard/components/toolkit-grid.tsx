"use client";

import Link from "next/link";
import {
  Target,
  Landmark,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const TOOLS: Array<{
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
}> = [
  { href: "/goals", label: "Goals", desc: "Plan & track", icon: Target, tint: "var(--color-pastel-lavender)" },
  { href: "/cpf", label: "CPF", desc: "OA · SA · MA", icon: Landmark, tint: "var(--color-pastel-sky)" },
  { href: "/insurance", label: "Insurance", desc: "Spot gaps", icon: ShieldCheck, tint: "var(--color-pastel-mint)" },
  { href: "/credit-cards", label: "Cards", desc: "Match strategy", icon: CreditCard, tint: "var(--color-pastel-coral)" },
];

export function ToolkitGrid() {
  return (
    <section>
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Your toolkit
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {TOOLS.map(({ href, label, desc, icon: Icon, tint }) => (
          <Link key={href} href={href}>
            <Card className="flex h-full items-center gap-3 p-3.5 transition hover:border-primary/40">
              <span
                className="grid size-10 shrink-0 place-items-center rounded-xl"
                style={{ backgroundColor: tint }}
              >
                <Icon className="size-5 text-ink" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-tight">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
