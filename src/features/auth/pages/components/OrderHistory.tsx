import { useQueries } from "@tanstack/react-query";
import type { Cart } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { productDetailQuery } from "@/features/products/api";
import { formatPrice } from "@/lib/format";

const formatDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
}).format;

export function OrderHistory({ carts }: { carts: Cart[] }) {
  // One query per distinct product across all orders, fetched in parallel.
  // Products you've already browsed are cache hits (no request).
  const ids = [
    ...new Set(carts.flatMap((c) => c.products.map((p) => p.productId))),
  ];
  const products = useQueries({
    queries: ids.map((id) => productDetailQuery(id)),
    combine: (results) =>
      new Map(results.map((r, i) => [ids[i], r.data] as const)),
  });

  if (carts.length === 0) {
    return <p className="text-muted-foreground">No orders yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {carts.map((cart) => {
        const pending = cart.id < 0;
        const lines = cart.products.map((p) => ({
          ...p,
          product: products.get(p.productId),
        }));
        // FakeStore carts have no prices, so the total waits until every product has loaded.
        const total = lines.reduce<number | null>(
          (t, l) =>
            t != null && l.product ? t + l.product.price * l.quantity : null,
          0,
        );

        return (
          // FakeStore returns the same id for every new cart, so the date keeps keys unique.
          <li key={`${cart.id}-${cart.date}`}>
            <Card
              size="sm"
              aria-busy={pending}
              className={pending ? "opacity-70" : undefined}
            >
              <CardHeader className="flex items-center justify-between gap-2">
                <CardTitle>
                  {pending ? "New order" : `Order #${cart.id}`}
                  <span className="ml-2 font-normal text-muted-foreground">
                    {formatDate(new Date(cart.date))}
                  </span>
                </CardTitle>
                {pending && <Badge variant="secondary">Processing…</Badge>}
              </CardHeader>
              <CardContent className="space-y-1">
                <ul className="space-y-1">
                  {lines.map(({ productId, quantity, product }) => (
                    <li key={productId} className="flex gap-2">
                      <span className="tabular-nums">{quantity} ×</span>
                      {product ? (
                        <span className="line-clamp-1">{product.title}</span>
                      ) : (
                        <Skeleton className="h-4 w-48" />
                      )}
                    </li>
                  ))}
                </ul>
                {total != null && (
                  <p className="pt-1 font-semibold tabular-nums">
                    Total {formatPrice(total)}
                  </p>
                )}
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
