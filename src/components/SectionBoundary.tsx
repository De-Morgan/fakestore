import { Suspense, useId, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryBoundary } from "./QueryBoundary";

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
      <QueryBoundary fallback={fallback}>{children}</QueryBoundary>
    </section>
  );
}
