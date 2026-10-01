import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

// The pre-paint script in index.html reads this key too. Keep them in sync.
export const THEME_STORAGE_KEY = "fakestore:theme";

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        mode: "system",
        setMode: (mode) => set({ mode }, undefined, "theme/setMode"),
      }),
      {
        name: THEME_STORAGE_KEY,
        partialize: (s) => ({ mode: s.mode }),
      },
    ),
    { name: "theme", enabled: import.meta.env.DEV },
  ),
);
