import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ThemeMode,
} from "./themeContext";

function readMode(): ThemeMode {
  try {
    const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? "{}");
    const mode = saved?.state?.mode;
    return mode === "light" || mode === "dark" ? mode : "system";
  } catch {
    return "system";
  }
}

function writeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ state: { mode }, version: 0 }),
    );
  } catch {
    // Storage can be unavailable (private mode, blocked site data). The theme still applies for this visit.
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readMode);

  useEffect(() => {
    const mql = matchMedia("prefers-color-scheme: dark");
    const apply = () => {
      const dark = mode === "dark" || (mode === "system" && mql.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    if (mode !== "system") return;
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode: (next: ThemeMode) => {
        writeMode(next);
        setModeState(next);
      },
    }),
    [mode],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
