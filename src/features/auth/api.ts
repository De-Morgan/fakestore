import { queryOptions, useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import {
  CartListSchema,
  TokenSchema,
  UserSchema,
  type Cart,
} from "@/api/types";
import { useAuthStore } from "./authStore";
import { decodeUserId } from "./jwt";

export const authKeys = {
  all: ["auth"] as const,
  user: (id: number) => [...authKeys.all, "user", id] as const,
  carts: (id: number) => [...authKeys.all, "carts", id] as const,
};

export const userQuery = (id: number) =>
  queryOptions({
    queryKey: authKeys.user(id),
    queryFn: ({ signal }) => apiFetch(`/users/${id}`, UserSchema, { signal }),
  });

// ISO dates sort correctly as strings. Module-level so `select` keeps a stable reference.
const newestFirst = (carts: Cart[]) =>
  carts.toSorted((a, b) => b.date.localeCompare(a.date));

export const userCartsQuery = (id: number) =>
  queryOptions({
    queryKey: authKeys.carts(id),
    queryFn: ({ signal }) =>
      apiFetch(`/carts/user/${id}`, CartListSchema, { signal }),
    select: newestFirst,
    // FakeStore doesn't save new carts, so a refetch (or a garbage-collected cache) would erase
    // orders placed this session. Only checkout writes here, and logout clears it.
    staleTime: Infinity,
    gcTime: Infinity,
  });

export type LoginValues = { username: string; password: string };

export function useLoginMutation() {
  const setCredentials = useAuthStore((s) => s.setCredentials);
  return useMutation({
    // Decode inside mutationFn so a bad token is a failed login (onError), not a crash in onSuccess.
    mutationFn: async (body: LoginValues) => {
      const { token } = await apiFetch("/auth/login", TokenSchema, {
        method: "POST",
        data: body,
      });
      return { token, userId: decodeUserId(token) };
    },
    onSuccess: setCredentials,
  });
}
