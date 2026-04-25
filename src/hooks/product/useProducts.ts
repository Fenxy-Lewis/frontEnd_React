import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById } from "@/services/product.service";

export const useProducts = (
  debouncedKeyword: string,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: ["products", page, limit, debouncedKeyword],
    queryFn: () => fetchProducts(debouncedKeyword, page, limit),
    enabled: true,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};

export const useProductById = (id: number | null) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: false,
  });
};
