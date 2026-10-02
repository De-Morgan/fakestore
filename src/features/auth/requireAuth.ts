import { redirect, type LoaderFunctionArgs } from "react-router";
import { useAuthStore } from "./authStore";

// Only same-origin paths. "//evil.example" is protocol-relative, so it's external too.
export function safeNext(next: string | null, fallback = "/account") {
  return next?.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

// Loaders run outside React, so read the store with getState() instead of the hook.
export function requireAuth({ request }: LoaderFunctionArgs) {
  if (!useAuthStore.getState().token) {
    const { pathname, search } = new URL(request.url);
    throw redirect(`/login?next=${encodeURIComponent(pathname + search)}`);
  }
  return null;
}

// The reverse guard for /login: already signed in → go where you were heading.
export function redirectIfAuthenticated({ request }: LoaderFunctionArgs) {
  if (useAuthStore.getState().token) {
    throw redirect(safeNext(new URL(request.url).searchParams.get("next")));
  }
  return null;
}
