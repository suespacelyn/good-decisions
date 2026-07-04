"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { changePassword } from "@/core/auth/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Lets the logged-in user set a new password (stored on this device). */
export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function reset() {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError("");
    setDone(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    const err = changePassword(current, next);
    if (err) {
      setError(err);
      return;
    }
    setDone(true);
    setTimeout(() => setOpen(false), 1200);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <KeyRound /> Change password
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Pick something easy for you to remember, hard for others to guess.
            This applies on this device.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <p className="py-2 text-center font-bold text-positive">
            Password changed 🎉
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <PwField
              label="Current password"
              value={current}
              onChange={setCurrent}
              autoComplete="current-password"
            />
            <PwField
              label="New password"
              value={next}
              onChange={setNext}
              autoComplete="new-password"
            />
            <PwField
              label="Confirm new password"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
            />
            {error && (
              <p role="alert" className="text-sm font-bold text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="mt-1 w-full"
              disabled={!current || !next || !confirm}
            >
              Save new password
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PwField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3.5 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
    </label>
  );
}
