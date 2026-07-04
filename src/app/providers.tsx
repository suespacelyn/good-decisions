"use client";

import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/core/data/store";
import { PwaRegister } from "@/components/pwa/pwa";

/** App-wide client providers: theme (dark mode) + the local-first data store. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <PwaRegister />
        {children}
      </StoreProvider>
    </ThemeProvider>
  );
}
