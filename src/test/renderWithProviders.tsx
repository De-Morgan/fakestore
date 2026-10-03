import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { createRoutes } from "@/app/router";
import { Toaster } from "@/components/ui/sonner";

// Every test gets its own QueryClient and router, so no cache or history leaks between tests.
export function renderWithProviders({
  initialEntries = ["/"],
}: { initialEntries?: string[] } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      // retry: false, or error tests sit through the backoff and time out.
      // gcTime: Infinity, so no garbage-collection timers outlive the test.
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  const router = createMemoryRouter(createRoutes({ queryClient }), {
    initialEntries,
  });

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>,
  );
  return { ...utils, queryClient, router };
}
