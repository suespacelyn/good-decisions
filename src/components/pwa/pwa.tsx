"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

/** Registers the service worker (offline + installability). No UI. */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

const DISMISS_KEY = "fff:install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

/** Dismissible "Install app" banner — Android prompt + iOS instructions. */
export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone;
    if (standalone || localStorage.getItem(DISMISS_KEY) === "1") return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    let t: ReturnType<typeof setTimeout> | undefined;
    if (ios) t = setTimeout(() => setShow(true), 1500);

    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  };

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
      <Download className="size-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1 text-sm">
        {isIOS ? (
          <span>
            Install: tap{" "}
            <Share className="-mt-0.5 inline size-4" aria-label="Share" /> then{" "}
            <strong>Add to Home Screen</strong>
          </span>
        ) : (
          <span className="font-bold">Add Good Decisions to your phone</span>
        )}
      </div>
      {!isIOS && deferred && (
        <button
          onClick={install}
          className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground"
        >
          Install
        </button>
      )}
      <button
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
