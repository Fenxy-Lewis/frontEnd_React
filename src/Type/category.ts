export type CategoryType = {
  id: number;
  name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  products: {
    name: string;
    price: number;
    qty: number;
    isActive: boolean;
  }[];
};
