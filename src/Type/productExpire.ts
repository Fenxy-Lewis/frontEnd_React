import type { ProductType } from "./product";

export type ProductExpireType = {
  id?: number;
  productId: number;
  product?: ProductType;
  expiryDate: Date | string;
  batchNumber: string;
  isNotified: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

