import { apiFetch } from "@/api/client";
import { queryOptions } from "@tanstack/react-query";
import {
  CategoriesSchema,
  ProductListSchema,
  ProductSchema,
  type Product,
} from "@/api/types";
import { queryClient } from "@/app/queryClient";

export type ProductSort = "asc" | "desc";
export type ProductFilters = { category?: string; sort: ProductSort };

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "details"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, "categories"] as const,
};

export const productListQuery = (filters: ProductFilters) =>
  queryOptions({
    queryKey: productKeys.list(filters),
    queryFn: ({ signal }) =>
      apiFetch(
        filters.category
          ? `/products/category/${encodeURIComponent(filters.category)}`
          : "/products",
        ProductListSchema,
        { params: { sort: filters.sort }, signal }, // axios builds and encodes the query string
      ),
  });

function findInLists(id: number) {
  for (const [key, list] of queryClient.getQueriesData<Product[]>({
    queryKey: productKeys.lists(),
  })) {
    const product = list?.find((p) => p.id === id);
    if (product) return { key, product };
  }
}

export const productDetailQuery = (id: number) =>
  queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: ({ signal }) =>
      apiFetch(`/products/${id}`, ProductSchema, { signal }),
    // List items are complete products, so a click from the list renders instantly.
    initialData: () => findInLists(id)?.product,
    initialDataUpdatedAt: () => {
      const hit = findInLists(id);
      return hit && queryClient.getQueryState(hit.key)?.dataUpdatedAt;
    },
  });

export const categoriesQuery = () =>
  queryOptions({
    queryKey: productKeys.categories(),
    queryFn: ({ signal }) =>
      apiFetch("/products/categories", CategoriesSchema, { signal }),
    staleTime: Infinity,
  });
