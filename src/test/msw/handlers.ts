import { http, HttpResponse, type JsonBodyType } from "msw";
import type { NewCart } from "@/api/types";
import {
  API,
  categories,
  DEMO_USER,
  FAKE_JWT,
  products,
  user,
  userCarts,
} from "./fixtures";

// jsdom's XHR enforces CORS (the test page is on localhost), so every mocked response needs
// the header FakeStore really sends. Without it axios sees a network error.
const cors = { "Access-Control-Allow-Origin": "*" };

export const json = (body: JsonBodyType, init: ResponseInit = {}) =>
  HttpResponse.json(body, {
    ...init,
    headers: { ...cors, ...init.headers },
  });

// FakeStore's `sort` orders by id.
const sorted = (list: typeof products, request: Request) =>
  new URL(request.url).searchParams.get("sort") === "desc"
    ? list.toReversed()
    : list;

export const handlers = [
  http.get(`${API}/products`, ({ request }) => json(sorted(products, request))),
  // Registered before /products/:id, which would otherwise match "categories" as an id.
  http.get(`${API}/products/categories`, () => json(categories)),
  http.get(`${API}/products/category/:category`, ({ params, request }) =>
    json(
      sorted(
        products.filter((p) => p.category === params.category),
        request,
      ),
    ),
  ),
  http.get(`${API}/products/:id`, ({ params }) => {
    const product = products.find((p) => p.id === Number(params.id));
    // Mimic FakeStore: an unknown id is a 200 with an empty body.
    return product
      ? json(product)
      : new HttpResponse("", { status: 200, headers: cors });
  }),

  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as typeof DEMO_USER;
    return body.username === DEMO_USER.username &&
      body.password === DEMO_USER.password
      ? json({ token: FAKE_JWT })
      : json("username or password is incorrect", {
          status: 401,
        });
  }),
  http.get(`${API}/users/:id`, () => json(user)),
  http.get(`${API}/carts/user/:id`, () => json(userCarts)),
  // FakeStore echoes the cart back with an id (always 11), and doesn't save it.
  http.post(`${API}/carts`, async ({ request }) => {
    const cart = (await request.json()) as NewCart;
    return json({ ...cart, id: 11 });
  }),
];
