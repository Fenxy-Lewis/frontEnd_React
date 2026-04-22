import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProduct } from "@/services/product.service";
import { toast } from "sonner";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CreateProduct,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product Created Successfully", {
        description: "Product has been created.",
      });
      console.log("Product created successfully");
    },
  });
};
