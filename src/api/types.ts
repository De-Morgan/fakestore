import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.url(),
  rating: z.object({ rate: z.number(), count: z.number() }),
});

export const ProductListSchema = z.array(ProductSchema);
export const CategoriesSchema = z.array(z.string());

export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategoriesSchema>[number];
