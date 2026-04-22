import { api } from "../lib/api";
import type { LoginPayload } from "@/Type/LoginPayload";
import type { RegisterPayload } from "@/Type/RegisterPayload";

export const userLogin =async (data: LoginPayload) => {
  const response = await api.post("/auth/login", data);
  console.log("Data AuthLogin:", response.data);
  return response.data; // ✅ return JSON data មកវិញ
};

export const userRegister = (data: RegisterPayload) =>
  api.post("/auth/register", data); // ✅ arrow function implicit return — ត្រឹមត្រូវហើយ
