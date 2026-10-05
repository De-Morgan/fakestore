import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { http } from "msw";
import { renderWithProviders } from "@/test/renderWithProviders";
import { json } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { API, products } from "@/test/msw/fixtures";
import type { Product } from "@/api/types";
import { FLOORS, topRatedByCategory } from "./home/floors";

describe("HomePage", () => {
  it("renders the directory and every floor link when the API is down", async () => {
    server.use(
      http.get(`${API}/products`, () =>
        json({ message: "down" }, { status: 500 }),
      ),
    );
    renderWithProviders();

    expect(
      await screen.findByRole("heading", { level: 1, name: /pick a floor/i }),
    ).toBeInTheDocument();
    const directory = screen.getByRole("navigation", {
      name: "Store directory",
    });
    for (const { floor, label, category } of FLOORS) {
      expect(
        within(directory).getByRole("link", {
          name: new RegExp(`floor ${floor}, ${label}`, "i"),
        }),
      ).toHaveAttribute(
        "href",
        `/products?category=${encodeURIComponent(category)}`,
      );
    }
    expect(
      screen.getByRole("link", { name: /see your orders/i }),
    ).toBeInTheDocument();

    // The live section vanishes quietly: no error message, no orphan heading.
    expect(
      screen.getByRole("link", { name: /browse the catalogue/i }),
    ).toBeInTheDocument();
    await expect
      .poll(() => screen.queryByRole("status", { name: /loading best-rated/i }))
      .toBeNull();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /best rated on each floor/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the best-rated product on each floor when the API is up", async () => {
    renderWithProviders();

    await screen.findByRole("link", { name: "Gold Ring" });
    const section = screen.getByRole("region", {
      name: /best rated on each floor/i,
    });
    // Fixtures: men's has two equal ratings (first listed wins); no women's products.
    for (const title of [
      "Fjallraven Backpack",
      "Gold Ring",
      "External Hard Drive",
    ]) {
      expect(
        within(section).getByRole("link", { name: title }),
      ).toBeInTheDocument();
      expect(
        within(section).getByRole("button", { name: `Add ${title} to cart` }),
      ).toBeInTheDocument();
    }
    expect(
      within(section).queryByRole("link", { name: "Slim Fit T-Shirt" }),
    ).not.toBeInTheDocument();
  });
});

describe("topRatedByCategory", () => {
  const withRating = (p: Product, rate: number, count: number): Product => ({
    ...p,
    rating: { rate, count },
  });
  const [backpack, tee] = products.filter(
    (p) => p.category === "men's clothing",
  ) as [Product, Product];

  it("prefers the higher rate, then more reviews", () => {
    expect(
      topRatedByCategory([
        withRating(backpack, 4, 900),
        withRating(tee, 4.5, 1),
      ]).get("men's clothing")?.title,
    ).toBe(tee.title);
    expect(
      topRatedByCategory([
        withRating(backpack, 4, 10),
        withRating(tee, 4, 11),
      ]).get("men's clothing")?.title,
    ).toBe(tee.title);
  });
});
