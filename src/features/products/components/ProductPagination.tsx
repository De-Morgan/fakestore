import { useSearchParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { updateParams } from "../searchParams";

type ProductPaginationProps = {
  page: number;
  pageCount: number;
  disabled?: boolean;
};

export function ProductPagination({
  page,
  pageCount,
  disabled = false,
}: ProductPaginationProps) {
  const [searchParams] = useSearchParams();
  if (pageCount <= 1) return null;

  // Real links (href="/products?category=…&page=2"), so they open in a new tab and survive a reload.
  const linkTo = (target: number) => {
    const search = updateParams(
      searchParams,
      "page",
      target === 1 ? null : String(target),
    ).toString();
    return { search: search ? `?${search}` : "" };
  };
  // An <a> can't be disabled, so take the edge links out of the tab order and pointer events.
  const edge = (isDisabled: boolean) =>
    isDisabled
      ? {
          "aria-disabled": true,
          tabIndex: -1,
          className: "pointer-events-none opacity-50",
        }
      : {};

  return (
    // `inert` while placeholder data is showing: these page numbers belong to the old list.
    <Pagination inert={disabled} className={cn(disabled && "opacity-60")}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={linkTo(Math.max(1, page - 1))}
            {...edge(page === 1)}
          />
        </PaginationItem>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <PaginationItem key={n}>
            <PaginationLink
              to={linkTo(n)}
              isActive={n === page}
              aria-label={`Page ${n}`}
            >
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            to={linkTo(Math.min(pageCount, page + 1))}
            {...edge(page === pageCount)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
