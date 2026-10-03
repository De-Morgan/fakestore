import { useSearchParams } from "react-router";
import { categoriesQuery, type ProductFilters as Filters } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_SORT, updateParams } from "../searchParams";
import { ProductSearch } from "./ProductSearch";

const ALL = "all";

// FakeStore's `sort` orders by id, not price, so label it honestly.
const sortItems = [
  { value: "asc", label: "Oldest first" },
  { value: "desc", label: "Newest first" },
];
type ProductFilterProps = { filters: Filters; q: string };

export function ProductFilters({ filters, q }: ProductFilterProps) {
  const [, setSearchParams] = useSearchParams();
  const categories = useQuery(categoriesQuery());
  const categoryLabelId = useId();
  const sortLabelId = useId();

  const categoryItems = [
    { value: ALL, label: "All categories" },
    ...((categories.data ?? []) as string[]).map((c) => ({
      value: c,
      label: c,
    })),
  ];

  // A param equal to its default is deleted, so URLs stay canonical (/products, not /products?sort=asc).
  const setParam = (
    key: string,
    value: string,
    isDefault: boolean,
    replace: boolean,
  ) =>
    setSearchParams(
      (prev) => updateParams(prev, key, isDefault ? null : value),
      { replace },
    );

  return (
    <div className="flex w-full flex-wrap items-end gap-4 sm:w-auto">
      <ProductSearch q={q} />
      <div className="grid gap-1.5">
        <Label id={categoryLabelId}>Category</Label>
        <Select
          items={categoryItems}
          value={filters.category ?? ALL}
          onValueChange={(value) =>
            setParam("category", value ?? ALL, !value || value === ALL, false)
          }
        >
          <SelectTrigger
            aria-labelledby={categoryLabelId}
            className="w-44 capitalize"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label id={sortLabelId}>Sort</Label>
        <Select
          items={sortItems}
          value={filters.sort}
          // Replace: flipping sort shouldn't add a history entry per click.
          onValueChange={(value) =>
            setParam(
              "sort",
              value ?? DEFAULT_SORT,
              !value || value === DEFAULT_SORT,
              true,
            )
          }
        >
          <SelectTrigger aria-labelledby={sortLabelId} className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
