import { api } from "@/lib/api";
import type { CustomerType } from "@/Type/customer";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const fetchCustomer = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const deleteCustomer = async (id: number) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};

export const updateCustomer = async (payload: CustomerType) => {
  const res = await api.put(`/customers/${payload.id}`, payload);
  return res.data;
};

export const createCustomer = async (payload: CustomerType) => {
  const res = await api.post("/customers", payload);
  return res.data;
};
