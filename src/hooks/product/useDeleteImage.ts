import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductImage } from "@/services/product.service";
import { toast } from "sonner";
export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => await deleteProductImage(id),
    onSuccess: () => {
      toast.success("Product image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete product image", {
        description:
          error.message ||
          "An error occurred while deleting the product image.",
      });
    },
  });
};
