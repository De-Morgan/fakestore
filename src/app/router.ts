import HomePage from "@/pages/Home";
import {
  createBrowserRouter,
  data,
  type LoaderFunctionArgs,
  type RouteObject,
} from "react-router";
import type { ComponentType } from "react";
import RootLayout from "@/components/layout/RootLayout";
import ErrorPage from "@/pages/ErrorPage";
import { queryClient } from "./queryClient";
import { productDetailQuery, productListQuery } from "@/features/products/api";
import { ApiError } from "@/api/client";

// Turns a default-exported page module into a `lazy` route definition.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

// `data()` doesn't set statusText, and ErrorPage shows it in the heading.
const notFound = () =>
  data("Product not found", { status: 404, statusText: "Not Found" });

// Render-as-you-fetch: runs in parallel with the lazy page download and only warms the cache.
// The page reads the same data through useSuspenseQuery, so the cache stays the single source of truth.
async function productDetailLoader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) {
    throw notFound();
  }
  try {
    // Critical data: awaited, so navigation waits for it (instant if already cached).
    const product = await queryClient.ensureQueryData(productDetailQuery(id));
    // Non-critical data: start fetching, but don't wait for it.
    void queryClient.prefetchQuery(
      productListQuery({ category: product.category, sort: "asc" }),
    );
    return null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw notFound();
    }
    throw error;
  }
}

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
        loader: productDetailLoader,
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
