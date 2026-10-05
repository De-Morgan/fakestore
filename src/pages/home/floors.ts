import type { Product } from "@/api/types";
import {
  BackpackIcon,
  GemIcon,
  MonitorIcon,
  ShirtIcon,
  type LucideIcon,
} from "lucide-react";

export type Floor = {
  floor: number;
  /** The API's category slug, used in /products?category=… */
  category: string;
  label: string;
  blurb: string;
  Icon: LucideIcon;
};

// Static on purpose: the homepage must look complete when fakestoreapi.com is down.
// Ordered bottom to top, everyday basics to big-ticket pieces.
export const FLOORS: Floor[] = [
  {
    floor: 1,
    category: "men's clothing",
    label: "Men's",
    blurb: "Backpacks, tees & jackets",
    Icon: BackpackIcon,
  },
  {
    floor: 2,
    category: "women's clothing",
    label: "Women's",
    blurb: "Rain jackets & everyday tops",
    Icon: ShirtIcon,
  },
  {
    floor: 3,
    category: "jewelery",
    label: "Jewellery",
    blurb: "Rings, bracelets & earrings",
    Icon: GemIcon,
  },
  {
    floor: 4,
    category: "electronics",
    label: "Electronics",
    blurb: "Drives, SSDs & monitors",
    Icon: MonitorIcon,
  },
];

export const TOP_FLOOR = Math.max(...FLOORS.map((f) => f.floor));

// The best-rated product per category: highest rate, then most reviews, then first listed.
export function topRatedByCategory(products: Product[]) {
  const best = new Map<string, Product>();
  for (const product of products) {
    const current = best.get(product.category);
    if (
      !current ||
      product.rating.rate > current.rating.rate ||
      (product.rating.rate === current.rating.rate &&
        product.rating.count > current.rating.count)
    ) {
      best.set(product.category, product);
    }
  }
  return best;
}
