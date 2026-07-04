"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, MessageSquare, Star } from "lucide-react";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Splash } from "@/components/splash";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const { ready, isAdmin } = useStore();
  if (!ready) return <Splash />;
  return isAdmin ? <Portal /> : <LoginForm />;
}

function LoginForm() {
  const { loginAsAdmin } = useStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit() {
    if (loginAsAdmin(username, password)) {
      setError(false);
    } else {
      setError(true);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6">
      <button
        onClick={() => router.push("/")}
        className="mb-8 flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <h1 className="text-2xl font-black">Log in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Welcome back to Good Decisions.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="u">Username</Label>
          <Input
            id="u"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="p">Password</Label>
          <Input
            id="p"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Password"
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p className="text-sm font-bold text-destructive">
            Incorrect username or password.
          </p>
        )}
        <Button size="lg" onClick={submit}>
          Log in
        </Button>
      </div>
    </div>
  );
}

function Portal() {
  const { state, logoutAdmin } = useStore();
  const router = useRouter();
  const feedback = state.feedback;

  const reviews = feedback.filter((f) => f.kind === "review");
  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
      : 0;

  function logout() {
    logoutAdmin();
    router.push("/");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 py-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Admin · Feedback</h1>
          <p className="text-sm text-muted-foreground">
            What your friends are saying.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut /> Log out
        </Button>
      </header>

      {/* Summary */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <Stat label="Avg rating" value={reviews.length ? avg.toFixed(1) : "—"} />
        <Stat label="Reviews" value={String(reviews.length)} />
        <Stat label="Total" value={String(feedback.length)} />
      </div>

      {feedback.length === 0 ? (
        <p className="text-sm text-muted-foreground">No feedback yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {feedback.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{f.author}</span>
                    <Badge variant={f.kind === "review" ? "primary" : "outline"}>
                      {f.kind === "review" ? "Review" : "Feedback"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatRelative(f.createdAt)}
                  </span>
                </div>
                {f.kind === "review" && f.rating != null && (
                  <div className="mt-2 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          "size-4",
                          n <= f.rating! ? "fill-warning text-warning" : "fill-muted text-muted",
                        )}
                      />
                    ))}
                  </div>
                )}
                {f.message && (
                  <p className="mt-2 flex gap-2 text-sm leading-relaxed">
                    <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    {f.message}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </ul>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Local prototype — feedback is collected on this device. Connect a backend
        to gather it from everyone.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-2xl font-black tabular-nums">{value}</p>
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
