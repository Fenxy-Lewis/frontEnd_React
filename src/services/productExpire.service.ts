import axios from "axios";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { ProductExpireType } from "@/Type/productExpire";

// 1. GET /api/v1/product-expires
export const fetchProductsExpire = async (
  search: string,
  page: number,
  limit: number,
  status?: string,
) => {
  try {
    const res = await api.get("/product-expires", {
      params: {
        search: search.trim() || undefined,
        status: status || undefined, // Backend may or may not use this, but we send it
        page,
        limit,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product expiry data",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// 2. GET /api/v1/product-expires/expiring-soon
export const fetchExpiringSoon = async (days: number = 30) => {
  try {
    const res = await api.get("/product-expires/expiring-soon", {
      params: { days },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch expiring soon products",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// 3. GET /api/v1/product-expires/:id
export const getProductExpireById = async (id: number) => {
  try {
    const res = await api.get(`/product-expires/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product expiry record",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// 4. POST /api/v1/product-expires
export const createProductExpire = async (payload: {
  productId: number;
  expiryDate: string;
  batchNumber: string;
}) => {
  try {
    const res = await api.post("/product-expires", payload);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("Failed to create expiry record", {
        description: error.response?.data?.message || "An error occurred",
      });
      throw new Error(
        error.response?.data?.message || "Failed to create product expiry",
      );
    }
    throw new Error("Failed to create product expiry");
  }
};

// 5. POST /api/v1/product-expires/check-and-notify
export const checkAndNotifyExpiring = async () => {
  try {
    const res = await api.post("/product-expires/check-and-notify");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to trigger check and notify",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// 6. PUT /api/v1/product-expires/:id
export const updateProductExpire = async (
  id: number,
  payload: Partial<ProductExpireType>,
) => {
  try {
    const res = await api.put(`/product-expires/${id}`, payload);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("Failed to update expiry record", {
        description: error.response?.data?.message || "An error occurred",
      });
      throw new Error(
        error.response?.data?.message || "Failed to update product expiry",
      );
    }
    throw new Error("Failed to update product expiry");
  }
};

// 7. DELETE /api/v1/product-expires/:id
export const deleteProductExpire = async (id: number) => {
  try {
    const res = await api.delete(`/product-expires/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("Failed to delete expiry record", {
        description: error.response?.data?.message || "An error occurred",
      });
      throw new Error(
        error.response?.data?.message || "Failed to delete product expiry",
      );
    }
    throw new Error("Failed to delete product expiry");
  }
};
