"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Penny } from "@/components/penny/penny";
import { NAV_ITEMS } from "@/components/app-shell/nav-config";
import { InstallPrompt } from "@/components/pwa/pwa";
import { cn } from "@/lib/utils";

/**
 * Responsive shell: left sidebar on desktop, bottom tab bar on mobile.
 * Content is constrained to a comfortable reading width.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-dvh md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 md:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <Penny size={36} />
          <span className="text-lg font-black tracking-tight">
            Good<span className="text-link"> Decisions</span>
          </span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
                  active
                    ? "bg-primary/10 text-link"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content — min-w-0 so wide children (charts, grids) can shrink
          instead of pushing the flex row past the viewport */}
      <main className="min-w-0 flex-1 pb-24 md:pb-8">
        <div className="mx-auto w-full max-w-2xl px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] md:px-8 md:pt-6">
          <InstallPrompt />
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {NAV_ITEMS.filter((i) => i.inBottomNav).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  data-tour={item.href === "/community" ? "community" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition-colors",
                    active ? "text-link" : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn("size-6", active && "fill-primary/15")}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
