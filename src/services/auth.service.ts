import { api } from "../lib/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  gender: string;
  phone: string;
};

export const userLogin =async (data: LoginPayload) => {
  const response = await api.post("/auth/login", data);
  console.log("Data AuthLogin:", response.data);
  return response.data; // ✅ return JSON data មកវិញ
};

export const userRegister = (data: RegisterPayload) =>
  api.post("/auth/register", data); // ✅ arrow function implicit return — ត្រឹមត្រូវហើយ
