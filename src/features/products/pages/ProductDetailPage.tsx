import { Container } from "@/components/layout/Container";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Link, useParams } from "react-router";
import { productDetailQuery } from "../api";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { SectionBoundary } from "@/components/SectionBoundary";
import { ProductGrid } from "../components/ProductGrid";
import { RelatedProducts } from "../components/RelatedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";

export default function ProductDetailPage() {
  const id = Number(useParams().id);

  return (
    <Container className="space-y-4 py-8">
      <Link
        to="/products"
        className="inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        ← Back to products
      </Link>
      <Suspense fallback={<DetailSkeleton />}>
        <ProductDetail key={id} id={id} />
      </Suspense>
    </Container>
  );
}
function ProductDetail({ id }: { id: number }) {
  const { data: product } = useSuspenseQuery(productDetailQuery(id));
  return (
    <>
      <article className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl p-8">
          <img
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            className="mx-auto aspect-square w-full max-w-md object-contain"
          />
        </div>
        <div className="space-y-4">
          <Badge variant="secondary" className="capitalize">
            {product.category}
          </Badge>
          <h1 className="text-2xl font-bold text-balance md:text-3xl">
            {product.title}
          </h1>
          <div className="flex items-start gap-16">
            <div className="space-y-4">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <StarIcon aria-hidden="true" className="size-4 fill-current" />
                {product.rating.rate} / 5 · {product.rating.count} reviews
              </p>
              <p className="text-3xl font-semibold tabular-nums">
                {formatPrice(product.price)}
              </p>
            </div>
            <AddToCartButton product={product} size={"lg"} />
          </div>
          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
      </article>
      <SectionBoundary
        title="More in this category"
        fallback={<ProductGrid.Skeleton count={4} />}
      >
        <RelatedProducts category={product.category} excludeId={product.id} />
      </SectionBoundary>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div
      className="grid gap-8 md:grid-cols-2"
      role="status"
      aria-label="Loading product"
    >
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
