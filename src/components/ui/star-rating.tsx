import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only 0–5 star rating used in the Financial IQ breakdown. */
export function StarRating({
  value,
  max = 5,
  className,
  size = 16,
}: {
  value: number;
  max?: number;
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={cn(
            i < value
              ? "fill-warning text-warning"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  );
}
