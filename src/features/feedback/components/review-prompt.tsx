"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star, X } from "lucide-react";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CLICKS_BEFORE_PROMPT = 50;

/**
 * Once the user has clicked around enough (50 taps), gently asks them to leave
 * a star review. Their rating + note is collected for the app admin. Shown once.
 */
export function ReviewPrompt() {
  const { state, submitFeedback, markReviewDone } = useStore();
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    // Don't compete with the first-run tour, and only ever ask once.
    if (state.reviewPromptDone || !state.tourSeen) return;
    let clicks = 0;
    const onClick = () => {
      clicks += 1;
      if (clicks >= CLICKS_BEFORE_PROMPT) {
        setVisible(true);
        document.removeEventListener("click", onClick);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [state.reviewPromptDone, state.tourSeen]);

  function close() {
    setVisible(false);
    markReviewDone();
  }

  function submit() {
    if (rating === 0) return;
    submitFeedback({ kind: "review", rating, message: note });
    close();
  }

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-soft-lg">
            <div className="flex items-start justify-between gap-2">
              <p className="font-extrabold">Enjoying the app so far? 🥹</p>
              <button
                onClick={close}
                aria-label="Dismiss"
                className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Drop us a quick review lah — it really helps us improve 💛
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="transition active:scale-90"
                >
                  <Star
                    className={cn(
                      "size-8",
                      (hover || rating) >= n
                        ? "fill-warning text-warning"
                        : "fill-muted text-muted",
                    )}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Anything we could do better? (optional)"
                className="mt-3 w-full resize-none rounded-xl border border-input bg-card p-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            )}

            <div className="mt-3 flex items-center gap-2">
              <Button className="flex-1" disabled={rating === 0} onClick={submit}>
                Submit review
              </Button>
              <Button variant="ghost" onClick={close}>
                Maybe later
              </Button>
            </div>
          </div>
    </motion.div>
  );
}
