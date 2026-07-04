"use client";

import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { useStore } from "@/core/data/store";

/** Shown while exploring seeded demo data; offers to start a real profile. */
export function DemoBanner() {
  const { state, resetAll } = useStore();
  const router = useRouter();
  if (!state.isDemo) return null;

  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3.5">
      <Info className="size-5 shrink-0 text-link" />
      <p className="flex-1 text-sm font-medium">
        You&apos;re exploring <strong>Jia Hui&apos;s</strong> demo data.
      </p>
      <button
        onClick={() => {
          resetAll();
          router.replace("/onboarding");
        }}
        className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground"
      >
        Start mine
      </button>
    </div>
  );
}
