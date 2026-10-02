import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { apiFetch } from "@/api/client";
import { CartSchema, type NewCart } from "@/api/types";
import { userCartsQuery } from "@/features/auth/api";
import { useCartStore, type CartItem } from "./cartStore";

export const toNewCart = (userId: number, items: CartItem[]): NewCart => ({
  userId,
  date: new Date().toISOString(),
  products: items.map((i) => ({ productId: i.id, quantity: i.qty })),
});

type CheckoutVars = { cart: NewCart; simulateFailure?: boolean };

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useCheckoutMutation() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((s) => s.clear);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ cart, simulateFailure }: CheckoutVars) => {
      if (import.meta.env.DEV && simulateFailure) {
        await delay(1500); // long enough to see the optimistic order before it rolls back
        throw new Error("Simulated checkout failure");
      }
      return apiFetch("/carts", CartSchema, { method: "POST", data: cart });
    },

    onMutate: async ({ cart }) => {
      const { queryKey } = userCartsQuery(cart.userId);
      // 1. Stop any in-flight fetch of this list from landing on top of our write.
      await queryClient.cancelQueries({ queryKey });
      // 2. Make sure the real history is cached, so the optimistic order is added to it rather than replacing it.
      await queryClient.ensureQueryData(userCartsQuery(cart.userId));
      // 3. Optimistic write. A negative id can't clash with a server id and marks the row as pending.
      const tempId = -Date.now();
      queryClient.setQueryData(queryKey, (old = []) => [
        { ...cart, id: tempId },
        ...old,
      ]);
      // 4. Show the history now that the order is in it. Navigating any earlier would mount the
      //    account page mid-fetch, and an unmount there (StrictMode does one) cancels step 2.
      navigate("/account");
      // 5. Whatever we return here arrives in onError/onSuccess as `context`.
      return { queryKey, tempId };
    },

    onError: (error, _vars, context) => {
      // Roll back by removing only our row, so a second checkout in flight isn't undone too.
      if (context) {
        queryClient.setQueryData(context.queryKey, (old = []) =>
          old.filter((c) => c.id !== context.tempId),
        );
      }
      if (import.meta.env.DEV) console.error(error);
      toast.error("Checkout failed. Your cart is unchanged.");
    },

    onSuccess: (saved, _vars, context) => {
      // Swap the temporary row for the server's. No invalidate: FakeStore didn't store it, so a refetch would drop it.
      queryClient.setQueryData(context.queryKey, (old = []) =>
        old.map((c) => (c.id === context.tempId ? saved : c)),
      );
      clearCart();
      toast.success(`Order #${saved.id} placed`);
    },
  });
}
