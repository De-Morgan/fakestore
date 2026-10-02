import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { userCartsQuery, userQuery } from "../api";
import { useAuthStore } from "../authStore";
import { useLogout } from "../useLogout";
import { OrderHistory } from "./components/OrderHistory";

export default function AccountPage() {
  const userId = useAuthStore((s) => s.userId);
  const logout = useLogout();

  // Dependent queries: idle until there's a userId. The route guard ensures one,
  // but `enabled` keeps this component correct on its own and documents the dependency.
  // Both run in parallel, since neither needs the other's data.
  const user = useQuery({ ...userQuery(userId ?? 0), enabled: userId != null });
  const carts = useQuery({
    ...userCartsQuery(userId ?? 0),
    enabled: userId != null,
  });

  return (
    <Container className="space-y-8 py-8">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">Account</h1>
        <Button variant="outline" size="sm" onClick={logout}>
          Log out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {user.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : user.isError ? (
            <p className="text-muted-foreground">Couldn't load your profile.</p>
          ) : (
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="capitalize">
                {user.data.name.firstname} {user.data.name.lastname}
              </dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all">{user.data.email}</dd>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{user.data.phone}</dd>
              <dt className="text-muted-foreground">Address</dt>
              <dd className="capitalize">
                {user.data.address.number} {user.data.address.street},{" "}
                {user.data.address.city} {user.data.address.zipcode}
              </dd>
            </dl>
          )}
        </CardContent>
      </Card>

      <section aria-labelledby="orders-heading" className="space-y-4">
        <h2 id="orders-heading" className="text-xl font-semibold">
          Order history
        </h2>
        {carts.isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : carts.isError ? (
          <p className="text-muted-foreground">Couldn't load your orders.</p>
        ) : (
          <OrderHistory carts={carts.data} />
        )}
      </section>
    </Container>
  );
}
