import { isRouteErrorResponse, Link, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  let title = "Something went wrong";
  let detail = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    detail = typeof error.data === "string" ? error.data : detail;
  } else if (import.meta.env.DEV) {
    detail = error instanceof Error ? error.message : String(error);
  }
  if (import.meta.env.DEV) console.error(error);
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <title>{`${title} . Fakestore`}</title>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="max-w-prose text-muted-foreground">{detail}</p>
      <Link
        to="/"
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        Go home
      </Link>
    </main>
  );
}
