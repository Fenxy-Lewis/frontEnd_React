import { checkTransaction, createPayment } from "@/services/payment.service";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast.success("Payment created successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to create Payment. Please try again.");
      console.error("Error creating Payment:", error);
    },
  });
};

export const useCheckTransaction = () => {
  return useMutation({
    mutationFn: checkTransaction,
    onSuccess: () => {
      toast.success("Transaction checked successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to check transaction. Please try again.");
      console.error("Error checking transaction:", error);
    },
  });
};
