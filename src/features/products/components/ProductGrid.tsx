import type { Product } from "@/api/types";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

const gridClass = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className={gridClass}>
      {products.map((product) => (
        <li key={product.id} className="grid">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={gridClass} role="status" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

ProductGrid.Skeleton = ProductGridSkeleton;
