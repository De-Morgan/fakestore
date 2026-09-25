import { Container } from "@/components/layout/Container";
import { Link, useParams } from "react-router";

export default function ProductDetailPage() {
  const { id } = useParams();

  return (
    <Container className="space-y-4 py-8">
      <h1 className="text-2xl font-bold">Product {id}</h1>
      <p className="text-muted-foreground">
        Product details arrive in Phase 3.
      </p>
      <Link
        to="/products"
        className="text-primary underline-offset-4 hover:underline"
      >
        ← Back to products
      </Link>
    </Container>
  );
}
