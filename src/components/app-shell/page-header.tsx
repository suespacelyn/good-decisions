"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CoachButton } from "@/components/penny/coach-button";

/**
 * Standard page header: optional back button + title + subtitle, with an
 * action slot and Coach access. Set `back` on pages that aren't bottom-nav tabs.
 */
export function PageHeader({
  title,
  subtitle,
  action,
  back = false,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  back?: boolean;
}) {
  const router = useRouter();

  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2">
        {back && (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="-ml-1 mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-foreground transition hover:bg-muted active:scale-95"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {action}
        <CoachButton />
      </div>
    </header>
  );
}
