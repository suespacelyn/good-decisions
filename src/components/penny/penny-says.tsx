"use client";

import { motion } from "motion/react";
import { Penny, type PennyMood } from "@/components/penny/penny";
import { cn } from "@/lib/utils";

/** Penny paired with a speech bubble. Gently floats to feel alive. */
export function PennySays({
  mood = "happy",
  children,
  size = 84,
  className,
}: {
  mood?: PennyMood;
  children: React.ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-3", className)}>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="shrink-0"
      >
        <Penny mood={mood} size={size} />
      </motion.div>
      <div className="relative max-w-sm rounded-xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm font-medium leading-relaxed text-card-foreground shadow-soft">
        {children}
      </div>
    </div>
  );
}
