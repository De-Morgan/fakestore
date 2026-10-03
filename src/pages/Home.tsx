import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <section className="bg-linear-to-b from-accent to-background">
      <title>FakeStore</title>
      <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Everything you need, one click away
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Browse clothing, jewellery and electronics from the FakeStore
          catalogue.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/products" className={buttonVariants({ size: "lg" })}>
            Shop now
          </Link>
          <Link
            to="/products?category=jewelery"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Browse jewellery
          </Link>
        </div>
      </Container>
    </section>
  );
}
