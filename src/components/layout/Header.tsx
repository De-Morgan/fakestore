import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router";
import { Container } from "./Container";
import { navLinks } from "./navLinks";
import { buttonVariants } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "./MobileNav";
import { UserMenu } from "./UserMenu";
import { ShoppingCartIcon } from "lucide-react";

export default function Header() {
  const cartCount = 0; // Phase 4: read from the cart store.

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-2">
        <MobileNav />
        <Link
          to="/"
          className="rounded-md text-lg font-semibold text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          FakeStore
        </Link>
        <nav aria-label="Main" className="mx-auto hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {navLinks.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                      isActive &&
                        "font-semibold text-primary hover:text-primary",
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative",
            )}
          >
            <ShoppingCartIcon />
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] tabular-nums">
              {cartCount}
            </Badge>
          </Link>
          <UserMenu />
        </div>
      </Container>
    </header>
  );
}
