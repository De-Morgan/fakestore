import type { Cart, Product, User } from "@/api/types";

export const API = "https://fakestoreapi.com";

const product = (
  id: number,
  title: string,
  price: number,
  category: string,
): Product => ({
  id,
  title,
  price,
  category,
  description: `${title} description`,
  image: `${API}/img/${id}.jpg`,
  rating: { rate: 4.1, count: 120 },
});

export const products: Product[] = [
  product(1, "Fjallraven Backpack", 109.95, "men's clothing"),
  product(2, "Slim Fit T-Shirt", 22.3, "men's clothing"),
  product(5, "Gold Ring", 168, "jewelery"),
  product(9, "External Hard Drive", 64, "electronics"),
];

export const categories = [...new Set(products.map((p) => p.category))];

export const DEMO_USER = { username: "mor_2314", password: "83r5^_" };

const base64url = (value: object) =>
  btoa(JSON.stringify(value))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

// Same shape as FakeStore's token: only `sub` (the user id) matters to the app.
export const FAKE_JWT = [
  base64url({ alg: "HS256", typ: "JWT" }),
  base64url({ sub: 2, user: DEMO_USER.username, iat: 1700000000 }),
  "signature",
].join(".");

export const user: User = {
  id: 2,
  email: "morrison@gmail.com",
  username: DEMO_USER.username,
  name: { firstname: "david", lastname: "morrison" },
  phone: "1-570-236-7033",
  address: {
    street: "Lovers Ln",
    number: 7267,
    city: "kilcoole",
    zipcode: "12926-3874",
  },
};

export const userCarts: Cart[] = [
  {
    id: 3,
    userId: 2,
    date: "2020-03-01T00:00:00.000Z",
    products: [{ productId: 2, quantity: 1 }],
  },
];
