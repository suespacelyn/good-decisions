import { cn } from "@/lib/utils";

export type PennyMood =
  | "happy"
  | "wave"
  | "celebrate"
  | "thinking"
  | "encouraging";

/**
 * Penny — the companion mascot. A friendly rounded coin-person in pastel
 * lavender. Minimal vector, rounded shapes, warm expressions. Never frowns.
 */
export function Penny({
  mood = "happy",
  size = 96,
  className,
}: {
  mood?: PennyMood;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label="Penny, your finance companion"
      className={cn("select-none", className)}
    >
      {/* Body / coin */}
      <circle cx="60" cy="62" r="42" className="fill-pastel-sky" />
      <circle
        cx="60"
        cy="62"
        r="42"
        className="stroke-primary/30"
        strokeWidth="3"
        fill="none"
      />
      {/* Inner coin ring with a subtle $ */}
      <circle
        cx="60"
        cy="62"
        r="32"
        className="stroke-primary/20"
        strokeWidth="2"
        strokeDasharray="3 4"
        fill="none"
      />

      {/* Cheeks */}
      <circle cx="42" cy="68" r="6" className="fill-pastel-rose opacity-70" />
      <circle cx="78" cy="68" r="6" className="fill-pastel-rose opacity-70" />

      {/* Eyes */}
      {mood === "thinking" ? (
        <>
          <circle cx="48" cy="56" r="4.5" className="fill-foreground" />
          <path
            d="M70 56 q5 -4 10 0"
            className="stroke-foreground"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : mood === "celebrate" ? (
        <>
          <path d="M44 58 l6 -6 l6 6" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M64 58 l6 -6 l6 6" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="48" cy="56" r="4.5" className="fill-foreground" />
          <circle cx="72" cy="56" r="4.5" className="fill-foreground" />
          <circle cx="49.5" cy="54.5" r="1.4" className="fill-card" />
          <circle cx="73.5" cy="54.5" r="1.4" className="fill-card" />
        </>
      )}

      {/* Mouth */}
      {mood === "celebrate" ? (
        <path
          d="M48 72 q12 16 24 0 q-12 6 -24 0 Z"
          className="fill-foreground"
        />
      ) : (
        <path
          d="M50 72 q10 10 20 0"
          className="stroke-foreground"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Waving / encouraging arm */}
      {(mood === "wave" || mood === "encouraging") && (
        <g className="origin-[96px_46px]">
          <circle cx="100" cy="40" r="8" className="fill-pastel-sky stroke-primary/30" strokeWidth="2" />
        </g>
      )}

      {/* Sparkles for celebrate */}
      {mood === "celebrate" && (
        <>
          <path d="M104 30 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" className="fill-warning" />
          <path d="M14 44 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" className="fill-pastel-teal" />
        </>
      )}
    </svg>
  );
}
