"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{ value: string; label: string; icon: LucideIcon }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

/** Light / Dark / System theme picker — lives under Profile → Settings. */
export function ThemeSetting() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? theme ?? "light" : "light";

  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        const active = current === o.value;
        return (
          <button
            key={o.value}
            onClick={() => setTheme(o.value)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg py-2.5 text-xs font-bold transition-colors",
              active
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
