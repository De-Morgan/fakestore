import type { ProductFilters, ProductSort } from "./api";

export const DEFAULT_SORT: ProductSort = "asc";

export function parseProductFilters(params: URLSearchParams): ProductFilters {
  return {
    category: params.get("category") || undefined,
    sort: params.get("sort") === "desc" ? "desc" : DEFAULT_SORT,
  };
}
