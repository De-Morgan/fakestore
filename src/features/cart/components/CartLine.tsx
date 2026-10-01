import { Link } from "react-router";
import { MAX_QTY, useCartStore, type CartItem } from "../cartStore";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";

const clampQty = (n: number) => Math.min(Math.max(Math.trunc(n), 1), MAX_QTY);

export function CartLine({ item }: { item: CartItem }) {
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const { id, title, price, image, qty } = item;

  // Commit typed input on blur/Enter, not on every keystroke, so "" or "1" on the way to "12" never hits the store.
  const commit = (input: HTMLInputElement) => {
    const n = Number(input.value);
    const next = Number.isFinite(n) && input.value !== "" ? clampQty(n) : qty;
    input.value = String(next);
    if (next !== qty) setQty(id, next);
  };

  return (
    <li className="flex gap-4 py-4">
      <img
        src={image}
        alt=""
        width={80}
        height={80}
        className="size-20 shrink-0 rounded-lg object-contain p-2"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <Link
            to={`/products/${id}`}
            className="line-clamp-2 font-medium underline-offset-4 hover:text-primary hover:underline"
          >
            {title}
          </Link>
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatPrice(price)} each
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div
            role="group"
            aria-label={`Quantity for ${title}`}
            className="flex items-center gap-1"
          >
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Decrease quantity"
              disabled={qty <= 1}
              onClick={() => setQty(id, qty - 1)}
            >
              <MinusIcon />
            </Button>
            <Input
              // Remount when qty changes elsewhere (the +/− buttons) so defaultValue picks it up.
              key={qty}
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_QTY}
              defaultValue={qty}
              aria-label="Quantity"
              className="h-7 w-12 [appearance:textfield] text-center tabular-nums [&::-webkit-inner-spin-button]:appearance-none"
              onBlur={(e) => commit(e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Increase quantity"
              disabled={qty >= MAX_QTY}
              onClick={() => setQty(id, qty + 1)}
            >
              <PlusIcon />
            </Button>
          </div>

          <p className="w-20 text-right font-semibold tabular-nums">
            {formatPrice(price * qty)}
          </p>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${title}`}
            onClick={() => removeItem(id)}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
    </li>
  );
}
