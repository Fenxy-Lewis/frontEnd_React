import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "@/services/customers.service";
import { toast } from "sonner";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer Updated Successfully", {
        description: "Customer has been updated.",
      });
    },
    onError: () => {
      toast.error("Failed to update customer");
    },
  });
};
