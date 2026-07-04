"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Settings, UserPlus, UserRound } from "lucide-react";
import { useStore } from "@/core/data/store";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GamificationCard } from "@/features/profile/components/gamification-card";
import { FriendsList } from "@/features/community/components/friends-list";
import { ToolkitGrid } from "@/features/dashboard/components/toolkit-grid";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { state } = useStore();
  const [friendsOpen, setFriendsOpen] = useState(false);
  const p = state.profile;
  const name = p?.name ?? "You";
  const handle = "@" + name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const joined = new Date(state.firstUseAt).getFullYear();
  const friendCount = state.following.length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        back
        title="Profile"
        action={
          <Link
            href="/settings"
            aria-label="Settings"
            className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted active:scale-95"
          >
            <Settings className="size-5" />
          </Link>
        }
      />

      {/* Identity */}
      <Card className="overflow-hidden">
        <div className="bg-pastel-rose/50 px-5 pb-5 pt-6">
          <div className="flex items-center gap-4">
            <span className="grid size-20 shrink-0 place-items-center rounded-full border-4 border-card bg-card text-foreground shadow-soft">
              <UserRound className="size-10" />
            </span>
            <div className="min-w-0">
              <h2 className="text-2xl font-black leading-tight">{name}</h2>
              <p className="text-sm font-bold text-foreground/70">
                {handle} · joined {joined}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="flex items-center gap-3 p-4">
          <button
            onClick={() => setFriendsOpen((o) => !o)}
            aria-expanded={friendsOpen}
            className="flex flex-1 items-center gap-1.5 text-left"
          >
            <span className="text-lg font-black tabular-nums">
              {friendCount}
            </span>
            <span className="text-sm font-bold text-muted-foreground">
              {friendCount === 1 ? "friend" : "friends"}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                friendsOpen && "rotate-180",
              )}
            />
          </button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => setFriendsOpen(true)}
          >
            <UserPlus /> Add friends
          </Button>
        </CardContent>
      </Card>

      {/* Gamification module */}
      <section>
        <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Your stats
        </h2>
        <GamificationCard />
      </section>

      {/* Friends — pops out only when tapped */}
      {friendsOpen && (
        <section>
          <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Friends
          </h2>
          <FriendsList />
        </section>
      )}

      {/* Toolkit */}
      <ToolkitGrid />
    </div>
  );
}
