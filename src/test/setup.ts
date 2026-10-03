import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { useAuthStore } from "@/features/auth/authStore";
import { useCartStore } from "@/features/cart/cartStore";
import { useThemeStore } from "@/features/theme/themeStore";
import { server } from "./msw/server";

// jsdom has no matchMedia. Sonner reads it for the "system" theme.
vi.stubGlobal(
  "matchMedia",
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
);

// Nor scrollTo, which the router's <ScrollRestoration> calls on every navigation.
vi.stubGlobal("scrollTo", vi.fn());

// An unmocked request fails the test instead of quietly hitting the real API.
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  // Stores are module singletons: put each back to its initial state (`true` replaces, not merges).
  useCartStore.setState(useCartStore.getInitialState(), true);
  useAuthStore.setState(useAuthStore.getInitialState(), true);
  useThemeStore.setState(useThemeStore.getInitialState(), true);
  // After the resets, which persist their initial state.
  localStorage.clear();
});

afterAll(() => server.close());
