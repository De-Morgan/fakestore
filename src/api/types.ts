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

export const TokenSchema = z.object({ token: z.string() });

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  name: z.object({ firstname: z.string(), lastname: z.string() }),
  phone: z.string(),
  address: z.object({
    street: z.string(),
    number: z.number(),
    city: z.string(),
    zipcode: z.string(),
  }),
});

export const CartSchema = z.object({
  id: z.number(),
  userId: z.number(),
  date: z.string(),
  products: z.array(z.object({ productId: z.number(), quantity: z.number() })),
});
export const CartListSchema = z.array(CartSchema);

export type User = z.infer<typeof UserSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type NewCart = Omit<Cart, "id">;
