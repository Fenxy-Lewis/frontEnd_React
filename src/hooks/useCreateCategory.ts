import {QueryClient, useMutation} from "@tanstack/react-query";
import { createCategory } from "@/services/category.service";
import { toast } from "sonner";
export const useCreateCategory = () => {
    const queryClient = new QueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess:() => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category Created Successfully", {
            description: "Category has been created.",
      });
        }
    })
}