export type ProductType = {
  id: number;
  name: string;
  description?: string;
  color?: string;
  price: number;
  qty: number;
  categoryId: number;
  category: {
    name: string;
  };
  isActive: boolean;
  productImages?: ProductImage[];
};

export type ProductImage = {
  id: number;
  fileName: string;
  imageUrl: string;
  productId: number;
};

export type CreateProductInput = {
  name: string;
  description?: string;
  color?: string;
  price: number;
  qty: number;
  categoryId: number;
  productImages?: ProductImage[];
  isActive: boolean;
};
