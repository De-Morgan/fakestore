import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./queryClient";
import { useApplyTheme } from "@/features/theme/useApplyTheme";

function ThemeSync() {
  useApplyTheme();
  return null;
}

// Single place to stack app-wide providers.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      {children}
      <Toaster richColors closeButton />
      {/* import.meta.env.DEV is replaced with `false` in builds, so this whole branch is dropped. */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
