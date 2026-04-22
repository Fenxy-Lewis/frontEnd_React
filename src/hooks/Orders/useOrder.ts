import { createOrders } from "@/services/orders.service";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export const useOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to create order. Please try again.");
    },
  });
};
