import { z } from "zod";
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.preprocess(
    (v) => {
      // when form gives undefined/"" treat as undefined
      if (v === "" || v === undefined || v === null) return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    },
    z.number({ message: "Price is required" }).min(1, "Price must be > 0"),
  ),
  description: z.string().optional(),
  categoryId: z.number().optional(),
  qty: z.preprocess(
    (v) => {
      // when form gives undefined/"" treat as undefined
      if (v === "" || v === undefined || v === null) return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    },
    z
      .number({ message: "Quantity is required" })
      .int()
      .min(1, "Quantity must be 1 or more"),
  ),
  isActive: z.boolean().default(true),
  productImages: z
    .array(
      z.object({
        id: z.number().optional(),
        productId: z.number().optional(),
        fileName: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    ).min(1, { message: "Image is required" }),
});
