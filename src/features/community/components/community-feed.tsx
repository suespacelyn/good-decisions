"use client";

import { useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import { useStore } from "@/core/data/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/features/community/components/post-card";

/**
 * The Community feed — me + friends sharing finance tips and links, with likes
 * and comments. Local-first: friends' posts are seeded; my posts persist.
 */
export function CommunityFeed() {
  const { state, addPost } = useStore();
  const [content, setContent] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [link, setLink] = useState("");

  const initial = (state.profile?.name ?? "Y").charAt(0).toUpperCase();

  const posts = useMemo(
    () =>
      [...state.posts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [state.posts],
  );

  function submit() {
    if (!content.trim()) return;
    addPost({ content, link: showLink ? link : undefined });
    setContent("");
    setLink("");
    setShowLink(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Compose */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-pastel-rose/70 text-sm font-extrabold text-ink">
              {initial}
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="Share a good finance tip or link…"
              className="min-h-[3rem] flex-1 resize-none bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
          </div>

          {showLink && (
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://…"
              className="mt-2"
            />
          )}

          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() => setShowLink((s) => !s)}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-bold text-link hover:bg-muted"
            >
              <Link2 className="size-4" /> {showLink ? "Remove link" : "Add link"}
            </button>
            <Button size="sm" disabled={!content.trim()} onClick={submit}>
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
