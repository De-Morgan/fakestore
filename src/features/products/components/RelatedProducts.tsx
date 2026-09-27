import { useSuspenseQuery } from "@tanstack/react-query";
import { productListQuery } from "../api";
import { ProductGrid } from "./ProductGrid";

type RelatedProductsProps = { category: string; excludeId: number };

export function RelatedProducts({ category, excludeId }: RelatedProductsProps) {
  const { data: products } = useSuspenseQuery(
    productListQuery({ category, sort: "asc" }),
  );
  const others = products.filter((p) => p.id !== excludeId).slice(0, 4);
  if (others.length === 0) {
    return <p className="text-muted-foreground">Nothing else here yet.</p>;
  }
  return <ProductGrid products={others} />;
}
