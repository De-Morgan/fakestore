import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { renderWithProviders } from "@/test/renderWithProviders";
import { json } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { API, DEMO_USER, FAKE_JWT } from "@/test/msw/fixtures";
import { useAuthStore } from "../authStore";

async function logIn(username: string, password: string) {
  const user = userEvent.setup();
  if (username) await user.type(screen.getByLabelText("Username"), username);
  if (password) await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: "Log in" }));
}

describe("LoginPage", () => {
  it("shows field errors and sends nothing when the form is empty", async () => {
    let requests = 0;
    server.events.on("request:start", () => requests++);
    renderWithProviders({ initialEntries: ["/login"] });
    await screen.findByRole("heading", { name: "Log in" });

    await logIn("", "");

    expect(await screen.findByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(requests).toBe(0);
    server.events.removeAllListeners();
  });

  it("shows a message for wrong credentials and stays logged out", async () => {
    renderWithProviders({ initialEntries: ["/login"] });
    await screen.findByRole("heading", { name: "Log in" });

    await logIn(DEMO_USER.username, "wrong");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid username or password",
    );
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("shows a generic message when the server fails", async () => {
    server.use(
      http.post(`${API}/auth/login`, () => json(null, { status: 500 })),
    );
    renderWithProviders({ initialEntries: ["/login"] });
    await screen.findByRole("heading", { name: "Log in" });

    await logIn(DEMO_USER.username, DEMO_USER.password);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /something went wrong/i,
    );
  });

  it("logs in and redirects to `next`", async () => {
    const { router } = renderWithProviders({
      initialEntries: ["/login?next=%2Fcart"],
    });
    expect(await screen.findByText("Log in to continue.")).toBeInTheDocument();

    await logIn(DEMO_USER.username, DEMO_USER.password);

    expect(
      await screen.findByRole("heading", { name: /your cart is empty/i }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/cart");
    expect(useAuthStore.getState()).toMatchObject({
      token: FAKE_JWT,
      userId: 2,
    });
  });

  it("ignores an external `next` and goes to the account page", async () => {
    const { router } = renderWithProviders({
      initialEntries: ["/login?next=%2F%2Fevil.example"],
    });
    await screen.findByRole("heading", { name: "Log in" });

    await logIn(DEMO_USER.username, DEMO_USER.password);

    expect(
      await screen.findByRole("heading", { name: "Account" }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/account");
  });

  it("fills in the demo account", async () => {
    const user = userEvent.setup();
    renderWithProviders({ initialEntries: ["/login"] });

    await user.click(
      await screen.findByRole("button", { name: /use demo account/i }),
    );

    expect(screen.getByLabelText("Username")).toHaveValue(DEMO_USER.username);
    expect(screen.getByLabelText("Password")).toHaveValue(DEMO_USER.password);
  });
});

describe("auth guards", () => {
  it("sends a logged-out visitor from /account to /login with `next`", async () => {
    const { router } = renderWithProviders({ initialEntries: ["/account"] });

    expect(
      await screen.findByRole("heading", { name: "Log in" }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
    expect(router.state.location.search).toBe("?next=%2Faccount");
  });

  it("sends a logged-in user away from /login", async () => {
    useAuthStore.setState({ token: FAKE_JWT, userId: 2 });
    const { router } = renderWithProviders({ initialEntries: ["/login"] });

    expect(
      await screen.findByRole("heading", { name: "Account" }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/account");
  });
});
