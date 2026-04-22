import { api } from "@/lib/api";
import type { OrderPayload } from "../Type/orderType";

export const createOrders = async (orderData: OrderPayload) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};
