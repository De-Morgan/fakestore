import { Suspense, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";

type QueryBoundaryProps = {
  fallback: ReactNode;
  errorMessage?: string;
  /** Replaces the default "Try again" block. Pass null to hide a failed section entirely. */
  errorFallback?: ReactNode;
  children: ReactNode;
};

// Loading and error states for components that call useSuspenseQuery.
// "Try again" calls reset() first. Without it, the failed query re-throws its cached error
// as soon as the boundary re-renders, and nothing is refetched.
export function QueryBoundary({
  fallback,
  errorMessage = "Couldn't load this section.",
  errorFallback,
  children,
}: QueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        // ErrorBoundary outside Suspense, so a failed load replaces the skeleton too.
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) =>
            errorFallback !== undefined ? (
              errorFallback
            ) : (
              <div role="alert" className="flex flex-col items-start gap-3">
                <p className="text-muted-foreground">{errorMessage}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetErrorBoundary}
                >
                  Try again
                </Button>
              </div>
            )
          }
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
