import { Suspense, useId, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

type SectionBoundaryProps = {
  title: string;
  fallback: ReactNode;
  children: ReactNode;
};

// An independent page region: it loads and fails on its own, without blocking or breaking the page.
export function SectionBoundary({
  title,
  fallback,
  children,
}: SectionBoundaryProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <h2 id={headingId} className="text-xl font-semibold">
        {title}
      </h2>
      {/* ErrorBoundary outside Suspense, so a failed load replaces the skeleton too. */}
      <ErrorBoundary
        fallback={
          <p className="text-muted-foreground">Couldn't load this section.</p>
        }
      >
        <Suspense fallback={fallback}>{children}</Suspense>
      </ErrorBoundary>
    </section>
  );
}
