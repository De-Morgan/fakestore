import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/cart", label: "Cart" },
  { to: "/account", label: "Account" },
  { to: "/login", label: "Login" },
];
export default function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to={"/"} className="text-lg font-bold text-primary">
          {" "}
          FakeStore
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-4 text-sm">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground transition-colors hover:text-foreground",
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
      </div>
    </header>
  );
}
