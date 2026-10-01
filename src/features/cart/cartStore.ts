import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

export const MAX_QTY = 99;

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  qty: number;
};

export type CartState = {
  items: Record<number, CartItem>;
  addItem: (product: Omit<CartItem, "qty">) => void;
  setQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
};

const without = (items: CartState["items"], id: number) => {
  const next = { ...items };
  delete next[id];
  return next;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: {},
        addItem: (product) =>
          set(
            (s) => {
              const line = s.items[product.id];
              const next = line
                ? { ...line, qty: Math.min(line.qty + 1, MAX_QTY) }
                : { ...product, qty: 1 };
              return { items: { ...s.items, [product.id]: next } };
            },
            undefined,
            "cart/addItem",
          ),
        setQty: (id, qty) =>
          set(
            (s) => {
              const line = s.items[id];
              if (!line) return s;
              if (qty <= 0) return { items: without(s.items, id) };
              return {
                items: {
                  ...s.items,
                  [id]: { ...line, qty: Math.min(qty, MAX_QTY) },
                },
              };
            },
            undefined,
            "cart/setQty",
          ),
        removeItem: (id) =>
          set(
            (s) => ({ items: without(s.items, id) }),
            undefined,
            "cart/removeItem",
          ),
        clear: () => set({ items: {} }, undefined, "cart/clear"),
      }),
      {
        name: "fakestore:cart",
        version: 1,
        // Persist data only. Actions are recreated by the store on every load.
        partialize: (s) => ({ items: s.items }),
      },
    ),
    { name: "cart", enabled: import.meta.env.DEV },
  ),
);
