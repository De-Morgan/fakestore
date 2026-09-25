import { ThemeProvider } from "@/features/theme/ThemeProvider";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
}
