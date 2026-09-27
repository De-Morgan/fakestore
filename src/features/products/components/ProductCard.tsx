import type { Product } from "@/api/types";
import { noop, useQueryClient } from "@tanstack/react-query";
import { productDetailQuery } from "../api";
import { Link } from "react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { StarIcon } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const { id, image, title, price, rating } = product;

  const prefetch = () =>
    void queryClient.query(productDetailQuery(id)).catch(noop);
  return (
    <Link
      to={`/products/${id}`}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardContent className="space-y-3">
          <div className="rounded-lg p-4">
            <img
              src={image}
              alt=""
              width={300}
              height={300}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-contain"
            />
          </div>
          <h3 className="line-clamp-2 font-medium group-hover:text-primary">
            {title}
          </h3>
        </CardContent>
        <CardFooter className="mt-auto justify-between">
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
        </CardFooter>
      </Card>
    </Link>
  );
}
