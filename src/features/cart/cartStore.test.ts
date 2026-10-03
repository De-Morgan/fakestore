import { describe, expect, it } from "vitest";
import { MAX_QTY, useCartStore } from "./cartStore";
import { selectCartCount, selectCartTotal, selectQty } from "./selectors";
import { toNewCart } from "./api";

const shirt = { id: 1, title: "Shirt", price: 10.1, image: "shirt.jpg" };
const ring = { id: 2, title: "Ring", price: 0.1, image: "ring.jpg" };

// Actions run outside React through getState(). setup.ts resets the store after each test.
const cart = () => useCartStore.getState();

describe("cartStore", () => {
  it("starts empty", () => {
    expect(cart().items).toEqual({});
  });

  it("adds a new line with qty 1", () => {
    cart().addItem(shirt);
    expect(cart().items[1]).toEqual({ ...shirt, qty: 1 });
  });

  it("increments qty when the same product is added twice", () => {
    cart().addItem(shirt);
    cart().addItem(shirt);
    expect(cart().items[1]?.qty).toBe(2);
  });

  it("never mutates the previous items object", () => {
    cart().addItem(shirt);
    const before = cart().items;
    const lineBefore = before[1];

    cart().addItem(shirt);

    expect(cart().items).not.toBe(before);
    expect(before[1]).toBe(lineBefore);
    expect(lineBefore?.qty).toBe(1);
  });

  it("caps qty at MAX_QTY when adding", () => {
    useCartStore.setState({ items: { 1: { ...shirt, qty: MAX_QTY } } });
    cart().addItem(shirt);
    expect(cart().items[1]?.qty).toBe(MAX_QTY);
  });

  it("sets qty, capped at MAX_QTY", () => {
    cart().addItem(shirt);
    cart().setQty(1, 5);
    expect(cart().items[1]?.qty).toBe(5);
    cart().setQty(1, 500);
    expect(cart().items[1]?.qty).toBe(MAX_QTY);
  });

  it("removes the line when qty is set to 0", () => {
    cart().addItem(shirt);
    cart().setQty(1, 0);
    expect(cart().items[1]).toBeUndefined();
  });

  it("ignores setQty for a product that isn't in the cart", () => {
    const before = cart().items;
    cart().setQty(42, 3);
    expect(cart().items).toBe(before);
  });

  it("removes one line and clears all lines", () => {
    cart().addItem(shirt);
    cart().addItem(ring);

    cart().removeItem(1);
    expect(Object.keys(cart().items)).toEqual(["2"]);

    cart().clear();
    expect(cart().items).toEqual({});
  });

  it("persists items (not actions) to localStorage", () => {
    cart().addItem(shirt);
    const saved = JSON.parse(localStorage.getItem("fakestore:cart") ?? "{}");
    expect(saved).toEqual({
      state: { items: { 1: { ...shirt, qty: 1 } } },
      version: 1,
    });
  });
});

describe("cart selectors", () => {
  it("counts units, not lines", () => {
    cart().addItem(shirt);
    cart().addItem(shirt);
    cart().addItem(ring);
    expect(selectCartCount(cart())).toBe(3);
  });

  it("rounds the total to cents", () => {
    // 0.1 * 3 = 0.30000000000000004 in floating point.
    useCartStore.setState({ items: { 2: { ...ring, qty: 3 } } });
    expect(selectCartTotal(cart())).toBe(0.3);

    // 10.1 * 3 + 0.1 * 3 = 30.599999999999998
    useCartStore.setState({
      items: { 1: { ...shirt, qty: 3 }, 2: { ...ring, qty: 3 } },
    });
    expect(selectCartTotal(cart())).toBe(30.6);
  });

  it("is 0 for an empty cart", () => {
    expect(selectCartCount(cart())).toBe(0);
    expect(selectCartTotal(cart())).toBe(0);
  });

  it("reads one product's qty, or 0", () => {
    cart().addItem(shirt);
    expect(selectQty(1)(cart())).toBe(1);
    expect(selectQty(2)(cart())).toBe(0);
  });
});

describe("toNewCart", () => {
  it("maps cart lines to FakeStore's cart shape", () => {
    const cartBody = toNewCart(2, [
      { ...shirt, qty: 2 },
      { ...ring, qty: 1 },
    ]);
    expect(cartBody).toEqual({
      userId: 2,
      date: expect.any(String),
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    });
    expect(Number.isNaN(Date.parse(cartBody.date))).toBe(false);
  });
});
