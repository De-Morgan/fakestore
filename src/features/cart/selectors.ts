import { useCartStore, type CartState } from "./cartStore";
import { useShallow } from "zustand/react/shallow";

export const selectCartCount = (s: CartState) =>
  Object.values(s.items).reduce((n, i) => n + i.qty, 0);

export const selectCartTotal = (s: CartState) =>
  Math.round(
    Object.values(s.items).reduce((t, i) => t + i.price * i.qty, 0) * 100,
  ) / 100;

export const selectQty = (id: number) => (s: CartState) =>
  s.items[id]?.qty ?? 0;

// Arrays are new on every call, so compare them element by element.
export const useCartItems = () =>
  useCartStore(useShallow((s) => Object.values(s.items)));
