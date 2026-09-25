import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors ProductCard's layout (Phase 3) so nothing shifts when data arrives.
export function ProductCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardContent className="space-y-3">
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
}
