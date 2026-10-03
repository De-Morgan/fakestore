# FakeStore

A storefront built on the [FakeStore API](https://fakestoreapi.com) with React 19, React Router, TanStack Query, Zustand, Tailwind v4 and shadcn/ui.

**Live:** _not deployed yet: add the Vercel URL here._

## Getting started

Requires Node 22+ and pnpm (the version is pinned in `package.json` → `packageManager`).

```bash
pnpm install
cp .env.example .env
pnpm dev
```

### Demo account

FakeStore has a fixed set of users. Log in with **`mor_2314` / `83r5^_`**, or click **Use demo account** on the login page.

FakeStore accepts writes but doesn't save them: an order you place shows in your history for this session only.

## Scripts

| Script                         | What it does                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `pnpm dev`                     | Dev server with HMR                                                            |
| `pnpm build`                   | Type-check, then production build to `dist/`                                   |
| `pnpm preview`                 | Serve the production build locally                                             |
| `pnpm typecheck`               | `tsc -b`                                                                       |
| `pnpm lint`                    | ESLint                                                                         |
| `pnpm format` / `format:check` | Prettier write / check                                                         |
| `pnpm test`                    | Vitest in watch mode                                                           |
| `pnpm test:run`                | Vitest once (what CI runs)                                                     |
| `pnpm coverage`                | Vitest once with coverage. Fails if `src/features/cart` drops below 90% lines. |
| `pnpm analyze`                 | Production build plus a bundle treemap in `stats.html`                         |

## Environment

| Variable       | Example                    | Purpose                        |
| -------------- | -------------------------- | ------------------------------ |
| `VITE_API_URL` | `https://fakestoreapi.com` | Base URL for every API request |

`VITE_` variables are **public**. Vite inlines them into the JavaScript bundle at build time, so anyone can read them in the browser. Never put a secret in one. Changing one on the host needs a **rebuild**, not a restart.

## Architecture

```
src/
  api/          axios instance, ApiError, apiFetch (zod-validated), shared schemas
  app/          QueryClient, providers, route tree (createRoutes)
  components/   layout (header, footer, boundaries) and shadcn ui/
  features/
    products/   list + detail pages, query options, URL-param parsing
    cart/       Zustand cart store, selectors, checkout mutation, cart page
    auth/       Zustand auth store, login, route guards, account page
    theme/      Zustand theme store + toggle
  test/         Vitest setup, MSW server/handlers/fixtures, renderWithProviders
```

Each kind of state has exactly one owner:

| State              | Owner                                      | Examples                                          |
| ------------------ | ------------------------------------------ | ------------------------------------------------- |
| **Server** state   | TanStack Query cache                       | products, categories, user profile, order history |
| **Client** state   | Zustand stores (persisted to localStorage) | cart lines, auth token, theme                     |
| **URL** state      | Search params                              | `?category=`, `?sort=`, `?q=`, `?page=`           |
| **Local UI** state | `useState`                                 | search box text before the debounce, form fields  |

API data never goes into a Zustand store. Filters live in the URL, so they are shareable, survive a refresh and work with the Back button.

```
 URL params ──► ProductsPage ──► useQuery(productListQuery) ──► apiFetch ──► FakeStore
                     │                    ▲
                     ▼                    │ select: search + paginate (no new request)
               useCartStore ◄── AddToCartButton
                     │
                     ▼
 CartPage ──► useCheckoutMutation ──► optimistic write to the order-history cache ──► /account
```

## Testing

- **Unit:** store actions and selectors, called through `useCartStore.getState()`.
- **Component:** whole pages rendered through the real route tree (`createRoutes`) with a fresh `QueryClient` and memory router per test. Queries go by role and label.
- **Network:** [MSW](https://mswjs.io) mocks FakeStore at the network level, so the real axios instance, interceptors, zod parsing and TanStack Query all run. Any request without a handler fails the test.

Every Zustand store and `localStorage` are reset after each test (`src/test/setup.ts`).

## CI and deploy

`.github/workflows/ci.yml` runs on pushes to `main` and on every pull request: install (frozen lockfile) → typecheck → lint → format check → tests with coverage → build.

Deploys go to Vercel (framework preset: Vite). Set `VITE_API_URL` in the project's environment variables. `vercel.json` rewrites every path to `index.html`, so deep links like `/products/3` survive a hard refresh.
