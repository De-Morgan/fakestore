import HomePage from "@/pages/Home";
import { createBrowserRouter, type RouteObject, data } from "react-router";
import type { ComponentType } from "react";
import RootLayout from "@/components/layout/RootLayout";
import ErrorPage from "@/pages/ErrorPage";

// Turns a default-exported page module into a `lazy` route definition.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage },

      {
        path: "products",
        lazy: page(() => import("@/features/products/pages/ProductsPage")),
      },
      {
        path: "products/:id",
        lazy: page(() => import("@/features/products/pages/ProductDetailPage")),
      },
      {
        path: "cart",
        lazy: page(() => import("@/features/cart/pages/CartPage")),
      },
      {
        path: "login",
        lazy: page(() => import("@/features/auth/pages/LoginPage")),
      },
      {
        path: "account",
        lazy: page(() => import("@/features/auth/pages/AccountPage")),
      },
      {
        path: "*",
        lazy: page(() => import("@/pages/NotFound")),
      },
    ],
  },
];
export const router = createBrowserRouter(routes);
