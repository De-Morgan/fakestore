import type { Product } from "@/api/types";
import type { ProductFilters, ProductSort } from "./api";

export const DEFAULT_SORT: ProductSort = "asc";
export const PAGE_SIZE = 8;

// What to fetch. These two go in the query key.
export function parseProductFilters(params: URLSearchParams): ProductFilters {
  return {
    category: params.get("category") || undefined,
    sort: params.get("sort") === "desc" ? "desc" : DEFAULT_SORT,
  };
}

// How to show what was fetched. These never go in the query key: the request is the same.
export type ProductView = { q: string; page: number };

export function parseProductView(params: URLSearchParams): ProductView {
  const page = Number(params.get("page"));
  return {
    q: params.get("q")?.trim() ?? "",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

// Copies `params` with `key` set, or removed when `value` is null (defaults stay out of the URL).
// Changing anything other than `page` resets `page`, so a new filter never opens on an empty page 3.
export function updateParams(
  params: URLSearchParams,
  key: string,
  value: string | null,
) {
  const next = new URLSearchParams(params);
  if (value === null) next.delete(key);
  else next.set(key, value);
  if (key !== "page") next.delete("page");
  return next;
}

export type ProductPage = {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
};

// Runs in the list query's `select`: the cache keeps the full list, and this derives one screen of it.
export function toProductPage(
  products: Product[],
  { q, page }: ProductView,
): ProductPage {
  const needle = q.toLowerCase();
  const matched = needle
    ? products.filter((p) => p.title.toLowerCase().includes(needle))
    : products;
  const pageCount = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const current = Math.min(page, pageCount); // ?page=99 shows the last page, not an empty grid
  return {
    items: matched.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    total: matched.length,
    page: current,
    pageCount,
  };
}
