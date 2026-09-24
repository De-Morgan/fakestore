import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Everything you need, one click away
      </h1>
      <p className="max-w-prose text-muted-foreground">
        Browse clothing, jewellery and electronics from the FakeStore catalogue.
      </p>
      <Link to="/products" className={buttonVariants({ size: "lg" })}>
        Shop products
      </Link>
    </section>
  );
}
