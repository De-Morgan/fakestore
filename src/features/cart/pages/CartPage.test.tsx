import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { renderWithProviders } from "@/test/renderWithProviders";
import { json } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { API, FAKE_JWT, products } from "@/test/msw/fixtures";
import { useAuthStore } from "@/features/auth/authStore";
import { useCartStore, type CartItem } from "../cartStore";

const line = (index: number, qty: number): CartItem => {
  const { id, title, price, image } = products[index]!;
  return { id, title, price, image, qty };
};

// Fjallraven Backpack × 2 ($219.90) + Slim Fit T-Shirt × 1 ($22.30) = $242.20
const preloadCart = () =>
  useCartStore.setState({ items: { 1: line(0, 2), 2: line(1, 1) } });

const subtotal = () => screen.getByText(/^Subtotal/).nextElementSibling;

describe("CartPage", () => {
  it("shows the empty state", async () => {
    renderWithProviders({ initialEntries: ["/cart"] });

    expect(
      await screen.findByRole("heading", { name: /your cart is empty/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse products/i }),
    ).toHaveAttribute("href", "/products");
  });

  it("lists the lines with a rounded subtotal", async () => {
    preloadCart();
    renderWithProviders({ initialEntries: ["/cart"] });

    expect(
      await screen.findByRole("heading", { name: "Cart" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Subtotal (3 items)")).toBeInTheDocument();
    expect(subtotal()).toHaveTextContent("$242.20");
  });

  it("changes quantities with the buttons and the input", async () => {
    const user = userEvent.setup();
    preloadCart();
    renderWithProviders({ initialEntries: ["/cart"] });

    const shirt = await screen.findByRole("group", {
      name: "Quantity for Slim Fit T-Shirt",
    });
    const decrease = within(shirt).getByRole("button", {
      name: "Decrease quantity",
    });
    expect(decrease).toBeDisabled(); // qty 1 can't go lower; removing is explicit

    await user.click(
      within(shirt).getByRole("button", { name: "Increase quantity" }),
    );
    expect(screen.getByText("Subtotal (4 items)")).toBeInTheDocument();

    // Typed values commit on Enter and are clamped to 1…99.
    const input = within(shirt).getByRole("spinbutton", { name: "Quantity" });
    await user.clear(input);
    await user.type(input, "250{Enter}");
    expect(useCartStore.getState().items[2]?.qty).toBe(99);
  });

  it("removes a line and clears the cart", async () => {
    const user = userEvent.setup();
    preloadCart();
    renderWithProviders({ initialEntries: ["/cart"] });

    await user.click(
      await screen.findByRole("button", { name: "Remove Fjallraven Backpack" }),
    );
    expect(
      screen.queryByRole("link", { name: "Fjallraven Backpack" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Subtotal (1 item)")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear cart" }));
    expect(
      await screen.findByRole("heading", { name: /your cart is empty/i }),
    ).toBeInTheDocument();
  });

  it("asks a logged-out user to log in, then returns to the cart", async () => {
    preloadCart();
    renderWithProviders({ initialEntries: ["/cart"] });

    expect(
      await screen.findByRole("link", { name: /log in to check out/i }),
    ).toHaveAttribute("href", "/login?next=%2Fcart");
    expect(
      screen.queryByRole("button", { name: "Checkout" }),
    ).not.toBeInTheDocument();
  });

  it("checks out: the order shows in the account history and the cart empties", async () => {
    const user = userEvent.setup();
    preloadCart();
    useAuthStore.setState({ token: FAKE_JWT, userId: 2 });
    const { router } = renderWithProviders({ initialEntries: ["/cart"] });

    await user.click(await screen.findByRole("button", { name: "Checkout" }));

    expect(await screen.findByText("Order #11")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/account");
    expect(screen.getByText("Order #3")).toBeInTheDocument(); // the existing history is kept
    expect(await screen.findByText("Order #11 placed")).toBeInTheDocument();
    expect(useCartStore.getState().items).toEqual({});
  });

  it("rolls back and keeps the cart when checkout fails", async () => {
    const user = userEvent.setup();
    server.use(http.post(`${API}/carts`, () => json(null, { status: 500 })));
    preloadCart();
    useAuthStore.setState({ token: FAKE_JWT, userId: 2 });
    renderWithProviders({ initialEntries: ["/cart"] });

    await user.click(await screen.findByRole("button", { name: "Checkout" }));

    expect(
      await screen.findByText("Checkout failed. Your cart is unchanged."),
    ).toBeInTheDocument();
    expect(screen.queryByText("New order")).not.toBeInTheDocument();
    expect(screen.getByText("Order #3")).toBeInTheDocument();
    expect(Object.keys(useCartStore.getState().items)).toEqual(["1", "2"]);
  });
});
