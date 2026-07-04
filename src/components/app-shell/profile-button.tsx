import Link from "next/link";
import { UserRound } from "lucide-react";

/** Top-left entry point to the user's Profile page. */
export function ProfileButton({ size = 40 }: { size?: number }) {
  return (
    <Link
      href="/profile"
      aria-label="Your profile"
      data-tour="profile"
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted active:scale-95"
    >
      <UserRound className="size-5" />
    </Link>
  );
}
