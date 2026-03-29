import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateProductInput } from "@/services/product.service";
import { updateProduct } from "@/services/product.service";
export function useUpdateProduct() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateProductInput>;
    }) => {
      return updateProduct(id, payload);
    },
    onSuccess: () => {
      console.log("Product Update Successfully...!");
      toast.success("Product updated successfully", {
        description: "The product has been updated successfully.",
      });
      queryclient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
