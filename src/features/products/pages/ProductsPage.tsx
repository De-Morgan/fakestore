import { Link } from "react-router";

export default function ProductsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <p className="text-muted-foreground">
        The product grid arrives in Phase 3.
      </p>
      <ul className="list-inside list-disc">
        {[1, 2, 3].map((id) => (
          <li key={id}>
            <Link
              to={`/products/${id}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              Product {id}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
