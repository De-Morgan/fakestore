import { useEffect } from "react";
import { useThemeStore } from "./themeStore";

export function useApplyTheme() {
  const mode = useThemeStore((s) => s.mode);
  useEffect(() => {
    const mql = matchMedia("(prefers-color-scheme: dark)");
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
}
