/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // `pnpm analyze` writes a treemap of the production bundle to stats.html.
    process.env.ANALYZE
      ? visualizer({ filename: "stats.html", gzipSize: true })
      : null,
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    // .env is gitignored, so CI has no VITE_API_URL. MSW handlers listen on this origin.
    env: { VITE_API_URL: "https://fakestoreapi.com" },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.test.{ts,tsx}",
        "src/components/ui/**",
      ],
      // `pnpm coverage` fails if the cart (pure logic + its pages) drops below this.
      thresholds: { "src/features/cart/**": { lines: 90 } },
    },
  },
});
