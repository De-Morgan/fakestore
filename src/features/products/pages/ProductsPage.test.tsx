import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { renderWithProviders } from "@/test/renderWithProviders";
import { json } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { API, products } from "@/test/msw/fixtures";
import { useCartStore } from "@/features/cart/cartStore";

describe("ProductsPage", () => {
  it("shows a skeleton, then the products", async () => {
    renderWithProviders({ initialEntries: ["/products"] });

    expect(
      await screen.findByRole("status", { name: /loading products/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("4 products")).toBeInTheDocument();
    for (const { title } of products) {
      expect(screen.getByRole("link", { name: title })).toBeInTheDocument();
    }
  });

  it("reads the category from the URL", async () => {
    renderWithProviders({ initialEntries: ["/products?category=jewelery"] });

    expect(await screen.findByText("1 product")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Gold Ring" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Fjallraven Backpack" }),
    ).not.toBeInTheDocument();
  });

  it("writes the category to the URL when you pick one", async () => {
    const user = userEvent.setup();
    const { router } = renderWithProviders({
      initialEntries: ["/products?page=2"],
    });
    await screen.findByText("4 products");

    await user.click(screen.getByRole("combobox", { name: /category/i }));
    await user.click(await screen.findByRole("option", { name: /jewelery/i }));

    // A new filter also drops ?page, so it never opens on an empty page.
    expect(router.state.location.search).toBe("?category=jewelery");
    expect(await screen.findByText("1 product")).toBeInTheDocument();
  });

  it("filters by search text once typing pauses, without a new request", async () => {
    const user = userEvent.setup();
    let listRequests = 0;
    server.events.on("request:start", ({ request }) => {
      if (new URL(request.url).pathname === "/products") listRequests++;
    });
    const { router } = renderWithProviders({ initialEntries: ["/products"] });
    await screen.findByText("4 products");

    await user.type(screen.getByRole("searchbox", { name: /search/i }), "ring");

    expect(await screen.findByText("1 product")).toBeInTheDocument();
    expect(router.state.location.search).toBe("?q=ring");
    expect(screen.getByRole("link", { name: "Gold Ring" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Fjallraven Backpack" }),
    ).not.toBeInTheDocument();
    expect(listRequests).toBe(1);
    server.events.removeAllListeners();
  });

  it("says so when nothing matches the search", async () => {
    renderWithProviders({ initialEntries: ["/products?q=banana"] });
    expect(
      await screen.findByText("No products match “banana”."),
    ).toBeInTheDocument();
  });

  it("shows an error with a working Retry", async () => {
    const user = userEvent.setup();
    let fail = true;
    server.use(
      http.get(`${API}/products`, () =>
        fail ? json(null, { status: 500 }) : json(products),
      ),
    );
    renderWithProviders({ initialEntries: ["/products"] });

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/couldn't load products/i);

    fail = false;
    await user.click(within(alert).getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("4 products")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("adds a product to the cart and announces the new count", async () => {
    const user = userEvent.setup();
    renderWithProviders({ initialEntries: ["/products"] });

    await user.click(
      await screen.findByRole("button", {
        name: "Add Fjallraven Backpack to cart",
      }),
    );

    expect(useCartStore.getState().items[1]?.qty).toBe(1);
    expect(screen.getByText("1 item in cart")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Cart, 1 item" }),
    ).toBeInTheDocument();
  });
});
