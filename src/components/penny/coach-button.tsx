import Link from "next/link";
import { Penny } from "@/components/penny/penny";

/** Top-right entry point to the AI Coach chat — Penny's face is the button. */
export function CoachButton({ size = 40 }: { size?: number }) {
  return (
    <Link
      href="/coach"
      aria-label="Chat with your Coach"
      data-tour="coach"
      className="relative shrink-0 rounded-full transition hover:opacity-85 active:scale-95"
    >
      <Penny size={size} mood="happy" />
      <span className="absolute right-0 top-0 size-2.5 rounded-full border-2 border-background bg-primary" />
    </Link>
  );
}
