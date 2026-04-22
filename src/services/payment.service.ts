import { api } from "@/lib/api";
import { toast } from "sonner";
export const createPayment = async (orderId: number) => {
  try {
    const response = await api.post(`/payments/${orderId}`);
    toast.success("Payment created successfully");
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to create payment");
  }
};
export const checkTransaction = async (tranId: string) => {
  try {
    const response = await api.post(`/payments/check/${tranId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to check transaction");
  }
};
