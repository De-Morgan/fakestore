import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Product } from "@/api/types";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { productListQuery } from "../api";
import {
  parseProductFilters,
  parseProductView,
  toProductPage,
} from "../searchParams";
import { ProductFilters } from "../components/ProductFilters";
import { ProductGrid } from "../components/ProductGrid";
import { ProductPagination } from "../components/ProductPagination";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const filters = parseProductFilters(searchParams);
  const { q, page } = parseProductView(searchParams);

  // Stable until q or page changes. An inline arrow would re-run select on every render.
  const select = useCallback(
    (products: Product[]) => toProductPage(products, { q, page }),
    [q, page],
  );

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    ...productListQuery(filters),
    select,
    // A new category keeps the old grid on screen (dimmed) instead of flashing skeletons.
    placeholderData: keepPreviousData,
  });

  return (
    <Container className="space-y-6 py-8">
      <title>Products · FakeStore</title>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">Products</h1>
          <span aria-live="polite" className="text-sm text-muted-foreground">
            {isFetching && !isPending ? "Updating…" : null}
          </span>
        </div>
        <ProductFilters filters={filters} q={q} />
      </div>
      {isPending ? (
        <ProductGrid.Skeleton count={8} />
      ) : isError ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 rounded-xl border border-destructive/50 p-4"
        >
          <p className="font-medium">Couldn't load products.</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* Announced when a search or filter changes the result count. */}
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {data.total === 0
              ? q
                ? `No products match “${q}”.`
                : "No products in this category."
              : `${data.total} ${data.total === 1 ? "product" : "products"}`}
          </p>
          {/* Cards use <h3>, so this keeps the outline h1 → h2 → h3 (Lighthouse "heading-order"). */}
          <h2 className="sr-only">Results</h2>
          {data.total > 0 && (
            <div
              aria-busy={isPlaceholderData}
              className={cn(
                "space-y-8 transition-opacity",
                isPlaceholderData && "opacity-60",
              )}
            >
              <ProductGrid products={data.items} />
              <ProductPagination
                page={data.page}
                pageCount={data.pageCount}
                disabled={isPlaceholderData}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
}
