import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Credentials = { token: string; userId: number };

export type AuthState = {
  token: string | null;
  userId: number | null;
  setCredentials: (credentials: Credentials) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        userId: null,
        setCredentials: (credentials) =>
          set(credentials, undefined, "auth/setCredentials"),
        logout: () =>
          set({ token: null, userId: null }, undefined, "auth/logout"),
      }),
      {
        name: "fakestore:auth",
        version: 0,
        partialize: (s) => ({ token: s.token, userId: s.userId }),
      },
    ),
    { name: "auth", enabled: import.meta.env.DEV },
  ),
);

export const selectIsLoggedIn = (s: AuthState) => s.token != null;
