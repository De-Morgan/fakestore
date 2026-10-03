import type { Product } from "@/api/types";
import { noop, useQueryClient } from "@tanstack/react-query";
import { productDetailQuery } from "../api";
import { Link } from "react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { StarIcon } from "lucide-react";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { ProductImage } from "./ProductImage";
type ProductCardProps = { product: Product; eager?: boolean };
export function ProductCard({ product, eager = false }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { id, image, title, price, rating } = product;

  const prefetch = () =>
    void queryClient.query(productDetailQuery(id)).catch(noop);
  return (
    <Card className="relative h-full transition-shadow hover:shadow-md has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50">
      <CardContent className="space-y-3">
        <div className="rounded-lg p-4">
          <ProductImage
            src={image}
            alt=""
            size={300}
            loading={eager ? "eager" : "lazy"}
          />
        </div>
        <h3 className="line-clamp-2 font-medium">
          <Link
            to={`/products/${id}`}
            onMouseEnter={prefetch}
            onFocus={prefetch}
            className="outline-none after:absolute after:inset-0 hover:text-primary"
          >
            {title}
          </Link>
        </h3>
      </CardContent>
      <CardFooter className="mt-auto flex-col items-stretch gap-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold tabular-nums">
            {formatPrice(price)}
          </span>
          <span
            className="flex items-center gap-1 text-xs text-muted-foreground"
            aria-label={`Rated ${rating.rate} out of 5 from ${rating.count} reviews`}
          >
            <StarIcon aria-hidden="true" className="size-3.5 fill-current" />
            {rating.rate}
          </span>
        </div>
        <AddToCartButton
          product={product}
          variant="outline"
          aria-label={`Add ${title} to cart`}
          className="relative z-10"
        />{" "}
      </CardFooter>
    </Card>
  );
}
