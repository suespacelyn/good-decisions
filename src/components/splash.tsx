import { Penny } from "@/components/penny/penny";

/** Full-screen loading splash shown while persisted state hydrates. */
export function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-bounce">
          <Penny mood="happy" size={88} />
        </div>
        <p className="text-sm font-bold text-muted-foreground">
          Good Decisions
        </p>
      </div>
    </div>
  );
}
