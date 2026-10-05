import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { QueryBoundary } from "@/components/QueryBoundary";
import { buttonVariants } from "@/components/ui/button";
import { DirectoryBoard } from "./home/DirectoryBoard";
import { FloorWindows } from "./home/FloorWindows";

// Everything except FloorWindows is static, so the page stands when the API is down.
export default function HomePage() {
  return (
    <>
      <title>FakeStore</title>
      <section>
        <Container className="space-y-10 py-12 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                You are here · Lobby
              </p>
              <h1 className="mt-3 font-display text-7xl leading-[0.85] font-extrabold tracking-[0.02em] uppercase sm:text-9xl">
                Pick a floor.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
                Clothing, jewellery and electronics on four floors. Everyday
                basics at the bottom, big-ticket pieces at the top.
              </p>
            </div>
            <Link to="/products" className={buttonVariants({ size: "lg" })}>
              Browse the catalogue
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
          <DirectoryBoard />
        </Container>
      </section>

      <QueryBoundary fallback={<FloorWindows.Skeleton />} errorFallback={null}>
        <FloorWindows />
      </QueryBoundary>

      <section aria-label="Your orders" className="border-t bg-window/50">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-8">
          <p className="text-muted-foreground">
            Shopped here before? Your past orders are on your account page.
          </p>
          <Link
            to="/account"
            className={buttonVariants({ variant: "outline" })}
          >
            See your orders
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Container>
      </section>
    </>
  );
}
