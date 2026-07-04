import * as React from "react";
import { cn } from "@/lib/utils";
import { clamp } from "@/lib/format";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100 */
  value: number;
  indicatorClassName?: string;
}

/** Rounded, chunky progress bar. */
export function Progress({
  value,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const pct = clamp(value, 0, 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-3 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-[width] duration-500 ease-out",
          indicatorClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
