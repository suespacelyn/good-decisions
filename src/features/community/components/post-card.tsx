"use client";

import { useState } from "react";
import { Heart, Link2, MessageCircle, Send } from "lucide-react";
import type { Post } from "@/core/types";
import { useStore } from "@/core/data/store";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function PostCard({ post }: { post: Post }) {
  const { toggleLikePost, addComment } = useStore();
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");

  function submitComment() {
    if (!draft.trim()) return;
    addComment(post.id, draft);
    setDraft("");
    setShowComments(true);
  }

  return (
    <Card>
      <CardContent className="p-4">
        {/* Author */}
        <div className="flex items-center gap-2.5">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-extrabold text-ink"
            style={{ backgroundColor: post.avatarColor }}
          >
            {post.author.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight">
              {post.author}
              {post.isMe && (
                <span className="ml-1.5 text-xs font-bold text-link">You</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatRelative(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">
          {post.content}
        </p>

        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-sm font-bold text-link"
          >
            <Link2 className="size-4 shrink-0" />
            <span className="truncate">{hostOf(post.link)}</span>
          </a>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
          <button
            onClick={() => toggleLikePost(post.id)}
            aria-pressed={post.likedByMe}
            aria-label={post.likedByMe ? "Unlike post" : "Like post"}
            className={cn(
              "flex items-center gap-1.5 text-sm font-bold transition-colors",
              post.likedByMe ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Heart className={cn("size-4", post.likedByMe && "fill-primary")} />
            {post.likes}
          </button>
          <button
            onClick={() => setShowComments((s) => !s)}
            aria-label="Show comments"
            aria-expanded={showComments}
            className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageCircle className="size-4" />
            {post.comments.length}
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-3 flex flex-col gap-2.5">
            {post.comments.map((c) => (
              <div key={c.id} className="flex gap-2 text-sm">
                <span className="font-bold">{c.author}</span>
                <span className="flex-1 text-foreground">{c.text}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelative(c.createdAt)}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitComment();
                }}
                placeholder="Add a comment…"
                className="h-9 flex-1 rounded-full border border-input bg-card px-3.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <button
                onClick={submitComment}
                disabled={!draft.trim()}
                aria-label="Send comment"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
