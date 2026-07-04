"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useStore } from "@/core/data/store";
import { getCurrentUser, login } from "@/core/auth/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Penny } from "@/components/penny/penny";

/**
 * Device-local login. Friends sign in with the username + password they were
 * given; the store rehydrates per user after a full navigation. Admin
 * credentials quietly route to the feedback portal instead.
 */
export default function LoginPage() {
  const { loginAsAdmin } = useStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  // Already logged in? Straight back into the app.
  useEffect(() => {
    if (getCurrentUser()) router.replace("/");
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Admin goes to the portal — same form, no visible difference.
    if (loginAsAdmin(username, password)) {
      router.replace("/admin");
      return;
    }

    if (login(username, password)) {
      // Full navigation (not client-side) so the store rehydrates with this
      // user's own data bucket.
      window.location.assign("/");
      return;
    }
    setError("Hmm, that username or password isn't right. Try again?");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <Penny mood="wave" size={88} />
        <h1 className="mt-4 text-3xl font-black tracking-tight">
          Good<span className="text-link"> Decisions</span>
        </h1>
        <p className="mt-1.5 text-sm font-semibold text-muted-foreground">
          Log in with the username and password you were given.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold">Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="e.g. priya"
                className="h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3.5 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold">Password</span>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="h-11 w-full min-w-0 rounded-lg border border-input bg-card pl-3.5 pr-11 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            {error && (
              <p role="alert" className="text-sm font-bold text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!username.trim() || !password}
            >
              <LogIn /> Log in
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        No login yet? Ask the friend who shared this app with you. You can
        change your password anytime in Settings.
      </p>
    </div>
  );
}
