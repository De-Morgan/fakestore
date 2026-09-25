import { Container } from "@/components/layout/Container";
import { ProductCardSkeleton } from "../components/ProductCardSkeleton";

export default function ProductsPage() {
  return (
    <Container className="space-y-6 py-8">
      <h1 className="text-2xl font-bold">Products</h1>
      <p className="text-muted-foreground">
        The product grid arrives in Phase 3.
      </p>
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        role="status"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  );
}
