"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useStore } from "@/core/data/store";
import { formatRelative } from "@/lib/format";

/**
 * Bell showing recent posts from friends. The list drops down as a small panel
 * tucked under the bell icon — no full-screen overlay or backdrop blur.
 */
export function NotificationsButton() {
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const notes = state.posts
    .filter((p) => !p.isMe && state.following.includes(p.author))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  // Keep the panel on screen: the bell isn't always the right-most header
  // item, so a pure right-0 anchor can push the panel past the left edge on
  // small screens. Measure and nudge it back inside a 12px margin.
  useLayoutEffect(() => {
    if (!open) {
      setShift(0);
      return;
    }
    const r = panelRef.current?.getBoundingClientRect();
    if (!r) return;
    const vw = window.innerWidth;
    let dx = 0;
    if (r.left < 12) dx = 12 - r.left;
    else if (r.right > vw - 12) dx = vw - 12 - r.right;
    if (dx !== 0) setShift(dx);
  }, [open]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative grid size-10 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted active:scale-95"
      >
        <Bell className="size-5" />
        {notes.length > 0 && (
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ transform: shift ? `translateX(${shift}px)` : undefined }}
          className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-3 shadow-soft-lg"
        >
          <p className="px-1 pb-2 text-sm font-extrabold">Notifications</p>
          {notes.length === 0 ? (
            <p className="px-1 pb-1 text-sm text-muted-foreground">
              Nothing here yet. Add friends to hear when they share a thought.
            </p>
          ) : (
            <ul className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
              {notes.map((p) => (
                <li key={p.id} className="flex items-start gap-2.5">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-extrabold text-ink"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.author.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-bold">{p.author}</span> shared a
                      thought
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.content}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(p.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
