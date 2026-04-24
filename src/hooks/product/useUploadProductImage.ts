import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProductImage } from "@/services/product.service";
import { toast } from "sonner";

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, request }: { imageId: number; request: File }) => {
      return uploadProductImage(imageId, request);
    },
    onSuccess: () => {
      toast.success("Hook: Product Image Upload Successfully..!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Product Image Upload Failed..!");
    },
  });
};
