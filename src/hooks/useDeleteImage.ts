import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductImage } from "../services/product.service"; // Adjust path តាមជាក់ស្តែង
import { toast } from "sonner"; // ឬ library toast ដែលអ្នកប្រើ

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async(id: number) => await deleteProductImage(id),
    onSuccess: () => {
      // បង្ហាញ message ជោគជ័យ
      toast.success("Product image deleted successfully");
      
      // បោះចោល cache ចាស់ ដើម្បីឱ្យវាទាញយកទិន្នន័យថ្មី (Invalidate Cache)
      // ឧបមាថា query key របស់អ្នកឈ្មោះ ['products'] ឬ ['product', id]
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      // error toast ត្រូវបាន handle ក្នុង service រួចហើយ 
      // តែអ្នកអាចថែម logic នៅទីនេះបាន បើចង់
      toast.error("Failed to delete product image", {
        description:
          error.message ||
          "An error occurred while deleting the product image.",
      });
    },
  });
};