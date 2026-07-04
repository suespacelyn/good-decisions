"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { Penny, type PennyMood } from "@/components/penny/penny";
import { cn } from "@/lib/utils";

interface TourStep {
  /** CSS selector of the element to spotlight. Omit for a centered step. */
  target?: string;
  mood: PennyMood;
  title: string;
  body: string;
}

const STEPS: TourStep[] = [
  {
    mood: "wave",
    title: "Hi, I'm Penny 👋",
    body: "Let me bring you around the app real quick — just a few taps. Follow me ah!",
  },
  {
    target: '[data-tour="overview"]',
    mood: "happy",
    title: "Your money, all in one place",
    body: "Your total net worth — savings, investments and CPF all here. Tap any amount to update it, super fast.",
  },
  {
    target: '[data-tour="tracker"]',
    mood: "encouraging",
    title: "Track your spending",
    body: "Pop in your income and expenses here. Then you can see where your money actually goes each month.",
  },
  {
    target: '[data-tour="community"]',
    mood: "happy",
    title: "Find your kakis 💬",
    body: "Swap money tips with friends, like and comment, and follow the people you trust.",
  },
  {
    target: '[data-tour="coach"]',
    mood: "encouraging",
    title: "Coach, on standby",
    body: "Tap my face up here and I'll suggest your next best money move — always with the why, never any selling.",
  },
  {
    target: '[data-tour="profile"]',
    mood: "celebrate",
    title: "You & your streak 🔥",
    body: "Your profile keeps your stats, friends and settings. That's it — go explore lah!",
  },
];

const PAD = 8;

export function WelcomeTour() {
  const { state, markTourSeen } = useStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [ttHeight, setTtHeight] = useState(200);

  useEffect(() => setMounted(true), []);

  // Measure the tooltip so we can keep it on screen even over tall targets.
  useLayoutEffect(() => {
    if (tooltipRef.current) setTtHeight(tooltipRef.current.offsetHeight);
  }, [step, rect, mounted]);

  const current = STEPS[step];

  const measure = useCallback(() => {
    if (!current.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(current.target);
    if (!el) {
      setRect(null);
      return;
    }
    setRect(el.getBoundingClientRect());
  }, [current]);

  // On each step, scroll the target into view, then measure (with a settle delay).
  useLayoutEffect(() => {
    if (state.tourSeen || !mounted) return;
    if (current.target) {
      const el = document.querySelector(current.target);
      // Instant scroll — smooth gets preempted by re-renders and never lands.
      el?.scrollIntoView({ block: "center", behavior: "auto" });
    }
    measure();
    const t = setTimeout(measure, 120);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure, state.tourSeen, mounted, current.target]);

  if (!mounted || state.tourSeen) return null;

  const isLast = step === STEPS.length - 1;
  const next = () => (isLast ? markTourSeen() : setStep((s) => s + 1));

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const spot = rect
    ? {
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        bottom: rect.bottom + PAD,
      }
    : null;

  // Tooltip placement — keep it fully on screen. Prefer below the target, then
  // above; if the target is taller than the viewport, overlay it (centred) so
  // the modal is always visible in the same viewport.
  const ttWidth = Math.min(vw - 24, 360);
  const M = 14;
  const ttLeft = spot
    ? Math.min(Math.max(spot.cx - ttWidth / 2, 12), vw - ttWidth - 12)
    : (vw - ttWidth) / 2;

  let ttTop = (vh - ttHeight) / 2;
  if (spot) {
    if (spot.bottom + M + ttHeight <= vh - 12) {
      ttTop = spot.bottom + M; // room below
    } else if (spot.top - M - ttHeight >= 12) {
      ttTop = spot.top - M - ttHeight; // room above
    } else {
      ttTop = (vh - ttHeight) / 2; // overlay the (tall) target
    }
    ttTop = Math.max(12, Math.min(ttTop, vh - ttHeight - 12));
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Click blocker (transparent) */}
      <div className="absolute inset-0" />

      {/* Dimming: spotlight cutout, or full dim for centered steps */}
      {spot ? (
        <div
          className="pointer-events-none fixed rounded-2xl transition-all duration-300 ease-out"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            boxShadow: "0 0 0 9999px oklch(0.15 0.01 350 / 0.72)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />
      )}

      {/* Pulsing tap indicator on the target */}
      {spot && (
        <div
          className="pointer-events-none fixed"
          style={{ top: spot.cy - 16, left: spot.cx - 16 }}
        >
          <span className="absolute inline-flex size-8 animate-ping rounded-full bg-primary/50" />
          <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-primary/30 ring-2 ring-primary" />
        </div>
      )}

      {/* Tooltip — static (no opacity animation; it can freeze mid-fade here) */}
      <div
        key={step}
        ref={tooltipRef}
        className={cn(
          "fixed rounded-2xl border border-border bg-card p-4 shadow-soft-lg",
          !spot && "left-1/2 -translate-x-1/2",
        )}
        style={
          spot
            ? { top: ttTop, left: ttLeft, width: ttWidth }
            : { top: ttTop, width: ttWidth }
        }
      >
        <div className="flex gap-3">
          <Penny mood={current.mood} size={48} />
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold leading-tight">{current.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {current.body}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-4 bg-primary" : "w-1.5 bg-border",
                )}
              />
            ))}
            <span className="ml-1 text-xs font-bold text-muted-foreground">
              {step + 1}/{STEPS.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markTourSeen}
              className="text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              Skip
            </button>
            <Button size="sm" onClick={next}>
              {isLast ? "Done 🎉" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
