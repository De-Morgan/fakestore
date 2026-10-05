import type { Product } from "@/api/types";
import { noop, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { StarIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { productDetailQuery, productListQuery } from "@/features/products/api";
import { ProductImage } from "@/features/products/components/ProductImage";
import { formatPrice } from "@/lib/format";
import { FLOORS, topRatedByCategory, type Floor } from "./floors";

const HEADING_ID = "best-rated-heading";

// The one live section on the homepage. Render it inside a QueryBoundary whose error fallback
// is null: if the API is down the section disappears and the rest of the page stands.
export function FloorWindows() {
  const { data: products } = useSuspenseQuery(
    productListQuery({ sort: "asc" }),
  );
  const best = topRatedByCategory(products);
  const windows = FLOORS.flatMap((floor) => {
    const product = best.get(floor.category);
    return product ? [{ floor, product }] : [];
  });
  if (windows.length === 0) return null;

  return (
    <Shell>
      <ul className={listClass}>
        {windows.map(({ floor, product }) => (
          <li key={floor.floor} className="snap-start">
            <Vitrine floor={floor} product={product} />
          </li>
        ))}
      </ul>
    </Shell>
  );
}

FloorWindows.Skeleton = function FloorWindowsSkeleton() {
  return (
    <Shell>
      <ul
        role="status"
        aria-label="Loading best-rated products"
        className={listClass}
      >
        {FLOORS.map(({ floor }) => (
          <li key={floor} className="snap-start">
            <Skeleton className="aspect-[3/4] rounded-xl" />
          </li>
        ))}
      </ul>
    </Shell>
  );
};

// Mobile: a swipeable row of windows. Desktop: four across.
const listClass =
  "mt-8 grid auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory sm:auto-cols-[45%] lg:grid-flow-row lg:grid-cols-4 lg:overflow-visible";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section aria-labelledby={HEADING_ID} className="border-t">
      <Container className="py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2
            id={HEADING_ID}
            className="font-display text-4xl font-bold tracking-[0.02em] uppercase sm:text-5xl"
          >
            Best rated on each floor
          </h2>
          <p className="text-sm text-muted-foreground">
            The highest customer rating in each department.
          </p>
        </div>
        {children}
      </Container>
    </section>
  );
}

function Vitrine({ floor, product }: { floor: Floor; product: Product }) {
  const queryClient = useQueryClient();
  const { id, title, price, image, rating } = product;
  const prefetch = () =>
    void queryClient.query(productDetailQuery(id)).catch(noop);

  return (
    <article className="relative flex h-full flex-col gap-4 rounded-xl bg-window p-4 transition-shadow hover:shadow-md has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50">
      <div className="flex items-center justify-between gap-2 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
        <span>
          Floor {floor.floor} · {floor.label}
        </span>
        <span
          className="flex items-center gap-1 tracking-normal"
          aria-label={`Rated ${rating.rate} out of 5 from ${rating.count} reviews`}
        >
          <StarIcon
            aria-hidden="true"
            className="size-3 fill-brass text-brass"
          />
          {rating.rate}
          <span className="opacity-70">({rating.count})</span>
        </span>
      </div>
      {/* Product shots are on white: multiply melts the white into the window glass.
          Dark mode can't multiply onto a dark ground, so the photo gets its own pale plate. */}
      <div className="rounded-lg p-6 dark:bg-white/95">
        <ProductImage
          src={image}
          alt=""
          size={300}
          loading="lazy"
          className="mix-blend-multiply"
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
      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="font-mono font-medium tabular-nums">
          {formatPrice(price)}
        </span>
        <AddToCartButton
          product={product}
          variant="outline"
          size="sm"
          aria-label={`Add ${title} to cart`}
          className="relative z-10"
        />
      </div>
    </article>
  );
}
