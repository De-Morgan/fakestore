import type { Product } from "@/api/types";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import { MAX_QTY, useCartStore } from "../cartStore";
import { selectQty } from "../selectors";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ShoppingCartIcon } from "lucide-react";

type AddToCartButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onClick" | "children"
> & { product: Pick<Product, "id" | "title" | "price" | "image"> };

export function AddToCartButton({ product, ...props }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  // Only this button re-renders when this product's quantity changes.
  const qty = useCartStore(selectQty(product.id));
  const navigate = useNavigate();

  const add = () => {
    // Copy the four fields we need. Passing `product` would persist its description and rating too.
    const { id, title, price, image } = product;
    addItem({ id, title, price, image });
    toast.success("Added to cart", {
      id: "add-to-cart", // Repeated clicks update one toast instead of stacking them.
      description: title,
      action: { label: "View cart", onClick: () => navigate("/cart") },
    });
  };

  return (
    <Button onClick={add} disabled={qty >= MAX_QTY} {...props}>
      <ShoppingCartIcon data-icon="inline-start" />
      Add to cart
      {qty > 0 && <span className="tabular-nums opacity-80">({qty})</span>}
    </Button>
  );
}
