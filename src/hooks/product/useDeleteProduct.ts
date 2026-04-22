// hooks/product/useDeleteProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Delete Successfully", {
        description: "Product has been deleted.",
      });
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });
}
