import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchProductsExpire,
  createProductExpire,
  updateProductExpire,
  deleteProductExpire,
  checkAndNotifyExpiring,
} from "@/services/productExpire.service";
import type { ProductExpireType } from "@/Type/productExpire";

export const useProductsExpire = (
  debouncedKeyword: string,
  page: number,
  limit: number,
  status?: string
) => {
  return useQuery({
    queryKey: ["product-expires", page, limit, debouncedKeyword, status],
    queryFn: () => fetchProductsExpire(debouncedKeyword, page, limit, status),
    enabled: true,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateProductExpire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { productId: number; expiryDate: string; batchNumber: string }) =>
      createProductExpire(payload),
    onSuccess: () => {
      toast.success("Expiry record created successfully");
      queryClient.invalidateQueries({ queryKey: ["product-expires"] });
    },
    onError: (error: Error) => {
      // Error toast is already handled in the service
      console.error(error);
    },
  });
};

export const useUpdateProductExpire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductExpireType> }) =>
      updateProductExpire(id, payload),
    onSuccess: () => {
      toast.success("Expiry record updated successfully");
      queryClient.invalidateQueries({ queryKey: ["product-expires"] });
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });
};

export const useDeleteProductExpire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProductExpire(id),
    onSuccess: () => {
      toast.success("Expiry record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["product-expires"] });
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });
};

export const useCheckAndNotifyExpiring = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => checkAndNotifyExpiring(),
    onSuccess: (data) => {
      toast.success("Check & Notify Triggered", {
        description: data?.message || "Notifications sent for expiring products.",
      });
      queryClient.invalidateQueries({ queryKey: ["product-expires"] });
    },
    onError: (error: Error) => {
      toast.error("Notify Action Failed", {
        description: error.message,
      });
    },
  });
};
