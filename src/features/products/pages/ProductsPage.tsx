import { Container } from "@/components/layout/Container";
import { useSearchParams } from "react-router";
import { parseProductFilters } from "../searchParams";
import { useQuery } from "@tanstack/react-query";
import { productListQuery } from "../api";
import { ProductFilters } from "../components/ProductFilters";
import { ProductGrid } from "../components/ProductGrid";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const filters = parseProductFilters(searchParams);

  const { data, isPending, isError, error, isFetching, refetch } = useQuery(
    productListQuery(filters),
  );

  return (
    <Container className="space-y-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">Products</h1>
          <span aria-live="polite" className="text-sm text-muted-foreground">
            {isFetching && !isPending ? "Updating…" : null}
          </span>
        </div>
        <ProductFilters filters={filters} />
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
      ) : data.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No products in this category.
        </p>
      ) : (
        <ProductGrid products={data} />
      )}
    </Container>
  );
}
