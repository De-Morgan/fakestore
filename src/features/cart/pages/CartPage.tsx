import { Container } from "@/components/layout/Container";
import { selectCartCount, selectCartTotal, useCartItems } from "../selectors";
import { useCartStore } from "../cartStore";
import { ShoppingCartIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { CartLine } from "../components/CartLine";

export default function CartPage() {
  const items = useCartItems();
  const count = useCartStore(selectCartCount);
  const total = useCartStore(selectCartTotal);
  const clear = useCartStore((s) => s.clear);

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center gap-4 py-16 text-center">
        <ShoppingCartIcon
          aria-hidden="true"
          className="size-12 text-muted-foreground"
        />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Find something you like and it will show up here.
        </p>
        <Link to="/products" className={buttonVariants()}>
          Browse products
        </Link>
      </Container>
    );
  }
  return (
    <Container className="space-y-4 py-8">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">Cart</h1>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear cart
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <ul className="divide-y border-y">
          {items.map((item) => (
            <CartLine key={item.id} item={item} />
          ))}
        </ul>

        <Card className="lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({count} {count === 1 ? "item" : "items"})
            </span>
            <span className="font-semibold tabular-nums">
              {formatPrice(total)}
            </span>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2">
            <Button size="lg" disabled>
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
