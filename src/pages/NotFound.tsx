import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">
        We couldn't find the page you were looking for.
      </p>
      <Link
        to="/"
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        Go home
      </Link>
    </section>
  );
}
