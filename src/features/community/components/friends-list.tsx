"use client";

import { Flame } from "lucide-react";
import { useStore } from "@/core/data/store";
import { Card, CardContent } from "@/components/ui/card";
import { FRIENDS } from "@/features/community/data/friends";
import { cn } from "@/lib/utils";

/** People you can add as friends — added friends drive your Community notifications. */
export function FriendsList() {
  const { state, toggleFollow } = useStore();

  return (
    <Card>
      <CardContent className="flex flex-col p-2">
        {FRIENDS.map((f) => {
          const added = state.following.includes(f.name);
          return (
            <div key={f.name} className="flex items-center gap-3 rounded-xl p-2">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full text-base font-extrabold text-ink"
                style={{ backgroundColor: f.avatarColor }}
              >
                {f.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-tight">{f.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="size-3 text-warning" />
                  {f.streak} · {f.handle}
                </p>
              </div>
              <button
                onClick={() => toggleFollow(f.name)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95",
                  added
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {added ? "Added ✓" : "Add"}
              </button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
