"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Lets friends send feedback to the app maker. Stored for the admin portal. */
export function FeedbackForm() {
  const { state, submitFeedback } = useStore();
  const [name, setName] = useState(state.profile?.name ?? "");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    if (!message.trim()) return;
    submitFeedback({ kind: "feedback", message, author: name });
    setMessage("");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2.5 text-sm font-bold text-positive">
        <CheckCircle2 className="size-5" />
        Thanks! Your feedback was sent to the team.
        <button
          onClick={() => setSent(false)}
          className="ml-auto text-link"
        >
          Send more
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Got an idea or something that bugs you? Tell us — it goes straight to the
        team building the app.
      </p>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="What could we add or improve?"
        className="w-full resize-none rounded-xl border border-input bg-card p-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
      <Button disabled={!message.trim()} onClick={submit}>
        <Send /> Send feedback
      </Button>
    </div>
  );
}
