import axios from "axios";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { ProductType, CreateProductInput } from "@/Type/product";

export const fetchProducts = async (
  search: string,
  page: number,
  limit: number,
) => {
  try {
    const res = await api.get("/products", {
      params: {
        // បើ search ទទេ វានឹងមិនដាក់ក្នុង URL ឡើយ
        search: search.trim() || undefined,
        page,
        limit,
      },
    });
    // Axios ដាក់ទិន្នន័យក្នុង .data រួចជាស្រេច
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchProductById = async (id: number) => {
  try {
    const res = await api.get(`/products/${id}`);
    // Handle both response shapes:
    // - { id, name, ... }  (flat)
    // - { data: { id, name, ... } }  (wrapped)
    const product = res.data?.data ?? res.data;
    return product as ProductType;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export async function CreateProduct(payload: CreateProductInput) {
  try {
    // បោះ payload ចូលជា argument ទី ២ របស់ api.post()
    const res = await api.post("/products", payload);

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create product",
      );
    }
    throw new Error("Failed to create product");
  }
}

// Update
export async function updateProduct(id: number, payload: Partial<ProductType>) {
  try {
    const res = await api.put(`/products/${id}`, payload);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("Failed to update product", {
        description:
          error.response?.data?.message ||
          "An error occurred while updating the product.",
      });
      throw new Error(
        error.response?.data?.message || "Failed to update product",
      );
    }
    throw new Error("Failed to update product");
  }
}

// File Upload ProductImage
export const uploadProductImage = async (id: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post(`/products/${id}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("Failed to upload product image", {
        description:
          error.response?.data?.message ||
          "An error occurred while uploading the product image.",
      });
      throw new Error(
        error.response?.data?.message || "Failed to upload product image",
      );
    }
    throw new Error("Failed to upload product image");
  }
};
// Delete ProductImage
// Delete ProductImage
export const deleteProductImage = async (imageId: number) => {
  try {
    const res = await api.delete(`/products/delete/${imageId}`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to delete image");
    }
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("Failed to delete product image", {
        description:
          error.response?.data?.message ||
          "An error occurred while deleting the product image.",
      });
      throw new Error(
        error.response?.data?.message || "Failed to delete product image",
      );
    }
    throw new Error("Failed to delete product image");
  }
};
